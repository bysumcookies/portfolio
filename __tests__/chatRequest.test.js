import { validateChatRequestData } from "@/lib/chatRequest";

describe("chatRequest 사용자 입력 검증 로직", () => {
  test("정상 message와 chatId가 들어오면 앞뒤 공백을 제거해서 반환한다", () => {
    const data = {
      message: "   안녕하세요   ",
      chatId: "   chat-123   ",
    };

    const result = validateChatRequestData(data);

    expect(result).toEqual({
      message: "안녕하세요",
      chatId: "chat-123",
    });
  });

  test("chatId가 없으면 temp-chat-id를 기본값으로 사용한다", () => {
    const data = {
      message: "프로젝트 설명해줘",
    };

    const result = validateChatRequestData(data);

    expect(result).toEqual({
      message: "프로젝트 설명해줘",
      chatId: "temp-chat-id",
    });
  });

  test("message가 빈 문자열이면 MISSING_MESSAGE 에러를 발생시킨다", () => {
    const data = {
      message: "",
      chatId: "chat-123",
    };

    expect(() => validateChatRequestData(data)).toThrow("MISSING_MESSAGE");
  });

  test("message가 공백만 있으면 MISSING_MESSAGE 에러를 발생시킨다", () => {
    const data = {
      message: "     ",
      chatId: "chat-123",
    };

    expect(() => validateChatRequestData(data)).toThrow("MISSING_MESSAGE");
  });

  test("message가 없으면 MISSING_MESSAGE 에러를 발생시킨다", () => {
    const data = {
      chatId: "chat-123",
    };

    expect(() => validateChatRequestData(data)).toThrow("MISSING_MESSAGE");
  });
});