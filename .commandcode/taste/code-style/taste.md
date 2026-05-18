# code-style

- Add concise code comments for important logic, design decisions, flow clarification, and non-obvious behavior — skip comments for self-explanatory code. Confidence: 0.85
- Use numeric separator underscores (e.g., `1_000` instead of `1000`) for readable large number literals. Confidence: 0.70
- Extract page inline markup into reusable UI components to DRY up large page files. Confidence: 0.60
- Place domain-specific shared components in subdirectories under `src/app/components/` (e.g., `src/app/components/events/`) rather than directly in `src/app/shared/`. Confidence: 0.70
- Keep constants/helpers scoped to their domain file — don't add non-domain-specific utilities (like a general-purpose `APP_URL` or `getAppUrl`) to a domain-specific file like `c15t.ts`. Instead, place general-purpose constants in their own dedicated lib file. Confidence: 0.65
- Remove console debug/log statements from server action files and middleware before considering them complete — don't leave `log()` calls or `console.log` in production code. Confidence: 0.65
