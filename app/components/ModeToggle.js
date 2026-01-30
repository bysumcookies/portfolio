"use client";

import { useTheme } from "../ThemeProvider";

export default function ModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold bg-[var(--panel)] text-[var(--fg)] border border-[var(--panel-border)] hover:bg-black/5 dark:hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
    >
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
