# Development Guide

| Field | Value |
| --- | --- |
| Status | Phase 1 baseline; some services/commands arrive in later phases |
| Runtime | Node.js 24+ (verified 24.21.0), npm 11+ |
| Package manager | npm with committed `package-lock.json` |
| Framework | Next.js 16.4.2 App Router |
| Default branch | `main` (project convention) |

## 1. Current state

The repository is the starter application shell. The following commands work:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The following do **not** exist yet and must not be assumed:

- database connection/models/seeds;
- authentication routes;
- admin dashboard;
- payment provider;
- test scripts/dependencies;
- Docker compose for Mongo/Redis/MinIO;
- production deployment configuration.

Their setup is added in the relevant phase. The canonical plan is in [PHASE-CHECKLIST.md](PHASE-CHECKLIST.md).

## 2. Prerequisites

- Node.js 24 LTS or newer.
- npm 11 or newer.
- Git.
- Optional but recommended for later phases:
  - Docker Desktop (MongoDB replica set, Redis, MinIO, Mailpit);
  - MongoDB Compass or `mongosh`;
  - `k6` for load testing;
  - Playwright browsers after Phase 2/11.

Windows PowerShell is the primary shell in this workspace. Commands below show PowerShell equivalents where useful.

## 3. First-time setup

```powershell
# From the repository root
npm install
Copy-Item .env.example .env.local
```

Fill only the values needed for the current phase. Never commit `.env.local`; `.gitignore` excludes `.env*` except `.env.example`.

Generate local secrets (example):

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Use separate local values for `AUTH_SECRET` and `MFA_ENCRYPTION_KEY`. Do not reuse production secrets.

Run:

```powershell
npm run dev
```

Open <http://localhost:3000>.

## 4. Environment rules

- Server-only secrets must never be prefixed with `NEXT_PUBLIC_`.
- `PAYMENT_PROVIDER=mock` and `ENABLE_MOCK_PAYMENTS=true` are for development/test only. Production startup will reject them.
- `FEATURE_PRIZE_SELECTIONS=false` and `PAYMENTS_LIVE_ENABLED=false` are required until the legal/provider gates are signed.
- `MONGODB_URI` must point to a replica set for transaction work (Phase 3+).
- `.env.example` documents placeholders; it must never contain real credentials.
- Production uses a managed secret store and separate credentials from staging.

## 5. Planned local services (added in later phases)

When the relevant phases land, the development stack will be:

| Service | Local option | Purpose |
| --- | --- | --- |
| MongoDB | Docker single-node replica set `rs0` | Transactions, indexes, seed |
| Redis | Docker/Redis | Rate limits, cache, BullMQ |
| Object storage | MinIO | Uploads/media |
| Email | Mailpit/console adapter | Verification/reset in dev |
| Payment | Mock provider | Full dev/test payment flow without real money |

A plain standalone MongoDB is not sufficient for transaction verification. The data model requires a replica set.

Until those files exist, do not run commands claiming they exist.

## 6. Scripts

| Command | Purpose | Status |
| --- | --- | --- |
| `npm run dev` | Next dev server | Available |
| `npm run build` | Production build | Available |
| `npm run start` | Start production build | Available |
| `npm run lint` | ESLint | Available |
| `npm run typecheck` | `tsc --noEmit` | Available |
| `npm run check` | Lint + typecheck | Available |
| `npm test` | Unit/integration tests | Phase 2/3 |
| `npm run test:e2e` | Playwright | Phase 11 |
| `npm run test:load` | k6 scenarios | Phase 12 |
| `npm run db:indexes` | Create/verify indexes | Phase 3 |
| `npm run db:seed` | Demo/dev seed | Phase 3 |
| `npm run admin:create` | One-time admin provisioning | Phase 4/13 |

## 7. Project structure

See [ARCHITECTURE.md](ARCHITECTURE.md) for the complete tree. Rules:

- `app/` contains routing, layouts and route handlers only.
- `components/` contains presentation and form components; no database access.
- `lib/` contains infrastructure adapters and cross-cutting helpers.
- `models/` contains Mongoose schema/index definitions.
- `services/` contains business workflows and transaction boundaries.
- `schemas/` contains shared Zod schemas and stable error codes.
- `messages/` contains `en.json` and `am.json` dictionaries.
- `workers/` contains BullMQ processors; they call services, not duplicate logic.
- `tests/` mirrors the layers and includes security/E2E/load scenarios.

The locale root will be `app/[lang]/` in Phase 2; the current starter `app/page.tsx` will be replaced, not layered with duplicate route trees.

## 8. Next.js 16 working rules

This repository uses Next.js 16 with `cacheComponents` and `partialPrefetching` enabled. Before implementing a Next-specific feature, read the relevant local guide:

```text
node_modules/next/dist/docs/
```

Key rules:

- `proxy.ts`, not `middleware.ts`.
- Do not use `runtime = 'edge'` or the removed PPR experimental flags.
- Session reads (`cookies()`) must not sit in a static shell outside a Suspense boundary.
- Use `use cache` deliberately for public data and revalidate tags after admin writes.
- Use Server Actions for first-party mutations; Route Handlers for callbacks, SSE, uploads and health.
- Every Server Action is a public POST endpoint and must authenticate/authorize/validate.
- Use `next/image` with configured remote patterns, not raw `<img>` for managed media.
- Prefer server components; add `"use client"` only for interaction.

## 9. Coding conventions

- TypeScript strict; avoid `any`. Validate external data with Zod and infer types from schemas where sensible.
- Keep money as integers with `Minor` suffix; never use floating-point arithmetic for totals.
- All user-facing text comes from locale dictionaries or localized content. Do not hardcode English in a component that also renders Amharic.
- Use stable error codes from services; map them to localized UI messages at the boundary.
- Use `server-only` imports for DB/auth/secrets modules.
- Use explicit projections and `.lean()` for read models; return DTOs, not Mongoose documents.
- Use allowlists for mutable fields; never spread request bodies into `$set`.
- Use transactions for payment, participation, snapshot and result transitions.
- Use idempotency keys for retryable mutations.
- Do not put business rules in React components or route-level conditionals.
- Do not use `Math.random()` for security, selection or tokens.
- Do not introduce new dependencies without checking maintained status, compatibility with Next 16/React 19/Node 24, licence and security.
- Update docs and the phase checklist when a business/security boundary changes.

## 10. Bilingual development requirements

- Add every UI key to both `messages/en.json` and `messages/am.json`.
- New admin content forms use the shared `LocalizedFieldGroup`, not single-language inputs.
- Publish services run `assertPublishable` and reject missing Amharic.
- Upload dialogs collect alt text in both languages.
- Test Amharic layout at mobile widths and with screen-reader language attributes.
- Initial Amharic strings are marked draft until native review. Legal/policy strings require human legal translation.
- See [I18N.md](I18N.md) for the full contract.

## 11. Testing expectations

- Unit tests for pricing, eligibility, state machines, hashes, sanitizers, validation and i18n key parity.
- Integration tests against a real MongoDB replica set (not a standalone mock) for transactions/indexes/payment callbacks/snapshot locking.
- E2E tests with the mock payment provider and both locales.
- Security tests for IDOR, role escalation, CSRF, callback forgery/replay, upload abuse and rate limits.
- Load tests in Phase 12; document actual results, no invented capacity.
- A phase is not complete until lint, typecheck, relevant tests and production build pass.

## 12. Security rules for contributors

- Never commit secrets, real user data, production database dumps or payment credentials.
- Do not log cookies, session tokens, passwords, MFA secrets or provider private keys.
- Do not add a hardcoded admin account or universal password.
- Do not disable authorization checks to make a test pass.
- Do not accept client-supplied prices, payment state, roles or eligibility.
- Do not weaken cookies/CSP/rate limits without a documented review.
- Do not add SVG uploads or trust client MIME types.
- Do not place database access in presentations or client components.
- Report security issues privately to the project owner; do not include sensitive details in public tickets.
- Run `npm audit`/secret scans when added to CI; review findings.

See [SECURITY-THREAT-MODEL.md](SECURITY-THREAT-MODEL.md).

## 13. Git and review workflow

- Keep changes scoped to one phase/feature.
- Do not overwrite working features without understanding them.
- Add/update tests with business-rule changes.
- Update docs and checklist in the same change.
- Use clear commit messages (e.g. `phase-2: add locale root and design tokens`).
- Do not commit generated `.next`, coverage, test artifacts or `.env` files.
- For high-impact architecture changes, add an ADR entry in [ARCHITECTURE.md](ARCHITECTURE.md).

## 14. Troubleshooting

| Symptom | Check |
| --- | --- |
| `npm run typecheck` fails | Ensure dependencies installed and Next generated types are up to date (`npm run dev`/`build` regenerates). |
| Next warns about cache/session | Read `node_modules/next/dist/docs/` caching/authentication-with-cache-components guides; wrap request reads in Suspense. |
| Build fails on environment | Later phases validate env at startup; copy `.env.example` and fill required values. |
| Mongo transaction errors | Use a replica set, not standalone `mongod`; check rs status. |
| Amharic glyphs clip | Ensure Ethiopic font loads, avoid fixed line heights/uppercase/letter-spacing, test 320 px width. |
| Mock payment appears in prod | Startup guard should block; verify `PAYMENT_PROVIDER`/`ENABLE_MOCK_PAYMENTS` and `NODE_ENV`. |
| Fonts fail at build | Prefer self-hosted/local fonts for Ethiopic; do not depend on runtime Google Fonts network access. |

## 15. Phase workflow

For each phase:

1. Inspect the repo and docs.
2. Read relevant Next.js local docs and provider docs.
3. Write a concise plan.
4. Implement only that phase and dependencies.
5. Add tests for new rules/boundaries.
6. Run lint, typecheck, tests and build; fix failures.
7. Update docs/checklist.
8. Report implemented work, files, test results, security notes, blockers and next phase.

Phase 1 is complete; Phase 2 starts only after architecture review.
