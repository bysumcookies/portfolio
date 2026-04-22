export function makeFallbackSuggestions(userMessage) {
  const lower = String(userMessage || "").toLowerCase();

  if (
    lower.includes("프로젝트") ||
    lower.includes("포트폴리오") ||
    lower.includes("과제")
  ) {
    return [
      "이 프로젝트에서 가장 중점적으로 본 부분은 무엇인가요?",
      "구현하면서 가장 어려웠던 점은 무엇이었나요?",
      "앞으로 어떻게 개선할 계획인가요?",
    ];
  }

  if (
    lower.includes("기술") ||
    lower.includes("스택") ||
    lower.includes("next") ||
    lower.includes("flask") ||
    lower.includes("mongodb") ||
    lower.includes("aws")
  ) {
    return [
      "이 기술을 사용한 이유는 무엇인가요?",
      "구현하면서 겪은 문제는 어떻게 해결했나요?",
      "비슷한 다른 선택지와 비교하면 어떤 차이가 있나요?",
    ];
  }

  if (
    lower.includes("자격증") ||
    lower.includes("공부") ||
    lower.includes("학습")
  ) {
    return [
      "현재 가장 집중하고 있는 학습 분야는 무엇인가요?",
      "공부하면서 중요하게 보는 기준은 무엇인가요?",
      "앞으로의 학습 계획은 어떻게 되나요?",
    ];
  }

  return [
    "조금 더 자세히 설명해주실 수 있나요?",
    "관련해서 어떤 경험을 가장 강조하고 싶나요?",
    "앞으로의 계획도 함께 들을 수 있을까요?",
  ];
}

export function normalizeSuggestedQuestions(value, fallback = []) {
  const base = Array.isArray(value) ? value : [];

  const cleaned = base
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  const unique = [...new Set(cleaned)];

  for (const item of fallback) {
    if (unique.length >= 3) break;

    if (typeof item === "string" && item.trim() && !unique.includes(item.trim())) {
      unique.push(item.trim());
    }
  }

  return unique.slice(0, 3);
}

export function validateModelResponse(parsed, userMessage) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("MODEL_RESPONSE_NOT_OBJECT");
  }

  const answer =
    typeof parsed.answer === "string" ? parsed.answer.trim() : "";

  if (!answer) {
    throw new Error("INVALID_ANSWER");
  }

  const suggestedQuestions = normalizeSuggestedQuestions(
    parsed.suggestedQuestions,
    makeFallbackSuggestions(userMessage)
  );

  if (suggestedQuestions.length !== 3) {
    throw new Error("INVALID_SUGGESTED_QUESTIONS");
  }

  return {
    answer,
    suggestedQuestions,
  };
}