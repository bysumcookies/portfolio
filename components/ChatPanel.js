"use client";

import { useMemo } from "react";

export default function ChatPanel({ onClose }) {
  const messages = useMemo(
    () => [
      { role: "assistant", text: "안녕하세요. 오른쪽은 Chat-like 패널입니다." },
      { role: "assistant", text: "버튼으로 닫을 수도 있고, 다시 열 수도 있어요." },
      { role: "user", text: "오케이. 홈은 듀얼 패널로!" },
    ],
    []
  );

  return (
    <aside className="relative w-full max-w-[520px] mx-auto min-h-[460px] rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] p-4">
        <div>
          <div className="text-sm font-medium text-[var(--fg)]">Chat</div>
          <div className="text-xs text-[var(--fg-muted)]">Ask me anything (demo)</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="h-8 w-8 rounded-full bg-[var(--panel)] border border-[var(--panel-border)] hover:bg-black/5 dark:hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] flex items-center justify-center"
        >
          <span className="text-[var(--fg-muted)] text-lg leading-none" aria-hidden="true">×</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-auto p-4">
      {messages.map((m, idx) => {
        const isUser = m.role === "user";
        return (
          <div
            key={idx}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={[
                "inline-block max-w-[70%] px-4 py-2 rounded-2xl break-words whitespace-pre-wrap text-sm",
                isUser
                  ? "bg-[var(--chat-outgoing-bg)] border border-[var(--chat-outgoing-border)] text-[var(--chat-outgoing-fg)] shadow-sm"
                  : "bg-[var(--chat-incoming-bg)] text-[var(--chat-incoming-fg)] shadow-md ring-1 ring-white/10",
              ].join(" ")}
            >
              {m.text}
            </div>
          </div>
        );
      })}
      </div>

      {/* Input (UI only) */}
      <div className="border-t border-[var(--panel-border)] p-3">
        <div className="flex gap-2">
          <input
            className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            placeholder="메시지를 입력하세요… (UI only)"
          />
          <button className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-[var(--accent-from)] shadow-[0_12px_30px_rgba(5,38,89,0.18)] hover:brightness-[1.03] active:brightness-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
