export const metadata = {
  title: "Certs",
};

export default function CertsPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)]">Certifications</h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          Exam history, learning focus, and next steps.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">AWS</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">SAA-C03</div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            Status: Preparing for retake (focus: Security + High Performance).
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">Korea</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">Engineer Information Processing</div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            Status: Written + Practical track (scheduled).
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">Degree</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">Academic Credit Program</div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            Courses and credits in progress.
          </div>
        </div>
      </section>
    </main>
  );
}
