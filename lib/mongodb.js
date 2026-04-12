import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio_chat";

if (!uri) {
  throw new Error("MONGODB_URI가 설정되지 않았습니다.");
}

export async function saveMessage(chatId, role, message) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const messagesCollection = db.collection("messages");

    return await messagesCollection.insertOne({
      chatId,
      role,
      message,
      createdAt: new Date(),
    });
  } finally {
    await client.close();
  }
}