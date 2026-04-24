export const metadata = {
  title: '자격증',
}

export default function CertsPage() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)]">
          Certifications
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          취득한 자격증과 현재 준비 중인 자격증을 정리한 페이지입니다.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">AWS</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">
            Solutions Architect - Associate
          </div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            상태: 준비 중
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">국가기술자격</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">
            정보처리산업기사
          </div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            상태: 진행 중
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">민간자격</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">
            네트워크관리사 2급
          </div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            상태: 취득
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="text-xs text-[var(--fg-muted)]">민간자격</div>
          <div className="mt-1 text-lg font-semibold text-[var(--fg)]">
            PC Master
          </div>
          <div className="mt-2 text-sm text-[var(--fg-muted)]">
            상태: 취득
          </div>
        </div>
      </section>
    </main>
  )
}