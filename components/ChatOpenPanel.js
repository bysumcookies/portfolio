"use client";

import { useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const CHAT_ENDPOINT = API_BASE
  ? `${API_BASE}/api/chat`
  : "https://portfolio-backend-6ies.onrender.com/api/chat";

const QUICK_PROMPTS = [
  { label: "프로젝트", prompt: "진행 중인 프로젝트에 대해 알려주세요." },
  {
    label: "자격증",
    prompt: "준비 중인 자격증에 대해 알려주세요.",
  },
  { label: "학습 흐름", prompt: "현재 학습 흐름에 대해 알려주세요." },
  { label: "연락 방법", prompt: "연락할 수 있는 방법을 알려주세요." },
];

export default function ChatOpenPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "궁금한 내용을 바로 물어보시거나 아래 질문을 눌러보세요.\n프로젝트, 자격증, 학습 흐름을 중심으로 안내해드릴게요.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(rawText) {
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
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

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to load a response.");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
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
          <div className="text-sm font-medium text-[var(--fg)]">Chat</div>
          <div className="text-[11px] text-[var(--fg-muted)] tracking-wide">
            편하게 채팅으로 물어보세요!
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

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed text-white bg-[var(--accent-from)]"
                    : "max-w-[78%] whitespace-pre-wrap rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 px-4 py-3 text-sm text-[var(--fg)] leading-relaxed"
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[78%] rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 px-4 py-3 text-sm text-[var(--fg)] leading-relaxed">
                답변을 준비하고 있습니다.
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
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
