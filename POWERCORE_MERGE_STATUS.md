# PowerCore Merge Status

Merge of **context-hub** (Maltbot Governance UI) into **powercore-unified** per [powercore-convergence-strategy.md](https://github.com/ianmxaof/powercore-unified) and [powercore-merge-implementation.md](https://github.com/ianmxaof/powercore-unified).

## Architecture After Merge

```
PowerCore Platform
├── / (Landing)           — Marketing from powercore-unified
├── /marketplace          — Agent marketplace
├── /workshop             — No-code agent builder
├── /hangar               — Agent roster management
├── /skills               — Skills Armory
├── /governance           — Maltbot Governance Dashboard (NEW)
│   ├── /                 — Context Hub
│   ├── /decide           — Decide Inbox (single bottleneck)
│   ├── /feeds            — Signal Feeds
│   ├── /security         — Security Posture + OpenClaw status
│   ├── /timeline         — Agent Timeline
│   ├── /radar            — CI/CR Radar
│   ├── /moltbook         — Moltbook Hub (social layer)
│   └── /projects/[id]    — Project detail
└── /api/
    ├── openclaw/         — OpenClaw CLI adapter
    ├── moltbook/         — Moltbook registration
    ├── checkout/         — Stripe
    └── webhooks/stripe/  — Stripe webhooks
```

## Merge Steps Completed

1. **Governance dashboard** — Added at `/governance` with full Maltbot UI
2. **OpenClaw API** — Status, health, sessions, skills, approvals
3. **Moltbook API** — Registration endpoint for PowerCoreAi
4. **Decide Inbox** — Single bottleneck (project + social + CI/CR)
5. **Moltbook Hub** — Social intelligence, register widget
6. **Nav link** — "Governance" added to main nav

## Merge Completed (Phase 1)

- **Governance dashboard** at `/governance` with Context Hub, Decide, Feeds, Security, Timeline, Radar, Skills, Moltbook tabs
- **Types, data, hooks** copied from context-hub
- **Governance** link added to main nav
- **Stub pages** for Decide, Feeds, Security, Timeline, Radar, Skills, Moltbook (full implementation in context-hub)

## Next Steps (Phase 2)

1. Copy full page implementations from `context-hub/src/app/(dashboard)/` to `powercore-unified/app/governance/` (decide, feeds, security, timeline, radar, skills, moltbook)
2. Copy OpenClaw API routes from `context-hub/src/app/api/openclaw/` to `powercore-unified/app/api/openclaw/`
3. Copy Moltbook register API from `context-hub/src/app/api/moltbook/` to `powercore-unified/app/api/moltbook/`
4. Copy Moltbook components from `context-hub/src/components/moltbook/` to `powercore-unified/components/moltbook/`
5. Copy Decide components from `context-hub/src/components/decide/` to `powercore-unified/components/decide/`
6. Copy `lib/openclaw.ts`, `types/api.ts` from context-hub
7. Add `date-fns`, `zod` to powercore-unified package.json
8. Wire Moltbook API key from env for live data when configured
9. Connect Decide Inbox to Supabase for persistence (per merge implementation)
