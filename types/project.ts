export type LinkedRepo = {
  id: string;
  name: string;
  url: string;
  branch?: string;
  lastSyncedAt?: string;
};

export type LinkedFeed = {
  id: string;
  name: string;
  urlOrSource: string;
  type: "rss" | "api" | "docs" | "custom";
  lastFetchedAt?: string;
};

export type LinkedAgent = {
  id: string;
  name: string;
  role: string;
  lastActiveAt?: string;
};

export type DecisionLogEntry = {
  id: string;
  at: string;
  title: string;
  summary: string;
  rationale?: string;
  tags?: string[];
};

export type Project = {
  id: string;
  name: string;
  problemSpaceMarkdown: string;
  linkedRepos: LinkedRepo[];
  linkedFeeds: LinkedFeed[];
  linkedAgents: LinkedAgent[];
  decisionLog: DecisionLogEntry[];
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
};
