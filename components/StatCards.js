export default function StatCards() {
    return (
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-neutral-300">Certifications</div>
          <ul className="mt-2 space-y-1 text-sm text-neutral-200">
            <li>• AWS (in progress)</li>
            <li>• Security fundamentals</li>
            <li>• AltOr mentoring track</li>
          </ul>
        </div>
  
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm text-neutral-300">Tech Stack</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {["Next.js", "React", "Tailwind", "AWS", "IAM", "VPC"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-neutral-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  