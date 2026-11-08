"use client";

import { mockDecideInbox } from "@/data/mock-dashboard";

export function useDecideInboxData() {
  const pendingCount = mockDecideInbox.filter((i) => i.status === "pending").length;
  return { pendingCount, items: mockDecideInbox };
}
