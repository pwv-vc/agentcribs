# data

- Always use specific query files by domain (e.g., `playlist.ts`, `user.ts`) rather than lumping unrelated queries into a generic file like `application.ts`. Confidence: 0.85
- Apply data transformations like sorting in the query layer (server queries), not in page components. Confidence: 0.60
- When exporting/downloading R2 data, include ALL keys/objects (all applications), not filtered subsets like only "accepted" status. Confidence: 0.70
- Sort AI analysis results (how heard, story themes) by count in descending order (most frequent first). Confidence: 0.75
