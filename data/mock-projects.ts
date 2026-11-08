import type { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Backend API Reliability",
    problemSpaceMarkdown: "We need to maintain P99 latency under 500ms while shipping new features. The team uses feature flags and gradual rollouts.",
    linkedRepos: [{ id: "r1", name: "backend-api", url: "https://github.com/org/backend-api", branch: "main" }],
    linkedFeeds: [{ id: "f1", name: "r/backend", urlOrSource: "reddit", type: "custom" }],
    linkedAgents: [{ id: "a1", name: "SLO Reviewer", role: "Research" }],
    decisionLog: [],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-29T08:00:00Z",
    lastActivityAt: "2025-01-29T08:00:00Z",
  },
];
