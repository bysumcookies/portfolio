export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-[var(--fg)]">About</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          This page summarizes my background, learning focus, and portfolio direction.
        </p>

        <section
          id="contact"
          className="mt-14 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--fg)]">Contact</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            The fastest way to reach me is email. I usually respond within 24-48 hours.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              className="rounded-xl border border-[var(--panel-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
              href="mailto:bysumcontact@gmail.com"
            >
              <div className="text-xs text-[var(--fg-muted)]">Email</div>
              <div className="mt-1 font-medium">bysumcontact@gmail.com</div>
            </a>

            <a
              className="rounded-xl border border-[var(--panel-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition"
              href="https://github.com/bysumcookies"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-xs text-[var(--fg-muted)]">GitHub</div>
              <div className="mt-1 font-medium">github.com/bysumcookies</div>
            </a>

            <a
              className="rounded-xl border border-[var(--panel-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] hover:bg-black/5 dark:hover:bg-white/10 transition sm:col-span-2"
              href="https://linkedin.com/in/bysumcookies"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-xs text-[var(--fg-muted)]">LinkedIn</div>
              <div className="mt-1 font-medium">linkedin.com/in/bysumcookies</div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
