"use client";

import { useEffect, useRef, useState } from "react";

const CHAT_ENDPOINT = "/api/chat";

const QUICK_PROMPTS = [
  { label: "프로젝트", prompt: "진행 중인 프로젝트에 대해 알려주세요." },
  { label: "자격증", prompt: "준비 중인 자격증에 대해 알려주세요." },
  { label: "학습 흐름", prompt: "현재 학습 흐름에 대해 알려주세요." },
  { label: "연락 방법", prompt: "연락할 수 있는 방법을 알려주세요." },
];

const assistantBubbleStyle = {
  background: "color-mix(in srgb, var(--accent-hover) 22%, transparent)",
};

const suggestionButtonStyle = {
  background: "color-mix(in srgb, var(--accent-hover) 12%, white)",
};

function parseSseEvent(eventBlock) {
  const dataLines = eventBlock
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.replace(/^data:\s?/, ""));

  if (dataLines.length === 0) {
    return null;
  }

  const data = dataLines.join("\n");

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("[SSE Parse Error]", error, data);
    return null;
  }
}

export default function ChatOpenPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "궁금한 내용을 바로 물어보시거나 아래 질문을 눌러보세요.\n프로젝트, 자격증, 학습 흐름을 중심으로 안내해드릴게요.",
    },
  ]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, suggestedQuestions]);

  function appendToLastAssistantMessage(text) {
    setMessages((prev) => {
      const next = [...prev];

      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i].role === "assistant") {
          next[i] = {
            ...next[i],
            text: `${next[i].text}${text}`,
          };
          break;
        }
      }

      return next;
    });
  }

  function replaceLastAssistantMessage(text) {
    setMessages((prev) => {
      const next = [...prev];

      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i].role === "assistant") {
          next[i] = {
            ...next[i],
            text,
          };
          break;
        }
      }

      return next;
    });
  }

  async function readStreamingResponse(res) {
    if (!res.body) {
      throw new Error("스트리밍 응답을 읽을 수 없습니다.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const eventBlocks = buffer.split("\n\n");
      buffer = eventBlocks.pop() || "";

      for (const eventBlock of eventBlocks) {
        const event = parseSseEvent(eventBlock);

        if (!event) {
          continue;
        }

        if (event.type === "answer") {
          appendToLastAssistantMessage(event.text || "");
        }

        if (event.type === "suggestions") {
          setSuggestedQuestions(
            Array.isArray(event.suggestedQuestions)
              ? event.suggestedQuestions
              : []
          );
        }

        if (event.type === "save_error") {
          setError(event.message || "답변 저장 중 문제가 발생했습니다.");
        }

        if (event.type === "error") {
          setError(event.message || "에러가 발생했습니다.");

          replaceLastAssistantMessage(
            event.message || "지금은 답변을 생성하지 못했습니다."
          );
        }

        if (event.type === "done") {
          return;
        }
      }
    }
  }

  async function sendMessage(rawText) {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    setError("");
    setSuggestedQuestions([]);
    setHasStartedChat(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "assistant", text: "" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();

        if (!res.ok || !data.ok) {
          const errorMessage =
            typeof data.answer === "string"
              ? data.answer
              : data.error?.code || "에러가 발생했습니다.";

          setError(errorMessage);
          replaceLastAssistantMessage(errorMessage);
          return;
        }
      }

      if (!res.ok) {
        const errorMessage = "서버 응답 중 문제가 발생했습니다.";
        setError(errorMessage);
        replaceLastAssistantMessage(errorMessage);
        return;
      }

      await readStreamingResponse(res);
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      replaceLastAssistantMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <aside className="relative h-full w-full rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-6 py-4">
        <div>
          <div className="text-sm font-medium text-[var(--fg)]">
            Chat with Me
          </div>
          <div className="text-[11px] text-[var(--fg-muted)] tracking-wide">
            궁금한 것을 채팅으로 물어보세요
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center justify-center"
        >
          <span
            className="text-[var(--fg-muted)] text-lg leading-none"
            aria-hidden="true"
          >
            X
          </span>
        </button>
      </div>

      <div ref={scrollAreaRef} className="flex-1 overflow-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((m, idx) => {
            const isStreamingAssistant =
              loading && m.role === "assistant" && idx === lastAssistantIndex;

            return (
              <div key={idx}>
                {(m.role === "user" || m.text || isStreamingAssistant) && (
                  <div
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed text-white bg-[var(--accent-from)]"
                          : "max-w-[78%] whitespace-pre-wrap rounded-2xl border border-[var(--panel-border)] px-4 py-3 text-sm text-[var(--fg)] leading-relaxed"
                      }
                      style={
                        m.role === "assistant"
                          ? assistantBubbleStyle
                          : undefined
                      }
                    >
                      {m.text || (isStreamingAssistant ? "응답 생성 중" : "")}

                      {isStreamingAssistant && (
                        <span
                          className="ml-0.5 inline-block animate-pulse align-baseline"
                          aria-hidden="true"
                        >
                          ▍
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {!hasStartedChat && idx === 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => sendMessage(item.prompt)}
                        disabled={loading}
                        className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition disabled:opacity-50"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                {!loading &&
                  m.role === "assistant" &&
                  idx === lastAssistantIndex &&
                  suggestedQuestions.length > 0 && (
                    <div className="mt-3 flex flex-col items-start gap-2">
                      {suggestedQuestions.map((question, questionIdx) => (
                        <button
                          key={`${question}-${questionIdx}`}
                          type="button"
                          onClick={() => sendMessage(question)}
                          disabled={loading}
                          className="max-w-[78%] rounded-2xl border border-[var(--panel-border)] px-4 py-2.5 text-left text-sm text-[var(--fg)] leading-relaxed whitespace-normal break-words transition hover:brightness-[0.99] disabled:opacity-50"
                          style={suggestionButtonStyle}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-[var(--panel-border)] px-6 py-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="w-full rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)]"
            placeholder="메시지를 입력하세요."
          />

          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="shrink-0 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)] disabled:opacity-60"
          >
            {loading ? "..." : "보내기"}
          </button>
        </div>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </aside>
  );
}