"use client";

import { useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const CHAT_ENDPOINT = API_BASE
  ? `${API_BASE}/api/chat`
  : "https://portfolio-backend-6ies.onrender.com/api/chat";

const QUICK_PROMPTS = [
  { label: "Projects", prompt: "Tell me about your projects." },
  {
    label: "Certs",
    prompt: "Tell me about the certifications you are preparing for.",
  },
  { label: "Timeline", prompt: "Show me your current study timeline." },
  { label: "Contact", prompt: "How can I contact you?" },
];

export default function ChatOpenPanel({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Choose a quick prompt or ask your own question. I can guide you through projects, certifications, and study progress.",
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
          <div className="text-sm font-medium text-[var(--fg)]">Guide</div>
          <div className="text-[11px] text-[var(--fg-muted)] tracking-wide">
            Portfolio chat
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
                Preparing a response...
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
            placeholder="Type a message."
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

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </aside>
  );
}
