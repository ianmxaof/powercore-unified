import Link from "next/link";

export default function GovernanceDecidePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Decide Inbox
        </h2>
        <p className="mt-1 text-zinc-400">
          Single inbox for human decisions. Merge from context-hub for full implementation.
        </p>
      </section>
      <p className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center text-sm text-zinc-500">
        <Link href="https://github.com/ianmxaof/maltbot-skill-decide-inbox" className="text-amber-400 hover:underline">
          Full Decide Inbox implementation
        </Link>{" "}
        available in context-hub. Copy <code className="bg-zinc-800 px-1 rounded">src/app/(dashboard)/decide/</code> and related components.
      </p>
    </main>
  );
}
