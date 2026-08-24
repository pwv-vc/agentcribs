# AGENTS.md

AgentCribs is a [RedwoodSDK](https://rwsdk.com) (`rwsdk`) project — an RSC-based React 19 framework running on Cloudflare Workers. It uses Cloudflare for all infrastructure: KV for fast lookups, R2 for durable backups, and `wrangler deploy` for deployment. No separate database — state lives in KV/R2 and Cloudflare's Send Email binding handles transactional mail.

## Commands

- Use pnpm
- Build - `pnpm build`
- Typecheck and wrangler checks - `pnpm check`
- Generate Cloudflare types - `pnpm generate`
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
│   │   │   ├── podcasts.tsx        # /podcasts index (from podcasts collection)
│   │   │   ├── podcasts/[id].tsx   # /podcasts/:id detail (seasons, episodes, hosts, trailer)
│   │   │   ├── apply.tsx
│   │   │   ├── thank-you.tsx
│   │   │   ├── verify-success.tsx
│   │   │   ├── verify-error.tsx
│   │   │   ├── terms.tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── not-found.tsx
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
│   │   │   ├── podcasts/      # Podcast components (trailer, seasons, episodes, hosts, cards)
│   │   │   ├── icons/         # Icon components (barrel export index.ts)
│   │   │   ├── application-detail.tsx
│   │   │   ├── community-section.tsx
│   │   │   ├── event-section.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── json-ld.tsx
│   │   │   └── seo.tsx
│   │   ├── layouts/           # default.tsx, admin.tsx
│   │   ├── actions/           # Server actions
│   │   │   ├── application.ts # Submit/get/update applications, types, KV/R2 helpers
│   │   │   ├── email.tsx      # Email sending (magic link, notifications, accept/reject)
│   │   │   ├── github.ts      # GitHub OAuth flow
│   │   │   └── queue.ts       # Queue handlers: process-application, send-email, notifications, slack, dead-letter
│   │   ├── emails/            # Email templates (admin-notification, pending-review, accepted, rejected, magic-link)
│   │   ├── lib/               # ai.ts (AI Gateway), events.ts, formatters.ts, luma.ts, registration-code.ts, seo.ts
│   │   ├── queries/           # Data fetching: application.ts, topics.ts, events.ts, podcasts.ts, faqs.ts
│   │   ├── middleware/        # Route middleware
│   │   │   ├── auth/basic.ts          # Dev password auth fallback (not wired by default)
│   │   │   ├── cloudflare-session.ts  # Cloudflare One Access session hydration
│   │   │   ├── github/callback.ts     # GitHub OAuth callback handler
│   │   │   └── verify/callback.ts     # Email magic link verification handler
│   │   ├── interrupters/      # Request-level interrupters
│   │   │   └── request-firewall.ts  # Blocks bot/CMS scanner requests
│   │   ├── shared/            # Shared UI bits: apply-form, cta-button, links, status-badge, footer, header, etc.
│   │   ├── document.tsx       # HTML document shell
│   │   ├── headers.ts         # CSP + security headers middleware
│   │   └── styles.css
├── content/                   # Content Collections source
│   ├── topics/                # *.md — application topic definitions (id, label, content)
│   ├── events/                # *.md — community events (id, date, location, speakers, content)
│   ├── podcasts/              # *.md — podcasts (id, name, tagline, logo, sponsor, trailer videoId, hosts, seasons with episodes)
│   ├── faqs/                  # *.md — FAQ entries (question, order, content) rendered on home + FAQPage schema
│   └── playlist/              # *.json — video playlists
├── public/                    # Static assets (favicons, robots.txt, sitemap, manifest)
├── types/                     # Shim type declarations (css.d.ts, rw.d.ts, vite.d.ts)
├── content-collections.ts     # Content Collections config (topics, playlist, events, podcasts, faqs schemas)
├── worker-configuration.d.ts  # Manual Env type declarations (bindings + secrets)
├── wrangler.jsonc             # Cloudflare Workers config — KV, R2, email, queues, secrets
├── vite.config.mts            # Vite build config
└── tsconfig.json
```

## Key Conventions

- **Framework**: RedwoodSDK (`rwsdk`) — RSC-based, React 19, Cloudflare Workers runtime
- **Routing**: Declared in `worker.tsx` — `route()`, `layout()`, middleware chaining via arrays
- **Data flow**: `actions/` for mutations, `queries/` for reads, `middleware/` for auth/oauth/verify
- **Auth**: Cloudflare One Access for admin panel (session middleware hydrated from headers), GitHub OAuth for identity, magic link verify for email
- **AI**: Workers AI Gateway (`createAiGateway` + `createUnified`) — used for story summarization via Llama models
- **Queues**: 5 Cloudflare Queues for background jobs — process-application, send-email, notifications, slack, dead-letter
- **Storage**: KV for fast lookups, R2 for durable backup, Send Email binding for mail
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, `@tailwindcss/typography`
- **Types**: No `npm run generate` needed for worker types — but `pnpm check` runs it
