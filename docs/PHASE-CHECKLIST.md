# Phased Delivery Checklist

| Field | Value |
| --- | --- |
| Current phase | **Phase 1 — complete, awaiting review** |
| Next phase | Phase 2 — Project Foundation and Design System |
| Rule | Complete one phase, run checks, update docs; do not silently skip or reorder |
| Bilingual rule | Amharic is a required deliverable in every content/admin phase, not a Phase 13 afterthought |

Status legend: `[x]` complete, `[ ]` planned, `[!]` blocked by an external dependency or business/legal decision.

## Phase 1 — Repository Inspection and Architecture

- [x] Inspect the existing repository, framework versions and configuration.
- [x] Confirm Next.js 16.4.2, React 19.3, TypeScript strict, Tailwind 4 and existing scripts.
- [x] Define architecture, runtime topology, layer boundaries and folder structure.
- [x] Document entities, relationships, indexes, state machines and transaction boundaries.
- [x] Create the security/threat-model checklist.
- [x] Document environment variables in `.env.example` without secrets.
- [x] Identify external integrations and blockers (Telebirr, Atlas, Redis, storage, email, monitoring).
- [x] Document bilingual/Amharic content entry requirements.
- [x] Create the phase checklist and development guide.
- [x] Run lint, typecheck and production build.
- [x] Record Phase 1 report and open review gates.

**Deliverables:** [ARCHITECTURE.md](ARCHITECTURE.md), [DATA-MODEL.md](DATA-MODEL.md), [SECURITY-THREAT-MODEL.md](SECURITY-THREAT-MODEL.md), [I18N.md](I18N.md), [ROUTES.md](ROUTES.md), [EXTERNAL-INTEGRATIONS.md](EXTERNAL-INTEGRATIONS.md), [BUSINESS-RULES.md](BUSINESS-RULES.md), [DEVELOPMENT.md](DEVELOPMENT.md), `.env.example`, phase report.

**Gate:** architecture review before Phase 2. Open business/legal decisions remain tracked in [BUSINESS-RULES.md](BUSINESS-RULES.md); they do not block Phase 2 unless noted.

## Phase 2 — Project Foundation and Design System

- [ ] Add maintained dependencies for UI, forms, validation, animation, data fetching, testing and quality:
  - shadcn/ui-compatible primitives (Radix), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`;
  - `react-hook-form`, `zod`, `@hookform/resolvers`;
  - `framer-motion` with reduced-motion support;
  - `@tanstack/react-query` only where client server-state is needed;
  - Vitest, Testing Library, jsdom, Playwright (installed, configured).
- [ ] Establish the locale root `app/[lang]/` and move the starter shell; validate supported locales.
- [ ] Implement root redirect in `proxy.ts` (locale only, not authorization).
- [ ] Add `messages/en.json` and `messages/am.json` with typed dictionary loading and key-parity tests.
- [ ] Add bilingual typography, including an Ethiopic font.
- [ ] Define brand design tokens: deep forest green, warm gold, neutrals, charcoal text, spacing, radii, shadows, focus rings.
- [ ] Build responsive public header/nav/footer and language switcher.
- [ ] Build reusable accessible primitives: buttons, links, cards, inputs, selects, text areas, checkboxes, dialogs, tabs, badges, skeleton, empty state, toast, pagination.
- [ ] Implement reduced-motion variants and test keyboard/focus behaviour.
- [ ] Add global loading/error/not-found states in both locales.
- [ ] Configure security headers/CSP baseline without breaking Next.js 16.
- [ ] Add test setup and initial component/a11y tests.
- [ ] Run lint, typecheck, tests and build.

**Gate:** app shell, design system, bilingual dictionaries, passing checks.

## Phase 3 — MongoDB and Data Models

- [ ] Add Mongoose 9 and MongoDB driver; configure connection pooling/health.
- [ ] Require/verify a replica set for transaction-capable environments.
- [ ] Implement all schemas from [DATA-MODEL.md](DATA-MODEL.md), including localized sub-schemas.
- [ ] Add indexes and a safe index-sync script (`autoIndex: false` in production).
- [ ] Add service/repository primitives with projections, cursor pagination and allowlists.
- [ ] Add development seed data clearly labelled as demo, with **no invented real prices/hours**.
- [ ] Add admin provisioning and seed scripts with no hardcoded production credentials.
- [ ] Add database integration tests (unique indexes, transactions, rollback, TTL, snapshot immutability).
- [ ] Document index list, seed process, backup/restore assumptions.
- [ ] Validate Amharic fields persist/query correctly.

**Gate:** reproducible local database, validated models, indexes, seed + integration tests.

## Phase 4 — Authentication and Authorization

- [ ] Implement `User`, `AuthCredential`, `Session`, `AuthToken` services.
- [ ] Argon2id password hashing and password policy.
- [ ] Registration, login, logout, email verification, password reset, email change.
- [ ] Secure cookies, session rotation/revocation, idle/absolute expiry.
- [ ] Rate limiting for auth/reset/verification endpoints (Redis).
- [ ] CSRF/CORS protections and origin checks for custom routes.
- [ ] Central DAL/guards: `requireUser`, `requireRole`, permissions, ownership.
- [ ] User/admin route protection; admin layout gate is defense-in-depth only.
- [ ] Administrator MFA enrolment/verification; one-time admin provisioning CLI.
- [ ] Notification hooks for security/account events.
- [ ] Localized auth UI, validation errors and emails/dictionary strings.
- [ ] Authentication/authorization security tests (enumeration, fixation, replay, IDOR, role escalation).
- [ ] Add auth docs and run all checks.

**Gate:** secure register/login/verify/reset, protected areas, passing access-control tests.

## Phase 5 — Public Destination Website

- [ ] Implement configurable categories (all required categories, admin-managed).
- [ ] Build homepage sections, including accessible horizontally scrolling category rows:
  - touch/keyboard scrolling, pause on hover/focus/interaction, reduced motion, desktop scroll controls;
  - no forced continuous movement that blocks content.
- [ ] Destination search/filter with cursor pagination and bilingual search.
- [ ] Destination detail pages with pricing clarity, gallery, map link, related destinations, plan CTA.
- [ ] Server-rendered metadata, canonical/hreflang, sitemap/robots, JSON-LD where accurate.
- [ ] Responsive images, lazy loading, optimized fonts, skeleton/empty/error states.
- [ ] Fully bilingual public navigation/content with Amharic typography.
- [ ] No invented destination facts/prices; published content is admin-managed.
- [ ] Component/E2E/accessibility tests for browsing/search/language switch.
- [ ] Run checks and document measured performance baseline.

**Gate:** visitor can browse/search/filter published destinations in both languages.

## Phase 6 — Admin Content Management

- [ ] Admin dashboard shell, sidebar and responsive layout.
- [ ] Destination CRUD with bilingual fields, gallery, publish/archive/feature, preview.
- [ ] Category CRUD, reorder, activate/deactivate, reference-safe delete.
- [ ] Secure media upload: signed flow, magic bytes, re-encode, size/pixel limits, alt text EN/AM.
- [ ] Shared `LocalizedFieldGroup`; every admin content form requires English + Amharic before publish.
- [ ] Publishing completeness report/blocking validation; no bypass via API.
- [ ] Homepage/content controls, FAQs, banners, contact/social links, policies.
- [ ] Audit logging for create/update/publish/delete/reorder.
- [ ] Admin content integration/E2E tests, including missing-Amharic rejection.
- [ ] Run checks.

**Gate:** functional admin CMS, secure media, bilingual publish enforcement.

## Phase 7 — User Dashboard and Travel Plans

- [ ] Dashboard overview: verification, plans, payments, eligibility, activity, results.
- [ ] Profile/settings/security UI and server actions; sensitive changes verified.
- [ ] Saved destinations, notifications, payment history, reviews, support tabs.
- [ ] Plan browsing/detail with rules, benefits, destinations, full price.
- [ ] Standard plan participation flow.
- [ ] Custom plan builder with 10/20 (and configured) destination counts.
- [ ] Server-side pricing engine and immutable pricing snapshot.
- [ ] Pending order creation/idempotency; no trust in client totals.
- [ ] Admin plan management: counts, fees, eligibility, limits, dates, cancellation/refund terms, legal-review metadata.
- [ ] Plan content/forms bilingual; errors localized.
- [ ] Unit/integration tests for price manipulation, counts, duplicates, snapshot immutability.
- [ ] Run checks.

**Gate:** users create/select valid plans; prices independently calculated; admin controls work.

## Phase 8 — Telebirr Integration

- [!] Obtain official merchant documentation, sandbox access and credentials (external blocker).
- [ ] Implement `PaymentProvider` interface and clearly labelled mock (non-production only).
- [ ] Implement Telebirr adapter only from verified official docs.
- [ ] Payment initiation with server-generated order/amount and idempotency.
- [ ] Authenticated callback Route Handler + independent verification.
- [ ] Amount/currency/merchant-order/status validation.
- [ ] Atomic payment/order/participation update; duplicate callback protection.
- [ ] Reconciliation jobs and durable job ledger; refund integration/manual workflow.
- [ ] Payment lifecycle, audit and safe logging; no secrets.
- [ ] Tests: success, failure, timeout, retry, duplicate, replay, mismatch, concurrency, provider outage.
- [ ] Document production credential setup and live activation checklist.
- [ ] Keep live payments disabled until approvals.

**Gate:** sandbox-verified flow (or documented mock-only status), passing payment security tests.

## Phase 9 — Selection Engine

- [!] **Resolve the participant sequence interpretation, winner count, eligibility and legal approval** (see [BUSINESS-RULES.md](BUSINESS-RULES.md)).
- [ ] Finalize versioned selection rules/protocol and publish them.
- [ ] Implement event state machine DRAFT→…→RESULTS_PUBLISHED + cancellation/failure.
- [ ] Eligibility service based on verified accounts/payments/rules; no client flags.
- [ ] Locked immutable snapshot with per-entry collection, canonicalization and SHA-256 manifest.
- [ ] Reconciliation before snapshot; insufficient/excess participant handling per published policy.
- [ ] Durable selection job with CSPRNG, rejection sampling, seed commitment/reveal, algorithm version.
- [ ] Persist result before any public animation; idempotent retries/recovery.
- [ ] Dual approval + MFA/step-up for snapshot lock/result publish; audit trail.
- [ ] Read-only public event/status/live display (SSE + polling fallback), privacy-safe results.
- [ ] Admin workflow UI, bilingual rules/results content.
- [ ] Tests: state transitions, tamper attempts, snapshot immutability, RNG determinism, duplicate jobs, public read-only, refresh/reconnect.
- [ ] Keep paid prize functionality disabled until legal approval.

**Gate:** tested fair/auditable selection engine, legal approval, published protocol.

## Phase 10 — Notifications and Operations

- [ ] In-app notifications for all required events with dedupe/localization.
- [ ] Configured email/SMS providers where available; bilingual templates.
- [ ] BullMQ retries/backoff/dead-letter and `BackgroundJob` recovery.
- [ ] Structured logging, error tracking, OpenTelemetry, alert rules.
- [ ] Payment reconciliation alerts and operational dashboards.
- [ ] Support/incident runbooks and on-call ownership.
- [ ] Notification delivery/integration tests.
- [ ] Run checks.

**Gate:** reliable notification pipeline and operational monitoring.

## Phase 11 — Security, Accessibility and Testing

- [ ] Threat-model review against implemented system.
- [ ] Test every role/protected endpoint/action; IDOR/ownership.
- [ ] Payment forgery/replay/duplicate/race tests.
- [ ] Selection tamper/race/public-trigger tests.
- [ ] Upload security tests (type/extension/content/size/path/SVG).
- [ ] CSRF, session, MFA, rate-limit and enumeration tests.
- [ ] Keyboard navigation, focus order, labels, dialogs, reduced motion, screen-reader basics.
- [ ] Amharic rendering, `lang` attributes, long strings, bilingual form/a11y checks.
- [ ] Dependency audit, secret scan, CSP/header verification.
- [ ] Full E2E workflow suite; fix all critical/high defects.
- [ ] Produce security test report, accessibility checklist, unresolved risks.
- [ ] Run checks.

**Gate:** critical/high defects fixed; reports signed off.

## Phase 12 — Scalability and Load Testing

- [ ] Inspect `explain()` plans and tune indexes/query shapes.
- [ ] Validate cache/revalidation and rate-limit behavior under load.
- [ ] Test queue retry/recovery and idempotency at scale.
- [ ] k6 tests: browsing/search, auth, plan creation, payment initiate/callback, selection status/stream.
- [ ] Concurrent payment/participation races.
- [ ] Selection job at realistic scale without loading all participants into memory.
- [ ] Optimize bottlenecks; document environment, workload, throughput, latency, error rate.
- [ ] Validate backup/restore procedure.
- [ ] Produce capacity/scaling guide; make no unmeasured claims.

**Gate:** measured load results, tuning, recovery evidence.

## Phase 13 — Production Deployment

- [ ] Provision MongoDB Atlas/Redis/storage/CDN/email/monitoring.
- [ ] Configure production env/secrets; validate startup guards.
- [ ] Configure HTTPS/secure cookies/CSP/headers.
- [ ] CI/CD with checks and controlled deploy/rollback.
- [ ] Run safe index/migration steps.
- [ ] Provision initial admin via one-time CLI + forced MFA; no seeded password.
- [ ] Configure Telebirr live credentials only after provider approval; keep feature off until sign-off.
- [ ] Configure backups/PITR and restore drill.
- [ ] Run smoke tests, security/accessibility sign-off, bilingual review sign-off.
- [ ] Document deployment instructions, production checklist, operational runbook, release acceptance.
- [ ] Confirm legal gates and prize feature status.

**Gate:** production release acceptance checklist complete; unresolved risks formally accepted.

## Acceptance-criteria mapping

| # | Acceptance criterion | Phase(s) |
| --- | --- | --- |
| 1 | Visitor browses published destinations without login | 5 |
| 2 | Categories work on desktop/mobile | 5, 6 |
| 3 | Category rows scroll/accessibly animate | 2, 5 |
| 4 | Destination details use admin-managed info | 5, 6 |
| 5 | Register/verify/login/logout | 4 |
| 6 | Unauthorized users cannot access admin/private data | 4, 11 |
| 7 | Admin creates/edits/publishes/archives destinations | 6 |
| 8 | Admin manages categories/plans | 6, 7 |
| 9 | Users create valid plans with allowed counts | 7 |
| 10 | Plan prices independently calculated/validated | 7 |
| 11 | Payment not successful from browser request alone | 8, 11 |
| 12 | Duplicate callbacks do not duplicate success | 8, 11 |
| 13 | Users view plan/payment history | 7, 8 |
| 14 | Selection eligibility follows server-enforced rules | 9, 11 |
| 15 | Locked auditable participant snapshot | 9 |
| 16 | Animation cannot influence actual result | 9, 11 |
| 17 | Published results survive refresh/reconnect | 9 |
| 18 | Sensitive admin actions audited | 4, 6, 8, 9 |
| 19 | English and Amharic interfaces work | 2, 4, 5, 6, 7, 9, 11 |
| 20 | Unit/integration/E2E tests pass | 2–11 |
| 21 | Production builds complete | Every phase |
| 22 | Load tests report measured capacity | 12 |
| 23 | Backup/restore/recovery documented | 3, 13 |
| 24 | Live payment/prize functionality disabled until approvals | 8, 9, 13 |

## Cross-cutting mandatory checks (every phase)

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Relevant unit/integration tests
- [ ] `npm run build`
- [ ] Authorization checked on every new server operation
- [ ] Input validation and output projection checked
- [ ] Secrets not committed/logged
- [ ] Both languages updated where user-facing
- [ ] Documentation and this checklist updated
- [ ] No working feature overwritten without a documented reason

## Blocked/external items

| Item | Owner/next action | Required before |
| --- | --- | --- |
| Telebirr official merchant access + docs | Project owner/Business | Phase 8 completion/live |
| Legal review of prize/selection and consumer terms | Project owner/Legal | Phase 9 activation |
| Selection sequence meaning/winner rules | Business/Legal | Phase 9 |
| Amharic native/legal translation review | Product/Translator | Production launch |
| Email/SMS provider | Operations | Phase 4/10 |
| MongoDB/Redis/storage/monitoring accounts | Operations | Phase 3/13 |
| Atlas Search availability/fallback decision | Engineering | Phase 5 |
