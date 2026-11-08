import Link from "next/link";
import { mockProjects } from "@/data/mock-projects";

export default function GovernanceProjectDetailPage({ params }: { params: { id: string } }) {
  const project = mockProjects.find((p) => p.id === params.id);
  if (!project) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-zinc-500">Project not found.</p>
        <Link href="/governance" className="mt-4 text-amber-400 hover:underline">
          ← Back to Context Hub
        </Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/governance" className="text-sm text-amber-400 hover:underline">
        ← Context Hub
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">{project.name}</h1>
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
        <h3 className="text-sm font-medium text-zinc-500">Problem space</h3>
        <p className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
          {project.problemSpaceMarkdown}
        </p>
      </div>
    </main>
  );
}
