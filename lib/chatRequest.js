export function validateChatRequestData(data) {
  const message = String(data?.message || "").trim();
  const chatId = String(data?.chatId || "").trim() || "temp-chat-id";

  if (!message) {
    throw new Error("MISSING_MESSAGE");
  }

  return {
    message,
    chatId,
  };
}