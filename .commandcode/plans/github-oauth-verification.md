# GitHub OAuth Verification for Application Form

## Goal

During the application flow, let users verify their identity via GitHub OAuth. On verification, we confirm their email matches, grab their GitHub handle (and optionally avatar), and attach it to the application record.

## Flow (End to End)

```
User enters email -> clicks "Verify with GitHub"
  -> Server generates nonce, stores {email} in KV (10min TTL)
  -> Client redirects to GitHub OAuth
  -> GitHub callback at /apply/github/callback?code=X&state=Y
  -> Server validates state, exchanges code for token, fetches emails
  -> Server finds primary verified email, matches against stored email
  -> On match: fetches profile, stores verification result in KV (30min TTL)
  -> Redirects back to /apply?github_state=NONCE
  -> Form reads verification, shows "Verified as @handle ✓"
  -> On submit: include nonce in formData, server consumes verification
  -> Optional fields (githubHandle, githubId, githubAvatarUrl) stored on ApplicationData
```

## Files to Create

### src/app/actions/github.ts

Three exported server actions:

- **startGitHubOAuth(email: string): string** - validates email, generates nonce via crypto.randomUUID(), stores oauth:state:{nonce} -> JSON.stringify({ email, createdAt }) in KV with 600s TTL, returns full GitHub authorize URL with read:user,user:email scope and the nonce as state param

- **getGitHubVerification(nonce: string): object | null** - reads oauth:verify:{nonce} from KV, returns parsed { githubHandle, githubId, githubAvatarUrl, email } or null

- **consumeGitHubVerification(nonce: string): object | null** - same as get but deletes the key after read (one-time use)

### src/app/middleware/github/callback.ts

Route middleware handling GET /apply/github/callback?code=X&state=Y:

1. Read code and state from query params
2. Read oauth:state:{state} from KV - if missing -> redirect /apply?github_error=expired
3. Exchange code for access token via POST https://github.com/login/oauth/access_token
4. Fetch emails: GET https://api.github.com/user/emails with Bearer token
5. Find primary verified email from response
6. Compare with stored email (case-insensitive) - mismatch -> redirect /apply?github_error=email_mismatch
7. Fetch profile: GET https://api.github.com/user
8. Store verification result in KV keyed by new nonce with 1800s TTL
9. Delete original state key
10. Redirect to /apply?github_state={newNonce}

Error translations:
- expired -> "Verification expired. Please try again."
- email_mismatch -> "The GitHub email doesn't match the email you entered."
- no_verified_email -> "Your GitHub account must have a verified primary email."
- api_error -> "Something went wrong. Please try again."

## Files to Modify

### src/app/actions/application.ts

- Add optional fields to ApplicationData: githubHandle?: string, githubId?: number, githubAvatarUrl?: string
- In submitApplication: extract github_state from formData, call consumeGitHubVerification, validate email match (skip GitHub data silently if email changed or verification expired - dont block submission), include GitHub fields in the stored object

### src/app/shared/apply-form.tsx

- Make email input controlled (value={email} onChange={e => setEmail(e.target.value)})
- Add state: email, verification, githubStateNonce, error
- On mount: check URL for github_state and github_error params, call getGitHubVerification, clean URL via replaceState
- Add "Verify with GitHub" button between email and organization fields, disabled when !email
- When verified: show green badge with avatar + "@handle" instead of button
- On submit: append github_state to formData
- Error display as small red text near button

### src/worker.tsx

- Import handleGitHubCallback from @/app/middleware/github/callback
- Add route("/apply/github/callback", handleGitHubCallback) after /apply/thank-you route

### src/app/components/application-detail.tsx

- After email line, add row: if githubHandle exists, show clickable link to https://github.com/{handle}

### src/app/pages/admin/applications.tsx

- Add "GitHub" column in table header after Email
- In table body, show @{handle} as clickable link or em-dash if absent

## Environment Variables (new secrets)

- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- GITHUB_CALLBACK_URL

## Verification

1. pnpm dev - app starts without errors
2. /apply - GitHub button present, disabled when email empty
3. Enter email, click button -> redirects to GitHub OAuth
4. Authorize -> redirects back with green "Verified as @handle" badge
5. Submit -> application stores githubHandle in KV
6. /admin/applications - shows GitHub handle in table and detail view
7. Test errors: expired state, email mismatch, no verified email
8. Submit without GitHub - works as before
