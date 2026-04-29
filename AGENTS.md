# AGENTS.md

AgentCribs is a [RedwoodSDK](https://rwsdk.com) (`rwsdk`) project — an RSC-based React 19 framework running on Cloudflare Workers. It uses Cloudflare for all infrastructure: KV for fast lookups, R2 for durable backups, and `wrangler deploy` for deployment. No separate database — state lives in KV/R2 and Cloudflare's Send Email binding handles transactional mail.

## Project Structure

```
├── src/
│   ├── worker.tsx             # Entry point — route definitions, middleware wiring
│   ├── client.tsx             # RSC client-side hydration & navigation
│   ├── app/
│   │   ├── pages/             # Route/page components
│   │   │   ├── home.tsx
│   │   │   ├── apply.tsx
│   │   │   ├── thank-you.tsx
│   │   │   ├── verify-success.tsx
│   │   │   ├── verify-error.tsx
│   │   │   └── admin/
│   │   │       ├── applications.tsx
│   │   │       └── application.tsx
│   │   ├── components/        # Reusable UI components (hero, faq, seo, etc.)
│   │   ├── layouts/           # default.tsx, admin.tsx
│   │   ├── actions/           # Server actions
│   │   │   ├── application.ts # Submit/get/update applications, types, KV/R2 helpers
│   │   │   ├── email.tsx      # Email sending (magic link, notifications, accept/reject)
│   │   │   ├── github.ts      # GitHub OAuth flow
│   │   │   └── queue.ts       # Queue handlers: process-application, send-email, notifications, slack
│   │   ├── emails/            # Email templates (admin-notification, pending-review, accepted, rejected, magic-link)
│   │   ├── lib/               # ai.ts (streamText via AI Gateway), seo.ts
│   │   ├── queries/           # Data fetching: application.ts
│   │   ├── middleware/        # Route middleware
│   │   │   ├── auth/basic.ts  # Basic auth for admin
│   │   │   ├── github/callback.ts
│   │   │   └── verify/callback.ts
│   │   ├── shared/            # Shared UI bits: apply-form, cta-button, links, status-badge
│   │   ├── lib/               # ai.ts (streamText via AI Gateway), seo.ts
│   │   ├── document.tsx       # HTML document shell
│   │   ├── headers.ts         # Common header middleware
│   │   └── styles.css
├── data/
│   └── topics.ts              # Application topic definitions
├── public/                    # Static assets (favicons, robots.txt, sitemap, manifest)
├── types/                     # Shim type declarations (css.d.ts, rw.d.ts, vite.d.ts)
├── wrangler.jsonc             # Cloudflare Workers config — KV, R2, email, secrets
├── vite.config.mts            # Vite build config
└── tsconfig.json
```

## Key Conventions

- **Framework**: RedwoodSDK (`rwsdk`) — RSC-based, React 19, Cloudflare Workers runtime
- **Routing**: Declared in `worker.tsx` — `route()`, `layout()`, middleware chaining via arrays
- **Data flow**: `actions/` for mutations, `queries/` for reads, `middleware/` for auth/oauth/verify
- **Auth**: Basic auth for admin panel, GitHub OAuth for identity, magic link verify for email
- **Storage**: KV for fast lookups, R2 for durable backup, Send Email binding for mail
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, `@tailwindcss/typography`
- **Types**: No `npm run generate` needed for worker types — but `pnpm check` runs it
