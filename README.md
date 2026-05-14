# AgentCribs

A curated [PWV](https://www.pwv/com) community for founders, developers, and hackers building tools and workflows for agentic software development.

AgentCribs began as a private gathering of PWV founders and close friends sharing the real tools, workflows, repos, and team practices they use to build software and run companies with AI. Now it's opening selectively to more people already building with agents.

Apply at [agentcribs.com](https://agentcribs.com/).

## Features

- **Application submission** — multi-topic application form with AI-powered story summarization, GitHub OAuth identity verification, and magic-link email verification
- **Applicant accounts** — accounts auto-created on email verification, Cloudflare Access-protected profile and documents pages (JWT-verified)
- **Document uploads** — applicants can upload dossiers and other documents, stored in R2 with D1 metadata. Supports dossier, matches, and cards document types
- **Document viewer** — view documents inline: markdown rendered with typography, JSON pretty-printed, download available for all types
- **Admin dashboard** — metrics, topic/location leaderboards, AI analysis of how-heard and story themes
- **Admin application review** — filterable applications table, accept/reject workflow, email notifications
- **Account management** — admin `/admin/accounts` page to list accounts, backfill from existing applications, bulk backfill with confirmation
- **Event integration** — Luma event listing and guest management

## PWV (Preston-Werner Ventures)

[PWV](https://www.pwv.com/about) is:

- Tom Preston-Werner
- David Price
- David Thyresson

PWV is the fund we wanted as early-stage founders.

We believe in founder-first values, and have a track record of backing category-defining companies from zero to breakout.

More info: [Portfolio](https://pwv.com/portfolio/) and [News](https://pwv.com/news/)

## Setup

### Prerequisites

- Node.js 22+
- A Cloudflare account with Workers, KV, R2, Queues, Workers AI Gateway, and Email Send enabled
- A [Workers AI Gateway](https://developers.cloudflare.com/ai-gateway/) — used for AI-powered story summarization via Llama models. The gateway runs from Cloudflare's edge even in local development (no local model needed).

This is a [RedwoodSDK](https://rwsdk.com) app. Wrangler is already included as a dev dependency via `rwsdk` — no global install needed.

Learn more: [rwsdk.com](https://rwsdk.com) · [docs.rwsdk.com](https://docs.rwsdk.com)

### Cloudflare Bindings

The worker requires these bindings (configured in `wrangler.jsonc`):

| Binding                     | Type         | Purpose                                                                   |
| --------------------------- | ------------ | ------------------------------------------------------------------------- |
| `AGENTCRIBS_KV`             | KV Namespace | Application storage, email dedup, OAuth state, verification tokens        |
| `AGENTCRIBS_R2`             | R2 Bucket    | Durable application backup storage                                        |
| `SEND_EMAIL`                | Send Email   | Transactional email for magic link verification, notifications            |
| `ASSETS`                    | Fetcher      | Static asset serving                                                      |
| `AI`                        | Workers AI   | AI Gateway binding (remote-only)                                          |
| `PROCESS_APPLICATION_QUEUE` | Queue        | Application processing: backup to R2, set email index, enqueue magic link |
| `SEND_EMAIL_QUEUE`          | Queue        | Send magic link verification email                                        |
| `NOTIFICATION_QUEUE`        | Queue        | Send pending-review/accepted/rejected emails + enqueue Slack              |
| `SLACK_QUEUE`               | Queue        | Post notifications to Slack webhook                                       |
| `DEAD_LETTER_QUEUE`         | Queue        | Capture failed queue messages for debugging                               |
| `BACKFILL_ACCOUNTS_QUEUE`   | Queue        | Backfill accounts: create accounts from applications, import documents    |
| `DB`                        | D1 Database  | Relational data: accounts, profiles, documents (Drizzle ORM)              |
| `USER_SESSION_DO`           | Durable Obj  | RedwoodSDK session management (signed cookies via Durable Object)         |

The worker defines 6 queues:

- **`agentcribs-process-application`** — backup to R2, set email index, enqueue magic link
- **`agentcribs-send-email`** — send magic link verification email
- **`agentcribs-notifications`** — send pending-review/accepted/rejected emails + enqueue Slack
- **`agentcribs-slack`** — post notifications to Slack webhook
- **`agentcribs-backfill-accounts`** — scan R2 directories for dossier/matches/cards files matching application ULIDs and create document records
- **`agentcribs-dead-letter`** — capture failed messages from other queues (no retries)

### Required Secrets

Set these via `wrangler secret put <NAME>`:

| Secret                  | Description                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `ADMIN_PASSWORD`        | Password for the admin panel at `/admin` (used by dev/password auth fallback)         |
| `ADMIN_COOKIE_NAME`     | Cookie name for the admin session (defaults to `agentcribs_dev_admin_session`)        |
| `GITHUB_CLIENT_ID`      | GitHub OAuth App client ID                                                            |
| `GITHUB_CLIENT_SECRET`  | GitHub OAuth App client secret                                                        |
| `GITHUB_CALLBACK_URL`   | GitHub OAuth callback URL (e.g. `https://agentcribs.com/apply/github/callback`)       |
| `SEND_EMAIL_FROM`       | From address for transactional emails (defaults to `agentcribs@agentcribs.com`)       |
| `APP_URL`               | Public base URL of the app (e.g. `https://agentcribs.com` or `http://localhost:5173`) |
| `SLACK_WEBHOOK_URL`     | Slack webhook URL for application notifications (optional)                            |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID — used by AI Gateway                                            |
| `AI_GATEWAY_NAME`       | Name of your Workers AI Gateway (e.g. `agentcribs-ai-gateway`)                        |
| `CF_AIG_TOKEN`          | AI Gateway API token — generate via Cloudflare dashboard under AI Gateway → API Keys  |
| `LUMA_API_SECRET`       | Luma API secret for event integration                                                 |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain (e.g. `https://your-team.cloudflareaccess.com`)         |
| `CF_ACCESS_AUD`         | Cloudflare Access application audience tag                                           |

### Local Development

```bash
# Install dependencies
pnpm install

# Generate worker type bindings
pnpm generate

# Generate and apply D1 migrations locally
pnpm migrate:new
pnpm migrate:dev

# Start dev server
pnpm dev
```

The dev server runs on `http://localhost:5173` by default. For local testing of email and GitHub OAuth, copy `example.env` to `.dev.vars` and fill in the required secrets.

### Dev impersonation

In local dev, you can impersonate any account by appending `?as=email` to the URL or setting the `x-dev-email` request header. This bypasses the magic link login flow and directly hydrates the session from D1 (creating the account if needed).

```
# Impersonate an account to view profile and documents
http://localhost:5173/my/profile?as=test@example.com
http://localhost:5173/my/documents?as=test@example.com
http://localhost:5173/my/documents/doc_abc123?as=test@example.com
```

The `?as=` param is automatically preserved on navigation links within profile and document pages. This feature is gated behind `import.meta.env.DEV` — it's stripped in production builds.

### Resetting the local database

To start with a clean D1 database (empty accounts, profiles, documents):

```bash
# Remove local D1 state
rm -rf .wrangler/state/v3/d1

# Remove drizzle metadata so it regenerates fresh
rm -rf drizzle/meta drizzle/*.sql

# Regenerate and apply
pnpm migrate:new
pnpm migrate:dev
```

This drops all local D1 data and recreates the tables from the current schema.

### Bulk Uploading Documents to R2

To bulk-associate dossier, matches, and cards files with applicant accounts, upload files to the R2 bucket in per-type directories. Files must be named with the application ULID prefix:

```
dossiers/{ULID}__Name.md
matches/{ULID}__Name.md
cards/{ULID}__Name.json
applications/{ULID}__Name.json
```

The `{ULID}` prefix (first 26 chars before `__`) is used to look up the application and its associated account. When backfill runs (via admin `/admin/accounts` or the backfill queue), the system scans each directory for matching files and creates document records in D1.

**Local dev — upload via wrangler CLI:**

In local dev (`pnpm dev`), the R2 binding talks to the remote Cloudflare R2 bucket by default. Upload with:

```bash
wrangler r2 object put agentcribs-applications/dossiers/01KQHZRVWCE7P1S4T70Z1Z8XE2__David_Thyresson.md \
  --file ./local-files/David_Thyresson.md
```

To use local R2 emulation (files stored on disk, no remote API calls), add
`"local": true` to the R2 bucket entry in `wrangler.jsonc`, then use the
`--local` flag with wrangler commands:

```bash
wrangler r2 object put agentcribs-applications/dossiers/... --file ./local/... --local
```

**Bulk upload a directory:**

```bash
for f in ./local-files/dossiers/*.md; do
  name=$(basename "$f")
  wrangler r2 object put "agentcribs-applications/dossiers/$name" --file "$f"
done
```

After uploading, trigger backfill from the admin accounts page or re-run backfill for existing accounts to pick up the new documents. Duplicate filenames per user per type are silently skipped (enforced by a unique database constraint).

### Content

Application topics and playlists are managed via [Content Collections](https://www.content-collections.dev/). Markdown topic definitions live in `content/topics/` and JSON playlists in `content/playlist/`. The `@content-collections/vite` plugin generates typed data at build time, consumed by server queries in `src/app/queries/`.

### One-time Setup

1. Create the KV namespace: `wrangler kv namespace create AGENTCRIBS_KV` (update `id` in `wrangler.jsonc`)
2. Create the R2 bucket: `wrangler r2 bucket create agentcribs-applications`
3. Create the 7 queues (names must match `wrangler.jsonc`):
   `wrangler queues create agentcribs-process-application`
   `wrangler queues create agentcribs-send-email`
   `wrangler queues create agentcribs-notifications`
   `wrangler queues create agentcribs-slack`
   `wrangler queues create agentcribs-dead-letter`
   `wrangler queues create agentcribs-backfill-accounts`
   `wrangler queues create agentcribs-account-login`
4. Create a [Workers AI Gateway](https://developers.cloudflare.com/ai-gateway/) — note the gateway name and generate an API key
5. [Create a GitHub OAuth App](https://github.com/settings/developers) with the callback URL set to your `GITHUB_CALLBACK_URL`
6. (Optional) Set up Slack notifications: Create a [Slack webhook](https://api.slack.com/messaging/webhooks) and set it as `SLACK_WEBHOOK_URL` secret

### Authentication

**Admin** (`/admin/*`) is protected by **Cloudflare One Access** in production. Cloudflare's Zero Trust proxy authenticates users and injects `cf-access-authenticated-user-email` headers, which the `cloudflareSessionMiddleware` reads to populate `ctx.session`. In dev mode, admin is unauthenticated.

**Applicant accounts** (`/my/*`) use **magic link login**. Users enter their email at `/login`, a one-time token is stored in KV (1hr TTL) and enqueued via `agentcribs-account-login` queue to send a sign-in email. Clicking the link sets a signed session cookie (via `defineDurableSession`) and redirects to `/my/profile`. Session middleware reads the cookie to hydrate account data from D1. Logout at `/logout` clears the session. If no account exists for the email, no email is sent — the same "check your email" page is shown to prevent account enumeration.

Application verification uses two flows:

- **GitHub OAuth** — verifies applicant identity via GitHub profile. Starts in `actions/github.ts`, handled by middleware at `/apply/github/callback`.
- **Magic link email** — verifies applicant email ownership. A verification link is sent via the `agentcribs-send-email` queue, and the callback at `/apply/verify` validates the token.

### Deploy

```bash
pnpm release
```
sh
pnpm release
```
