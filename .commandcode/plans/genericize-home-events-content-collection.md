# Plan: Genericize Home Page + Add Events Content Collection

## Overview

Replace all May 6 event hardcoded content across the site with a content-managed events system and generic community-focused copy. The home page hero refocuses on "A Curated Community for Agentic Software Builders." Events become a content collection. Two new public pages list events and show event detail.

---

## 1. Add Events Content Collection

**File**: `content-collections.ts`

Add an `events` collection using the existing pattern (`.md` files with Zod frontmatter schema, no `compileMarkdown` transform):

```ts
const events = defineCollection({
  name: "events",
  directory: "content/events",
  include: "*.md",
  schema: z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    location: z.string(),
    status: z.enum(["upcoming", "past", "current"]),
    isFeatured: z.boolean().default(false),
    speakers: z.array(z.object({
      name: z.string(),
      affiliation: z.string().optional(),
    })),
    content: z.string(),
  }),
});
```

Add `events` to the config array: `content: [topics, playlist, events]`.

---

## 2. Create First Event Content File

**New file**: `content/events/may-6-2026.md`

Frontmatter with all extracted event data (title, date, location, speakers, status "past", isFeatured true). Body is markdown description of the event.

---

## 3. Create Events Query Wrapper

**New file**: `src/app/queries/events.ts`

Three queries following the `serverQuery` pattern from `src/app/queries/topics.ts`:
- `getEvents()` — all events, sorted by date descending
- `getEvent(id)` — single event by id, or `null`
- `getFeaturedEvent()` — first event with `isFeatured: true`, or `null`

Exports `Event` type from `(typeof allEvents)[number]`.

---

## 4. Create Public Events Pages

### 4a. Events List Page

**New**: `src/app/pages/community/events.tsx`

Pattern from `src/app/pages/admin/events.tsx`:
- Async component
- `<Seo>` with title/description
- `try/catch` around `getEvents()`
- Error state: message + back-to-home CTA
- Empty state: "No events yet" message
- List: card per event showing date (formatted via `src/app/lib/formatters.ts`), title, location, status, speakers, link to detail

### 4b. Event Detail Page

**New**: `src/app/pages/community/event-detail.tsx`

- Accepts `{ id: string }` prop
- `<Seo>` with event-specific title/description
- `try/catch` around `getEvent(id)`
- Null/not-found state: "Event not found" + back link (pattern from `src/app/pages/admin/application.tsx`)
- Detail: title, date, location, status badge, speakers list with affiliations, markdown body in a prose container

---

## 5. Add Public Routes

**File**: `src/worker.tsx`

In the public `layout(Layout, [...])` block, add:
```tsx
route("/community/events", EventsList),
route("/community/events/:id", ({ params }) => (
  <EventDetail id={params.id} />
)),
```

Import `EventsList` from `@/app/pages/community/events` and `EventDetail` from `@/app/pages/community/event-detail`.

---

## 6. Rewire Home Page

### 6a. `src/app/pages/home.tsx`

- Import and call `getFeaturedEvent()`
- Pass `featuredEvent` to `<EventSection event={featuredEvent} />`
- Update `<Seo>` title → `"AgentCribs | A Curated Community for Agentic Software Builders"`
- Update `<Seo>` description → generic community-focused description
- Make `schema` JSON-LD `@graph` conditional: include Event node only when `featuredEvent` exists, build it from actual event data
- Genericize FAQPage JSON-LD questions/answers (match FAQ component changes below)
- Genericize WebPage `name` and `description` (remove "May 6")

### 6b. `src/app/components/hero-section.tsx`

- **Remove**: `<p>May 6 in San Francisco</p>` label
- **Change subtitle**: `"Peter Levine + Tom Preston-Werner. One night in San Francisco."` → `"A Curated Community for Agentic Software Builders"`
- **Change body paragraph**: Remove event-specific names/dates/fireside chat. Focus on what AgentCribs is — a community for builders using AI agents.
- **Keep**: CTA button + fallback note (genericize the "cannot attend on May 6" → "cannot attend an upcoming event")

### 6c. `src/app/components/event-section.tsx`

- **Add prop**: `{ event: Event | null }` — import `Event` type from queries
- **If `null`**: Return `null` (don't render section)
- **Render from event data**: `event.title`, `event.date` (formatted), `event.location`, `event.speakers` (names + affiliations), `event.content` (markdown body)
- Keep the same two-column layout structure and visual style

### 6d. `src/app/components/faq-section.tsx`

Replace all 5 FAQ Q&A pairs with generic versions:

| Question | Answer |
|---|---|
| Who should apply? | (keep as-is, already generic) |
| Are AgentCribs events public? | No. AgentCribs events are curated and space is limited. Apply to join AgentCribs first. Selected applicants receive a separate registration invite for events. |
| How do applications work? | Applications are reviewed by our team. Selected applicants receive invitations to upcoming events and community opportunities. If you're not selected for a particular event, you remain on our list for future opportunities online and in person. |
| What if I cannot attend an event? | You should still apply. We will follow up with selected applicants about future AgentCribs opportunities online and in person. |
| Where are events held? | Event locations vary. Venue details are shared with registered attendees for each event. |

**Bottom CTA block**: Genericize heading and description — remove "May 6", "San Francisco", "Peter Levine and Tom Preston-Werner". Use: "Apply to join the community and receive consideration for upcoming events and opportunities." Keep PWV link and contact email.

---

## 7. Update Hardcoded References

### 7a. `src/app/lib/seo.ts`

```ts
export const OG_IMAGE_ALT = "AgentCribs — A curated PWV community for agentic software builders";
```

### 7b. `src/app/pages/apply.tsx`

- Seo `description`: Remove "May 6 event in San Francisco" → "Apply to join the curated AgentCribs community for builders working with AI agents."
- Body paragraph: "Selected applicants will receive consideration for upcoming events and community opportunities."

### 7c. `src/app/pages/thank-you.tsx`

- Line 38: "If you're selected for the May 6 event in San Francisco, you'll receive a separate registration invite with event details." → "If you're selected for an upcoming event, you'll receive a separate registration invite with event details."

### 7d. `src/app/pages/verify-success.tsx`

- Line 21: "If you're selected for the May 6 event in San Francisco, you'll receive a separate registration invite with event details." → "If you're selected for an upcoming event, you'll receive a separate registration invite with event details."

### 7e. `public/llms.txt`

- Remove specific event date (May 6, 2026), location (San Francisco), speaker names
- Replace with: "AgentCribs hosts periodic in-person and online events for the community."
- Remove "Event", "Event date", "Event location", "Featured conversation" lines from Key Facts
- Keep rest of the structure

---

## 8. Files NOT Changed

- `src/app/components/community-section.tsx` — no May 6 references, stays as-is
- `src/app/components/how-it-works-section.tsx` — dead code, not imported anywhere
- `src/app/components/pwv-section.tsx` — dead code, not imported anywhere
- `src/app/actions/email.tsx` — the hardcoded Luma URL (`tbgovtd2?tk=...`) stays for the accepted email template since it's the actual invite link
- `src/app/emails/accepted.tsx` — generic template, no May 6 references
- All admin pages (`src/app/pages/admin/*`) — unrelated

---

## Verification

1. `pnpm check` — TypeScript and wrangler checks pass
2. `pnpm build` — Content collections generate `allEvents` successfully
3. Manual review of:
   - Home page: hero is community-focused (no event date/location), event section shows featured event or is absent, FAQs are generic
   - `/community/events` page: shows at least the May 6 event card
   - `/community/events/may-6-2026` page: shows full event detail
   - Apply page: no May 6 references
   - Thank-you/verify-success pages: generic event language
   - `llms.txt`: no specific event references
   - `og:image:alt` meta tag across pages: generic
