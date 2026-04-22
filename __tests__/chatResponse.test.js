import {
  makeFallbackSuggestions,
  normalizeSuggestedQuestions,
  validateModelResponse,
} from "@/lib/chatResponse";

describe("chatResponse 응답 보정 로직", () => {
  test("정상 응답이면 answer와 suggestedQuestions를 반환한다", () => {
    const parsed = {
      answer: "저는 포트폴리오 챗봇입니다.",
      suggestedQuestions: [
        "사용한 기술 스택은 무엇인가요?",
        "프로젝트 구조를 설명해 주세요.",
        "앞으로 개선할 점은 무엇인가요?",
      ],
    };

    const result = validateModelResponse(parsed, "포트폴리오 설명해줘");

    expect(result).toEqual({
      answer: "저는 포트폴리오 챗봇입니다.",
      suggestedQuestions: [
        "사용한 기술 스택은 무엇인가요?",
        "프로젝트 구조를 설명해 주세요.",
        "앞으로 개선할 점은 무엇인가요?",
      ],
    });
  });

  test("answer 앞뒤 공백은 제거한다", () => {
    const parsed = {
      answer: "   공백이 있는 답변입니다.   ",
      suggestedQuestions: [
        "질문 1",
        "질문 2",
        "질문 3",
      ],
    };

    const result = validateModelResponse(parsed, "테스트");

    expect(result.answer).toBe("공백이 있는 답변입니다.");
  });

  test("answer가 비어 있으면 INVALID_ANSWER 에러를 발생시킨다", () => {
    const parsed = {
      answer: "   ",
      suggestedQuestions: [
        "질문 1",
        "질문 2",
        "질문 3",
      ],
    };

    expect(() => validateModelResponse(parsed, "테스트")).toThrow(
      "INVALID_ANSWER"
    );
  });

  test("suggestedQuestions가 배열이 아니면 fallback 질문으로 보정한다", () => {
    const parsed = {
      answer: "기술 스택에 대한 답변입니다.",
      suggestedQuestions: "배열이 아닙니다.",
    };

    const result = validateModelResponse(parsed, "기술 스택 알려줘");

    expect(result.suggestedQuestions).toEqual([
      "이 기술을 사용한 이유는 무엇인가요?",
      "구현하면서 겪은 문제는 어떻게 해결했나요?",
      "비슷한 다른 선택지와 비교하면 어떤 차이가 있나요?",
    ]);
  });

  test("suggestedQuestions에 빈 문자열과 중복이 있으면 정리하고 fallback으로 3개를 채운다", () => {
    const fallback = [
      "fallback 질문 1",
      "fallback 질문 2",
      "fallback 질문 3",
    ];

    const result = normalizeSuggestedQuestions(
      ["질문 1", " ", "질문 1", "질문 2"],
      fallback
    );

    expect(result).toEqual([
      "질문 1",
      "질문 2",
      "fallback 질문 1",
    ]);
  });

  test("프로젝트 관련 질문이면 프로젝트 fallback 질문을 반환한다", () => {
    const result = makeFallbackSuggestions("포트폴리오 프로젝트 설명해줘");

    expect(result).toEqual([
      "이 프로젝트에서 가장 중점적으로 본 부분은 무엇인가요?",
      "구현하면서 가장 어려웠던 점은 무엇이었나요?",
      "앞으로 어떻게 개선할 계획인가요?",
    ]);
  });
});