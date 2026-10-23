# External Integrations and Activation Requirements

| Field | Value |
| --- | --- |
| Status | Phase 1 inventory; none configured yet |
| Rule | Do not invent endpoints, credentials, signatures or provider capabilities. |
| Production activation | Each integration has its own checklist; paid/selection features have extra legal gates. |

## 1. Integration status summary

| Integration | Needed for | Status | Blocking? |
| --- | --- | --- | --- |
| MongoDB Atlas (or managed MongoDB replica set) | All persistent features | Not configured | Yes — Phase 3 |
| Redis (managed) | Rate limits, caching, BullMQ | Not configured | Yes for production; local Redis in dev |
| S3-compatible object storage + CDN | Destination/category media | Not configured | Yes for admin media |
| Transactional email | Verification, reset, payment/account notifications | Not configured | Yes for production sign-up |
| SMS provider | Optional phone verification/notifications | Not contracted | No (optional) |
| Telebirr merchant platform | Live payments | Blocked: official merchant access/credentials not supplied | Yes for live payments |
| Error tracking/monitoring | Operations | Not configured | Yes before launch |
| Legal/regulatory review | Paid selection/prize features | Open | Yes for Phase 9 activation |
| Native Amharic translation/legal review | Production copy | Draft process | Yes before launch |
| Atlas Search (optional) | Strong bilingual search | Not configured | No; fallback required |

## 2. Telebirr

### 2.1 What is known

- Telebirr is the required initial payment method.
- It is an Ethio Telecom service with merchant onboarding/KYC and separate proximity and online/remote payment capabilities.
- An official merchant agreement and integration documentation are required before implementation.
- Public third-party SDKs/blog posts exist, but they are **not authoritative** and must not be used as the source of endpoints, signatures, callback fields or status codes.

### 2.2 What must be obtained before Phase 8 coding can be completed

- Official merchant onboarding confirmation and contract.
- Sandbox/test credentials and merchant short code (if applicable).
- Official base URLs and API version.
- Supported payment flow(s): H5 checkout, app/deeplink, QR, or other.
- Authentication method (token exchange, keys, signing, TLS requirements).
- Request/response schemas and amount format/currency rules.
- Callback/notification URL registration, signature algorithm, retry policy, IP allowlist if any.
- Transaction status query and verification procedure.
- Refund/cancellation/reversal support and settlement/reconciliation reports.
- Idempotency requirements and error codes.
- Sandbox test vectors and certification requirements.
- Production go-live approval process and supported merchant categories.
- Consumer terms/payment-provider policy requirements.

### 2.3 Implementation stance

- Define the `PaymentProvider` interface first (see [ARCHITECTURE.md](ARCHITECTURE.md)).
- Implement a clearly labelled mock for development/tests only.
- Implement the telehealth adapter only against verified official documentation and sandbox.
- Verify callbacks cryptographically/authentically, then independently verify transaction state with the provider.
- Reconcile uncertain payments with durable jobs.
- Never mark paid from a browser return or an unsigned callback.
- Support idempotent callbacks, amount/currency/merchant-order checks, replay protection and duplicate processing.
- Log provider lifecycle events without secrets.

### 2.4 Live activation checklist

- [ ] Official documentation and merchant approval on file.
- [ ] Sandbox end-to-end success, failure, timeout, duplicate and amount-mismatch tests pass.
- [ ] Callback authentication/replay tests pass.
- [ ] Refund/reconciliation process approved and tested (or documented as manual).
- [ ] Legal/consumer terms and support process published in both languages.
- [ ] Production credentials in secret store; `PAYMENTS_LIVE_ENABLED=true` only after approval.
- [ ] Mock provider impossible in production (startup guard).
- [ ] Monitoring and on-call alerts for callback/reconciliation failures.
- [ ] A small-value production pilot approved before full launch.

## 3. MongoDB

**Recommended:** MongoDB Atlas replica set (or a managed equivalent) in a region with acceptable latency to Ethiopia/East Africa and the app region.

Requirements:

- Replica set/sharded cluster for multi-document transactions.
- Separate dev/staging/prod projects; separate credentials.
- Private networking/IP allowlist where supported.
- TLS, strong auth, least-privilege database users.
- Continuous backups/PITR, restore testing, alerts.
- Query/performance monitoring; connection pool limits aligned with app instances.
- `autoIndex: false` in production; indexes created by a deploy script.
- Retention/legal review for financial and selection records.
- Amharic/bilingual search validated; Atlas Search optional.

No real credentials belong in `.env.example`, source or docs.

## 4. Redis and durable jobs

**Recommended:** managed Redis with TLS and private networking (or a dedicated worker-friendly Redis service).

Uses:

- distributed rate limiting;
- short-lived cache where justified;
- BullMQ queue for payment reconciliation, notifications, media and selection jobs;
- distributed locks only with fencing/idempotency, never as the sole source of truth.

Rules:

- Never use an in-memory array as a production queue/lock/ledger.
- Every job has an idempotency key and durable `BackgroundJob` ledger.
- Retries use exponential backoff with a bounded maximum and dead-letter handling.
- Queue loss must be recoverable from MongoDB state + scheduled reconciliation.
- Redis is not the payment ledger or authoritative participant store.

## 5. Object storage and CDN

Requirements:

- S3-compatible private bucket for originals; CDN/public derivatives.
- Short-lived signed uploads or server-side upload processing.
- Random, non-guessable keys; no client-controlled paths.
- Magic-byte validation, re-encoding and metadata stripping.
- Allowed formats: JPEG, PNG, WebP (reject SVG/HTML).
- Size/pixel limits (initial 10 MB, max 4096 px; configurable).
- Localized alt text required for published use.
- Bucket listing disabled; least-privilege access; CORS restricted to the app domain.
- CDN cache invalidation/versioned URLs when images are replaced.
- Copyright/consent check for destination photography.

Local development can use MinIO. Production credentials are separate and never committed.

## 6. Email and SMS

### Email

Required for verification, password reset, security alerts, payment/order and selection notifications. Options: a transactional API (e.g. Resend) or SMTP. Selection is Phase 4/10.

Requirements:

- SPF, DKIM and DMARC configured for the sending domain.
- Templates in English and Amharic, with a text fallback.
- Bounce/complaint handling and suppression list.
- Rate limits and retries; do not leak account existence.
- No sensitive payment or identity data in email.
- Dev mode uses a local mail catcher, never a real recipient list.

### SMS (optional)

Only if a supported Ethiopian provider is contracted. Verify Unicode/Ethiopic support, sender ID registration, segment limits/costs and delivery reporting. SMS is not required for initial launch unless phone verification becomes mandatory.

## 7. Observability

- Error tracking (e.g. Sentry) with PII/secret scrubbing.
- Structured logs with request IDs and redaction.
- OpenTelemetry metrics/traces for latency, queue depth, DB, payment/reconciliation and selection jobs.
- Uptime checks and alert routing.
- Dashboard for registration/login failures, payment success/error rates, callback verification failures, reconciliation backlog, refund failures, selection job failures and dead letters.
- Retention aligned with privacy policy.

## 8. Hosting and network

Recommended baseline:

- CDN/WAF in front of the app and media.
- HTTPS with managed certificates.
- Long-lived Next.js Node containers (2+ replicas), separate workers.
- Private network access to MongoDB/Redis; secret manager.
- Staging environment with sandbox credentials; production isolated.
- Automated CI/CD with approval gates for production.
- Security headers/CSP configured at app/proxy/CDN layers.
- Health checks for app and worker.

Serverless-only deployment is possible but must solve connection pooling, worker separation and SSE/long-running jobs. Those are explicit architecture decisions, not assumptions.

## 9. Legal, translation and compliance providers

| Need | Requirement |
| --- | --- |
| Ethiopian legal review | Written approval/advice covering paid selection/prize, consumer protection, data protection, taxes, refunds, eligibility |
| Amharic translator/reviewer | Native reviewer for UI, marketing, legal/policy and selection terminology |
| Payment-provider compliance | Telebirr merchant category and consumer terms |
| Data protection | Privacy notice, retention/consent, access/deletion process |
| Photography rights | Licence/consent for each destination image |

These are launch dependencies even though they are not “code integrations”.

## 10. Environment variable mapping

See [`.env.example`](../.env.example) for the full template. Important rules:

- Only `NEXT_PUBLIC_*` values reach the browser; no secret may use that prefix.
- `PAYMENT_PROVIDER=mock` and `ENABLE_MOCK_PAYMENTS=true` are development/test only.
- `PAYMENTS_LIVE_ENABLED` and `FEATURE_PRIZE_SELECTIONS` default to false.
- `AUTH_SECRET`, `MFA_ENCRYPTION_KEY`, `TELEBIRR_*`, S3/Redis/Mongo and email credentials are server-only.
- Production startup validation rejects missing required values and unsafe combinations.
- `LEGAL_REVIEW_REFERENCE`, `LEGAL_APPROVED_AT` and `TELEBIRR_LIVE_APPROVED_AT` are evidence fields, not substitutes for the actual review.

## 11. Open questions for providers

1. Which exact Telebirr online merchant flow is approved for a tourism/travel-plan platform?
2. Is a subscription, deposit or chance-based participation model permitted by the merchant agreement?
3. What merchant category and consumer disclosures are required?
4. Does the provider support refunds/reversals via API, and what are the cutoffs?
5. What settlement report and reconciliation cadence are available?
6. What are the callback retry and signature rules, and can test vectors be provided?
7. Which email/SMS providers have reliable delivery in Ethiopia and support Amharic?
8. Which Atlas region/tier provides acceptable latency/backups and supports the expected indexes/search?
9. Which object-storage/CDN provider is approved for public tourism imagery and private uploads?
10. What is the legal entity, support contact and complaint-handling process for the live service?
