"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto w-full px-6 sm:px-10 lg:px-14 max-w-[860px] lg:max-w-[920px] xl:max-w-[980px]">
        <div className="flex items-center justify-between py-5">
          {/* Left */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[var(--fg)]"
          >
            LOGO
          </Link>

          {/* Right */}
          <div className="flex items-center gap-6">
            {/* Desktop menu only */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--fg-muted)]">
              <Link
                className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                href="/about"
              >
                About
              </Link>
              <Link
                className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                href="/projects"
              >
                Projects
              </Link>
              <Link
                className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
                href="/certs"
              >
                Certs
              </Link>
            </nav>

            {/* Always visible */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
