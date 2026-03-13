"use client";

import Link from "next/link";

export default function HeroCTA() {
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-4">
      <Link
        href="/projects"
        className="
          inline-flex items-center justify-center
          rounded-full px-3 py-[0.45rem]
          text-[13px] font-semibold text-white
          bg-[var(--accent-from)]
          shadow-[0_10px_26px_rgba(5,38,89,0.16)]
          hover:brightness-[1.03] active:brightness-[0.98]
          transition
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
        "
      >
        Projects
      </Link>

      <Link
        href="/contact"
        className="
          inline-flex items-center justify-center
          rounded-full px-3 py-[0.45rem]
          text-[13px] font-semibold
          bg-[var(--panel)] text-[var(--fg)]
          border border-[var(--panel-border)]
          hover:bg-black/5 dark:hover:bg-white/10
          transition
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]
          focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
        "
      >
        Contact
      </Link>
    </div>
  );
}
