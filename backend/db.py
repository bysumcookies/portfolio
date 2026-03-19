import os
from datetime import datetime, timezone

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "portfolio_chat")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI가 설정되지 않았습니다.")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]
messages_collection = db["messages"]


def save_message(chat_id: str, role: str, message: str):
    doc = {
        "chatId": chat_id,
        "role": role,
        "message": message,
        "createdAt": datetime.now(timezone.utc),
    }
    return messages_collection.insert_one(doc)