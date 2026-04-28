# brand
See [brand/taste.md](brand/taste.md)

# cloudflare
- Use Cloudflare Email (Send Email binding) for transactional email sending instead of third-party services like Resend or MailChannels. Confidence: 0.50
- Use `env.EMAIL.send({ to, from, subject, html, text })` with the Cloudflare SendEmail binding, typed as `SendEmail` in the `ExportedHandler` generics. Confidence: 0.60
