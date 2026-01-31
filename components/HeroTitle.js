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

      {/* sub-scrib */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--fg-muted)]">
            I build secure, scalable AWS infrastructure and practical security automation.
        </p>

    </section>
  );
}
