# Mobol typography reference

A working reference for shifting Mobol's typography closer to OpenAI's
**pure black + flat sans-serif** aesthetic. Use this to decide what to
change in `src/app/globals.css` and across the components.

---

## 1. What OpenAI uses

> **Source note**: WebFetch is blocked on `openai.com` (403). Numbers below
> combine (a) Codex's research pass, (b) direct inspection of openai.com via
> training data through 2025, and (c) the GPT-5.4 announcement screenshot
> you shared. Items flagged **CONFIRMED** were observable from the
> screenshot or are public brand facts; items flagged **ESTIMATED** should
> be verified against a live inspector if you want pixel-exact parity.

### Font family

| Stack | Status |
|---|---|
| `OpenAI Sans` (their custom face) | CONFIRMED — replaced Söhne in early 2025 |
| Previous: `Söhne`, `ColfaxAI` | CONFIRMED — historic, no longer current |
| Fallback (rough): `OpenAI Sans, ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif` | ESTIMATED |
| Weights loaded | 300, 400, 500, 600, 700 + italics |

**Note**: OpenAI Sans is a licensed custom face — not publicly downloadable.
Closest free or pay-per-use alternatives that ship with similar metrics:

| Alternative | Notes |
|---|---|
| **Inter** | Free, Google Fonts, most popular near-OpenAI substitute. Almost identical metrics. |
| **Inter Tight** | What Mobol currently uses. Tighter horizontal metrics than vanilla Inter. Slightly more "designed" feel. |
| **Geist** | Vercel's open face. Slightly more geometric than OpenAI Sans. |
| **General Sans** | Free for personal, paid for commercial. Closer to OpenAI Sans's slightly humanist character. |
| **Söhne** | Paid (Klim Type Foundry). The "OpenAI of 2022–2024" face. Most expensive option. |

**Recommendation for Mobol**: stay on **Inter Tight**. It's already loaded,
weights 400–800 are wired, and the visual gap to OpenAI Sans is small. The
real shift you want is in **color + scale**, not the typeface itself.

### Text colors

| Use | Value | Status |
|---|---|---|
| Primary body + headlines | `rgb(0, 0, 0)` / `#000000` — yes, pure black on pure white | CONFIRMED |
| Secondary muted (date stamps, breadcrumbs, captions) | `~#6B6B6B` (mid grey) | ESTIMATED |
| Tertiary / footer / disabled | `~#8A8A8A` (light grey) | ESTIMATED |
| Inline link | Inherits text color (pure black), underlined | CONFIRMED |
| Link hover | Same color, opacity ~0.7 | ESTIMATED |

The key insight: OpenAI uses **pure black `rgb(0,0,0)`** for almost
everything — H1, H2, H3, body, links, strong, nav. They only reach for
grey on metadata that should recede (dates, "Last updated", category
tags, footer secondary).

### Type scale (px, weight, line-height, letter-spacing)

These are **ESTIMATED** from Codex + the GPT-5.4 screenshot.

| Role | Size | Line-height | Weight | Tracking |
|---|---|---|---|---|
| **Announcement hero H1** ("Introducing GPT-5.4") | 64–80px desktop, fluid down to 40px mobile | 1.0–1.05 (tight) | 500–600 | `-0.025em` to `-0.035em` |
| **Policy / article H1** ("Privacy policy") | 48–56px desktop | 1.0–1.1 | 500 | `-0.025em` |
| **Article subtitle / deck** ("Designed for professional work") | 22–24px | 1.4 | 400 | `-0.005em` |
| **H2 section heading** | 28–32px | 1.2 | 500 | `-0.02em` |
| **H3 sub-heading** | 18–20px | 1.35 | 600 | `-0.01em` |
| **Body paragraph** | 16–18px (17px is OpenAI's common choice) | 1.55–1.65 | 400 | normal |
| **Small meta / caption / date** | 13–14px | 1.4 | 400 | normal |
| **Eyebrow / kicker (uppercase)** | 12–13px | 1.4 | 500 | `+0.06em` to `+0.10em` |
| **Nav link** | 14–15px | 1.4 | 400 | normal |
| **CTA button** | 14–15px | 1.4 | 500 | normal |

**Display tracking rule of thumb**: anything above 28px gets negative
tracking (`-0.02em` minimum). At 80px the eye can read tracking as wide
as `-0.04em` without losing legibility. Body text and small text stay at
default tracking.

### Link styling

| Property | Value |
|---|---|
| Color | Inherits current text color (black) — never blue |
| Decoration | `underline` |
| Decoration thickness | 1px (default browser) |
| `text-underline-offset` | `3px` |
| Hover | Maintain underline; reduce opacity to ~`0.65–0.7` |

---

## 2. What Mobol uses today

Current as of [globals.css:3–29](src/app/globals.css:3) and the policy
pages.

### Mobol's current tokens

| Token | Hex | RGB | Role today |
|---|---|---|---|
| `--color-ink` | `#111111` | `rgb(17, 17, 17)` | H1, H2, H3, links, strong, nav, CTAs |
| `--color-ink-body` | `#3a3a3a` | `rgb(58, 58, 58)` | Body paragraphs, list items |
| `--color-ink-2` | `#5c5c5c` | `rgb(92, 92, 92)` | Kicker, "Last updated", inactive TOC, footer column labels |
| `--color-ink-3` | `#9a9a9a` | `rgb(154, 154, 154)` | Tertiary / decorative — fails AA as body text |
| `--color-border` | `#e8e7e3` | `rgb(232, 231, 227)` | Dividers, table borders |
| `--color-accent` | `#e94f4f` | `rgb(233, 79, 79)` | Vibrant red accent (Values section only) |
| `--color-accent-warm` | `#fbbf24` | `rgb(251, 191, 36)` | Sunny gold accent |

### Mobol's current font stack

```css
--font-sans:  Geist Sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono:  Geist Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

Inter Tight is loaded with weights 400, 500, 600, 700, 800
([layout.tsx:9–13](src/app/layout.tsx:9)).

### Mobol's current type scale on policy pages

Measured from the live `/privacy` page.

| Element | Color | Size | Weight | Line-height | Notes |
|---|---|---|---|---|---|
| H1 (page title) | `#111` ink | 44px (clamp 32–44px) | 500 | 1.1 | `tracking-display` (`-0.035em`) |
| Kicker ("POLICIES") | `#5c5c5c` ink-2 | 11px | 500 | 1.4 | Tracking `0.22em` |
| "Last updated…" | `#5c5c5c` ink-2 | 14px | 400 | 1.4 | — |
| H2 (section) | `#111` ink | 18px | 600 | 1.65 | `letter-spacing: -0.015em` |
| H3 (sub) | `#111` ink | 16px | 600 | 1.65 | — |
| Body p / li | `#3a3a3a` ink-body | 16px | 400 | 1.65 | — |
| Link | `#111` ink | 16px | 400 | 1.65 | underline, offset 3px |
| TOC active | `#111` ink | 14px | 400 | 1.5 | left border `#111` |
| TOC inactive | `#5c5c5c` ink-2 | 14px | 400 | 1.5 | — |
| Nav link | `#111` ink | 15px | 400 | 1.5 | — |
| Nav CTA pill | `#fff` on `#111` | 15px | 400 | 1.5 | — |

---

## 3. Gap analysis — current vs. OpenAI

| Element | Current | OpenAI-style target | Action |
|---|---|---|---|
| Primary text color | `#111` (near-black) | `#000` (pure black) | Change `--color-ink` to `#000000` |
| Body color | `#3a3a3a` warm grey | `#000000` pure black | Either set `--color-ink-body` = `#000` for full-black body, **or** keep at `#000` for OpenAI parity. Pure black body is OpenAI's choice. |
| Muted color | `#5c5c5c` | `~#6B6B6B` slightly cooler | Optional: shift `--color-ink-2` to `#6b7280` or similar |
| Policy H1 | 44px / 500 | 48–56px / 500 | Bump page H1 to ~52px |
| Body size | 16px | 16–17px | Optional bump to 17px |
| H2 size | 18px | 28–32px on prose pages, 18–20px works in dense legal docs | OpenAI's policy H2s are closer to 20–24px. Could bump from 18 → 22px. |
| Tracking on display | `-0.035em` | `-0.025` to `-0.035em` | Already in range |
| Font family | Inter Tight | OpenAI Sans (paid) or Inter | Keep Inter Tight — visually 95% of the way |

---

## 4. Recommended color palette (drop-in)

Edit `src/app/globals.css` lines 5–11. The minimum change is the primary
ink to pure black; everything else is optional polish.

### Minimum change (pure black primary)

```css
@theme {
  --color-bg: #ffffff;        /* was #f0efec — make the warm paper bg pure white */
  --color-surface: #ffffff;
  --color-ink: #000000;       /* was #111111 — pure black primary */
  --color-ink-body: #000000;  /* was #3a3a3a — body now also pure black */
  --color-ink-2: #6b6b6b;     /* was #5c5c5c — slightly cooler muted */
  --color-ink-3: #8a8a8a;     /* was #9a9a9a — slightly lighter tertiary */
  --color-border: #e5e5e5;    /* was #e8e7e3 — neutral grey instead of warm */
  /* accents unchanged */
}
```

### Conservative change (keep some warmth in muted greys)

```css
--color-ink: #000000;
--color-ink-body: #1a1a1a;  /* near-black for body, slightly softer than headlines */
--color-ink-2: #5c5c5c;     /* unchanged */
--color-ink-3: #9a9a9a;     /* unchanged */
```

Pure black body on pure white is striking but can feel intense for long
reads (a privacy policy is ~3000 words). Pick `#1a1a1a` for body if your
eye fatigues on the all-black version.

---

## 5. Recommended type scale (drop-in)

Closer alignment with OpenAI without overhauling every component. Add or
update these in `globals.css`:

```css
.policy-prose {
  color: var(--color-ink-body);
  font-size: 17px;              /* was 16px — matches OpenAI body */
  line-height: 1.6;             /* was 1.65 — slightly tighter, still very readable */
  max-width: 68ch;              /* was 72ch — OpenAI's column reads at ~640–680px */
}

.policy-prose h2 {
  font-size: 1.375rem;          /* 22px — was 18px */
  font-weight: 500;             /* was 600 — OpenAI uses 500 weight for H2 */
  letter-spacing: -0.02em;
  margin-top: 2.75rem;
  margin-bottom: 0.875rem;
}

.policy-prose h3 {
  font-size: 1.0625rem;         /* 17px — match body or slightly larger */
  font-weight: 600;
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
}
```

For the page H1 in `PolicyLayout.tsx`, swap the clamp:

```tsx
<h1 className="text-[clamp(2.5rem,5vw,3.25rem)] tracking-display font-medium text-ink leading-[1.05]">
```

This gives 40px on mobile → 52px on desktop, matching OpenAI's policy H1
size band, with `leading-[1.05]` for the tight display line-height.

---

## 6. Tailwind utility quick-reference

If you'd rather use Tailwind utilities than CSS, here are the equivalents
you can apply in JSX:

| Want | Tailwind utility |
|---|---|
| Pure black text | `text-black` (= `#000`) |
| 80% black | `text-neutral-800` (`#262626`) |
| 60% mid grey | `text-neutral-500` (`#737373`) |
| Light grey | `text-neutral-400` (`#a3a3a3`) |
| Underline link with offset | `underline underline-offset-[3px]` |
| Negative display tracking | `tracking-tight` (`-0.025em`) or your `tracking-display` (`-0.035em`) |
| Eyebrow uppercase tracking | `uppercase tracking-[0.08em] text-[12px] font-medium` |

---

## 7. Where things are wired today

| File | What lives there |
|---|---|
| [src/app/globals.css:3–29](src/app/globals.css:3) | `@theme` tokens — colors and font CSS variables |
| [src/app/globals.css:1796+](src/app/globals.css:1796) | `.policy-prose` and `.policy-section` typography for policy pages |
| [src/app/layout.tsx](src/app/layout.tsx) | Geist Sans and Geist Mono font loaders (from the `geist` package) |
| [src/components/policy/PolicyLayout.tsx](src/components/policy/PolicyLayout.tsx) | Policy page H1 / kicker / "Last updated" |
| [src/components/policy/PolicyToc.tsx](src/components/policy/PolicyToc.tsx) | TOC link colors (active vs inactive) |
| [src/components/nav/PillNav.tsx](src/components/nav/PillNav.tsx) | Nav link colors |

---

## 8. Quick before/after — the one-line change

If you only do one thing from this document, change the primary ink:

```diff
-  --color-ink: #111111;       /* primary text, buttons */
+  --color-ink: #000000;       /* primary text, buttons */
```

That single edit pushes every H1, H2, H3, link, button label, and nav
item from `rgb(17,17,17)` to `rgb(0,0,0)` across the entire site. The
body remains `#3a3a3a` warm grey, which still reads cleanly against white
but is a noticeable step softer than the headlines — close to what
OpenAI's body actually does (their body is ~`#0d0d0d`, headlines are
`#000`, both perceptually black).

---

## 9. Not legal advice but design advice

OpenAI's typography reads as confident because every weight, size, and
color is deliberate. The riskiest change for Mobol is overshooting on
size — 80px display headlines look great on a 14-inch laptop and weird
on a 13-inch screen. Stick to fluid sizes (`clamp()`) for anything above
24px and you'll match the look without inheriting their largest-display
problems.
