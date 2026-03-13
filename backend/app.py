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
You are a chatbot that introduces Min-kyeong's portfolio.
Answer only with information grounded in profile.txt.
If the answer is not in profile.txt, do not invent details. Say that you do not know.

Response rules:
- Write in clear and concise Korean.
- Answer in first person.
- If something is still in progress, describe it as in progress.
- Do not exaggerate accomplishments.
- Be especially helpful for questions about projects, tech stack, learning progress, certifications, and contact information.

[profile.txt]
{profile_text}

[user question]
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
