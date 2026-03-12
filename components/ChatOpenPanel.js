"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

const QUICK_PROMPTS = [
  { label: "Projects", prompt: "프로젝트에 대해 알려줘" },
  { label: "Certs", prompt: "자격증 준비에 대해 알려줘" },
  { label: "Timeline", prompt: "학습 타임라인에 대해 알려줘" },
  { label: "Contact", prompt: "연락 방법에 대해 알려줘" },
];

export default function ChatOpenPanel({ onClose }) {
  // 1) 메시지 목록: 이제 고정 배열이 아니라 '상태'로 관리
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Pick a prompt below and I will guide you to Projects / Certs / Timeline.",
    },
  ]);

  // 2) 입력값 상태
  const [input, setInput] = useState("");

  // 3) 로딩 / 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 4) 실제 전송 함수
  async function sendMessage(rawText) {
    const trimmed = rawText.trim();

    if (!trimmed || loading) return;

    setError("");

    // 사용자 메시지를 먼저 화면에 추가
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/sendMessage?message=${encodeURIComponent(trimmed)}`
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "응답을 불러오지 못했습니다.");
      }

      // 백엔드 app.py에서 answer로 바꿨으므로 data.answer를 읽음
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer },
      ]);
    } catch (err) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 5) Enter 전송
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  }

  // 6) 퀵 프롬프트 버튼 클릭 시 바로 전송
  function handleQuickPrompt(prompt) {
    sendMessage(prompt);
  }

  return (
    <aside className="relative h-full w-full rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-6 py-4">
        <div>
          <div className="text-sm font-medium text-[var(--fg)]">Guide</div>
          <div className="text-[11px] text-[var(--fg-muted)] tracking-wide">
            Chat UI (API-ready)
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
            ×
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
                    ? "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-white bg-[var(--accent-from)]"
                    : "max-w-[78%] rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 px-4 py-3 text-sm text-[var(--fg)] leading-relaxed"
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[78%] rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 px-4 py-3 text-sm text-[var(--fg)] leading-relaxed">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickPrompt(item.prompt)}
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
            placeholder="Type a message..."
          />

          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)] disabled:opacity-60"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}