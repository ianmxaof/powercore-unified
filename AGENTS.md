# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This repo contains the consumer-facing **PowerCore Unified Dashboard**: a Next.js 14 App Router frontend for the PowerCore AI Agent Marketplace. It provides the public landing and marketplace experience (marketplace, skills armory, workshop, hangar) that complements the separate `powercore-dashboard` admin/creator interface and the `powercore-hardened` backend.

The app is a dark-mode, Tailwind + shadcn/ui + Framer Motion frontend that is currently wired to:
- A typed HTTP API client in `lib/api.ts` (configurable via `NEXT_PUBLIC_API_URL`).
- A PostgreSQL schema in `database/schema.sql` used by the backend for agents, skills, payments, subscriptions, reviews, and context caching.
- Stripe payments via `app/api/checkout/route.ts` and `app/api/webhooks/stripe/route.ts`.
- Security and auth-aware routing via `middleware.ts`.

There is a `powercore-critical-files/` directory that contains canonical versions of key integration pieces (env template, API client, middleware, email service, UserContext, API routes). When you change any of those concerns, keep the main app files and their copies in `powercore-critical-files/` consistent.

## Commands & Development Workflow

All commands assume the working directory is the repo root: `powercore-unified/`.

### Environment & setup

- Install dependencies (Node version should align with CI, which pins Node 20):
  - `npm install`
- Create your local env file from the canonical template:
  - Copy `powercore-critical-files/.env.example` to `.env.local` and fill in values.
  - Key variables for local work include:
    - `NEXT_PUBLIC_APP_URL` (usually `http://localhost:3000`)
    - `NEXT_PUBLIC_API_URL` (backend API base, e.g. `http://localhost:5003`)
    - `DATABASE_URL` (PostgreSQL DSN, matches `database/README.md`)
    - Stripe keys (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`)
    - NextAuth + OAuth provider settings (if/when auth is enabled).

### Core npm scripts

From `package.json`:

- Development server (Next.js App Router):
  - `npm run dev`
- Production build:
  - `npm run build`
- Start production server (after `npm run build`):
  - `npm start`
- Lint (Next/ESLint):
  - `npm run lint`
- Type-check (TypeScript, no emit):
  - `npm run type-check`

### Database lifecycle

Database schema is managed via raw SQL, not an ORM (yet):

- Schema location:
  - `database/schema.sql` (with docs in `database/README.md`).
- Typical local setup flow (PostgreSQL 12+):
  - Create DB: `CREATE DATABASE powercore_db;`
  - Apply schema:
    - `psql -U postgres -d powercore_db -f database/schema.sql`
    - or `psql $DATABASE_URL -f database/schema.sql`

The SQL schema defines marketplace entities (agents, skills, reviews), ownership tables (user_agents, user_skills, user_credits, subscriptions), and payment audit tables (`payments`), plus triggers and functions to keep ratings and timestamps in sync.

### Health checks & payments (runtime commands)

Assuming `npm run dev` is running on port 3000:

- Frontend health endpoint (Next API):
  - `GET http://localhost:3000/api/health`
  - Aggregates checks of `DATABASE_URL`, `NEXT_PUBLIC_API_URL/health`, and Stripe configuration.
- Stripe webhook testing (when webhooks are configured):
  - Use Stripe CLI to forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### CI/CD expectations

The GitHub Actions workflow `.github/workflows/ci.yml` runs the following jobs:

- **lint-and-type-check**: `npm ci`, then `npm run lint` and `npm run type-check`.
- **build**: `npm ci`, then `npm run build` with `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_API_URL` from secrets.
- **unit-tests** (planned): `npm test -- --coverage --watchAll=false` (no `test` script exists yet in `package.json`; adding tests should respect this contract).
- **e2e-tests** (planned): `npm run test:e2e` using Playwright after downloading the build artifact (no `test:e2e` script yet; add one when e2e tests are introduced).
- **security-audit**: `npm audit` and a Snyk scan (optional, `continue-on-error: true`).
- **deploy-preview**: Vercel preview deployments for PRs.
- **deploy-production**: Vercel production deployments on `main`, followed by Sentry release and Cloudflare cache purge.
- **health-check**: simple post-deploy health probe.

When you add or modify tests, keep these CI expectations in mind so the pipeline remains green.

## Runtime Architecture

### Next.js App Router & page structure

The app uses the Next.js App Router with the `app/` directory:

- `app/layout.tsx`: root layout, sets global `<html lang="en" className="dark">`, Inter font, and base metadata/openGraph for "PowerCore - AI Agent Marketplace".
- `app/globals.css`: Tailwind-based global styles and theme tokens.
- Key top-level routes (all implemented as client components with heavy UI/animation):
  - `/` → `app/page.tsx`: landing page showcasing featured agents, stats, feature cards, and CTAs.
  - `/marketplace` → `app/marketplace/page.tsx`: agent marketplace with filters/search/sorting, grid/list view, and in-memory sample agent data.
  - `/skills` → `app/skills/page.tsx`: "Skills Armory" for modular skills, including skill packs and cart state (all sample data).
  - `/workshop` → `app/workshop/page.tsx`: no-code agent builder wizard (templates → configure → test → deploy) with simulated chat testing.
  - `/hangar` → `app/hangar/page.tsx`: "Agent Hangar" where a user manages their agent roster and skill loadouts (backed by placeholder arrays, not real API calls yet).
  - `/privacy` & `/terms` → legal content pages.

All of these pages currently use static arrays (agents, skills, templates, etc.) for display. The intended evolution (described in `INTEGRATION_COMPLETE.md` and the READMEs under `files (2)/` and `files (3)/`) is to replace these arrays with real data from the backend API via `lib/api.ts`.

When wiring new pages to backend data, follow this pattern:
- Prefer `lib/api.ts` over ad-hoc `fetch` calls from React components.
- Keep page components focused on presentation and user interaction; push IO and persistence concerns into small helpers or the API client.

### UI layer (Tailwind + shadcn/ui)

UI primitives are centralized under `components/ui/` and are standard shadcn-style components (`button.tsx`, `badge.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `switch.tsx`, `tabs.tsx`, `textarea.tsx`).

Tailwind configuration (`tailwind.config.ts`):
- Enables `darkMode: ["class"]`.
- Scans `./app/**/*`, `./components/**/*`, and `./pages/**/*` for class names.
- Extends a token-based color system (`--primary`, `--background`, etc.) and includes the `tailwindcss-animate` plugin.

Imports in the app use the `@/*` path alias from `tsconfig.json`:
- `@/components/...` resolves from repo root.
- `@/lib/...` for shared utilities and API client.

### API client (`lib/api.ts`)

`lib/api.ts` exposes a single `ApiClient` instance (imported elsewhere as `api`) that is responsible for talking to the backend HTTP API defined by `NEXT_PUBLIC_API_URL`:

- `API_BASE` is `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003'`.
- A generic `request<T>(endpoint, options)` method wraps `fetch`, merges default headers, and automatically attaches an `Authorization: Bearer <auth_token>` header if `localStorage.auth_token` is set.
- The client defines typed namespaces for backend domains (as of the current implementation and integration docs):
  - `api.agents.*` — list/get/create/update/delete/publish agents, equip/unequip skills, run agents.
  - `api.skills.*` — list skills and packs.
  - `api.users.*` — current user profile, owned agents/skills, credits, etc.
  - `api.payments.*` — checkout and verification helpers.
  - `api.auth.*` — login/register/logout/password reset.
  - Additional helpers for search, referrals, and creator analytics are described in `INTEGRATION_COMPLETE.md` even if not all methods are present in the code snapshot you see.

When adding new backend endpoints, extend this client first and then consume the new methods from React components or hooks (for example, `UserContext` and payment flows).

There is a duplicate, canonical copy at `powercore-critical-files/lib/api.ts`. Keep both versions synchronized when changing types or endpoints.

### Auth/session state (`UserContext` and `middleware.ts`)

#### User context

`powercore-critical-files/contexts/UserContext.tsx` contains an opinionated global auth / user state implementation that is not yet wired into the live `app/layout.tsx`:

- Manages:
  - `user: User | null` (type imported from `@/lib/api`).
  - `isLoading`, `isAuthenticated`, `error`.
- Provides methods:
  - `login(email, password)` → `api.auth.login`, stores `auth_token`, sets `user`.
  - `register(data)` → `api.auth.register`, stores `auth_token`.
  - `logout()` → `api.auth.logout`, clears `auth_token` and user.
  - `updateUser(data)` → `api.users.update`.
  - `refreshUser()` → `api.users.me`.
- Utility hooks:
  - `useUser()` — access context (must be used under `UserProvider`).
  - `useRequireAuth(redirectTo = "/auth/login")` — client-side guard that redirects unauthenticated users and stores an `auth_redirect` in `sessionStorage`.
  - `useCredits()` — lazily fetches user credits via `api.users.credits()`.
  - `useOwnership(itemType, itemId)` — pattern for "does this user own this agent/skill?" checks.

To actually enable this in the live app, `RootLayout` (or a new top-level provider component) should wrap `children` with `UserProvider`. Until that happens, most pages treat auth implicitly (e.g., `middleware.ts` looks only at the token, not context state).

#### Middleware and route protection

The root `middleware.ts` (mirrored under `powercore-critical-files/middleware.ts`) enforces high-level routing rules and security headers:

- Auth token source:
  - Cookie `auth_token` or `Authorization: Bearer <token>` header.
- Page route classification:
  - `protectedRoutes`: `"/hangar"`, `"/workshop"`, `"/dashboard"`, `"/settings"`, `"/checkout"`.
  - `authRoutes`: `"/auth/login"`, `"/auth/register"`, `"/auth/forgot-password"`.
  - Public routes include `/`, `/marketplace`, `/skills`, `/privacy`, `/terms`, `/api/health`, `/api/webhooks`.
- API route classification:
  - `protectedApiRoutes`: `/api/users/me`, `/api/checkout`, `/api/agents/create`.
  - Webhooks and `/api/health` are always allowed.
- Behavior:
  - For protected API routes without a token → JSON 401.
  - For protected pages without a token → redirect to `/auth/login?redirect=<original-path>`.
  - For auth pages with a token → redirect to `/dashboard` or `redirect` query param.
  - Adds CORS headers for all `/api/*` routes.
  - Adds strong security headers (X-Frame-Options, CSP in production, Permissions-Policy, etc.) for page responses.

When introducing new protected pages or API routes, update `protectedRoutes` / `protectedApiRoutes` rather than implementing ad-hoc checks.

### API routes (health, checkout, webhooks)

Under `app/api/` (duplicated in `powercore-critical-files/app/api/`):

- `app/api/health/route.ts`:
  - Aggregates health from three sub-checks:
    - Database: verifies `DATABASE_URL` is present (placeholder for a real ping).
    - API: optional secondary backend health via `NEXT_PUBLIC_API_URL/health` with a 5s timeout.
    - Stripe: validates `STRIPE_SECRET_KEY` existence and basic format.
  - Computes overall status: `'healthy' | 'degraded' | 'unhealthy'` depending on sub-check results.
  - Returns a typed JSON body with `status`, `timestamp`, `version`, `uptime`, and per-service check data.

- `app/api/checkout/route.ts`:
  - Initializes Stripe with `STRIPE_SECRET_KEY`.
  - `POST` handler:
    - Expects `itemType`, `itemId`, optional `priceId`, `quantity`, `successUrl`, `cancelUrl`.
    - Infers the user from the auth header (placeholder `getUserFromRequest` currently just checks for any `Authorization` header and returns a mock user).
    - For subscriptions: creates a `mode: 'subscription'` checkout session for the given Stripe `priceId`.
    - For one-time purchases: looks up `ItemDetails` via `getItemDetails` (currently a mock map), grants free items directly, and otherwise creates a `mode: 'payment'` checkout session.
  - `GET` handler:
    - Accepts `session_id` query param and returns selective information about the Stripe Checkout session for client-side verification.

- `app/api/webhooks/stripe/route.ts`:
  - Verifies webhook signatures using `STRIPE_WEBHOOK_SECRET`.
  - Persists webhook events for idempotency (placeholder `storeWebhookEvent`, `isEventProcessed`, `markEventProcessed`, `markEventFailed`).
  - Handles key Stripe events via dedicated handlers:
    - `checkout.session.completed` → `handleCheckoutCompleted` → grants agent/skill/pack/credits ownership, records a payment, sends a purchase confirmation email.
    - Subscription events (`customer.subscription.created` / `updated`) → manage user tier and subscription state.
    - Payment failures and refunds → log and update payment records / revoke access.
  - Helper functions (`grantAgentAccess`, `grantSkillAccess`, `grantSkillPackAccess`, `addCredits`, `recordPayment`, `sendPurchaseConfirmationEmail`) are all TODO stubs, intentionally delegating real work to the backend + database schema.

These routes are the glue between Stripe, the `payments` / `user_agents` / `user_skills` tables in `database/schema.sql`, and the frontend purchase flows (`components/payment-modal.tsx` and marketplace/workshop pages).

### Payments UI (`components/payment-modal.tsx`)

`components/payment-modal.tsx` implements a rich, multi-rail payment modal:

- Supported `PaymentMethod` values: `"stripe"`, `"x402"`, `"crypto"`, `"credits"`.
- Renders a selection step with gradient cards describing each rail (fees, labels like "New" and "Popular").
- Tracks the internal step machine: `select` → `confirm` → `processing` → `success`.
- Uses a mock `userCredits` balance and a simulated async `handlePayment` (setTimeout-based) — real integration should:
  - Invoke `/api/checkout` with the selected method and item info.
  - Redirect to Stripe or process x402/crypto/credits as appropriate.
  - Use `onPaymentComplete` to notify callers on success.

When modifying payment behavior, coordinate changes across:
- `components/payment-modal.tsx` (client UX).
- `app/api/checkout/route.ts` (session creation).
- `app/api/webhooks/stripe/route.ts` (post-payment fulfillment).
- `database/schema.sql` (payments, user_credits, subscriptions tables).

### Database schema (`database/`)

The PostgreSQL schema described in `database/schema.sql` and `database/README.md` is the source of truth for persistent marketplace data. High-level structure:

- Core entities:
  - `agents` — marketplace agents with pricing, stats, tags, and creator info.
  - `skills` — modular capabilities (with JSONB manifests, categories, and verification flags).
  - `agent_skills` — many-to-many mapping of agents to equipped skills, with `slot_position`.
  - `user_agents`, `user_skills` — user ownership records.
- Payments and subscriptions:
  - `payments` — all payment transactions across Stripe/x402/crypto/credits.
  - `user_credits` — current credit balance, `total_earned`, `total_spent`.
  - `subscriptions` — recurring items, with period windows and provider metadata.
- Supporting tables:
  - `reviews` — ratings and written reviews.
  - `context_cache` — multi-level RLM context compression cache (`level1_summaries`, `level2_summary`, `compression_ratio`).

Triggers and functions keep the above in sync (timestamps, aggregate ratings, etc.) and are assumed by the webhook and API layers when you eventually replace the TODOs with real database calls.

### Configuration & infra

- `next.config.mjs`:
  - `reactStrictMode: true`.
  - Configures `images.domains` for GitHub avatars and Unsplash.
- `tsconfig.json`:
  - `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, JSX `preserve`.
  - Path alias `"@/*": ["./*"]` for concise imports.
- `powercore-critical-files/lib/email.ts`:
  - Pluggable email service supporting `resend` and `sendgrid` (selected via `EMAIL_PROVIDER`).
  - Provides templated helpers like `sendWelcomeEmail` and `sendPurchaseConfirmationEmail`, used conceptually by webhook handlers.
- `.github/workflows/ci.yml`:
  - Described in the CI section above; serves as the authoritative reference for required scripts, environment variables, and deployment flow.

When you touch cross-cutting concerns (auth, payments, env vars, health checks), scan both `powercore-critical-files/` and the main app for corresponding definitions and keep them aligned.
