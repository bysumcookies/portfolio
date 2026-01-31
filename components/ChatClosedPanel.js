"use client";

export default function ChatClosedPanel({ onOpenChat }) {
  return (
    <section className="relative h-full w-full rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md overflow-hidden">
      {/* Soft corner gradient (subtle) */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-[360px] w-[360px] rounded-full blur-3xl opacity-55"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-to), var(--accent-via), var(--accent-from))",
        }}
      />

      {/* Inner spacing: “여백의 미” */}
      <div className="relative flex h-full flex-col px-7 py-8 sm:px-8 sm:py-9">
        {/* Top 30%: Hero block */}
        <div className="flex-1">
          <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--fg-muted)]">
            Cloud Security Engineer
          </div>

          <div className="mt-3 text-[28px] sm:text-[32px] font-semibold leading-[1.05] text-[var(--fg)]">
            Hello, my name is
          </div>

          <div className="mt-2 text-[34px] sm:text-[42px] font-extrabold leading-[1.0] text-[var(--fg)]">
            <span style={{ color: "var(--accent-hover)" }}>
              MIN-KYEONG KIM
            </span>
          </div>

          {/* Small social dots (placeholders) */}
          <div className="mt-6 flex items-center gap-2">
            {["GitHub", "LinkedIn", "Email", "Blog"].map((label) => (
              <span
                key={label}
                title={label}
                className="h-2.5 w-2.5 rounded-full bg-[var(--panel-border)]"
              />
            ))}
          </div>
        </div>

        {/* Bottom 70%: Visual / CTA area */}
        <div className="flex-[2] flex flex-col justify-end">
          {/* Minimal “visual” frame to keep it airy */}
          <div className="rounded-2xl border border-[var(--panel-border)] bg-white/5 dark:bg-white/5 p-5">
            <div className="text-sm text-[var(--fg)] font-medium">
              Try the guided chat
            </div>
            <div className="mt-2 text-xs text-[var(--fg-muted)] leading-relaxed">
              Ask about Projects / Certs / Timeline. (UI demo now, API later)
            </div>

            {/* Chips instead of looking like a chat app */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Show Projects", "Show Certs", "Open Timeline", "About Me"].map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={onOpenChat}
                    className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={onOpenChat}
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)] shadow-[0_12px_30px_rgba(5,38,89,0.18)] hover:brightness-[1.03] active:brightness-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
