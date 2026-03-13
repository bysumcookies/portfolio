import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai

load_dotenv()

app = Flask(__name__)
app.json.ensure_ascii = False


def parse_cors_origins():
    raw = os.getenv("CORS_ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins or ["http://localhost:3000", "http://127.0.0.1:3000"]


CORS(
    app,
    resources={r"/api/*": {"origins": parse_cors_origins()}},
)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

BASE_DIR = Path(__file__).resolve().parent
PROFILE_PATH = BASE_DIR / "profile.txt"

client = genai.Client(api_key=API_KEY) if API_KEY else None


@app.get("/")
def home():
    return {"ok": True, "message": "server ok"}


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "portfolio-backend",
        "model": MODEL,
    }


def load_profile_text():
    if not PROFILE_PATH.exists():
        raise FileNotFoundError(f"profile.txt not found: {PROFILE_PATH}")

    return PROFILE_PATH.read_text(encoding="utf-8")


def build_prompt(user_message, profile_text):
    return f"""
너는 김민경의 포트폴리오를 안내하는 챗봇이다.
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
{profile_text}

[사용자 질문]
{user_message}
""".strip()


def generate_answer(prompt):
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    text = response.text if response.text else None
    if not text:
        raise RuntimeError("Failed to generate a response.")

    return text.strip()


@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    user_message = str(data.get("message", "")).strip()

    if not user_message:
        return jsonify({
            "ok": False,
            "error": "missing JSON field: message",
        }), 400

    if not client:
        return jsonify({
            "ok": False,
            "error": "GEMINI_API_KEY is not configured",
        }), 500

    try:
        profile_text = load_profile_text()
        prompt = build_prompt(user_message, profile_text)
        answer = generate_answer(prompt)

        return jsonify({
            "ok": True,
            "answer": answer,
        }), 200
    except Exception as exc:
        return jsonify({
            "ok": False,
            "error": f"Gemini API error: {exc}",
        }), 502


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
