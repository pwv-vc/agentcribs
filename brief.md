# AgentCribs — Design Brief

## Register

**Brand** for public surfaces (home, apply, community, events, terms, privacy).
**Product** for admin surfaces (dashboard, applications, events).

The public surfaces carry the voice of PWV — confident, curated, technically literate. The admin surfaces are instruments for operators managing applications and events.

## Users and Context

**Public**: Technical founders, senior developers, hands-on builders already working with AI agents and agentic software development. They arrive skeptical of beginner content and want to know: is this community real, curated, and worth their time?

**Admin**: PWV operators reviewing applications, managing events, and monitoring community health. They need speed, clarity, and density — filter, scan, act.

## Product Purpose

AgentCribs is a curated PWV community for people building with AI agents. The public site communicates what the community is, who it's for, and what events are coming. The apply flow collects applications. The admin panel lets operators review, accept, reject, and manage events.

The single most important job: **convince an AI-skeptical technical builder that this community is legitimate and worth applying to**.

## Voice

Confident, direct, technically precise. Not welcoming in a generic way — selective in a way that signals quality. The copy already carries this voice well:
- "This is not a beginner AI meetup. It is a working community for people already building."
- "Space is limited."
- No exclamation points, no marketing filler.

Physical words: **warm, sharp, grounded, curated, real**.

## Anti-References

This must not feel like:
- A generic SaaS landing page (cream + purple gradient, stock illustrations, "revolutionize your workflow")
- A dark-mode terminal aesthetic developer tool (green-on-black mono everywhere)
- A beginner-friendly "learn AI" meetup group
- A typical VC portfolio splash page with headshot grids
- Anything that reads as an AI-generated landing page with centered hero, card grid, and pill buttons as the house style

## Composition

The public surfaces are **Learn → Decide**. Users learn what AgentCribs is through progressive sections (hero, event, community, FAQ), then decide whether to apply. Each section must stand alone — the page is scanned, not read linearly.

The admin surfaces are **Monitor → Operate**. Operators filter applications by status, sort, paginate, download, and drill into individual records. Tables, filters, and quick actions dominate.

Allowed composition lanes: progressive disclosure sections, asymmetric grids, editorial pull-quotes, data tables with filter pills. Avoid: centered hero with card grids below it as the default layout reflex.

## Design Principles

1. **Earn attention through curation, not decoration.** The design should feel authored and deliberate, not template-driven.
2. **Warmth through color, not through filler.** The cream background and green accent already do this work. Don't layer on more.
3. **Typography carries hierarchy.** Bold weights and tight leading for headings; relaxed measure for body. Mono for labels and metadata.
4. **Dark mode is equal, not secondary.** Both modes are designed, not generated.
5. **Density matches purpose.** Landing pages breathe. Admin tables pack information.

## Accessibility

- All interactive elements need visible focus rings (not outline:none without replacement)
- Color contrast meets WCAG AA minimums in both light and dark modes
- Dark mode is respected via system preference with a manual toggle
- `prefers-reduced-motion` is respected where motion exists
- Touch targets minimum 44×44px on interactive elements

## Visual Foundation

### Type
- **Sans/serif**: DM Sans Variable (headings, body)
- **Mono**: DM Mono (labels, metadata, admin badges)
- **Hierarchy**: font-black (900) for headings, normal weight for body, font-mono uppercase for labels
- **Measure**: 720-820px max for body text, single-column form at 640px
- **Leading**: 0.98 (headings), 1.55 (body), 1.05 (subheads)

### Color (Light)
- **Background**: warm cream (`#fff9da`), white cards (`#ffffff`)
- **Text**: black (`#000000`), secondary warm-gray (`#303027`)
- **Accent**: deep green (`#006f1b`), hover (`#005a16`)
- **Brand green**: (`#00d22e`), hover (`#85ffa0`)
- **Borders**: (`#d9d9d9`)
- **Cyan accent**: (`#00d2c8`) — used in SemverFlourish only

### Color (Dark)
- **Background**: black (`#000000`), soft black (`#0a0a0a`), muted (`#111111`)
- **Text**: warm cream (`#f7f2df`), secondary (`#d7d0bb`)
- **Accent**: bright green (`#04d936`), hover (`#58f06f`)
- **Brand green**: (`#00d22e`), hover (`#85ffa0`)
- **Borders**: (`#303027`)

### Color Strategy
A **Statement** commitment level in both modes — the green accent owns a significant portion of interactive surfaces. The warm cream/black backgrounds are tinted neutrals (warmth in light, pure black in dark). The cyan exists only as a decorative flourish, never as a functional color.

### Status Colors (Admin)
- **Unverified**: indigo bg/text pair
- **Pending**: amber bg/text pair
- **Accepted**: green bg/text pair
- **Rejected**: red bg/text pair
- **All**: green bg/text pair

### Spacing
- Generous section padding: `py-16` to `py-24` on brand pages
- Content constrained to `max-w-[1040px]` (brand), `max-w-[1200px]` (admin)
- Forms at `max-w-[640px]`

### Layout
- Single-column with occasional asymmetric sidebars (community section dark panel, event section date block)
- Zebra-striped tables for admin lists
- Section dividers via `border-b border-border`
- No two-column form fields (taste)

### Components
- **CTA Button**: green-filled, bold text, squared, border matches fill
- **Header**: logo + "by PWV" label + "Apply" CTA + dark mode toggle
- **Footer**: SemverFlourish SVG graphic + copyright + legal links
- **Admin nav**: status filter pills (rounded-full), sort toggle, pagination
- **Cards**: dark panel for PWV sidebar; standard bordered sections elsewhere

### Brand Assets
- PWV logo (white SVG on dark backgrounds)
- AgentCribs wordmark in DM Sans bold
- Favicon: SVG/ICO/PNG variants
- OG image at `/og-image.png`
- `"by PWV"` mono label next to logo
