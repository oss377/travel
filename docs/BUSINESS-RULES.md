# Business Rules, Assumptions and Decision Log

| Field | Value |
| --- | --- |
| Status | Draft; business/legal approval required for starred items |
| Date | 2026-10-23 |
| Rule | Do not silently invent a business rule. If a rule is unknown, disable the affected paid/high-impact feature until approved. |

This document separates **safe defaults** (implementation can proceed) from **blocking decisions** (must be answered before a phase or activation). No paid chance-based feature is launched by default.

## 1. Blocking decisions

### 1.1 Meaning of the 20→21→19→22… sequence ★

The brief proposes:

```text
20 → 21 → 19 → 22 → 18 → 23 → 17 → 24 → 16 → 25 → 15 ...
```

This is **not** a complete winner-selection algorithm. It is not safe to treat participant count, eligibility threshold and winner count as interchangeable. Before Phase 9, the business/legal owner must answer:

1. Does each number represent:
   - the **number of eligible participants** in an event,
   - the **minimum threshold required to proceed**,
   - the **number of winners**, or
   - another grouping rule?
2. What happens at each group size? Is one winner chosen from the group, are all participants in the group winners, or is the number only a sizing threshold?
3. What are the legal minimum and maximum participant counts?
4. When the count falls between sequence values, what rule applies? Round down, round up, wait for the exact value, extend, postpone or cancel?
5. Is the sequence applied once, repeated, or as a schedule of possible event sizes?
6. Who approves changing the sequence, and when may it change relative to entries opening/closing?
7. Is there a maximum number of winners per event and how are alternates handled?

**Current implementation stance:** store the sequence and interpretation as versioned configuration only. `interpretation` must be non-null before an event can open. The proposed sequence never determines winners by itself. A selection event cannot run until the rule, algorithm and legal approval are recorded.

### 1.2 Legal and regulatory approval ★

Before enabling paid participation and/or prize/travel benefits, obtain Ethiopian legal advice and required approvals covering:

- whether the promotion is lawful and whether a permit is required;
- consumer-protection and advertising rules;
- eligibility (age, residency, employee/insider exclusions);
- taxes and reporting;
- cancellation, postponement and refund obligations;
- payment-provider rules and prohibited-business restrictions;
- data protection/privacy and participant disclosure;
- how winners are notified and how benefits are delivered.

Record a legal review reference and approval date in platform settings. `FEATURE_PRIZE_SELECTIONS` stays `false` until then. The public copy must never say or imply “guaranteed win”, “guaranteed trip”, or “everyone wins”.

### 1.3 Telebirr commercial and technical access ★

Official merchant onboarding, contract, credentials, supported flows, callback authentication, sandbox access, refund capability and settlement/reconciliation rules are external dependencies. No endpoint or signature is invented. Live payments stay off until Phase 8 evidence and the activation checklist are complete.

### 1.4 What the plan price actually buys ★

The platform must explain whether a payment is for:

- destination entry/admission;
- transportation;
- accommodation;
- a guided package;
- a platform participation fee;
- a combination; or
- another defined benefit.

Destination prices are not automatically a complete travel package. The admin must configure and publish inclusions/exclusions and terms before a paid plan can be activated. No business default is assumed.

### 1.5 Refund, cancellation and postponement policy ★

The platform must state, before payment:

- when a user can cancel and what they receive;
- what happens if an event is postponed, cancelled or does not reach its threshold;
- provider fees/non-refundable amounts;
- processing time and method;
- whether a refund removes selection eligibility;
- what happens if a winner cannot be contacted or declines.

No “automatic refund” claim is made unless the provider and operational process can actually deliver it.

### 1.6 Eligibility criteria ★

Required legal/business definitions:

- minimum age;
- residency/citizenship/diaspora rules;
- account/email/phone verification requirements;
- payment verification requirement;
- one entry per user/plan/event or multiple entries;
- employee/contractor/insider exclusions;
- disqualification and appeals process;
- identification documents required (prefer not to collect until necessary, and protect them if collected);
- treatment of suspended/refunded/charged-back participants.

The system enforces server-side rules from the approved configuration; it does not infer eligibility from a payment alone.

## 2. Safe defaults for implementation

These defaults are conservative and can be changed through approved configuration. They do not authorize paid chance-based functionality.

| Area | Default | Notes |
| --- | --- | --- |
| Supported languages | English + Amharic | Both required for published admin content |
| Default locale | English | Root negotiates cookie/Accept-Language |
| Currency | ETB | Integer santim |
| Time zone | `Africa/Addis_Ababa` | UTC storage |
| Plan sizes | 10 and 20 destinations | Configurable allowlist; other counts only if admin enables |
| Custom plans | Disabled | Feature flag; admin can enable after configuring rules |
| Standard plan destinations | Admin-configured fixed list | Server validates count and availability |
| Destination duplicate in custom plan | Rejected by default | Prevent duplicate IDs; option could be approved later |
| One active order per user/plan | True | `activeOrderKey` unique sparse; reattempt after final state |
| One selection entry per user/event | True | Unique partial index; requires business approval to change |
| Email verification | Required for paid actions | Browsing allowed before verification |
| Phone verification | Optional | Only if a supported provider exists |
| Payment | Telebirr; mock only in development | Live disabled by default |
| Plan price display | Full server breakdown before payment | Fees/taxes only when configured and disclosed |
| Fees/taxes | Zero until configured | Do not invent a fee |
| Tax rounding | Half-up to nearest santim | Pricing-engine version recorded |
| Participant list visibility | Private | Public aggregate counts only |
| Winner public name | Masked by default | Full name only with a lawful/consented disclosure policy |
| Selection method | No method enabled until approved | Versioned CSPRNG protocol planned |
| Selection dual approval | Required for snapshot lock and result publish | Two distinct admins, MFA/step-up |
| Admin approval for refunds | Required above configured threshold | Audit + provider outcome |
| Public selection display | Enabled only when event allows it | Read-only, no client mutation |
| Reviews | Allowed only from registered users, moderated | No fake “verified” badges |
| Testimonials | Only with verified source metadata | No invented quotes/ratings |
| Account deletion | Request → retention review → deletion/anonymization | Financial/audit retention exceptions |
| Demo data | Clearly labelled and off by default | Never production destination facts/prices |
| Amharic machine translation | Disabled | Human translation/review only for published content |

## 3. Plans and pricing

### 3.1 Plan sizes

- Admin configures `allowedDestinationCounts`, initially `[10, 20]`.
- The server rejects any custom plan whose destination count is not in the allowlist.
- The server verifies each destination is published, not archived, and eligible for plan inclusion.
- Duplicate destinations are rejected unless a future approved rule explicitly allows repeats (not default).
- The plan builder displays destination cards, category, and current price. It never submits a trusted total.
- The final amount is computed from database prices plus configured/disclosed fees, taxes and approved discounts.
- The order stores the exact selected destination list, prices, fee lines, tax, discount, currency, plan-rules version and calculation time.

### 3.2 Pricing modes

Supported server-side modes:

- sum of eligible destination prices (`sum_of_destinations`);
- fixed amount configured by admin (`fixed_amount`), still disclosed and validated;
- optional participation/service fee;
- optional tax rate in basis points;
- optional approved discounts.

A plan must not activate until its inclusions/exclusions and price composition are complete in both languages. The client cannot submit `total`, `destinationPrice`, `discount` or `currency` as authoritative values.

### 3.3 Destination price changes

- Changing a destination price affects only future orders.
- Existing orders retain their pricing snapshot.
- If a selected destination is unpublished/archived before order creation, the order fails validation and the user is asked to rebuild; after order creation, existing snapshots are honored according to the plan terms.

## 4. Orders, payments and participation

### 4.1 Order lifecycle

```text
pending_payment -> paid -> (refund_pending) -> refunded
pending_payment -> payment_failed | expired | cancelled
```

- A retry creates a new payment attempt, not a duplicate order/participation.
- An order is payable only while `pending_payment` and before `expiresAt`.
- A verified provider success is required; browser return is informational.
- After payment verification, participation eligibility is evaluated server-side. Payment alone does not guarantee eligibility or a winner.
- Cancellation/expiry releases the active order slot; no payment means no participation.
- Order/payment/participation transitions are transactional and idempotent.

### 4.2 Payment state

The app distinguishes provider status, local verification status and reconciliation status. “Pending” is shown honestly. Never show “paid” because a redirect succeeded or because a client posted a status.

### 4.3 Participation eligibility

Eligibility is computed from server records and the published rules version. At minimum, default checks include:

- account exists and is active;
- email verified (if required);
- qualifying verified payment;
- correct plan/event;
- not disqualified under published rules;
- legal/age/residency requirements recorded as satisfied/unsatisfied/not applicable.

A payment that is refunded, reversed, charged back or found fraudulent may disqualify participation according to the published policy. The system records the reason; it does not silently remove a participant.

## 5. Selection events

### 5.1 Published rules before entries

Before an event opens, these must be complete and legally reviewed:

- event name/description;
- eligibility;
- participating plans/payment requirement;
- opening/closing dates and timezone;
- threshold/participant rule and interpretation;
- winner count;
- selection method and version;
- announcement time/place;
- prize/trip terms, taxes/fees, delivery timeline;
- refund/cancellation/postponement rules;
- privacy/disclosure policy;
- complaints/appeals process.

Rules are versioned and hashed. After opening, they cannot change. A material change requires cancellation and a new event with a new consent/terms version.

### 5.2 Snapshot and result integrity

- Snapshot is built only after closing and payment reconciliation.
- It includes only eligible participants; no one is invented to reach a size.
- Entries are immutable after lock; count and manifest hash are published.
- No admin may alter eligibility after lock. Corrections require an audited cancellation/re-run process published in advance.
- If insufficient eligible participants remain, follow the published extension/postpone/cancel/refund rule. Do not quietly lower the threshold or add fake entries.
- Selection uses a CSPRNG and a documented, versioned algorithm with commitment/reveal evidence where appropriate. The server persists winners before any animation.
- Dual approval is required for high-impact transitions. The approving admins must be distinct and authenticated with MFA.
- The public display cannot trigger, alter or predict the result; it only renders the persisted result.

### 5.3 Winner disclosure

- Default: masked display name and public verification reference; no email, phone, user ID, payment reference or identity document.
- Full-name disclosure requires lawful basis/consent in the published privacy policy.
- Notification status is not a public field beyond “winners have been contacted” if approved.
- Participants can see their own outcome in the dashboard. Public viewers see only the official result.

## 6. Administrator and security operations

| Action | Requirement |
| --- | --- |
| Publish destination/category/plan/content | Permission, both languages complete, audit |
| Change price/rules | Audit; rules version/hash; existing orders unaffected |
| View payment/participant data | Permission; least-privilege DTO; no secrets |
| Refund | Permission, amount limits, provider verification, audit |
| Suspend user | Permission, reason, session revocation, audit |
| Change role | Super admin + fresh MFA, audit |
| Lock snapshot | Dual approval, MFA, reconciliation complete |
| Publish result | Dual approval, MFA, persisted result evidence |
| Toggle legal/feature gates | Super admin, recorded approval metadata, audit |
| Change settings | Super admin; validation; audit; no secrets in DB |

## 7. Content and translation operations

1. Admin content has both English and Amharic fields. Publishing requires both, except for explicitly non-prose values.
2. Image upload requires alt text in both languages before the image is used on published content.
3. Legal/policy content is not machine-translated. A human reviewer and approval reference are recorded.
4. Amharic UI dictionary strings are reviewed by a native speaker before production. Initial strings are marked draft.
5. The CMS shows missing-translation reports and completeness badges. Bulk actions cannot bypass completeness.
6. If a destination/plan changes materially, the content is re-verified; do not claim prices/hours are current without admin confirmation.
7. No production destination facts/prices are invented for seed data. Demo records must be labelled and disabled in production.

## 8. Data, privacy and retention

- Collect only necessary personal data. Define the purpose and retention for email, phone, IP, support content and identity evidence.
- Do not publish participant lists, payment references, contact details or identity documents.
- Provide an authenticated process for access/export/deletion requests; honor legal/financial retention exceptions.
- Revoke sessions on deactivation/suspension and on password/email changes.
- Keep financial/selection/audit records separate from editable display content.
- Publish a privacy policy in English and Amharic, with human legal review.
- Do not use real production data in development/seed environments.

## 9. Notifications

- In-app notifications are always created for verification, payment, order, selection/result, refund and security events.
- Email is enabled only with a configured provider; SMS only with a contracted provider and verified Ethiopic support.
- Notifications use the user’s preferred locale and never disclose another user’s private data.
- Duplicate delivery is prevented by a dedupe key.

## 10. Support and disputes

- Users can open a support ticket linked to an order/payment/event without exposing sensitive data in the subject.
- Refund/disqualification/appeal decisions record a reason and are auditable.
- Support staff cannot edit payment status manually; they use the payment/refund workflow with provider evidence.
- Abuse reports are reviewed by an authorized administrator, with account suspension and an audit record.

## 11. Decisions to record before each phase

| Before phase | Decision needed |
| --- | --- |
| Phase 2 | Approve locale-prefixed URLs, route redirect, Amharic UI review owner |
| Phase 3 | Confirm MongoDB Atlas/region/backup tier; demo-data policy |
| Phase 4 | Approve auth/session ADR, email provider, admin MFA policy |
| Phase 5 | Approve category taxonomy, content sourcing/verification, search fallback |
| Phase 6 | Approve media storage/CDN provider, copyright/consent policy |
| Phase 7 | Approve plan price composition, allowed counts, fees/taxes, inclusions |
| Phase 8 | Official Telebirr onboarding/credentials, live activation sign-off |
| Phase 9 | **Resolve participant sequence meaning, winner count, eligibility, selection algorithm and legal approval** |
| Phase 10 | Email/SMS providers, notification policy, on-call/alert routing |
| Phase 11 | Accept residual risks; approve security/accessibility reports |
| Phase 12 | Approve capacity envelope and scaling budgets |
| Phase 13 | Production legal/security/operations sign-off |

## 12. Change control

- A change to eligibility, pricing, refunds, selection method or disclosure rules is a **versioned business change**, not a code tweak.
- Published rules/terms are never silently edited. Existing orders/events keep the accepted version; new versions apply prospectively.
- Any exception requires written approval, an audit record and (where users could be affected) communication.
- The phase checklist must be updated when a rule changes.
