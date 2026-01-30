"use client";

import Link from "next/link";
import ModeToggle from "@/app/components/ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--panel-border)] bg-[var(--panel)] backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--fg)]">
            LOGO
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm text-[var(--fg-muted)] sm:flex">
              <Link className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="/about">
                About
              </Link>
              <Link className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="/projects">
                Projects
              </Link>
              <Link className="transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm" href="/contact">
                Contact
              </Link>
            </nav>

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
