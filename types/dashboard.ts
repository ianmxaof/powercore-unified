/**
 * Types for governance dashboard: Feeds, Decide, Security, Timeline, Radar, Skills, Moltbook.
 */

export type SignalFeedCard = {
  id: string;
  name: string;
  source: "github" | "reddit" | "x" | "rss" | "api" | "docs" | "moltbook";
  projectId?: string;
  signalStrength: number;
  lastDelta: string;
  whyItMatters: string;
  confidence: number;
  lastFetchedAt: string;
};

export type DecideOption = { id: string; label: string; summary: string };

type BaseDecideItem = {
  id: string;
  createdAt: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "approved" | "ignored" | "deeper";
};

export type ProjectDecision = BaseDecideItem & {
  category: "project";
  projectId?: string;
  whatChanged: string;
  whyItMatters: string;
  options: DecideOption[];
  recommendation: string;
};

export type SocialAction = BaseDecideItem & {
  category: "social";
  actionType: "post" | "comment" | "follow" | "create_submolt" | "dm";
  title: string;
  description: string;
  reasoning: string;
  implications: string[];
  targetSubmolt?: string;
  targetAgent?: string;
};

export type CICRAlert = BaseDecideItem & {
  category: "ci_cr";
  repo?: string;
  alertType: "failure" | "dependency" | "security";
  summary: string;
  suggestedAction: string;
};

export type DecideInboxItem = ProjectDecision | SocialAction | CICRAlert;

export type MoltbookAgent = {
  name: string;
  karma: number;
  followers: number;
  following: number;
  lastActive: string;
  status: "claimed" | "pending_claim";
};

export type MoltbookPost = {
  id: string;
  title: string;
  content: string;
  submolt: string;
  author: string;
  authorKarma: number;
  upvotes: number;
  comments: number;
  createdAt: string;
  relevanceScore?: number;
  relevanceReason?: string;
};

export type SocialExposure = {
  projectsMentioned: string[];
  apiEndpoints: { path: string; flagged: boolean }[];
  toolNames: string[];
  humanInfoLeaked: boolean;
  riskScore: "low" | "medium" | "high";
};

export type BehaviorAnomaly = {
  id: string;
  pattern: string;
  description: string;
  participatingAgents: number;
  severity: "info" | "warning" | "critical";
  detectedAt: string;
};

export type SecurityPosture = {
  publicExposure: boolean;
  portRiskScore: number;
  apiKeys: { id: string; label: string; lastUsedAt?: string }[];
  pluginTrust: { name: string; level: "verified" | "community" | "unknown" }[];
  attackerPreview?: string;
};

export type AgentTimelineEvent = {
  id: string;
  agentId: string;
  agentName: string;
  projectId?: string;
  kind: "observed" | "hypothesis" | "cross_check" | "proposal" | "awaiting_decision";
  summary: string;
  at: string;
};

export type RadarItem = {
  id: string;
  kind: "ci_failure" | "dependency_churn" | "tooling_change" | "automation_opportunity";
  title: string;
  summary: string;
  impact?: string;
  at: string;
  projectId?: string;
};

export type SkillCard = {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  authorReputation?: "verified" | "community" | "unknown";
  dependencyRiskScore: number;
  usageCount?: number;
  timeToRollback?: string;
  hasDryRun: boolean;
};
