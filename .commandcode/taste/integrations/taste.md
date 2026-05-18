# slack

- Use Slack `button` block elements with `type: "button"`, `text`, and a `url` property — do NOT use `action_id` (which triggers Slack interactivity warnings). Use a simple link button with `url` pointing to the app URL, without `action_id` or interactive component configuration. Confidence: 0.70

# c15t

- Use `mode: 'hosted'` with a backend URL for c15t in production projects, not `mode: 'offline'` (which is only for prototyping). Confidence: 0.70
- Extract duplicated URL strings like `/api/c15t` into a shared constant (e.g., in a config or constants file) rather than hardcoding them in both consent config and worker route definitions. Confidence: 0.65
- Use `extractRelevantHeaders` from `@c15t/react/server` to forward relevant geo/locale headers to the c15t backend instead of manually stripping hop-by-hop headers. Confidence: 0.65
- When using c15t in hosted mode with RedwoodSDK, proxy c15t backend requests through the app's own domain (e.g., `/api/c15t` → c15t backend) as a performance optimization to reduce DNS lookups. Confidence: 0.70
