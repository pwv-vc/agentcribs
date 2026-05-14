# auth
- Use Cloudflare Access JWT (Zero Trust) for admin route authentication only — do NOT use it for user account access on `/my/*` routes. Confidence: 0.75
- Use magic link OTP authentication for user account access (login sends OTP magic link email, user clicks link to verify, redirects to `/my/profile`) — not CF Access JWT. Confidence: 0.75
- Use a dedicated Cloudflare Queue to generate magic link verification tokens and send OTP emails, and store short-lived magic link tokens in KV. Confidence: 0.70
- In dev mode, support `?as=email` query param or `x-dev-email` header to simulate authentication, gated behind `import.meta.env.DEV` so it's stripped in production. Confidence: 0.70
- When building links with the `as` impersonation param, only append it when `devEmail` is actually provided (active impersonation) — do not add the `as` param just because the app is in dev mode. Confidence: 0.65
- Group all user-facing authenticated routes under a `/my/*` base path (e.g., `/my/profile`, `/my/documents`), and redirect `/me` to `/my/profile`. Confidence: 0.70
- Login and logout routes should NOT use the `/my` prefix — place them at `/login` and `/logout` directly, since they are public entry/exit points, not authenticated resources. Confidence: 0.60
- Use a dedicated minimal/basic layout for auth routes (login, verify, logout) rather than the main site Layout — auth pages shouldn't show the site header, navbar, or footer. Confidence: 0.70
