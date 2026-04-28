# AgentCribs

A curated [PWV](https://www.pwv/com) community for founders, developers, and hackers building tools and workflows for agentic software development.

AgentCribs began as a private gathering of PWV founders and close friends sharing the real tools, workflows, repos, and team practices they use to build software and run companies with AI. Now it's opening selectively to more people already building with agents.

Apply at [agentcribs.com](https://agentcribs.com/).

## Setup

### Prerequisites

- Node.js 22+
- A Cloudflare account with Workers, KV, R2, and Email Send enabled

This is a [RedwoodSDK](https://rwsdk.com) app. Wrangler is already included as a dev dependency via `rwsdk` — no global install needed.

Learn more: [rwsdk.com](https://rwsdk.com) · [docs.rwsdk.com](https://docs.rwsdk.com)

### Cloudflare Bindings

The worker requires these bindings (configured in `wrangler.jsonc`):

| Binding | Type | Purpose |
|---------|------|---------|
| `AGENTCRIBS_KV` | KV Namespace | Application storage, email dedup, OAuth state, verification tokens |
| `AGENTCRIBS_R2` | R2 Bucket | Durable application backup storage |
| `SEND_EMAIL` | Send Email | Transactional email for magic link verification |
| `ASSETS` | Fetcher | Static asset serving |

### Required Secrets

Set these via `wrangler secret put <NAME>`:

| Secret | Description |
|--------|-------------|
| `ADMIN_PASSWORD` | Password for the admin panel at `/admin` |
| `ADMIN_COOKIE_NAME` | Cookie name for the admin session (defaults to `agentcribs-dev-admin_session`) |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_CALLBACK_URL` | GitHub OAuth callback URL (e.g. `https://agentcribs.com/api/auth/github/callback`) |
| `SEND_EMAIL_FROM` | From address for verification emails (defaults to `agentcribs@agentcribs.com`) |
| `APP_URL` | Public base URL of the app (e.g. `https://agentcribs.com` or `http://localhost:5173`) |

### Local Development

```bash
# Install dependencies
pnpm install

# Generate worker type bindings
pnpm generate

# Start dev server
pnpm dev
```

The dev server runs on `http://localhost:5173` by default. For local testing of email and GitHub OAuth, set the corresponding secrets via wrangler or `.dev.vars`.

### One-time Setup

1. Create the KV namespace: `wrangler kv namespace create AGENTCRIBS_KV` (update `id` in `wrangler.jsonc`)
2. Create the R2 bucket: `wrangler r2 bucket create agentcribs-applications`
3. [Create a GitHub OAuth App](https://github.com/settings/developers) with the callback URL set to your `GITHUB_CALLBACK_URL`
5. (Optional) Set up Slack notifications: Create a [Slack webhook](https://api.slack.com/messaging/webhooks) and set it as `SLACK_WEBHOOK_URL` secret

### Deploy

```bash
pnpm release
```
