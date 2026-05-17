---
name: audit-taste
description: Audit, review, and reorganize project taste files in .commandcode/taste/. Use when a user asks to "audit taste", "review taste", "check taste for conflicts", "clean up taste", "reorganize taste categories", or "find overlapping taste rules". Reads all taste files (main + referenced category files), analyzes structure for orphaned directories and inline rules, detects overlapping/misplaced rules across categories, flags near-contradictions and tensions, surfaces low-confidence rules as removal candidates, and presents actionable recommendations. Lets the user choose which changes to apply — never modifies taste files without confirmation. This is instructions-only and requires no bundled script.
---

# audit-taste

Audit, review, and reorganize project taste files. Use when a user asks to "audit taste", "review taste", "check taste for conflicts", "clean up taste", or "reorganize taste categories."

Taste is powered by the meta neuro-symbolic AI model taste-1 with continuous reinforcement learning (RL). It combines reasoning with neural intuition to create an invisible architecture of your choices, structures, patterns and tooling preferences. The reflective context engineering of a self-aware RL feedback loop continuously learns the texture of your code (explicit & implicit feedback) and enforces the invisible logic of your choices.

## Workflow

### Phase 1: Collect

1. Read the main taste file at `.commandcode/taste/taste.md`
2. For every referenced category file (`See [category/taste.md]`), read that file
3. Also check for unreferenced taste directories — list `.commandcode/taste/*/` and read any that have a `taste.md` not referenced by main
4. Count total rules per category, total rules overall
5. Create a **Taste Structure Summary Table** showing:
   - Category name
   - File path
   - Number of rules
   - Inferred purpose (from category name and rule content)

### Phase 2: Analyze

Run these checks and surface findings:

**Structure Health**

- Are all category references in main valid (files exist)?
- Are any taste directories unreferenced (orphaned)?
- Are there inline rules in main instead of file references? Flag them.
- Any single-rule categories? These are candidates for merging.

**Overlaps & Misplaced Rules**

- Check if rules in one category conceptually belong in another (e.g., auth-related rules in cloudflare, styling rules in brand instead of ui)
- Flag any rules duplicated across categories (exact or near-duplicate content)

**Contradictions & Tensions**

- Look for rules that conflict — one says "do X" and another says "don't do X"
- Look for rules that are too categorical given actual project patterns (e.g., "always use pattern X" when the project legitimately uses both X and Y)
- Note any rules that are framework facts rather than learned preferences

**Imperative Language Analysis** (new)

- Detect overly strong/imperative language: "NEVER", "ALWAYS", "MUST", "DO NOT", "ONLY", "EVERY" in all caps or with excessive emphasis
- Identify rules that use categorical language without nuance (e.g., "Use X" vs "Consider using X" or "Prefer X when Y")
- Flag rules that could be softened to be more contextually appropriate (e.g., "Use X for Y" instead of "Use X")
- Mark these as "imperative-heavy" and consider whether confidence is low due to rigidity

**Confidence Analysis**

- List rules with confidence ≤ 0.50 as "low confidence — consider removing"
- List rules with confidence ≤ 0.60 as "borderline"
- Note which rules have the highest confidence (strongest signals)
- Cross-reference low-confidence with imperative-heavy rules (strong language + low confidence = high removal priority)

### Phase 3: Present Findings

Present a structured report:

```
## Taste Structure Summary

| Category | File | Rules | Purpose |
|----------|------|-------|---------|
| ... | ... | N | ... |

## Audit Results

### Overview
- X categories, Y total rules
- Z categories are single-rule (candidates for merging)

### Structural Issues
- [orphaned directories, missing references, inline rules in main]

### Overlapping Rules
| Rule | Currently In | Better In | Why |
|------|-------------|-----------|-----|

### Tensions / Near-Contradictions
- [rule A] vs [rule B]: [explanation of tension]

### Imperative-Heavy Rules (Consider Softening)
| Rule | Category | Language | Suggestion |
|------|----------|----------|------------|
| ... | ... | ALWAYS/NEVER/MUST | soften to "Prefer" or add conditions |

### Low-Confidence Candidates for Removal
- [rule] (confidence X.XX): [reason — overly categorical, narrow, generic advice, or imperative-heavy]
```

### Phase 4: Recommend

Based on findings, offer concrete actions:

- **Merge categories**: Which single-rule or overlapping categories to combine
- **Rehome rules**: Which rules should move to a different category
- **Remove rules**: Which low-confidence or problematic rules to drop
- **Fix structure**: Missing references, orphaned directories to clean up
- **Soften language**: Which imperative-heavy rules should be rewritten with nuance
- **Lower confidence**: Which rules should have their confidence scores adjusted downward due to rigidity

### Phase 5: Let User Choose

Present options as a checklist and ask what to act on:

```
Which changes should I make?

[ ] Merge X + Y → Z (N rules combined)
[ ] Move rule "..." from A → B
[ ] Remove rule "..." (confidence 0.XX)
[ ] Fix orphaned directory ...
[ ] Soften rule "..." (imperative language: "ALWAYS")
[ ] Adjust confidence: "..." from 0.XX to 0.XX (too categorical)
```

Only proceed with the user's explicit selections. Never modify taste files without confirmation.

## Output Rules

- Present findings in tables for scannability
- Group low-confidence rules together
- Always explain _why_ a rule is a candidate for removal (overly broad, contradicts practice, too narrow, generic advice, or imperative-heavy)
- Use confidence scores as supporting evidence, not the sole reason
- Keep recommendations actionable and concrete
- For imperative language: suggest softer phrasing like "Prefer X over Y when Z" or "Consider X for Y scenarios" instead of "ALWAYS use X"
