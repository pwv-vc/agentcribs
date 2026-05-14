# AGENTS.md

AgentCribs is a [RedwoodSDK](https://rwsdk.com) (`rwsdk`) project — an RSC-based React 19 framework running on Cloudflare Workers. It uses Cloudflare for all infrastructure: KV for fast lookups, R2 for durable backups, D1 with Drizzle ORM for relational data (accounts, profiles, documents), and Durable Objects for session management. Cloudflare's Send Email binding handles transactional mail.

## Commands

- Use pnpm
- Build - `pnpm build`
- Typecheck and wrangler checks - `pnpm check`
- Generate Cloudflare types - `pnpm generate`
- D1 migrations - `pnpm migrate:new` (generate), `pnpm migrate:dev` (apply local), `pnpm migrate:prod` (apply remote)
- Deploy staging - `pnpm deploy:staging`
- Deploy production - `pnpm deploy:production`

## Project Structure

```
├── src/
│   ├── worker.tsx             # Entry point — route definitions, middleware wiring, queue consumers
│   ├── client.tsx             # RSC client-side hydration & navigation
│   ├── app/
│   │   ├── pages/             # Route/page components
│   │   │   ├── home.tsx
│   │   │   ├── apply.tsx
│   │   │   ├── thank-you.tsx
│   │   │   ├── verify-success.tsx
│   │   │   ├── verify-error.tsx
│   │   │   ├── terms.tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── login.tsx             # Account magic-link login page
│   │   │   ├── profile.tsx        # Applicant profile page (session cookie protected)
│   │   │   ├── documents.tsx         # Applicant documents list (session cookie protected)
│   │   │   ├── document-detail.tsx    # Document viewer — renders .md/.json inline, download button
│   │   │   └── admin/         # Admin area authenticated using Cloudflare One Access in production
│   │   │       ├── applications.tsx
│   │   │       ├── application.tsx
│   │   │       ├── application-edit-page.tsx
│   │   │       ├── application-edit.tsx
│   │   │       ├── events.tsx
│   │   │       └── event.tsx
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── events/        # Event-related components
│   │   │   ├── icons/         # Icon components (barrel export index.ts)
│   │   │   ├── application-detail.tsx
│   │   │   ├── community-section.tsx
│   │   │   ├── event-section.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── how-it-works-section.tsx
│   │   │   ├── json-ld.tsx
│   │   │   ├── pwv-section.tsx
│   │   │   └── seo.tsx
│   │   ├── layouts/           # default.tsx, admin.tsx
│   │   ├── actions/           # Server actions
│   │   │   ├── application.ts # Submit/get/update applications, types, KV/R2 helpers
│   │   │   ├── email.tsx      # Email sending (magic link, notifications, accept/reject)
│   │   │   ├── github.ts      # GitHub OAuth flow
│   │   │   ├── account.ts     # Account/profile actions, document upload
│   │   │   └── queue.ts       # Queue handlers: process-application, send-email, notifications, slack, dead-letter
│   │   ├── emails/            # Email templates (admin-notification, pending-review, accepted, rejected, magic-link, account-login)
│   │   ├── lib/               # ai.ts (AI Gateway), events.ts, formatters.ts, luma.ts, registration-code.ts, seo.ts
│   │   ├── queries/           # Data fetching: application.ts, topics.ts
│   │   ├── middleware/        # Route middleware
│   │   │   ├── auth/basic.ts          # Dev password auth fallback (not wired by default)
│   │   │   ├── cloudflare-session.ts  # Cloudflare One Access session hydration (admin)
│   │   │   ├── account-session.ts     # Cloudflare Access + D1 account lookup (applicants)
│   │   │   ├── github/callback.ts     # GitHub OAuth callback handler
│   │   │   └── verify/callback.ts     # Email magic link verification + account creation
│   │   ├── interrupters/      # Request-level interrupters
│   │   │   └── request-firewall.ts  # Blocks bot/CMS scanner requests
│   │   ├── shared/            # Shared UI bits: apply-form, cta-button, links, status-badge, footer, header, etc.
│   │   ├── document.tsx       # HTML document shell
│   │   ├── headers.ts         # CSP + security headers middleware
│   │   └── styles.css
│   ├── db/                    # Drizzle ORM
│   │   ├── schema.ts          # accounts, profiles, documents tables
│   │   └── db.ts              # Drizzle client (env.DB)
│   ├── sessions/              # Durable Objects
│   │   └── UserSession.ts     # RedwoodSDK session DO (getSession, saveSession, revokeSession)
├── content/                   # Content Collections source
│   ├── topics/                # *.md — application topic definitions (id, label, content)
├── drizzle/                   # D1 migration files
├── public/                    # Static assets (favicons, robots.txt, sitemap, manifest)
├── types/                     # Shim type declarations (css.d.ts, rw.d.ts, vite.d.ts)
├── content-collections.ts     # Content Collections config (topics + playlist schemas)
├── worker-configuration.d.ts  # Manual Env type declarations (bindings + secrets)
├── drizzle.config.ts          # Drizzle Kit config
├── wrangler.jsonc             # Cloudflare Workers config — D1, KV, R2, DO, email, queues, secrets
├── vite.config.mts            # Vite build config
└── tsconfig.json
```

## Key Conventions

- **Framework**: RedwoodSDK (`rwsdk`) — RSC-based, React 19, Cloudflare Workers runtime
- **Routing**: Declared in `worker.tsx` — `route()`, `layout()`, middleware chaining via arrays
- **Data flow**: `actions/` for mutations, `queries/` for reads, `middleware/` for auth/oauth/verify
- **Auth**: Cloudflare One Access for admin panel (session middleware hydrated from headers), GitHub OAuth for identity, magic link verify for email
- **Accounts**: Accounts created automatically on email verification — applicants access /my/profile and /my/documents via Cloudflare Access + D1 account lookup
- **AI**: Workers AI Gateway (`createAiGateway` + `createUnified`) — used for story summarization via Llama models
- **Queues**: 6 Cloudflare Queues for background jobs — process-application, send-email, notifications, slack, dead-letter, backfill-accounts
- **Storage**: KV for fast lookups, R2 for durable backup, D1 (Drizzle ORM) for accounts/profiles/documents, Send Email binding for mail
- **Sessions**: RedwoodSDK `defineDurableSession` backed by UserSession Durable Object — signed, HttpOnly session cookies
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, `@tailwindcss/typography`
- **Types**: No `npm run generate` needed for worker types — but `pnpm check` runs it
