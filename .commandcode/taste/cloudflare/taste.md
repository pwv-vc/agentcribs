# cloudflare
- Use Cloudflare Email (Send Email binding) for transactional email sending instead of third-party services like Resend or MailChannels. Confidence: 0.50
- Use `env.EMAIL.send({ to, from, subject, html, text })` with the Cloudflare SendEmail binding, typed as `SendEmail` in the `ExportedHandler` generics. Confidence: 0.60
- Use `createAiGateway` from `ai-gateway-provider` with `createUnified` from `ai-gateway-provider/providers/unified` and `generateText` from the `ai` package for Workers AI calls, instead of using the raw `env.AI.run()` binding. Configure `createAiGateway` with `{ accountId, gateway, apiKey }` as string config values (not as a Cloudflare binding). Confidence: 0.80
- Add retry-logging to Cloudflare Queue consumers using `message.attempts` so retries are visible in log streams for observability. Confidence: 0.70
- When using `generateText` for structured JSON output via AI Gateway, strip markdown code blocks (```json ... ```) from the response before parsing, as LLMs often wrap JSON in markdown even when instructed not to. Confidence: 0.75
- When LLM responses via AI Gateway consistently fail to parse as valid JSON even with cleanup helpers, prefer switching to a more capable model rather than adding increasingly complex parsing workarounds. Confidence: 0.65
- When switching to a more capable model for AI Gateway analysis tasks, use `openai/gpt-5.4-nano` as the preferred model for reliable structured output. Confidence: 0.65
- Include the JSON schema directly in the system prompt when requiring structured LLM output, explicitly instructing the model to respond with JSON matching that schema. Confidence: 0.70
