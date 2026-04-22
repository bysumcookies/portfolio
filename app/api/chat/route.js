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

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description: "사용자 질문에 대한 답변",
    },
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
  required: ["answer", "suggestedQuestions"],
  additionalProperties: false,
};

async function loadProfileText() {
  const profilePath = path.join(process.cwd(), "backend", "profile.txt");
  return readFile(profilePath, "utf-8");
}

function buildPrompt(userMessage, profileText) {
  return `
너는 김민경 본인인 것처럼 대답한다.
답변은 반드시 profile.txt에 있는 내용만 근거로 작성한다.
profile.txt에 없는 내용은 추측해서 만들지 말고, 모른다고 솔직하게 답한다.

반드시 JSON만 출력한다.
마크다운, 코드블록, 설명문, 서두/말미 문장 없이 JSON 객체만 출력한다.

JSON 형식 규칙:
- answer: 사용자 질문에 대한 자연스럽고 명확한 한국어 답변
- suggestedQuestions: 답변과 자연스럽게 이어지는 후속 질문 3개 문자열 배열

답변 규칙:
- 답변은 자연스럽고 명확한 한국어로 작성한다.
- 답변은 1인칭 시점으로 작성한다.
- 진행 중인 내용은 진행 중이라고 표현한다.
- 완료되지 않은 내용을 완료된 것처럼 과장하지 않는다.
- 프로젝트, 기술 스택, 학습 방향, 자격증, 연락처 관련 질문에는 가능한 범위에서 구체적으로 답한다.
- 전체 톤은 신입 포트폴리오 답변처럼 차분하고 정돈된 느낌으로 유지한다.
- 사용자가 더 자세한 설명을 요청하지 않았다면 보통 2문장~4문장 정도로 답한다.
- profile.txt에 답변 톤이나 표현 방식이 적혀 있다면 그 지침을 우선 반영한다.
- answer에는 마크다운 문법(예: **굵게**, # 제목, * 목록기호)을 사용하지 않는다.
- 필요하면 줄바꿈은 사용해도 되지만, 전체 답변은 일반 텍스트처럼 자연스럽게 보이도록 작성한다.
- suggestedQuestions는 profile.txt 범위 안에서만 작성한다.
- 모르는 내용은 억지로 추천 질문으로 만들지 말고, 현재 답변과 자연스럽게 이어지는 질문만 작성한다.

[profile.txt]
${profileText}

[사용자 질문]
${userMessage}
  `.trim();
}

async function generateStructuredAnswer(prompt) {
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini 응답 텍스트가 비어 있습니다.");
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error("[JSON Parse Error]", error, text);
    throw new Error("JSON_PARSE_FAILED");
  }

  return parsed;
}

function buildErrorResponse({
  status,
  code,
  stage,
  chatId,
  userMessage,
}) {
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
    const fallbackChatId =
      String(data?.chatId || "").trim() || "temp-chat-id";

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
  let parsed;
  let answer;
  let suggestedQuestions;

  try {
    profileText = await loadProfileText();
    prompt = buildPrompt(message, profileText);
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

  try {
    parsed = await generateStructuredAnswer(prompt);

    const validated = validateModelResponse(parsed, message);
    answer = validated.answer;
    suggestedQuestions = validated.suggestedQuestions;
  } catch (error) {
    console.error("[Gemini/Parse Error]", error);

    const status = error?.status;

    if (status === 429) {
      return buildErrorResponse({
        status: 429,
        code: "MODEL_QUOTA_EXCEEDED",
        stage: "gemini",
        chatId,
        userMessage: "지금 API 사용량 제한에 걸렸습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    if (status === 503) {
      return buildErrorResponse({
        status: 503,
        code: "MODEL_TEMPORARILY_UNAVAILABLE",
        stage: "gemini",
        chatId,
        userMessage: "지금 AI 응답이 몰려 있어서 잠시 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    return buildErrorResponse({
      status: 502,
      code: "MODEL_RESPONSE_FAILED",
      stage: "gemini",
      chatId,
      userMessage: "지금은 답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }

  try {
    await saveMessages(chatId, message, answer);
  } catch (error) {
    console.error("[MongoDB Error]", error);

    return buildErrorResponse({
      status: 500,
      code: "MONGODB_SAVE_FAILED",
      stage: "mongodb",
      chatId,
      userMessage: "답변은 생성되었지만 저장 중 문제가 발생했습니다. 다시 시도해 주세요.",
    });
  }

  return Response.json({
    ok: true,
    chatId,
    answer,
    suggestedQuestions,
    error: null,
  });
}