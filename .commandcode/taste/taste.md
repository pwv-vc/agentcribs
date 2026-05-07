# brand

See [brand/taste.md](brand/taste.md)

# ui

- Use single-column layout (no two-column grids) for form fields in the apply form. Confidence: 0.65

# css

- For dark mode: Use sage green accent colors matching the light theme instead of orange/different tones for buttons and accents. Confidence: 0.70
- Use white backgrounds for cards in light mode to improve text contrast and readability. Confidence: 0.75
- Use alternating row colors (zebra striping) for list/table views to improve scanability. Confidence: 0.75

# cli

- Never run `npx wrangler deploy --dry-run` to verify builds; use `pn build`, `pn generate`, or `pn check` instead. Confidence: 0.85

# cloudflare
See [cloudflare/taste.md](cloudflare/taste.md)
# data

- Query files in `src/app/queries/` should use content collections instead of redefining them inline. Confidence: 0.65
- Always use specific query files by domain (e.g., `playlist.ts`, `user.ts`) rather than lumping unrelated queries into a generic file like `application.ts`. Confidence: 0.85
- Apply data transformations like sorting in the query layer (server queries), not in page components. Confidence: 0.60
- When exporting/downloading R2 data, include ALL keys/objects (all applications), not filtered subsets like only "accepted" status. Confidence: 0.70
- Sort AI analysis results (how heard, story themes) by count in descending order (most frequent first). Confidence: 0.75

# logging

- Remove console debug/log statements from server action files and middleware before considering them complete — don't leave `log()` calls or `console.log` in production code. Confidence: 0.65

# code-style

- Use numeric separator underscores (e.g., `1_000` instead of `1000`) for readable large number literals. Confidence: 0.70
- Extract page inline markup into reusable UI components to DRY up large page files. Confidence: 0.60
- Place domain-specific shared components in subdirectories under `src/app/components/` (e.g., `src/app/components/events/`) rather than directly in `src/app/shared/`. Confidence: 0.70
- Keep constants/helpers scoped to their domain file — don't add non-domain-specific utilities (like a general-purpose `APP_URL` or `getAppUrl`) to a domain-specific file like `c15t.ts`. Instead, place general-purpose constants in their own dedicated lib file. Confidence: 0.65

# security

- Include `i.ytimg.com` in the `img-src` Content-Security-Policy directive when the project embeds YouTube videos. Confidence: 0.70
- Include `images.lumacdn.com` and `cdn.lu.ma` in the `img-src` Content-Security-Policy directive when displaying Luma event cover images and host avatars. Confidence: 0.70

# icons
- Store all icon components in `src/app/components/icons/` with individual component files and a barrel export `index.ts`. Confidence: 0.70

# slack

- Use Slack `button` block elements with `type: "button"`, `text`, and a `url` property — do NOT use `action_id` (which triggers Slack interactivity warnings). Use a simple link button with `url` pointing to the app URL, without `action_id` or interactive component configuration. Confidence: 0.70

# c15t

- Use `mode: 'hosted'` with a backend URL for c15t in production projects, not `mode: 'offline'` (which is only for prototyping). Confidence: 0.70
- Extract duplicated URL strings like `/api/c15t` into a shared constant (e.g., in a config or constants file) rather than hardcoding them in both consent config and worker route definitions. Confidence: 0.65
- Use `extractRelevantHeaders` from `@c15t/react/server` to forward relevant geo/locale headers to the c15t backend instead of manually stripping hop-by-hop headers. Confidence: 0.65

# rwsdk

- Structure auth/session middleware as middleware that populates `ctx` (e.g., `ctx.session`, `ctx.user`) rather than as interrupters that return a Response — session middleware should enrich context, not short-circuit the request chain. Confidence: 0.50
- Name Cloudflare-specific session middleware `cloudflareSessionMiddleware` (not the generic `sessionMiddleware`) and scope it only to admin routes via `route(path, [middleware, handler])` rather than placing it at the app level. Confidence: 0.65
- When using c15t in hosted mode with RedwoodSDK, proxy c15t backend requests through the app's own domain (e.g., `/api/c15t` → c15t backend) as a performance optimization to reduce DNS lookups. Confidence: 0.70

# documentation

- Keep AGENTS.md concise and optimized for prompt context windows — include only essential information (commands, project structure, key conventions) with minimal detail, so coding agents can quickly find context and explore the codebase. Confidence: 0.70
- Always keep README.md up to date with current features, project structure, and environment variables/secrets needed to run the project. Confidence: 0.70
- Always keep AGENTS.md up to date with current project structure and conventions so coding agents don't need to re-explore the codebase. Confidence: 0.70
