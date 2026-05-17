# ui

- Install @tailwindcss/typography for prose/content styling. Confidence: 0.70
- Use semantic brand theme tokens (text-text, bg-bg-soft, border-border, text-accent, bg-accent, font-serif, font-mono, etc.) instead of hardcoded color values in components — theme tokens adapt to light/dark mode automatically. Confidence: 0.70
- For dark mode: Use sage green accent colors matching the light theme instead of orange/different tones for buttons and accents. Confidence: 0.70
- Use white backgrounds for cards in light mode to improve text contrast and readability. Confidence: 0.75
- Use alternating row colors (zebra striping) for list/table views to improve scanability. Confidence: 0.75
- Store all icon components in `src/app/components/icons/` with individual component files and a barrel export `index.ts`. Confidence: 0.70
- Use single-column layout (no two-column grids) for form fields in the apply form. Confidence: 0.65
