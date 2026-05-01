# brand

See [brand/taste.md](brand/taste.md)

# ui

- Use single-column layout (no two-column grids) for form fields in the apply form. Confidence: 0.65

# css

- For dark mode: Use sage green accent colors matching the light theme instead of orange/different tones for buttons and accents. Confidence: 0.70

# cli

- Never run `npx wrangler deploy --dry-run` to verify builds; use `pn build`, `pn generate`, or `pn check` instead. Confidence: 0.85

# cloudflare

- Use Cloudflare Email (Send Email binding) for transactional email sending instead of third-party services like Resend or MailChannels. Confidence: 0.50
- Use `env.EMAIL.send({ to, from, subject, html, text })` with the Cloudflare SendEmail binding, typed as `SendEmail` in the `ExportedHandler` generics. Confidence: 0.60
- Use `createAiGateway` from `ai-gateway-provider` with `createUnified` from `ai-gateway-provider/providers/unified` and `generateText` from the `ai` package for Workers AI calls, instead of using the raw `env.AI.run()` binding. Configure `createAiGateway` with `{ accountId, gateway, apiKey }` as string config values (not as a Cloudflare binding). Confidence: 0.80
- Add retry-logging to Cloudflare Queue consumers using `message.attempts` so retries are visible in log streams for observability. Confidence: 0.70

# data

- Query files in `src/app/queries/` should use content collections instead of redefining them inline. Confidence: 0.65
- Always use specific query files by domain (e.g., `playlist.ts`, `user.ts`) rather than lumping unrelated queries into a generic file like `application.ts`. Confidence: 0.85
- Apply data transformations like sorting in the query layer (server queries), not in page components. Confidence: 0.60

# logging

- Remove console debug/log statements from server action files and middleware before considering them complete — don't leave `log()` calls or `console.log` in production code. Confidence: 0.65

# code-style

- Use numeric separator underscores (e.g., `1_000` instead of `1000`) for readable large number literals. Confidence: 0.70
- Extract page inline markup into reusable UI components to DRY up large page files. Confidence: 0.60
- Place domain-specific shared components in subdirectories under `src/app/components/` (e.g., `src/app/components/events/`) rather than directly in `src/app/shared/`. Confidence: 0.70

# security

- Include `i.ytimg.com` in the `img-src` Content-Security-Policy directive when the project embeds YouTube videos. Confidence: 0.70
- Include `images.lumacdn.com` and `cdn.lu.ma` in the `img-src` Content-Security-Policy directive when displaying Luma event cover images and host avatars. Confidence: 0.70

# icons
- Store all icon components in `src/app/components/icons/` with individual component files and a barrel export `index.ts`. Confidence: 0.70

# slack

- Use Slack `button` block elements with `type: "button"`, `text`, and a `url` property — do NOT use `action_id` (which triggers Slack interactivity warnings). Use a simple link button with `url` pointing to the app URL, without `action_id` or interactive component configuration. Confidence: 0.70
