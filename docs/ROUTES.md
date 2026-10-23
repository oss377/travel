# Route Map and Access Rules

All page routes are locale-prefixed: `/{lang}/...`, where `lang` is `en` or `am`. `/` redirects to the visitor’s preferred supported locale. API routes are not locale-prefixed.

Access levels:

- **P** — public
- **U** — authenticated user (account owner)
- **A** — administrator
- **S** — super administrator
- **W** — provider/worker only (verified request)
- **R** — read-only public stream/endpoint

Rendering:

- **Static/ISR** — public content in the cacheable shell with tag revalidation.
- **Dynamic** — request-time private/admin data, `no-store`.
- **Live** — read from the database on every refresh/poll; no caching of status.

## 1. Public website

| Route | Access | Rendering | Purpose |
| --- | --- | --- | --- |
| `/` | P | Redirect | Locale negotiation → `/{lang}` |
| `/{lang}` | P | Static/ISR | Homepage |
| `/{lang}/destinations` | P | Dynamic/ISR | Search, filters, cursor pagination |
| `/{lang}/destinations/[slug]` | P | Static/ISR | Destination detail, gallery, related, plan CTA |
| `/{lang}/categories/[slug]` | P | Static/ISR | Category listing |
| `/{lang}/travel-plans` | P | Static/ISR | Active/upcoming plans |
| `/{lang}/travel-plans/[id]` | P | Dynamic/ISR | Plan details, price breakdown, rules, CTA |
| `/{lang}/selection-events` | P | Dynamic | Public events, status and rules |
| `/{lang}/selection-events/[id]` | P | Live | Read-only live/status display; SSE + polling fallback |
| `/{lang}/results` | P | Static/ISR | Published results index |
| `/{lang}/results/[id]` | P | Static/ISR | Immutable published result + verification reference |
| `/{lang}/about` | P | Static/ISR | About content |
| `/{lang}/contact` | P | Static/ISR | Contact information and form |
| `/{lang}/faq` | P | Static/ISR | Bilingual FAQs |
| `/{lang}/terms` | P | Static/ISR | Terms/versioned legal content |
| `/{lang}/privacy` | P | Static/ISR | Privacy policy |
| `/{lang}/login` | Anonymous only | Dynamic | Login |
| `/{lang}/register` | Anonymous only | Dynamic | Registration |
| `/{lang}/forgot-password` | Anonymous | Dynamic | Request reset |
| `/{lang}/reset-password` | Token holder | Dynamic | Consume reset token |
| `/{lang}/verify-email` | Token holder | Dynamic | Consume verification token |
| `/{lang}/unauthorized` | P | Static | Safe unauthorized message |

Notes:

- Authenticated visitors on login/register are redirected to the dashboard.
- Public selection pages never expose a control that mutates the event.
- Plan/destination prices are rendered from server data; the CTA routes to login or the dashboard as appropriate.

## 2. User dashboard

All routes require a valid session. Services additionally check ownership on every record.

| Route | Access | Purpose |
| --- | --- | --- |
| `/{lang}/dashboard` | U | Overview: verification, active plans, payments, eligibility, activity, results |
| `/{lang}/dashboard/plans` | U | Browse/select plans, view rules/benefits/destinations/cost, join, track |
| `/{lang}/dashboard/plans/create` | U (feature-flag) | Custom plan builder; server-calculated totals |
| `/{lang}/dashboard/payments` | U | Payment history and statuses |
| `/{lang}/dashboard/payments/[orderNumber]` | U (owner) | Order/payment detail, retry, receipt-safe view |
| `/{lang}/dashboard/selection-events` | U | Eligible events, closing dates, published counts, schedules |
| `/{lang}/dashboard/winners` | U (owner) | Results relevant to the user; public verification references |
| `/{lang}/dashboard/saved` | U | Saved destinations |
| `/{lang}/dashboard/notifications` | U | In-app notifications |
| `/{lang}/dashboard/reviews` | U | Own reviews and moderation status |
| `/{lang}/dashboard/support` | U | Support tickets |
| `/{lang}/dashboard/support/[ticketNumber]` | U (owner) | Ticket thread |
| `/{lang}/dashboard/profile` | U | Name, phone, avatar, language, notification preferences |
| `/{lang}/dashboard/security` | U | Password, email change, sessions, MFA |
| `/{lang}/dashboard/settings` | U | Account settings, deactivation request |
| `/{lang}/payment/return` | P (no auth assumption) | Provider browser-return landing; only shows “pending verification” and polls the owner’s order after login. Never marks paid. |

## 3. Administrator

All routes require an active admin/super-admin session, MFA, and the relevant permission. The layout gate is defense in depth; every Server Action/service also checks.

| Route | Access | Purpose |
| --- | --- | --- |
| `/{lang}/admin` | A | Metrics overview, health indicators |
| `/{lang}/admin/destinations` | A | Destination list, filters, archive/publish |
| `/{lang}/admin/destinations/new` | A | Create with EN + AM fields |
| `/{lang}/admin/destinations/[id]/edit` | A | Edit, bilingual content, gallery, price verification |
| `/{lang}/admin/categories` | A | Category list/reorder/status |
| `/{lang}/admin/categories/new` | A | Create with EN + AM fields |
| `/{lang}/admin/categories/[id]/edit` | A | Edit/reorder/image |
| `/{lang}/admin/travel-plans` | A | Plan list/status |
| `/{lang}/admin/travel-plans/new` | A | Create plan, allowed counts, pricing rules |
| `/{lang}/admin/travel-plans/[id]/edit` | A | Edit rules/pricing/dates/eligibility/content |
| `/{lang}/admin/orders` | A | Order search/detail |
| `/{lang}/admin/payments` | A | Transaction ledger, reconciliation status/refunds |
| `/{lang}/admin/participants` | A | Participation counts/eligibility; restricted identity view |
| `/{lang}/admin/selection-events` | A | Event list and workflow state |
| `/{lang}/admin/selection-events/new` | A | Draft event with rules and threshold config |
| `/{lang}/admin/selection-events/[id]` | A | Review eligible count, approvals, lock, select, publish, audit |
| `/{lang}/admin/results` | A | Published/voided results and verification evidence |
| `/{lang}/admin/refunds` | A | Review/approve/process refunds (permission + threshold) |
| `/{lang}/admin/users` | A | Search/filter users, verification, suspend/reactivate |
| `/{lang}/admin/users/[id]` | A | Account detail (no secrets), audit history |
| `/{lang}/admin/reviews` | A | Moderate reviews |
| `/{lang}/admin/support` | A | Support queue/threads |
| `/{lang}/admin/content` | A | Homepage sections, FAQs, policies, banners, testimonials |
| `/{lang}/admin/content/[key]` | A | Bilingual content editor + legal review metadata |
| `/{lang}/admin/audit-logs` | A/S | Immutable audit search (role-restricted) |
| `/{lang}/admin/settings` | S | Feature flags, legal gates, platform settings |

High-impact actions (refund above threshold, role changes, snapshot lock, result publish) require re-authentication and, where configured, a second distinct administrator’s approval. These are actions, not separate GET routes.

## 4. API and Route Handlers

| Route | Access | Method | Purpose |
| --- | --- | --- | --- |
| `/api/health` | P/W | GET | Liveness; no secrets/topology |
| `/api/payments/[provider]/callback` | W | POST | Authenticated provider callback; signature/verification, idempotent |
| `/api/payments/[provider]/return` | P | GET | Optional browser return; redirects to pending status; never marks paid |
| `/api/selection-events/[id]/status` | R | GET | Safe public status JSON; `no-store` |
| `/api/selection-events/[id]/stream` | R | GET | SSE status/result updates; read-only; `no-store` |
| `/api/uploads` | A | POST | Server-side image upload (multipart) or signed-upload completion |
| `/api/uploads/sign` | A | POST | Short-lived signed upload URL scoped to type/size/key |
| `/api/admin/jobs/[id]/retry` | S | POST | Retry a failed job with audit (if exposed operationally) |
| `/api/internal/reconcile` | W | POST | Cron/worker trigger protected by a secret/service identity; not public |
| `/api/internal/readiness` | W | GET | Readiness checks for Mongo/Redis/storage; private |

First-party mutations (create plan, join plan, profile update, admin content save, approvals) use **Server Actions**, not ad-hoc public APIs. They still undergo the same service authorization and validation.

## 5. Route-level rules

1. Every page under `(user)` and `admin` reads the session behind a Suspense boundary where Cache Components requires it; private pages/layouts are not prerendered with user data.
2. Admin layout checks role and MFA, but a direct POST to a Server Action cannot rely on that layout. Every action re-checks.
3. Locale validation happens in the `[lang]` layout; unsupported locales 404.
4. Public/result pages never include private participant lists, contact data or payment references.
5. `Cache-Control: no-store` is set for payment status, admin/private dashboards, callbacks and selection status/live streams.
6. A provider return page does not trust query parameters. It authenticates the user and fetches server state.
7. Error pages localize their content and never reveal stack traces, database details or internal IDs.
