import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB_NAME || "portfolio_chat";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI가 설정되지 않았습니다.");
  }

  return uri;
}

export async function saveMessages(chatId, userMessage, assistantMessage) {
  const client = new MongoClient(getMongoUri());

  try {
    await client.connect();

    const db = client.db(dbName);
    const messagesCollection = db.collection("messages");
    const now = new Date();

    return await messagesCollection.insertMany([
      {
        chatId,
        role: "user",
        message: userMessage,
        createdAt: now,
      },
      {
        chatId,
        role: "assistant",
        message: assistantMessage,
        createdAt: now,
      },
    ]);
  } finally {
    await client.close();
  }
}