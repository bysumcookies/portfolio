"use client";

export default function ChatClosedPanel({ onOpenChat }) {
  return (
    <section className="relative h-full w-full rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur-md overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-[360px] w-[360px] rounded-full blur-3xl opacity-55"
        style={{
          background:
            "linear-gradient(135deg, var(--accent-to), var(--accent-via), var(--accent-from))",
        }}
      />

      <div className="relative flex h-full flex-col px-7 py-8 sm:px-8 sm:py-9">
        <div className="flex-1">
          <div className="w-full">
            <div className="text-sm text-[var(--fg)] font-medium">
              채팅으로 직접 포트폴리오 살펴보기
            </div>
            <div className="mt-2 max-w-[520px] text-xs text-[var(--fg-muted)] leading-relaxed">
              프로젝트, 자격증, 학습 흐름, 연락 방법을 채팅으로 빠르게 확인할 수 있습니다.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["프로젝트", "자격증", "학습 흐름", "연락 방법"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={onOpenChat}
                  className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onOpenChat}
            className="inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)] shadow-[0_12px_30px_rgba(5,38,89,0.18)] hover:brightness-[1.03] active:brightness-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            채팅 열기
          </button>
        </div>
      </div>
    </section>
  );
}
