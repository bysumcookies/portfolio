import os
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)
app.json.ensure_ascii = False
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

BASE_DIR = Path(__file__).resolve().parent
PROFILE_PATH = BASE_DIR / "profile.txt"

client = genai.Client(api_key=API_KEY) if API_KEY else None


@app.get("/")
def home(): # 헬스체크용 입구: 서버가 살아 있는지 확인
    return {"ok": True, "message": "server ok"}


def load_profile_text(): # profile.txt 파일을 읽어서 문자열로 반환
    if not PROFILE_PATH.exists():
        raise FileNotFoundError(f"profile.txt not found: {PROFILE_PATH}")

    return PROFILE_PATH.read_text(encoding="utf-8")


def build_prompt(user_message, profile_text): 
    # 사용자 질문(user_message)과 profile.txt(profile_text)를 바탕으로 최종 프롬프트를 생성
    return f"""
        너는 김민경 본인인 것처럼 답변하는 포트폴리오 챗봇이다.
        모든 답변은 반드시 1인칭으로 작성한다.
        예: "저는 ~입니다", "제가 사용한 기술은 ~입니다", "저는 ~를 진행했습니다".

        규칙:
        - profile.txt에 있는 사실만 바탕으로 답한다.
        - 없는 내용은 지어내지 말고 모른다고 말한다.
        - 진행 중인 일은 완료된 것처럼 말하지 말고 진행 중이라고 표현한다.
        - 답변은 과장하지 말고, 신입 지원자 관점에서 솔직하고 명확하게 작성한다.
        - 질문이 포트폴리오, 기술 스택, 프로젝트, 학습 과정, 자격증 준비에 관한 것이면 가능한 한 구체적으로 답한다.

        [profile.txt]
        {profile_text}

        [사용자 질문]
        {user_message}
        """.strip()


def generate_answer(prompt): # Gemini API를 실제로 호출해서 답변 문자열만 반환환
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )

    text = response.text if response.text else None
    if not text:
        raise RuntimeError("답변을 생성하지 못했습니다.")

    return text.strip()


@app.get("/sendMessage")
def send_message(): # HTTP 요청을 받아서 실제 챗봇 기능(전체 흐름 조정)을 수행
    user_message = request.args.get("message", "").strip()

    if not user_message:
        return jsonify({
            "ok": False,
            "error": "missing query param: message"
        }), 400

    if not client:
        return jsonify({
            "ok": False,
            "error": "GEMINI_API_KEY not set in backend/.env"
        }), 500

    try:
        profile_text = load_profile_text()
        prompt = build_prompt(user_message, profile_text)
        answer = generate_answer(prompt)

        return jsonify({
            "ok": True,
            "answer": answer
        }), 200

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": f"Gemini API error: {e}"
        }), 502


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)