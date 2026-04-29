# brand
See [brand/taste.md](brand/taste.md)

# css
- For dark mode: Use sage green accent colors matching the light theme instead of orange/different tones for buttons and accents. Confidence: 0.70

# cloudflare
- Use Cloudflare Email (Send Email binding) for transactional email sending instead of third-party services like Resend or MailChannels. Confidence: 0.50
- Use `env.EMAIL.send({ to, from, subject, html, text })` with the Cloudflare SendEmail binding, typed as `SendEmail` in the `ExportedHandler` generics. Confidence: 0.60
- Use `createAiGateway` from `ai-gateway-provider` with `createUnified` from `ai-gateway-provider/providers/unified` and `generateText` from the `ai` package for Workers AI calls, instead of using the raw `env.AI.run()` binding. Configure `createAiGateway` with `{ accountId, gateway, apiKey }` as string config values (not as a Cloudflare binding). Confidence: 0.80

# data
- Query files in `src/app/queries/` should import topic/list definitions from `data/topics.ts` instead of redefining them inline. Confidence: 0.65
