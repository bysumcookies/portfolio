export default function HeroVisualCard({ onOpenChat }) {
  return (
    <div className="relative w-full max-w-[520px] mx-auto min-h-[460px] rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] dark:bg-white/5 backdrop-blur-md overflow-hidden">
      {/* Background blob gradient */}
      <div className="absolute -top-24 -right-24 h-[360px] w-[360px] rounded-full blur-3xl opacity-60" style={{ background: 'linear-gradient(135deg, var(--accent-to), var(--accent-via), var(--accent-from))' }}></div>
      
      {/* Content */}
      <div className="relative h-full min-h-[460px] flex flex-col items-center justify-center p-8">
        {/* Placeholder profile image */}
        <div className="relative">
          <div 
            className="h-56 w-56 rounded-full p-[2px]"
            style={{ background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))' }}
          >
            <div className="h-full w-full rounded-full bg-[var(--panel)] flex items-center justify-center">
              <svg
                className="h-24 w-24 text-[var(--fg-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <button
          onClick={onOpenChat}
          className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-[var(--fg)] bg-[linear-gradient(135deg,rgba(214,239,255,0.55),rgba(214,239,255,0.25))] dark:bg-[linear-gradient(135deg,rgba(214,239,255,0.16),rgba(214,239,255,0.08))] border border-[var(--panel-border)] hover:brightness-[1.03] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        >
          Ask me about my profile
        </button>
      </div>
    </div>
  );
}
