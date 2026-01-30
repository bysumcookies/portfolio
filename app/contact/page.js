import Navbar from "../../components/Navbar";

export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-[var(--fg)]">Contact</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          이메일/깃허브/링크드인 등을 넣을 예정입니다.
        </p>
      </main>
    </div>
  );
}
