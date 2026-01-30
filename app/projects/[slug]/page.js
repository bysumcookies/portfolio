import Link from "next/link";
import Navbar from "../../../components/Navbar";

export default function ProjectDetailPage({ params }) {
  const { slug } = params; // URL의 /projects/<여기> 값이 들어옵니다.

  // 발표용: 개인정보/시험/장래희망 등 개인 식별 정보 없이도 그럴듯한 템플릿
  const project = {
    title: slug.replaceAll("-", " ").toUpperCase(),
    summary: "프로젝트 상세 페이지 템플릿(데모)입니다.",
    stack: ["Next.js", "Tailwind", "UI", "Routing"],
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <div className="text-xs text-[var(--fg-muted)]">
          <Link className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="/projects">
            Projects
          </Link>{" "}
          / {slug}
        </div>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--fg)]">{project.title}</h1>
        <p className="mt-3 max-w-prose text-sm text-[var(--fg-muted)]">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1 text-xs text-[var(--fg-muted)]"
            >
              {t}
            </span>
          ))}
        </div>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Problem</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              어떤 상황에서 어떤 요구사항이 있었는지(일반화된 설명).
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Solution</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              어떤 방식으로 해결했는지(아키텍처/흐름 중심).
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Result</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              결과/개선점/배운 점(개인정보 없이).
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Links</h2>
            <div className="mt-3 flex gap-3 text-sm">
              <a className="underline decoration-[var(--fg-muted)] transition-colors hover:decoration-[var(--accent-hover)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="#">
                Demo
              </a>
              <a className="underline decoration-[var(--fg-muted)] transition-colors hover:decoration-[var(--accent-hover)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="#">
                Repo
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
