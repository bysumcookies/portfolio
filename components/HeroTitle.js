"use client";

export default function HeroTitle() {
  return (
    <section>
      {/* HERO TITLE (Primary) */}
      <div
        className="
          text-4xl sm:text-5xl lg:text-4xl
          font-extrabold
          tracking-[0.1em]
          uppercase
          leading-tight
        "
        style={{ color: "var(--accent-from)" }}
      >
        CLOUD SECURITY <br />
        ENGINEER
      </div>

      {/* SUB TITLE (Secondary) */}
      <div
        className="
          mt-5 sm:mt-6
          text-xs sm:text-sm
          tracking-[0.30em]
          uppercase
          font-medium
          text-[var(--fg-muted)]
        "
      >
        My name is MIN-KYEONG
      </div>

      {/* Desktop-only description */}
      <p className="mt-4 hidden md:block max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--fg-muted)]">
        I build secure, scalable AWS infrastructure and practical security automation.
      </p>
    </section>
  );
}
