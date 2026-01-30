"use client";

export default function ModeToggle({ value, onChange }) {
  const isOn = value === "b"; // 예: b일 때 ON이라고 가정

  return (
    <button
      type="button"
      onClick={() => onChange(isOn ? "a" : "b")}
      className={[
        "relative h-7 w-12 rounded-full border border-white/15 transition",
        isOn ? "bg-[rgb(var(--accent))]/80" : "bg-white/10",
      ].join(" ")}
      aria-label="Toggle mode"
    >
      <span
        className={[
          "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform",
          isOn ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}
