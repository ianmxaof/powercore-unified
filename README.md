# PowerCore Unified

A Next.js 14 App Router frontend for the PowerCore AI agent marketplace: public landing, hangar, workshop, skills armory, and Stripe checkout.

## What this project provides

- Consumer landing and marketplace UI (Tailwind, shadcn/ui)
- Agent hangar, no-code workshop, skills armory
- Optional governance UI (context hub / decide inbox)
- Checkout via Stripe; API client talks to the PowerCore backend

## Who should use this

Operators shipping the public PowerCore site (powercore.app). Admin/creator UI lives in `powercore-dashboard`; backend in `powercore-hardened`.

## Quick start

```bash
npm install
cp .env.example .env.local   # or the env template in powercore-critical-files
npm run dev
```

See `AGENTS.md` in the checkout for local commands. Do not commit secrets.
