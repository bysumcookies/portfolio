import Navbar from "../../components/Navbar";

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-[var(--fg)]">About</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          여기에 자기소개/경험을 채울 예정입니다.
        </p>
      </main>
    </div>
  );
}
