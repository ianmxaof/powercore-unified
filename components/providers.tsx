"use client";

/**
 * Client-side Providers Component
 * Wraps all client-side context providers
 */

import { UserProvider } from "@/contexts/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
