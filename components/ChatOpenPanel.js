"use client";

import { useMemo } from "react";

export default function ChatOpenPanel({ onClose }) {
  const messages = useMemo(
    () => [
      {
        role: "assistant",
        text: "Pick a prompt below and I will guide you to Projects / Certs / Timeline.",
      },
    ],
    []
  );

  return (
    <aside className="relative h-full w-full rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] px-6 py-4">
        <div>
          <div className="text-sm font-medium text-[var(--fg)]">Guide</div>
          <div className="text-[11px] text-[var(--fg-muted)] tracking-wide">Chat UI (API-ready)</div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center justify-center"
        >
          <span className="text-[var(--fg-muted)] text-lg leading-none" aria-hidden="true">
            ¡¿
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className="flex justify-start">
              <div className="max-w-[78%] rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 px-4 py-3 text-sm text-[var(--fg)] leading-relaxed">
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Projects", "Certs", "Timeline", "Contact"].map((t) => (
            <button
              key={t}
              type="button"
              className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--panel-border)] px-6 py-4">
        <div className="flex gap-2">
          <input
            disabled
            className="w-full rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] opacity-70 cursor-not-allowed"
            placeholder="Type a keyword (API integration planned)"
          />
          <button
            type="button"
            disabled
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)] opacity-60 cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
