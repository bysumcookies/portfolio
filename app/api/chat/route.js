export const runtime = "nodejs";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { saveMessages } from "@/lib/mongodb";
import { validateModelResponse } from "@/lib/chatResponse";
import { validateChatRequestData } from "@/lib/chatRequest";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SUGGESTIONS_SCHEMA = {
  type: "object",
  properties: {
    suggestedQuestions: {
      type: "array",
      description: "답변과 자연스럽게 이어지는 후속 질문 3개",
      items: {
        type: "string",
      },
      minItems: 3,
      maxItems: 3,
    },
  },
  required: ["suggestedQuestions"],
  additionalProperties: false,
};

async function loadProfileText() {
  const profilePath = path.join(process.cwd(), "backend", "profile.txt");
  return readFile(profilePath, "utf-8");
}

function buildAnswerPrompt(userMessage, profileText) {
  return `
너는 김민경 본인인 것처럼 대답한다.
답변은 반드시 profile.txt에 있는 내용만 근거로 작성한다.
profile.txt에 없는 내용은 추측해서 만들지 말고, 모른다고 솔직하게 답한다.

이번 응답에서는 추천 질문을 만들지 않는다.
사용자 질문에 대한 answer 본문만 자연어 텍스트로 출력한다.
JSON, 마크다운, 코드블록, 목록 기호, 설명용 라벨을 출력하지 않는다.

답변 규칙:
- 답변은 자연스럽고 명확한 한국어로 작성한다.
- 답변은 1인칭 시점으로 작성한다.
- 진행 중인 내용은 진행 중이라고 표현한다.
- 완료되지 않은 내용을 완료된 것처럼 과장하지 않는다.
- 프로젝트, 기술 스택, 학습 방향, 자격증, 연락처 관련 질문에는 가능한 범위에서 구체적으로 답한다.
- 전체 톤은 신입 포트폴리오 답변처럼 차분하고 정돈된 느낌으로 유지한다.
- 사용자가 더 자세한 설명을 요청하지 않았다면 보통 2문장~4문장 정도로 답한다.
- profile.txt에 답변 톤이나 표현 방식이 적혀 있다면 그 지침을 우선 반영한다.
- 마크다운 문법(예: **굵게**, # 제목, * 목록기호)을 사용하지 않는다.
- 필요하면 줄바꿈은 사용해도 되지만, 전체 답변은 일반 텍스트처럼 자연스럽게 보이도록 작성한다.

[profile.txt]
${profileText}

[사용자 질문]
${userMessage}
  `.trim();
}

function buildSuggestionsPrompt(userMessage, answer, profileText) {
  return `
너는 김민경의 포트폴리오 챗봇이다.
아래 profile.txt, 사용자 질문, 이미 생성된 답변을 바탕으로
사용자가 이어서 물어볼 만한 후속 질문 3개를 만든다.

반드시 JSON만 출력한다.
마크다운, 코드블록, 설명문, 서두/말미 문장 없이 JSON 객체만 출력한다.

JSON 형식:
{
  "suggestedQuestions": ["질문1", "질문2", "질문3"]
}

추천 질문 규칙:
- suggestedQuestions는 반드시 문자열 3개로 구성한다.
- profile.txt 범위 안에서 답변 가능한 질문만 만든다.
- 이미 생성된 답변과 자연스럽게 이어지는 질문으로 만든다.
- 너무 일반적인 질문보다 프로젝트, 기술 스택, 학습 방향, 자격증, 연락처와 관련된 질문을 우선한다.
- 모르는 내용을 억지로 추천 질문으로 만들지 않는다.

[profile.txt]
${profileText}

[사용자 질문]
${userMessage}

[이미 생성된 답변]
${answer}
  `.trim();
}

function buildErrorResponse({ status, code, stage, chatId, userMessage }) {
  return Response.json(
    {
      ok: false,
      chatId,
      answer: userMessage,
      suggestedQuestions: [],
      error: {
        code,
        stage,
      },
    },
    { status }
  );
}

function createSseMessage(payload) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

function sendSse(controller, encoder, payload) {
  controller.enqueue(encoder.encode(createSseMessage(payload)));
}

/**
 * 스트리밍 체감을 위해 서버에서 받은 chunk를
 * 다시 작은 글자 단위로 쪼개서 프론트로 보냅니다.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTextAsTyping(controller, encoder, text) {
  const characters = Array.from(text);
  const unitSize = 2;

  for (let i = 0; i < characters.length; i += unitSize) {
    const piece = characters.slice(i, i + unitSize).join("");

    sendSse(controller, encoder, {
      type: "answer",
      text: piece,
    });

    await sleep(18);
  }
}

async function generateSuggestedQuestions({ message, answer, profileText }) {
  if (!ai) {
    return [];
  }

  try {
    const prompt = buildSuggestionsPrompt(message, answer, profileText);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: SUGGESTIONS_SCHEMA,
      },
    });

    const text = response.text?.trim();

    if (!text) {
      return [];
    }

    const parsed = JSON.parse(text);

    const validated = validateModelResponse(
      {
        answer,
        suggestedQuestions: parsed.suggestedQuestions,
      },
      message
    );

    return validated.suggestedQuestions;
  } catch (error) {
    console.error("[Suggestions Error]", error);
    return [];
  }
}

export async function POST(request) {
  let data;

  try {
    data = await request.json();
  } catch (error) {
    return Response.json(
      {
        ok: false,
        answer: "잘못된 JSON 요청입니다.",
        suggestedQuestions: [],
        error: {
          code: "INVALID_JSON",
          stage: "request",
        },
      },
      { status: 400 }
    );
  }

  let message;
  let chatId;

  try {
    const validatedRequest = validateChatRequestData(data);
    message = validatedRequest.message;
    chatId = validatedRequest.chatId;
  } catch (error) {
    const fallbackChatId = String(data?.chatId || "").trim() || "temp-chat-id";

    return buildErrorResponse({
      status: 400,
      code: "MISSING_MESSAGE",
      stage: "request",
      chatId: fallbackChatId,
      userMessage: "질문이 비어 있습니다. 내용을 입력해 주세요.",
    });
  }

  if (!API_KEY) {
    return buildErrorResponse({
      status: 500,
      code: "MISSING_API_KEY",
      stage: "server",
      chatId,
      userMessage: "현재 서버 설정 문제로 답변을 생성할 수 없습니다.",
    });
  }

  let profileText;
  let prompt;

  try {
    profileText = await loadProfileText();
    prompt = buildAnswerPrompt(message, profileText);
  } catch (error) {
    console.error("[Profile Load Error]", error);

    return buildErrorResponse({
      status: 500,
      code: "PROFILE_LOAD_FAILED",
      stage: "profile",
      chatId,
      userMessage: "프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let answer = "";

      try {
        const geminiStream = await ai.models.generateContentStream({
          model: MODEL,
          contents: prompt,
          config: {
            responseMimeType: "text/plain",
          },
        });

        for await (const chunk of geminiStream) {
          const chunkText = chunk.text || "";

          if (!chunkText) {
            continue;
          }

          answer += chunkText;

          /**
           * 기존에는 chunkText를 그대로 한 번에 보냈습니다.
           * 그런데 Gemini chunk가 크게 오면 화면에서는 한 번에 출력되는 것처럼 보입니다.
           * 그래서 여기서 2글자 단위로 다시 쪼개서 전송합니다.
           */
          await sendTextAsTyping(controller, encoder, chunkText);
        }

        const trimmedAnswer = answer.trim();

        if (!trimmedAnswer) {
          throw new Error("EMPTY_STREAM_ANSWER");
        }

        const suggestedQuestions = await generateSuggestedQuestions({
          message,
          answer: trimmedAnswer,
          profileText,
        });

        sendSse(controller, encoder, {
          type: "suggestions",
          suggestedQuestions,
        });

        try {
          await saveMessages(chatId, message, trimmedAnswer);
        } catch (error) {
          console.error("[MongoDB Error]", error);

          sendSse(controller, encoder, {
            type: "save_error",
            message:
              "답변은 생성되었지만 저장 중 문제가 발생했습니다. 다시 시도해 주세요.",
          });
        }

        sendSse(controller, encoder, {
          type: "done",
        });
      } catch (error) {
        console.error("[Gemini Stream Error]", error);

        const status = error?.status;

        let message =
          "지금은 답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.";
        let code = "MODEL_RESPONSE_FAILED";

        if (status === 429) {
          message =
            "지금 API 사용량 제한에 걸렸습니다. 잠시 후 다시 시도해 주세요.";
          code = "MODEL_QUOTA_EXCEEDED";
        }

        if (status === 503) {
          message =
            "지금 AI 응답이 몰려 있어서 잠시 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
          code = "MODEL_TEMPORARILY_UNAVAILABLE";
        }

        sendSse(controller, encoder, {
          type: "error",
          code,
          message,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}