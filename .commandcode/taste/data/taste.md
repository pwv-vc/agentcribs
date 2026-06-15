# data
- Query files in `src/app/queries/` should use content collections instead of redefining them inline. Confidence: 0.65
- Always use specific query files by domain (e.g., `playlist.ts`, `user.ts`) rather than lumping unrelated queries into a generic file like `application.ts`. Confidence: 0.85
- Apply data transformations like sorting in the query layer (server queries), not in page components. Confidence: 0.70
- When exporting/downloading R2 data, include ALL keys/objects (all applications), not filtered subsets like only "accepted" status. Confidence: 0.70
- Sort AI analysis results (how heard, story themes) by count in descending order (most frequent first). Confidence: 0.75
- For event-related lookups (e.g., "next upcoming event" for application approval emails), use the content collection as the source of truth — not the Luma API. Treat the content collection as the canonical event schedule and store the external Luma URL as an attribute (e.g., `lumaEventUrl`) on each collection entry. Use a `waitlist` flag on collection entries to branch behavior: when the next event is upcoming and `waitlist: true`, the URL is included and the applicant is added directly; when there is no upcoming event, the email omits the event URL/registration code and the applicant is added to the waitlist to be notified of the next event. Confidence: 0.80
