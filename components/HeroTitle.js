"use client";

export default function HeroTitle() {
  return (
    <section className="max-w-3xl">
      <div
        className="text-[13px] font-semibold uppercase tracking-[0.14em] sm:text-[14px]"
        style={{ color: "var(--accent-hover)" }}
      >
        my name is MIN-KYEONG
      </div>

      <h1
        className="mt-4 text-[2.4rem] font-black leading-[0.92] tracking-[-0.06em] sm:text-[3.3rem] lg:text-[4rem]"
        style={{
          color: "var(--accent-from)",
          textShadow:
            "0 1px 0 rgba(255,255,255,0.18), 0 8px 18px rgba(5,38,89,0.12), 0 16px 30px rgba(5,38,89,0.08)",
        }}
      >
        CLOUD SECURITY
        <span className="block">ENGINEER</span>
      </h1>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--fg-muted)] sm:text-base">
        AWS 학습, 보안 기초, 자격증 준비, 그리고 포트폴리오 구현 과정을
        한곳에 정리하고 있습니다.
      </p>
    </section>
  );
}
