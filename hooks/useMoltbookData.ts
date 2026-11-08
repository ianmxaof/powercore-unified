"use client";

import { mockDecideInbox } from "@/data/mock-dashboard";
import {
  mockMoltbookAgent,
  mockMoltbookSignals,
  mockSocialExposure,
  mockBehaviorAnomalies,
} from "@/data/mock-moltbook";

export function useMoltbookData() {
  const socialPendingCount = mockDecideInbox.filter(
    (i) => i.category === "social" && i.status === "pending"
  ).length;

  return {
    agent: mockMoltbookAgent,
    signals: mockMoltbookSignals,
    exposure: mockSocialExposure,
    anomalies: mockBehaviorAnomalies,
    socialPendingCount,
    lastSyncedAt: null as string | null,
    isConfigured: false,
    error: null as string | null,
  };
}
