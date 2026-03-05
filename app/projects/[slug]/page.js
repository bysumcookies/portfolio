import Link from "next/link";

export default function ProjectDetailPage({ params }) {
  const { slug } = params;

  const project = {
    title: slug.replaceAll("-", " ").toUpperCase(),
    summary: "Project detail template page (demo content).",
    stack: ["Next.js", "Tailwind", "UI", "Routing"],
    links: {
      demo: null,
      repo: null,
    },
  };

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <div className="text-xs text-[var(--fg-muted)]">
          <Link
            className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
            href="/projects"
          >
            Projects
          </Link>{" "}
          / {slug}
        </div>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--fg)]">{project.title}</h1>
        <p className="mt-3 max-w-prose text-sm text-[var(--fg-muted)]">{project.summary}</p>

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
              Explain the initial constraints and what needed to be solved.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Solution</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Describe architecture decisions and implementation approach.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Result</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Share outcomes, improvements, and key lessons learned.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
            <h2 className="text-lg font-medium text-[var(--fg)]">Links</h2>
            {project.links.demo || project.links.repo ? (
              <div className="mt-3 flex gap-3 text-sm">
                {project.links.demo ? (
                  <a
                    className="underline decoration-[var(--fg-muted)] transition-colors hover:decoration-[var(--accent-hover)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                    href={project.links.demo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Demo
                  </a>
                ) : null}
                {project.links.repo ? (
                  <a
                    className="underline decoration-[var(--fg-muted)] transition-colors hover:decoration-[var(--accent-hover)] hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                    href={project.links.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Repo
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--fg-muted)]">Links will be added soon.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
