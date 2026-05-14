# Plan: Replace CF Access JWT Account Auth with Magic Link OTP

## Overview

Replace the Cloudflare Access JWT-based auth for `/my/*` routes (currently in `account-session.ts`) with an OTP magic link flow — the same pattern used by application verification. Admin auth (`/admin/*`) stays unchanged — keeps using `cloudflare-session.ts` + `access-jwt.ts`.

## User Flow

1. User visits `/my/*` → redirected to `/my/login` (if no session)
2. `/my/login` shows: "Enter your email to sign in" form
3. Submits email → server action looks up account in D1 by email:
   - **Account exists** → generates token, stores `login:${token}` in KV (1hr TTL), enqueues to `ACCOUNT_LOGIN_QUEUE`
   - **No account** → silently does nothing (no KV write, no queue, no email)
   - In both cases → redirects to `/my/login?sent=true`
4. Queue handler calls `sendAccountLoginMagicLink` → sends email with link `/my/verify?token=xxx`
5. `/my/login?sent=true` shows "Check your email" message with: "If you didn't receive an email, check your spam folder and make sure you've applied" with link to `/apply`
6. User clicks link → `/my/verify?token=xxx` middleware looks up KV, looks up account in D1, sets session cookie (via framework's `defineDurableSession`), redirects to `/my/profile`
7. Logout route `/my/logout` clears session cookie, redirects to `/my/login`

---

## New Files

### `src/app/pages/login.tsx`
- Client component with email form
- When `?sent=true`: shows "Check your email" with note: "If you didn't receive an email, check your spam folder and make sure you've applied" with link to `/apply`
- Simple page — no AccountLayout wrapper needed

### `src/app/actions/account.ts`
- `initiateAccountLogin(email: string)` server action
  - Validate email format
  - **Look up account in D1** by email — if no account exists, skip everything and redirect to `/my/login?sent=true` (no KV write, no queue, no email — prevents account enumeration)
  - If account exists: generate `crypto.randomUUID()` token, store `login:${token}` → `{email, createdAt}` in KV with 1hr TTL, enqueue to `ACCOUNT_LOGIN_QUEUE`
  - Redirect to `/my/login?sent=true`

### `src/app/emails/account-login.tsx`
- React Email template similar to `magic-link.tsx`
- Subject: "Sign in to AgentCribs"
- Button: "Sign in to your account" → `/my/verify?token=xxx`
- Text: "This link expires in 1 hour"

### `src/app/middleware/account/verify.ts`
- Route middleware at `/my/verify`
- Reads `token` from query params
- Looks up `login:${token}` in KV → extract email
- Looks up account in D1 by email (created on application verify or auto-created)
- Sets `ctx.session = { ...ctx.session, accountId, email }` — framework persists to signed cookie
- Deletes KV token (one-time use)
- Redirects to `/my/profile`

---

## Modified Files

### `src/app/middleware/account-session.ts` — REWRITE
- **Remove:** All CF Access JWT code (`verifyAccessToken`, `getDevEmail`)
- **Replace with:** Read `ctx.session.accountId` from framework session cookie
- If no `accountId` → redirect to `/my/login` (instead of throwing 401)
- Look up account in D1, hydrate `ctx.session` with `email`, `accountId`, `avatarUrl`
- Dev mode: support `?as=email` by looking up/creating account directly in D1 (no JWT, no magic link)

### `src/app/layouts/account.tsx` — UPDATE
- Line 67: Change unauthenticated sign-in link from `/cdn-cgi/access/login` → `/my/login`
- Line 57: Change logout link from `/cdn-cgi/access/logout` → `/my/logout`

### `src/app/components/account/mobile-nav.tsx` — UPDATE
- Line 71: Change logout link from `/cdn-cgi/access/logout` → `/my/logout`

### `src/worker.tsx` — UPDATE ROUTING
New routes (before the protected AccountLayout block):
```tsx
// Public login + verify — no AccountLayout wrapper
route("/my/login", LoginPage),
route("/my/verify", handleAccountVerification),

// Logout
route("/my/logout", handleAccountLogout),
```

Protected routes stay inside `AccountLayout` but now use the rewritten `accountSessionMiddleware`:
```tsx
layout(AccountLayout, [
  accountSessionMiddleware,  // reads session cookie, redirects to /my/login if unauthenticated
  route("/my/profile", ProfilePage),
  route("/my/documents", DocumentsPage),
  route("/my/documents/:id", ...),
]),
```

Document download route: keep using `cloudflareSessionMiddleware` for now (it handles auth inline). Can migrate later.

### Queue consumer in `src/worker.tsx` — ADD BRANCH
In the `queue()` export, add:
```tsx
} else if (batch.queue === "agentcribs-account-login") {
  await processRetries(batch.queue, batch.messages, async (message) => {
    const payload = message.body as { email: string; token: string };
    await handleAccountLoginMagicLink(payload);
  });
}
```

### `src/app/actions/queue.ts` — ADD HANDLER
```ts
export async function handleAccountLoginMagicLink(payload: { email: string; token: string }): Promise<void> {
  const { email, token } = payload;
  const baseUrl = getAppUrl(env.APP_URL);
  await sendAccountLoginMagicLink({
    sendEmail: env.SEND_EMAIL,
    from: sendEmailFrom(),
    baseUrl,
    email,
    token,
  });
}
```

### `src/app/actions/email.tsx` — ADD FUNCTION
```ts
export async function sendAccountLoginMagicLink({ sendEmail, from, baseUrl, email, token }) {
  const verifyUrl = `${baseUrl}/my/verify?token=${token}`;
  await sendEmail.send({
    from,
    to: email,
    subject: "Sign in to AgentCribs",
    text: accountLoginText({ verifyUrl }),
    html: await render(<AccountLoginEmail verifyUrl={verifyUrl} />),
  });
}
```

### `wrangler.jsonc` — ADD QUEUE
In `queues.producers`:
```jsonc
{ "binding": "ACCOUNT_LOGIN_QUEUE", "queue": "agentcribs-account-login" }
```
In `queues.consumers`:
```jsonc
{ "queue": "agentcribs-account-login", "max_batch_size": 10, "max_batch_timeout": 5 }
```

### `worker-configuration.d.ts` — ADD BINDING
```ts
ACCOUNT_LOGIN_QUEUE: Queue;
```

---

## Files NOT Changed

- `src/app/middleware/cloudflare-session.ts` — unchanged (admin auth)
- `src/app/lib/access-jwt.ts` — unchanged (still used by admin)
- `src/app/middleware/verify/callback.ts` — unchanged (application verification)
- All admin pages and routes — unchanged

---

## Verification

1. Visit `/my/profile` → redirects to `/my/login`
2. Submit email that **has an account** → redirects to `/my/login?sent=true`
3. Submit email that **has no account** → redirects to `/my/login?sent=true` (same UX, no email sent)
4. `/my/login?sent=true` shows: "Check your email" + "If you didn't receive an email, check your spam folder and make sure you've applied" with link to `/apply`
5. Email arrives (account exists) → click link → redirected to `/my/profile`, session active
6. Navigate to `/my/documents` → accessible (session cookie present)
7. Click logout → redirected to `/my/login`, session cleared
8. Admin routes (`/admin/*`) still work with CF Access JWT
9. Dev mode: `?as=email@test.com` on `/my/profile` works directly
10. `pnpm check` passes
