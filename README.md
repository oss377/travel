# Lucky Travel Ethiopia

A mobile-first tourism discovery and travel-plan platform for destinations across Ethiopia, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, MongoDB and Mongoose.

> **Current status: Phase 1 (Repository Inspection and Architecture) complete.**
> The application is still the starter Next.js shell. No database, authentication, payments, selection engine or public catalogue has been implemented yet. Phase 2 begins only after this architecture is reviewed.

## What the platform will include

- Public destination discovery with bilingual English/Amharic content, search, configurable categories and SEO.
- Secure accounts, email verification, password reset, sessions, roles and administrator MFA.
- User dashboard for plans, orders, payments, notifications, saved destinations, reviews and support.
- Administrator dashboard for destinations, categories, plans, orders, payments, users, content, refunds, audits and selection events.
- Server-calculated plan pricing with immutable order snapshots.
- A provider-abstracted Telebirr integration with a development mock. Live payments are disabled until official merchant approval and credentials exist.
- A separate, auditable selection-event engine with locked participant snapshots, cryptographic verifiable selection, dual approval and a read-only public display.
- English and Amharic interfaces, plus bilingual input fields for every administrator-managed content item.

Paid chance-based prize or selection functionality is **not** enabled by default. It requires legal review, published rules and the appropriate Ethiopian permits/approvals before launch.

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, stack decisions, layers, flows and phase gate |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Collections, fields, relationships, indexes, states and transaction boundaries |
| [docs/SECURITY-THREAT-MODEL.md](docs/SECURITY-THREAT-MODEL.md) | Assets, trust boundaries, threats, controls and pre-launch security gates |
| [docs/I18N.md](docs/I18N.md) | English/Amharic routing, dictionaries, bilingual admin content contract and review process |
| [docs/ROUTES.md](docs/ROUTES.md) | Required public, user, admin and API route map with access rules |
| [docs/EXTERNAL-INTEGRATIONS.md](docs/EXTERNAL-INTEGRATIONS.md) | Required third-party services, blockers and activation checklists |
| [docs/BUSINESS-RULES.md](docs/BUSINESS-RULES.md) | Assumptions, configurable rules and decisions that must be approved |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local setup, commands, conventions and troubleshooting |
| [docs/PHASE-CHECKLIST.md](docs/PHASE-CHECKLIST.md) | Phased delivery plan, status and acceptance mapping |
| [docs/PHASE-1-REPORT.md](docs/PHASE-1-REPORT.md) | Phase 1 implementation report and review gates |

## Quick start (starter shell only)

Prerequisites: Node.js 24+, npm 11+.

```bash
npm install
Copy-Item .env.example .env.local   # PowerShell
npm run dev
```

Open <http://localhost:3000>.

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

The planned local MongoDB (replica set), Redis, S3-compatible storage, mail catcher and test commands are documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). They are added in later phases.

## Architecture at a glance

- **Next.js App Router** with locale-prefixed routes (`/en/...`, `/am/...`) and a root locale redirect.
- **Server-authoritative services**: prices, payment state, roles, eligibility and selection results are never trusted from the browser.
- **MongoDB replica set** with Mongoose models, explicit indexes and transactions for payment, participation and selection integrity.
- **Redis + BullMQ** for distributed rate limiting, caching and durable background jobs; a separate worker process handles reconciliation, notifications and selection jobs.
- **Object storage + CDN** for destination media; uploads are validated, re-encoded and never stored in MongoDB documents.
- **Immutable records** for orders, payments, snapshots, results and audit logs.
- **Bilingual by construction**: localized content is stored as `{ en, am }`; publishing requires both languages.

## Legal and safety notice

This project is not legal advice. Before enabling paid participation, chance-based selection or prize/travel benefits, obtain Ethiopian legal and regulatory review covering consumer protection, data protection, permitted promotional activity, tax treatment, refunds, eligibility and payment-provider rules. The platform must not claim that payment guarantees a trip, prize or winning outcome.

## License

Proprietary. All rights reserved unless a licence is added by the project owner.
# travel
# travel
# travel
