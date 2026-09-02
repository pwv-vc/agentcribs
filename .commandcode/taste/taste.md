# brand

See [brand/taste.md](brand/taste.md)

# ui
See [ui/taste.md](ui/taste.md)
# labels

- Capitalize words in format labels (e.g., "In Person" not "In person"). Confidence: 0.80

# css

- For dark mode: Use teal family (`#00d2c8` brand teal / `#88fff8` soft-teal) for buttons and accents, not the dark sage or bright green tones. The user is moving away from dark sage; the accent role shifts to teal, not just lighter greens. Confidence: 0.75
- Use white backgrounds for cards in light mode to improve text contrast and readability. Confidence: 0.75
- Avoid hardcoded black section backgrounds (e.g., `bg-black`) — they break light/dark mode theming. Choose an alternate background color that works in both modes while still being visually distinct from surrounding sections. Confidence: 0.75
- Use alternating row colors (zebra striping) for list/table views to improve scanability. Confidence: 0.75
- Name CSS status color tokens by semantic role (live, scheduled, draft, ended, declined, waitlist) rather than by source domain (event, guest, application) when the same colors serve the same meaning across domains. Confidence: 0.70

# cli

- Never run `npx wrangler deploy --dry-run` to verify builds; use `pn build`, `pn generate`, or `pn check` instead. Confidence: 0.85

# communication

- Sends terse requests (e.g., just "fix" followed by pasted tool warning/error output, or "center cta button"/"center this"/"bold gues names"/"fix the &amp; in ..." with IDE-selected lines as the only context) and expects the direct, minimal edit applied to the referenced code — not exploration or extended explanation. Confidence: 0.93
- Will supply exact URLs/factual values directly (e.g., pasted the trailer's YouTube watch URL after searches stalled) — when a specific external link or fact is needed and quick searches don't find it, ask the user rather than running long web search/fetch chains. Confidence: 0.6
- Use the exact URL the user gives for a link — do not "improve" it by inferring a more specific variant. When asked to link a company name mentioned in a bio (e.g., "GitHub" with https://github.com/), the link targets the company's site, not a personal profile — do not substitute a person's handle (e.g., github.com/mojombo) just because their other social links use it. Confidence: 0.7
- For copywriting requests, explicitly asks for a few short candidate options up front ("give me a few ideas of short call to action copy") — present multiple concise options with visual previews, then wire in the winner once they pick. Confidence: 0.6

# dev-server

- Uses ngrok tunnels with a custom static domain (e.g., `agentcribs.ngrok.dev`) to preview local dev servers. When Vite blocks the tunnel host ("Blocked request. This host ... is not allowed"), add the host to `server.allowedHosts` in vite.config.mts — allow the specific host rather than disabling host checking (`allowedHosts: true`), and note the dev server needs a restart for it to take effect. Confidence: 0.6

# cloudflare
See [cloudflare/taste.md](cloudflare/taste.md)
# data
See [data/taste.md](data/taste.md)
# logging

- Remove console debug/log statements from server action files and middleware before considering them complete — don't leave `log()` calls or `console.log` in production code. Confidence: 0.65

# code-style

- Use numeric separator underscores (e.g., `1_000` instead of `1000`) for readable large number literals. Confidence: 0.70
- Extract page inline markup into reusable UI components to DRY up large page files. Confidence: 0.60
- Place domain-specific shared components in subdirectories under `src/app/components/` (e.g., `src/app/components/events/`) rather than directly in `src/app/shared/`. Confidence: 0.70
- Keep constants/helpers scoped to their domain file — don't add non-domain-specific utilities (like a general-purpose `APP_URL` or `getAppUrl`) to a domain-specific file like `c15t.ts`. Instead, place general-purpose constants in their own dedicated lib file. Confidence: 0.65

# security

- Include `i.ytimg.com` in the `img-src` Content-Security-Policy directive when the project embeds YouTube videos. Confidence: 0.70
- Include `www.youtube.com` in the `script-src` Content-Security-Policy directive when using `react-youtube` (the library dynamically loads the YouTube IFrame API script from that origin). Confidence: 0.70

# youtube

- When YouTube iframe embeds fail (e.g., Error 153), fix the embed issue directly rather than replacing with an image thumbnail fallback — prefer solving the embed problem. Confidence: 0.65
- Include `images.lumacdn.com` and `cdn.lu.ma` in the `img-src` Content-Security-Policy directive when displaying Luma event cover images and host avatars. Confidence: 0.70
- When using `react-youtube` (or any third-party library that extends `React.Component`), the importing file must have the `"use client"` directive — otherwise the dev server will fail with "Class extends value undefined is not a constructor or null". Confidence: 0.70

# icons
See [icons/taste.md](icons/taste.md)
# slack

- Use Slack `button` block elements with `type: "button"`, `text`, and a `url` property — do NOT use `action_id` (which triggers Slack interactivity warnings). Use a simple link button with `url` pointing to the app URL, without `action_id` or interactive component configuration. Confidence: 0.70

# html
- In hero sections, use `<h2>` (not `<p>`) for the tagline/subtitle beneath the `<h1>` to maintain proper semantic heading hierarchy. Confidence: 0.75
- Provide an `onDark` variant prop for components that render on both light and dark surfaces (e.g., link pills, back links), switching between theme tokens (`border-border`, `text-text-secondary`) and fixed white-translucent tones (`border-pwv-white/20`, `text-pwv-white/80`). Confidence: 0.70

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

# seo
- Make SEO and Open Graph tags content-driven — derive per-page title/description/OG image from the content itself (frontmatter fields like `ogImage`, `ogImageAlt`) rather than hardcoding a static site-wide OG image. Confidence: 0.85
- Cache-bust images via a version query param (e.g., `?v=N`) so image updates propagate easily; bumping one number in content/config should refresh all references to those images. Confidence: 0.8
- Make OG image dimensions content-driven too — expose `ogImageWidth`/`ogImageHeight` frontmatter fields rendered as `og:image:width`/`og:image:height` instead of hardcoding pixel sizes (1200×630, 1500×1500) in page components. Confidence: 0.75
- Add `sameAs` arrays to JSON-LD structured data entities (e.g., `PodcastSeries`) from content-driven social/platform links (show URL, LinkedIn, X, Apple) for entity identity. Confidence: 0.70

# screenshots
See [screenshots/taste.md](screenshots/taste.md)
sameAs` arrays to JSON-LD structured data entities (e.g., `PodcastSeries`) from content-driven social/platform links (show URL, LinkedIn, X, Apple) for entity identity. Confidence: 0.70

# screenshots
See [screenshots/taste.md](screenshots/taste.md)
ow URL, LinkedIn, X, Apple) for entity identity. Confidence: 0.70

# screenshots
See [screenshots/taste.md](screenshots/taste.md)
sameAs` arrays to JSON-LD structured data entities (e.g., `PodcastSeries`) from content-driven social/platform links (show URL, LinkedIn, X, Apple) for entity identity. Confidence: 0.70

# screenshots
See [screenshots/taste.md](screenshots/taste.md)
