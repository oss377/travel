# Security and Threat Model — Lucky Travel Ethiopia

| Field | Value |
| --- | --- |
| Status | Living document; Phase 1 baseline |
| Scope | Public site, user accounts/dashboard, admin console, payments, selection engine, media, jobs, operations |
| Classification | Internal security documentation |
| Rule | No feature is considered complete because a button is hidden. Every protected operation authorizes on the server. |

This document is not a guarantee that the platform is secure. It records the assets, attack surfaces, required controls, test expectations and residual risks. It must be updated whenever a security boundary or business rule changes.

## 1. Security objectives

1. **Account integrity:** only the account owner can access private profile, orders, payments, notifications and support data.
2. **Payment integrity:** an order is marked paid only after a provider-authenticated, independently verified transaction; amounts and currency cannot be manipulated; callbacks are idempotent.
3. **Selection integrity:** eligibility, snapshots and results are server-enforced, immutable after lock, auditable and resistant to client/insider manipulation.
4. **Content integrity:** only authorized administrators can publish content; uploaded media cannot execute code or overwrite arbitrary objects.
5. **Least disclosure:** public pages and APIs reveal only public information; participant lists, payment references and identity data stay private.
6. **Availability and abuse resistance:** authentication, search, uploads, payments and live displays are rate-limited and degrade safely.
7. **Administrative accountability:** sensitive actions require strong authentication, permissions, re-authentication and audit records.
8. **Bilingual completeness without injection:** translated/admin-entered content is validated and sanitized in both languages.

## 2. Assets

| Asset | Sensitivity | Notes |
| --- | --- | --- |
| Passwords, password hashes | Critical | Argon2id; never logged or serialized |
| Session tokens, reset/verification tokens, TOTP secrets | Critical | Hashed/encrypted at rest; cookies HttpOnly |
| Telebirr merchant secrets, signing keys, callback secrets | Critical | Secret store only; never browser or logs |
| Payment ledger, orders, pricing snapshots | High | Financial integrity; retention obligations |
| Selection snapshots, seed/commitment, results, approvals | High | Fairness evidence; private participant data |
| User PII (email, phone, IP, profile) | High | Minimize, redact, access-log |
| Admin audit logs | High | Append-only, tamper-evident access |
| Destination/media content | Medium | Integrity, copyright/consent, upload safety |
| Published legal terms/eligibility | High | Consumer protection; versioned |
| Public selection display | Medium | Read-only; no personal data leakage |
| Feature flags/legal approvals | High | Gate paid/fairness-sensitive functionality |
| Backups | Critical | Encrypted, access-controlled, restore-tested |

## 3. Actors and trust boundaries

| Actor | Capabilities | Trust |
| --- | --- | --- |
| Anonymous visitor | Browse published content, search, view public results, register/login | Untrusted |
| Registered user | Own profile, own orders/payments/notifications, join eligible plans | Authenticated but untrusted |
| Administrator | Content/plan/payment/user operations within permissions | Strongly authenticated; still audited |
| Super administrator | Settings, roles, legal gates, high-impact approvals | Strongest controls; dual control for selected actions |
| Background worker | Process payments/notifications/selection | Internal service identity, least privilege |
| Telebirr provider | Send callbacks / respond to verification | External; authenticate every message; verify independently |
| Object storage/CDN | Serve/store media | Configured trusted service; signed access |
| Attacker | Internet, stolen session, malicious admin, compromised dependency | Assume capable and opportunistic |

### Boundaries

- Browser ↔ Next.js app
- Next.js app ↔ MongoDB
- Next.js app ↔ Redis/queue
- Next.js app ↔ object storage
- App/worker ↔ Telebirr
- App/worker ↔ email/SMS
- Public viewer ↔ selection display
- Admin browser ↔ privileged admin actions
- CI/CD ↔ production secrets/infrastructure

## 4. Security invariants

These must remain true in code review and tests:

1. **No price, total, role, ownership, payment status or eligibility flag is trusted from the client.**
2. **No public request can mutate a selection event, snapshot or result.**
3. **No browser redirect is accepted as payment proof.**
4. **No payment callback is processed without authentication/verification and idempotency.**
5. **No admin endpoint/action is protected only by hiding its link.**
6. **No password, session token, MFA secret, provider secret or raw identity document is returned in an API response or written to logs.**
7. **No uploaded file is trusted based on extension or client MIME type.**
8. **No published bilingual content can have a missing required language.**
9. **No locked snapshot/result is edited in place.**
10. **No production mock payment can be enabled accidentally.**

## 5. Threat catalog and controls

### 5.1 Authentication and account abuse

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Credential stuffing | Automated login attempts with breached passwords | Argon2id, IP+account rate limits, progressive delay, optional CAPTCHA, breached-password check if provider available, alerting | Rate-limit + timing tests; load test |
| User enumeration | Registration/forgot-password responses reveal existence | Generic responses for reset/login; constant-ish flows; rate limits; no email existence in UI | API tests for identical responses/timing tolerance |
| Password brute force / hash DoS | Flood login to exhaust CPU | Per-IP and per-account limits; bounded Argon2 params; queue/limit concurrency; lockout/backoff | Abuse test under load |
| Session theft | XSS, stolen cookie, shared device | HttpOnly/Secure/SameSite cookies, `__Host-` prefix, rotation, idle/absolute expiry, revoke-all, step-up auth | Cookie attribute and revocation tests |
| Session fixation | Attacker supplies a session ID | Server generates random token; rotate on login/privilege change; never accept token from URL | Auth integration tests |
| CSRF | Cross-site form posts to cookie-auth endpoints | SameSite, Next Server Action Origin checks, CSRF tokens for custom cookie-auth routes, strict CORS | CSRF tests |
| Reset token abuse | Replay, guessing, email change | 256-bit random, HMAC-hashed storage, single-use, short TTL, invalidate sessions, rate limits | Token replay/expiry tests |
| MFA bypass | Admin disables MFA or replays a code | Admin MFA mandatory, TOTP replay prevention, encrypted secret, hashed recovery codes, step-up, super-admin control | MFA integration tests |
| Account takeover via email change | Change email without verifying both sides | Require current password/session, verify new address, notify old address, invalidate sessions | E2E security test |

### 5.2 Authorization and IDOR

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| IDOR | Change order/destination/user ID in URL/action | Every service takes actor context; ownership check on user resources; public DTOs exclude private fields; opaque public IDs | Role/ownership matrix tests |
| Role escalation | User submits `role=admin` in profile/update | Allowlisted mutable fields; role never accepted from public payload; separate super-admin service | Mass-assignment tests |
| Admin bypass | Hidden nav or client-only gate | Server layout guard + per-action/service guard; deny by default; permission map | Route/action tests for each role |
| Forced browsing | Direct access to admin URLs | Layout/server guard, forbidden response; no sensitive HTML/JS sent to unauthorized users | E2E + integration |
| Cross-tenant/user data leak | `populate` returns other users' sessions/payments | Projections, explicit joins, scoped queries, tests | Query review/integration |
| Admin view overreach | Support staff see secrets | Admin DTOs never include secrets/hashes/tokens; field-level permissions; audit views | DTO snapshot tests |

Authorization rules are implemented in a data access layer and repeated in services. `proxy.ts` only handles locale redirects; it is not an authorization boundary.

### 5.3 Injection and content security

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| NoSQL injection | Objects in query params (`{ $ne: null }`) | Zod schema coercion, reject non-scalar query values, Mongoose casting, no raw query construction | Fuzz/security tests |
| XSS via CMS | Admin content/rich text contains scripts | Server-side allowlist sanitizer; React escaping; CSP; no raw HTML unless sanitized; tests for both locales | XSS payload tests |
| XSS via reviews/support | User-generated text with HTML/JS | Store plain text or sanitized Markdown; escape; content-security policy | Stored/reflected XSS tests |
| Path traversal | Upload filename `../../x` | Ignore client filename for storage; random keys; normalize; no direct filesystem access | Upload tests |
| SSRF | Map URL/image URL fetched server-side | Do not fetch arbitrary user URLs; allowlist https; block internal IPs/metadata ranges if fetching is ever added | SSRF unit tests |
| Injection through i18n | Translation placeholders/HTML | Render as text; parameterize; never `dangerouslySetInnerHTML` without sanitization; dictionary values reviewed | XSS and rendering tests |
| CSV/formula injection | Admin exports | Escape cells beginning `= + - @`; documented export format | Export tests |

### 5.4 Payment and financial threats

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Price manipulation | Client submits total/fees | Server recomputes from DB; immutable snapshot; reject client totals | Order creation tests |
| Payment forgery | Browser claims success | Callback signature verification + independent provider verification; no success from redirect | Mock forgery tests |
| Callback replay/duplication | Provider retries or attacker replays | Unique provider event ID + idempotency key + transaction state guard | Concurrent/duplicate callback tests |
| Amount/currency mismatch | Callback says 1 ETB for a 10,000 ETB order | Compare merchant order, amount, currency, status; mark mismatch, alert | Mismatch tests |
| Race/double-spend | Two callbacks or requests update order simultaneously | Mongo transaction, conditional updates, unique indexes, idempotency; no read-modify-write without guards | Concurrency test |
| Duplicate participation | Two orders/callbacks create entries | Unique `orderId` participation, unique active entry rule, transaction | Concurrency/integration |
| Refund abuse | User/admin claims over-refund | Sum of refunds ≤ captured; provider verification; approval + audit | Refund tests |
| Reconciliation failure | Callback lost/queued | Durable job, provider status lookup, retry/backoff, alerting, manual reconciliation record | Worker failure tests |
| Secret leakage | Merchant key in client bundle/log | Server-only env, secret store, redaction, bundle/secret scans | Build/log scans |
| Mock enabled in production | Misconfiguration | Startup guard rejects mock when production/live; explicit flags; tests | Config validation tests |
| Phishing | Fake payment pages | Official provider flow; clear order summary; no credential collection outside provider; user education copy | UX review |

Live Telebirr remains disabled until official integration approval and the Phase 8 security tests pass. The provider abstraction must not invent callback rules.

### 5.5 Selection engine threats

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Client-triggered selection | Public clicks/endpoint | Selection only via authenticated admin + worker; public endpoints read-only | Endpoint/action tests |
| Insider manipulation | Admin edits participants after seeing count | Locked snapshot, immutable entries, dual approval, audit, rules hash | Snapshot immutability tests |
| Eligibility tampering | Admin/user changes payment/age flag | Eligibility computed from verified records + versioned rules; no client flags | Service tests |
| Biased RNG | Predictable `Math.random` / modulo bias | CSPRNG, rejection sampling, documented algorithm/version, seed commitment/reveal | Statistical + deterministic replay tests |
| Premature/secret reveal | Admin knows winners before public | Internal access restricted; result persisted before animation; disclosure policy | Access/audit tests |
| Animation determines result | Frontend randomly picks names | Server persists result; display only reads it | E2E refresh/reconnect test |
| Snapshot replacement | Editing snapshot document | Immutable status transition + no update API; unique hashes; audit | Integration test |
| Duplicate job delivery | Worker retries | Unique result/event transition, idempotency, locking | Worker replay test |
| Participant data leak | Public verification includes IDs/contacts | Public DTO returns masked labels/hashes only; consent rules | Privacy tests |
| Forced-size fraud | System adds fake participants to reach threshold | Never invent/add participants; published policy for insufficient threshold | Rule tests |
| Insufficient participants mishandled | Silent cancellation after payment | Published extension/postpone/cancel/refund rule; admin reason; audit | Workflow tests |
| Legal gate bypass | Enabling event without approval | Feature flag + legal approval metadata + server validation; default off | Config/role tests |

### 5.6 File upload and media

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Malicious file | `.php`, `.html`, polyglot, SVG script | Magic-byte validation, reject SVG/HTML, re-encode images, safe content type, isolated storage domain | Upload tests |
| Stored XSS via SVG | SVG with script | Reject SVG; render as image only after rasterization | E2E |
| Oversized upload / DoS | Huge files or decompression bombs | Size limits, pixel-dimension limits, timeouts, queue processing | Load/abuse test |
| Path traversal/overwrite | Crafted filename/key | Server-generated random keys; no client paths; bucket policy | Unit test |
| Unauthorized upload | Visitor uploads media | Admin role + MFA + permission + rate limit; signed URL scoped to key/type/size/TTL | Auth tests |
| Metadata privacy leak | EXIF GPS/device data | Strip metadata during re-encode | Inspection test |
| Hotlink/misuse | Public bucket listing | Block listing; CDN/public URL policy; signed/private originals | Infra check |

### 5.7 Admin and audit threats

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Admin account takeover | Phishing/credential reuse | MFA, session rotation, step-up for sensitive actions, alerting | Security tests |
| Malicious insider | Refund, suspend, publish, change rules | Least privilege, dual approval, immutable audit, anomaly alerts | Process test |
| Log tampering | Editing/deleting audit records | Append-only app + restricted DB role; external export/immutability where available | DB permission review |
| Repudiation | No evidence of action | `AuditLog` in same transaction; request ID, actor, hashes | Transaction tests |
| Rate/approval bypass | Crafting action request | Permission + approval state checked server-side, not UI-only | Action tests |

### 5.8 Availability and abuse

| Threat | Attack path | Required controls | Verification |
| --- | --- | --- | --- |
| Search scraping | Enumerating catalogue/large pages | Rate limits, cursor pagination caps, cache/CDN, WAF, bot detection | Load/abuse test |
| Login/email bombing | Trigger reset emails | Rate limit by IP + email, cooldown, provider quotas, generic responses | Tests |
| SSE exhaustion | Open many live streams | Concurrency caps per IP, timeout/heartbeat, read-only payload; polling fallback | Load test |
| Queue flooding | Spam actions/jobs | Rate limit, dedupe, idempotency, bounded retries/dead-letter | Load test |
| DB connection exhaustion | Serverless/ephemeral scaling or attack | Pool caps, timeouts, connection monitoring, backpressure | Load test |
| Third-party outage | Telebirr down/slow | Timeouts, circuit breaker, safe pending state, reconciliation | Failure injection |
| Backup loss | Corruption/deletion | Encrypted PITR, separate account/project, restore drills | DR test |

## 6. Authentication implementation checklist (Phase 4)

- [ ] Argon2id via a maintained native package; parameters documented and benchmarked on production hardware.
- [ ] Never log or select password hashes; auth credential collection is separate from user profile.
- [ ] Session token 256-bit CSPRNG; only HMAC-SHA-256 hash stored; token never in URL/localStorage.
- [ ] Cookie attributes: `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`, `__Host-` prefix in production.
- [ ] Idle and absolute session expiry; rotation after privilege changes; logout revokes server-side.
- [ ] Password reset invalidates all sessions; email change notifies the old address and verifies the new one.
- [ ] Generic responses for forgot-password/login where enumeration is a risk.
- [ ] Rate limiting on register, login, reset request/consume, verification, MFA, email change, admin invite.
- [ ] Admin MFA required, TOTP secrets encrypted, recovery codes hashed, replay-safe.
- [ ] CSRF protection for custom cookie-authenticated Route Handlers; Server Actions rely on framework Origin checks plus application validation.
- [ ] Central session/DAL helper; no session logic duplicated in components.
- [ ] Authorization tests for every user/admin resource and action.
- [ ] Initial admin created by a one-time CLI with a prompted password, forced MFA and an audit record; no seeded password.
- [ ] Account suspension/deactivation revokes sessions immediately.
- [ ] Development/test credentials are local-only and never in source.

## 7. Input, output and data handling

- Zod validate/coerce every Server Action, Route Handler, query parameter, webhook body and worker payload.
- Use explicit field allowlists; never spread a request body into a Mongoose update.
- Normalize emails/phone numbers server-side; trim and length-cap names and content.
- Sanitize rich text on the server using an allowlist; store the sanitized result.
- Return DTOs, not raw Mongoose documents. Mark `select: false` on secrets and still verify DTO projections.
- Set strict JSON body limits; reject unexpected content types.
- Use parameterized Mongoose query filters; reject object/array values where scalar is expected.
- Escape/parameterize output; do not use `dangerouslySetInnerHTML` for user/admin content without sanitization.
- Redact emails, phone numbers, IPs, tokens and provider identifiers in logs where not needed.
- Never store raw IP addresses when an HMAC is sufficient for abuse detection; if raw IP is legally required, document retention.

## 8. CSRF, CORS and headers

### CSRF

- Server Actions: Next.js compares Origin to Host; configure `serverActions.allowedOrigins` for the production proxy/CDN only.
- Custom cookie-authenticated Route Handlers: require `Origin`/`Sec-Fetch-Site` checks and a synchronizer/double-submit CSRF token; reject cross-site requests.
- Payment callbacks: signature/authenticated provider response, replay protection and idempotency; not CSRF-protected because the provider is the caller, but they must not accept browser-session cookies as authorization.
- CORS: default deny. Allow only explicit origins/methods if a future public API requires it; no wildcard with credentials.

### Response headers

Planned baseline (verify against Next.js 16 CSP guidance in Phase 2):

```text
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload  (after domain readiness)
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
X-Frame-Options: DENY
Content-Security-Policy:
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  frame-ancestors 'none';
  form-action 'self';
  img-src 'self' data: blob: <object-storage/CDN>;
  font-src 'self';
  connect-src 'self' <monitoring endpoints>;
  script-src 'self' <nonce/hashes as required by Next.js 16>;
  style-src 'self' 'unsafe-inline';   # review in Phase 11; inline style attributes may require this
  upgrade-insecure-requests
```

Nonces/CSP are integrated with the proxy/build in Phase 2/11 without breaking static caching. Any use of third-party scripts (analytics, payment SDKs) requires an explicit allowlist and privacy review. Prefer no third-party scripts in checkout/selection flows.

## 9. Rate limiting baseline

Limits are implemented in Redis with atomic counter/levers; values are configurable and validated under load.

| Endpoint class | Baseline |
| --- | --- |
| Login | 5 failures per account / 15 min; 20 per IP / 15 min; progressive delay |
| Registration | 5 per IP / hour; 3 per email / day |
| Password reset request | 3 per account / hour; 10 per IP / hour |
| Password reset consume | 10 per IP / hour |
| Email verification | 5 per user / hour; 20 per IP / hour |
| MFA verify | 5 per session / 10 min |
| Payment initiation | 10 per user / hour; per-IP cap |
| Payment callback | Provider retries honored; signature first; dedupe; anomaly alerts |
| Search | 60 requests / min / IP; cursor/page size caps |
| Upload | 20 per admin / hour; size/dimension limits |
| Review/support | 5 reviews/day/user; 5 tickets/hour/user |
| Admin mutations | Permission + MFA; 100/hour/admin; anomaly alerts |
| Selection SSE | 3 concurrent streams/IP; heartbeat timeout |
| Public APIs | Per-route budgets; `Retry-After` responses |

Do not rate-limit legitimate provider retries into loss; callbacks must be acknowledged safely and processed idempotently.

## 10. Secrets and configuration

- All secrets in a managed secret store or deployment environment, never source, client bundles or logs.
- `NEXT_PUBLIC_*` values contain no credentials.
- Startup validation rejects missing required secrets and unsafe combinations (e.g. mock payments in production).
- Separate development/staging/production credentials; no production data in dev.
- Rotate session pepper, MFA key, provider keys and storage credentials with documented procedures. Rotation invalidates affected sessions/tokens.
- Secret scanning in CI (`gitleaks` or equivalent) and dependency audit. No secrets in Docker image layers.
- Database/Redis/storage use private networking and least-privilege credentials.
- Backups encrypted; restore access requires break-glass authorization.

## 11. Logging, monitoring and privacy

- Structured logs: request ID, route, status, duration, actor role/pseudonymous ID, outcome. Avoid raw PII and never log secrets/tokens/passwords/MFA.
- Provider payload logs are sanitized; full payloads only in a restricted evidence store if legally required.
- Error tracking scrubs sensitive fields.
- Alerts: repeated auth failures, admin login anomalies, callback verification failures, reconciliation backlog, refund failures, selection job failures, queue dead letters, database slow queries/connection saturation, 5xx spikes.
- Access to admin audit logs is itself audited.
- Log retention 30–90 days unless a legal requirement says otherwise.

## 12. Compliance and legal gates

- Paid chance-based/prize functionality requires Ethiopian legal review, consumer-protection compliance, eligibility/refund terms, tax treatment and any required permit. `FEATURE_PRIZE_SELECTIONS` defaults false.
- The UI must not imply that payment guarantees a trip, prize or win.
- Publish plan terms, price composition, inclusions/exclusions, eligibility, cancellation/refund policy and selection rules before payment.
- Telebirr live activation requires official merchant approval and provider-policy compliance.
- Data protection: collect only necessary PII, publish a privacy policy, support access/export/deletion requests, document retention, protect participant data and do not publish private identity/payment details.
- Amharic legal/policy translations require human/legal review. Automated structure tests do not replace legal review.
- Terms/version accepted at order time is stored with the order; changing terms does not retroactively alter existing orders.
- Public winner disclosure follows the published privacy policy and consent; default is masked display.

## 13. Pre-launch security gates

Critical/high defects block launch.

- [ ] Threat model reviewed against the implemented system.
- [ ] Every role and protected route/action tested for authorization and IDOR.
- [ ] CSRF, session fixation/rotation/revocation, logout and password reset tested.
- [ ] Admin MFA and step-up tested; recovery process tested.
- [ ] Payment callback forgery, replay, amount mismatch, duplicate and race tests pass.
- [ ] Live payments disabled unless provider sandbox/live approval is documented.
- [ ] Selection snapshot immutability, dual approval, RNG reproducibility and public read-only tests pass.
- [ ] Upload content/type/size/path tests pass; no SVG/HTML accepted.
- [ ] CSP/security headers verified in staging; no mixed content.
- [ ] Rate limits and WAF/bot rules verified under load.
- [ ] Dependency/secret scans clean or exceptions documented and accepted.
- [ ] Backups encrypted and a restore drill completed.
- [ ] Audit logging verified, including denial events.
- [ ] Privacy policy, terms, refund/cancellation and eligibility content approved in both languages.
- [ ] Incident response and provider-outage runbooks documented.
- [ ] Remaining risks recorded with owners and acceptance dates.

## 14. Known limitations and accepted-risk process

At Phase 1, no controls are implemented yet. The following are known gaps that must be closed by their phases:

- Custom auth requires rigorous review/testing (Phase 4, Phase 11).
- Telebirr behavior, signature scheme and refund support are unverified (Phase 8).
- Selection count semantics and legal approval are unresolved (Phase 9 gate).
- Bilingual legal translation review is pending (Phase 11/13).
- Capacity is unmeasured (Phase 12).
- Email/SMS/storage/monitoring providers are not selected (Phase 10/13).
- CSP compatibility with the chosen real-time/animation stack must be validated (Phase 11).

No unresolved critical/high security risk may be treated as accepted without a named risk owner, documented compensating control and a dated approval.
