import Link from "next/link";
import Navbar from "../../components/Navbar";

const items = [
  { slug: "project-a", title: "Project A", desc: "요약 설명" },
  { slug: "project-b", title: "Project B", desc: "요약 설명" },
  { slug: "project-c", title: "Project C", desc: "요약 설명" },
];

export default function ProjectsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-[var(--fg)]">Projects</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          목록 페이지(정통 구조). 카드 클릭 → 상세로 이동.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 transition-all hover:bg-black/5 dark:hover:bg-white/10 hover:border-[var(--accent-from)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <div className="font-medium text-[var(--fg)]">{p.title}</div>
              <div className="mt-2 text-sm text-[var(--fg-muted)]">{p.desc}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
