import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { saveMessage } from "@/lib/mongodb";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

async function loadProfileText() {
  const profilePath = path.join(process.cwd(), "backend", "profile.txt");
  return readFile(profilePath, "utf-8");
}

function buildPrompt(userMessage, profileText) {
  return `
너는 김민경 본인인 것처럼 대답한다.
답변은 반드시 profile.txt에 있는 내용만 근거로 작성한다.
profile.txt에 없는 내용은 추측해서 만들지 말고, 모른다고 솔직하게 답한다.

답변 규칙:
- 답변은 자연스럽고 명확한 한국어로 작성한다.
- 답변은 1인칭 시점으로 작성한다.
- 진행 중인 내용은 진행 중이라고 표현한다.
- 완료되지 않은 내용을 완료된 것처럼 과장하지 않는다.
- 프로젝트, 기술 스택, 학습 방향, 자격증, 연락처 관련 질문에는 가능한 범위에서 구체적으로 답한다.
- 전체 톤은 신입 포트폴리오 답변처럼 차분하고 정돈된 느낌으로 유지한다.
- 사용자가 더 자세한 설명을 요청하지 않았다면 보통 2문장~4문장 정도로 답한다.
- profile.txt에 답변 톤이나 표현 방식이 적혀 있다면 그 지침을 우선 반영한다.
- 마크다운 문법(예: **굵게**, # 제목, * 목록기호)은 사용하지 않는다.
- 필요하면 줄바꿈은 사용해도 되지만, 전체 답변은 일반 텍스트처럼 자연스럽게 보이도록 작성한다.

[profile.txt]
${profileText}

[사용자 질문]
${userMessage}
  `.trim();
}

async function generateAnswer(prompt) {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });
  
    const text = response.text?.trim();
  
    if (!text) {
      throw new Error("Failed to generate a response.");
    }
  
    return text;
}


export async function POST(request) {
  const data = await request.json();
  const message = String(data?.message || "").trim();
  const chatId = String(data?.chatId || "").trim() || "temp-chat-id";

  if (!message) {
    return Response.json(
      {
        ok: false,
        error: "missing JSON field: message",
      },
      { status: 400 }
    );
  }

  if (!ai) {
    return Response.json(
      {
        ok: false,
        error: "GEMINI_API_KEY is not configured",
      },
      { status: 500 }
    );
  }

  try {
    const profileText = await loadProfileText();
    const prompt = buildPrompt(message, profileText);
    const answer = await generateAnswer(prompt);

    await saveMessage(chatId, "user", message);
    await saveMessage(chatId, "assistant", answer);
    
    return Response.json({
      ok: true,
      chatId,
      answer,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: `Gemini API error: ${error.message}`,
      },
      { status: 502 }
    );
  }
}