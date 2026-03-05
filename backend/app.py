import os
import requests
from flask import Flask, request, Response
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

@app.get("/")
def home():
    return "server ok"

@app.get("/sendMessage")
def send_message():
    user_message = request.args.get("message", "").strip()
    if not user_message:
        return Response("missing query param: message", status=400, mimetype="text/plain; charset=utf-8")

    if not API_KEY:
        return Response("GEMINI_API_KEY not set in backend/.env", status=500, mimetype="text/plain; charset=utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    headers = {"Content-Type": "application/json", "x-goog-api-key": API_KEY}
    payload = {"contents": [{"parts": [{"text": user_message}]}]}

    try:
        r = requests.post(url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as e:
        return Response(f"request failed: {e}", status=502, mimetype="text/plain; charset=utf-8")

    if r.status_code != 200:
        return Response(f"Gemini API error ({r.status_code}):\n{r.text}", status=502, mimetype="text/plain; charset=utf-8")

    data = r.json()
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        text = str(data)

    return Response(text, mimetype="text/plain; charset=utf-8")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)