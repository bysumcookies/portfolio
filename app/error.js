"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("[App Error Boundary]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[var(--bg)] text-[var(--fg)]">
      <section className="w-full max-w-md rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 text-center shadow-sm">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--fg-muted)]">
          Error Boundary
        </p>

        <h1 className="mt-3 text-xl font-semibold text-[var(--fg)]">
          화면을 불러오는 중 문제가 발생했습니다.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          일시적인 오류일 수 있습니다. 다시 시도하거나 홈으로 이동해 주세요.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-[var(--accent-from)]"
          >
            다시 시도
          </button>

          <a
            href="/"
            className="rounded-2xl border border-[var(--panel-border)] px-4 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            홈으로 이동
          </a>
        </div>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-5 max-h-40 overflow-auto rounded-2xl border border-[var(--panel-border)] bg-black/5 p-3 text-left text-xs text-[var(--fg-muted)] dark:bg-white/5">
            {error?.message}
          </pre>
        )}
      </section>
    </main>
  );
}