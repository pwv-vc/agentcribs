# Design Checkup — AgentCribs

**Date**: 2026-06-15
**Score**: 49/60 (↑2 since prior checkup)

---

## Vitals

| Vital Sign | Status | Score |
|---|---|---|
| Intentionality | Healthy | 9/10 |
| Readability | Healthy | 9/10 |
| Usability | Healthy | 8/10 |
| Responsiveness | Healthy | 9/10 |
| Speed | Healthy | 9/10 |
| Accessibility | Critical | 5/10 |

---

## Changes Since Last Checkup

### Resolved
- **Dark mode toggle touch target** (P0): Changed from `size-9` (36×36px) to `size-11` (44×44px). Now meets WCAG 2.5.5 minimum. ✓
- **CTA button border-radius**: Changed from `rounded-lg` to `rounded-none`. The CTA now has its own distinct shape, reducing the "every border-radius is the same" watch concern. ✓

### Corrected
- **Safe-area handling**: The previous checkup reported no `env(safe-area-inset-*)` handling. This was incorrect — `pb-[env(safe-area-inset-bottom)]` exists in the default layout's `<main>` and `pb-[max(2rem,env(safe-area-inset-bottom))]` exists in the footer. The responsive score was undervalued. ✓

### Unresolved (carried forward)
- **No visible focus indicators** on header nav, footer links, filter pills, pagination, CTA button, dark mode toggle (P0)
- **No skip-to-content link** (P1)
- **Body transition-colors not gated behind prefers-reduced-motion** (P1)
- **Submit button disabled until AI summary completes** — no timeout or fallback (P2)
- **No ARIA attributes on admin filter pills** (P2)
- **font-serif token maps to DM Sans** — either intentional or an oversight (Watch)

---

## Vital Sign Details

### 1. Intentionality — Healthy (9/10)

**Evidence of intention**:
- Warm cream background (`#fff9da`) paired with deep green accent (`#006f1b`) is a specific, non-generic palette choice.
- The `rounded-none` CTA button is a deliberate departure from the `rounded-lg` convention used on form inputs — it signals "this is the primary action, it looks different for a reason."
- The SemverFlourish SVG remains unique and domain-appropriate.
- Dark PWV sidebar panel in the community section uses hardcoded values to stay dark regardless of theme.
- DM Sans + DM Mono pairing is deliberate and well-scoped.
- Copy voice is strong and consistent. No exclamation points, no filler.
- The hero leads with "AgentCribs" in massive weight — the brand itself is the hook.

**Watch**: The FAQ section structure is the most conventional part of the page. `font-serif` still maps to DM Sans (same as sans). The hero text sizes top out at `text-8xl` which is a common choice — scaling even larger (`text-9xl`) could make a stronger impression.

### 2. Readability — Healthy (9/10)

**Evidence**:
- Hero heading at `text-8xl` with `leading-none` makes a strong visual anchor. Subtitle at `text-5xl` with `leading-[1.05]` is a clear second step.
- Body measure: `max-w-[720px]` or `max-w-[820px]` at `text-lg` (18px) = approximately 70-75 characters per line. Comfortable.
- Dark mode: `#f7f2df` on `#000000` ≈ 15.2:1 contrast. Light mode: `#000000` on `#fff9da` ≈ 17.4:1.
- Text-secondary in light: `#303027` on `#fff9da` ≈ 9.4:1 — clearly distinguishable.
- Accent green on light: `#006f1b` on `#fff9da` ≈ 5.9:1 — passes AA for normal text.
- Accent green on dark: `#04d936` on `#000000` ≈ 11.3:1 — excellent.
- Form labels are `text-sm font-semibold` with `text-xs` helper text — clear hierarchy.

**Watch**: The `theme-color` meta tags use `#f7f1dc` (light) and `#090907` (dark) which don't match the CSS `--color-bg` values (`#fff9da` and `#000000`). The difference is small but may cause a subtle color flash on some browsers.

### 3. Usability — Healthy (8/10)

**Evidence**:
- Form labels are always visible (never placeholder-only). Required fields marked with red asterisk.
- Form state persists across page transitions via `sessionStorage` and across OAuth redirects via KV storage.
- Email validation happens client-side before submission.
- Error states: red bordered container with red text, GitHub mismatch warning in amber, errors clear when user modifies fields.
- Admin panel has filter pills, sort toggle, pagination, and download dropdown.
- Status badge component is consistent across applications table, detail view, and mobile cards.
- AI story summarization with streaming feedback ("Distilling your story...").
- Dark mode toggle at 44×44px now meets touch target minimum.

**Weaknesses (unchanged from prior checkup)**:
- Submit button disabled when `!summary` — no timeout or fallback for AI summarization failure. User has no alternate submission path.
- No undo or confirmation for status changes in the admin panel.
- Admin table uses `rowspan={2}` — semantically correct but can confuse screen reader navigation order.

### 4. Responsiveness — Healthy (9/10)

**Score upgraded from 8/10.** Safe-area handling was already present in the codebase but was incorrectly flagged as missing in the prior checkup.

**Evidence**:
- `pb-[env(safe-area-inset-bottom)]` on the main element in the default layout.
- `pb-[max(2rem,env(safe-area-inset-bottom))]` in the footer.
- `viewport-fit=cover` in the meta viewport tag.
- Hero text scales: `text-5xl` → `sm:text-7xl` → `md:text-8xl`.
- Section padding: `py-14` → `sm:py-20`, `py-16` → `sm:py-24`.
- Header: "by PWV" label hides on mobile (`hidden sm:inline`).
- Admin nav: `hidden md:flex` for desktop, MobileNav component for narrow.
- Applications table: `hidden sm:block` for desktop, `sm:hidden` for mobile cards.
- Community section: `grid-cols-1` → `lg:grid-cols-[1fr_320px]`.
- Footer: `flex-col` → `sm:flex-row`.
- SemverFlourish has mobile-specific stroke widths, label sizes, and negative margin.
- Apply form: name fields stack on mobile, 2-column on `sm:`.

**Watch**: The PWV sidebar dark panel uses hardcoded colors that don't respond to theme changes — intentional for that component, but limits reuse.

### 5. Speed — Healthy (9/10)

**Evidence**:
- Self-hosted fonts with `font-display: swap` — no invisible text during load.
- Tailwind v4 purges unused CSS at build time.
- RSC-based framework ships minimal client JS.
- SemverFlourish is inline SVG — no extra request.
- No large images on the landing page.
- Dark mode script runs synchronously before paint to prevent FOUC.
- AI summarization uses streaming for progressive feedback.
- `scroll-behavior: smooth` for anchor scrolling.
- Security headers set: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP.
- `modulepreload` for the client entry point.

**Watch**: No visible loading skeletons during page navigation. The RSC framework likely handles this via streaming, but I cannot verify without the dev server running.

### 6. Accessibility — Critical (5/10)

**Score upgraded from 4/10.** The dark mode toggle touch target fix resolves one P0 issue. But the core keyboard/screen-reader issues remain.

**Blocking issues (unchanged)**:
- **No visible focus indicators on links, navigation items, pagination controls, or the dark mode toggle.** Form inputs are the only elements with `focus:ring-1 focus:ring-accent`. The CTA button, header nav links ("Events", "Apply"), footer links, filter pills, pagination prev/next, and dark mode toggle all lack explicit focus styles. Keyboard users tabbing through the page get zero visual feedback. This is the single biggest remaining issue.
- **No skip-to-content link.** Keyboard users must tab through header elements to reach main content on every page load.

**Recently fixed**:
- **Dark mode toggle at 44×44px** (size-11) now meets WCAG 2.5.5 minimum. ✓

**Strengths (what's done right)**:
- Form inputs have `focus:ring-1 focus:ring-accent focus:border-accent`.
- Dark mode toggle has `aria-label="Toggle dark mode"`.
- Form labels are properly associated with inputs via `<label>` wrapping.
- `prefers-reduced-motion` is respected in the SemverFlourish (hides animated signals).
- Status badges and metrics cards use semantic color coding backed by text labels (not color-alone).
- Submit button disabled communicates via `opacity-50` (visual, but lacks text explanation).

**Additional gaps**:
- `transition-colors duration-200` on `<body>` is not wrapped in a `prefers-reduced-motion: no-preference` query.
- The admin table's `rowspan` pattern may confuse screen reader navigation order.
- No ARIA attributes on status filter pills (no `role="list"`, `aria-current`, or `aria-pressed`).
- Submit button disabled state communicates exclusively through `opacity-50` with no text explanation visible to all users.
- No `role="navigation"` on `<nav>` elements.
- Pagination disabled "Previous"/"Next" spans use only `opacity-40` with no `aria-disabled` attribute.

---

## Composition Check

**Public surfaces (Learn → Decide)**: ✅ Progressive section structure (hero → community → event → FAQ → CTA) works. Each section passes the "stand alone" test. The hero leads with the brand name and category, not a generic headline. The community section's border-l-4 accent pull quote is a strong visual hook.

**Admin surfaces (Monitor → Operate)**: ✅ Filter pills, sort toggle, pagination, metrics grid, and leaderboards support scanning and acting. Zebra-striped table rows improve scanability. The composition matches the work.

---

## Prescriptions

### Critical — Fix immediately

1. **Add visible focus indicators to all interactive elements.** Apply `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2` (or equivalent) to:
   - Header nav links ("Events", "Apply")
   - Footer links ("Terms", "Privacy", "PWV")
   - CTA button (`CtaButton` component)
   - Dark mode toggle (`DarkModeToggle`)
   - Filter pills (admin applications page)
   - Pagination prev/next links
   - The admin "Sort toggle" link
   - All `<a>` elements in `CommunitySection`, `EventSection`, `FaqSection`
   - The "Learn more about PWV" link in the community section

   → Use `/design interaction` to address systematically.

2. **Add a skip-to-content link** as the first focusable element in the `<body>`. Standard pattern: visually hidden until focused, then shown at top of viewport.

   → Add to `document.tsx` or `default.tsx` layout.

3. **Wrap `transition-colors` on body in a `prefers-reduced-motion: no-preference` query.** Add to `styles.css`.

### Watch — Address soon

4. **Add ARIA attributes to admin filter pills**: `role="list"` on the container, `aria-current="page"` on the active pill. Add `aria-label` to the sort toggle link.

5. **Consider a fallback for the disabled submit button** when AI summarization hangs or fails — a timeout that re-enables the button with a warning, or a "Submit without summary" option.

6. **Make `font-serif` intentional or remove it.** Currently maps to DM Sans (same as sans). Source Serif 4 is in the project dependencies — if serif styling is wanted, wire it up. If not, remove the token.

7. **Align `theme-color` meta tags with CSS variables.** Use `#fff9da` (light) and `#000000` (dark) instead of `#f7f1dc` and `#090907`.

8. **Add `aria-disabled="true"` and `role="link"`** to the inactive pagination prev/next spans to communicate their state to screen readers.

---

## Next Steps

1. `/design interaction` — Add focus indicators, ARIA attributes, touch target audit
2. `/design motion` — Audit reduced-motion compliance for body transition
3. `/design surface` — Harden states: loading skeletons, submit fallback, error recovery
