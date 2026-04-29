# brand

See [brand/taste.md](brand/taste.md)

# css

- For dark mode: Use sage green accent colors matching the light theme instead of orange/different tones for buttons and accents. Confidence: 0.70

# cli

- Never run `npx wrangler deploy --dry-run` to verify builds; use `pn build`, `pn generate`, or `pn check` instead. Confidence: 0.85

# cloudflare

- Use Cloudflare Email (Send Email binding) for transactional email sending instead of third-party services like Resend or MailChannels. Confidence: 0.50
- Use `env.EMAIL.send({ to, from, subject, html, text })` with the Cloudflare SendEmail binding, typed as `SendEmail` in the `ExportedHandler` generics. Confidence: 0.60
- Use `createAiGateway` from `ai-gateway-provider` with `createUnified` from `ai-gateway-provider/providers/unified` and `generateText` from the `ai` package for Workers AI calls, instead of using the raw `env.AI.run()` binding. Configure `createAiGateway` with `{ accountId, gateway, apiKey }` as string config values (not as a Cloudflare binding). Confidence: 0.80

# data

- Query files in `src/app/queries/` should use content collections instead of redefining them inline. Confidence: 0.65

# logging

- Remove console debug/log statements from server action files and middleware before considering them complete — don't leave `log()` calls or `console.log` in production code. Confidence: 0.65

# code-style

- Use numeric separator underscores (e.g., `1_000` instead of `1000`) for readable large number literals. Confidence: 0.70

# slack

- Use Slack `button` block elements with `type: "button"`, `text`, and a `url` property — do NOT use `action_id` (which triggers Slack interactivity warnings). Use a simple link button with `url` pointing to the app URL, without `action_id` or interactive component configuration. Confidence: 0.70
