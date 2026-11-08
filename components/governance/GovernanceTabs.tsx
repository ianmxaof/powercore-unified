"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDecideInboxData } from "@/hooks/useDecideInboxData";

const BASE = "/governance";

const TABS = [
  { href: `${BASE}`, label: "Context Hub", short: "Context" },
  { href: `${BASE}/feeds`, label: "Signal Feeds", short: "Feeds" },
  { href: `${BASE}/decide`, label: "Decide Inbox", short: "Decide", badgeKey: "decide" as const },
  { href: `${BASE}/security`, label: "Security", short: "Security" },
  { href: `${BASE}/timeline`, label: "Agent Timeline", short: "Timeline" },
  { href: `${BASE}/radar`, label: "CI/CR Radar", short: "Radar" },
  { href: `${BASE}/skills`, label: "Skills", short: "Skills" },
  { href: `${BASE}/moltbook`, label: "Moltbook Hub", short: "Moltbook" },
] as const;

export function GovernanceTabs() {
  const pathname = usePathname();
  const { pendingCount } = useDecideInboxData();

  const isProjectDetail = pathname.startsWith(`${BASE}/projects/`);
  const activeHref = isProjectDetail ? BASE : pathname;

  return (
    <nav className="flex gap-1 border-b border-zinc-800 bg-zinc-900/50 px-4" aria-label="Governance sections">
      {TABS.map((tab) => {
        const { href, label, short } = tab;
        const badgeKey = "badgeKey" in tab ? tab.badgeKey : undefined;
        const isActive = href === BASE ? activeHref === BASE || isProjectDetail : pathname.startsWith(href);
        const badge = badgeKey === "decide" && pendingCount > 0 ? pendingCount : null;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-t px-3 py-2.5 text-sm font-medium transition flex items-center gap-1.5 ${
              isActive
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
            }`}
            title={label}
          >
            <span>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </span>
            {badge != null && (
              <span className="ml-0.5 px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
