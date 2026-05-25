# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start Next.js dev server (default port 3000)
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm exec tsc --noEmit` — typecheck (no script alias; strict mode is on)

There are no `lint` or `test` scripts defined.

Both `pnpm-lock.yaml` (untracked, current) and `package-lock.json` (tracked, older) exist — the repo is mid-migration to pnpm, and `pnpm-workspace.yaml` (`allowBuilds: sharp: true`) requires pnpm to honor it. Prefer pnpm.

## Required environment

- `OPENAI_API_KEY` — required by `/api/chat`. Server-side only; never prefix with `NEXT_PUBLIC_`. Copy `.env.example` to `.env.local`.
- `OPENAI_MODEL` — optional override; defaults to `gpt-4o-mini`.

## Stack — all newer than typical training data

- **Next.js 16.2.4** (App Router). Per [AGENTS.md](AGENTS.md), read `node_modules/next/dist/docs/` before writing Next-specific code. APIs and conventions may differ from your training data.
- **React 19.2.4**.
- **AI SDK v6** (`ai`) with `@ai-sdk/openai` v3 + `@ai-sdk/react` v3. The route handler at [src/app/api/chat/route.ts](src/app/api/chat/route.ts) uses v6 patterns: `streamText({ model, messages: await convertToModelMessages(messages) })` returning `result.toUIMessageStreamResponse()`. Older AI-SDK patterns (e.g. `result.toAIStreamResponse()`, sync `convertToModelMessages`) will break.
- **Tailwind v4** with `@theme` directive. Design tokens live in `@theme` blocks in [src/app/globals.css](src/app/globals.css), not a `tailwind.config.ts`. The site uses **Geist Sans + Geist Mono** only (from the `geist` package, exposed as `--font-geist-sans` / `--font-geist-mono`) — wired in [src/app/layout.tsx](src/app/layout.tsx). No serif or italic display face: every headline, body line, and label is Geist Sans for a clean modern look; Geist Mono is reserved for code, kickers, and technical labels. Color palette is OpenAI-style: pure black `#000000` primary, cool greys for muted text, pure white surface. See [font-reference.md](font-reference.md) for the full typography rationale and scale.
- **UI libraries (approved)**: `motion` is the canonical animation library — already installed at `motion@12.38.0` (the rebrand of Framer Motion). Always import from `motion/react`, not `framer-motion`. Use `motion`, `AnimatePresence`, and `useReducedMotion` directly; don't handroll keyframe utilities when a motion primitive will do. shadcn/ui-style component libraries (Radix-based) are also approved when a new accessible primitive (dialog, popover, dropdown, etc.) is needed — prefer those over building from scratch.
- Path alias: `@/*` → `./src/*`.

## Architecture — load-bearing patterns

### Two distinct chat experiences (don't confuse them)

1. **Home-page scripted demo** at [src/components/services/chat/](src/components/services/chat/). **Not real AI.** Driven by [chatScript.ts](src/components/services/chat/chatScript.ts) (a fully scripted ~50s, ~20-turn sequence) and [useChatScript.ts](src/components/services/chat/useChatScript.ts) (a reducer-based phase machine: idle → playing → paused → done/responding, with typewriter and thinking-step reveals scheduled via `setTimeout`). Paused/resumed via `IntersectionObserver` on viewport visibility. Renders rich widgets per message via [widgets/index.tsx](src/components/services/chat/widgets/index.tsx) (a `switch` over the 18+ `ChatWidget` types in [types.ts](src/components/services/chat/types.ts)).
2. **/contact real AI** in [src/app/contact/ChatPanel.tsx](src/app/contact/ChatPanel.tsx). Uses `useChat()` from `@ai-sdk/react` with `DefaultChatTransport` pointing at `/api/chat`.

When the user says "chat", clarify which.

### Nav hide/peek via html data attributes

[src/components/nav/NavHideContext.tsx](src/components/nav/NavHideContext.tsx) writes `data-chat-expanded` and `data-nav-peeking` to the `<html>` element. CSS in [globals.css](src/app/globals.css) targets these attributes for transitions, decoupling JS state from prop drilling. Hysteresis: reveal at 80px, hide at 140px. When changing nav or scroll-coupled styles, preserve this contract.

### Mockup components use a uniform pause pattern

Each `*Mockup.tsx` under [src/components/services/](src/components/services/) (Chat, Builder, Branding, SocialMedia, Seo, Reputation) is a self-contained scripted animation paused/resumed via `IntersectionObserver`. Preserve this when editing — animations should not run off-screen.

### AI demo asset drop workflow

Voice/image/video assets for the home-page chat demo live under [public/ai-demo/](public/ai-demo/). When adding new audio, place files in [public/ai-demo/audio/](public/ai-demo/audio/) (paths already wired in `chatScript.ts`) and flip the matching `ready: true` field for the accent in [chatScript.ts](src/components/services/chat/chatScript.ts). See [public/ai-demo/audio/README.md](public/ai-demo/audio/README.md).

## Policy pages — keep them current

Three legal pages must reflect what the site actually does. They share a layout via [PolicyLayout.tsx](src/components/policy/PolicyLayout.tsx) and styling via `.policy-prose` in [globals.css](src/app/globals.css):

- `/privacy` — [src/app/privacy/page.tsx](src/app/privacy/page.tsx)
- `/terms` — [src/app/terms/page.tsx](src/app/terms/page.tsx)
- `/cookies` — [src/app/cookies/page.tsx](src/app/cookies/page.tsx)

Drafted from OAIC + business.gov.au + ACCC sources for an Australian sole trader (Mobol, ABN 81 902 687 376, WA). **Research-informed, not legal advice.** Contact email throughout: `hello@mobol.com.au`.

### Maintenance triggers

When making any of the following changes, you MUST also edit the listed page(s) and bump the `lastUpdated` prop in `<PolicyLayout lastUpdated="…">` to today's date. Treat this as part of the change, not a follow-up.

| Change you're making | Privacy | Terms | Cookies |
|---|:---:|:---:|:---:|
| Adding a new third-party service (analytics, error tracking, A/B tests, CRM, email provider, CDN, payments) | ✅ `third-parties`, `overseas-disclosures` | — | ✅ `what-we-use` table, `third-parties` |
| Adding a new cookie, localStorage key, or session storage entry | — | — | ✅ `what-we-use` table row |
| Wiring GA4 (banner already stores consent, you just need to gate `gtag` init on `mobol_cookie_consent_v1 === "granted"` and subscribe to the `mobol:consent-changed` event) | ✅ `what-we-collect` (move GA4 out of "when live" hedging), `third-parties` | — | ✅ Confirm `_ga` table row matches what ships |
| Adding a tracking pixel (Meta, LinkedIn, TikTok, X) | ✅ `third-parties` | — | ✅ `what-we-use` table |
| Adding a new data collection point (file uploads, voice capture, persisted chat history, account signup, file storage) | ✅ `what-we-collect`, `retention-security` | ✅ `services` if user-facing | — |
| Switching providers (e.g. OpenAI → Anthropic, Vercel → Cloudflare, GA4 → Plausible) | ✅ `third-parties`, `overseas-disclosures` | ✅ `ai-features` if AI-related | ✅ `what-we-use` table, `third-parties` |
| Adding marketing email or newsletter consent | ✅ `how-we-use`, `your-rights` | — | — |
| Changing limitation-of-liability, dispute, or indemnity terms | — | ✅ `liability`, `disputes`, `indemnity` | — |
| Changing service offerings or pricing model | — | ✅ `services` | — |
| Moving business address or changing governing-law state | ✅ `who-we-are` | ✅ `who-we-are`, `governing-law` | — |
| Changing the public contact email | ✅ every `contact` section (and the layout's footer note) | ✅ `contact` | ✅ `contact` |
| Changing data retention windows | ✅ `retention-security` | — | — |
| Adding a payment gateway (Stripe, Paddle) | ✅ `third-parties`, `what-we-collect` | ✅ `services` (billing terms) | ✅ `what-we-use` (Stripe cookies) |
| Crossing the AU$3M turnover threshold OR starting to handle health/sensitive info | ✅ `who-we-are` — drop the small-business exemption caveat | — | — |
| Tranche-2 privacy reform commencing (expected 2026–2027) | ✅ `who-we-are` — switch from "not strictly bound" to "bound by the APPs" | — | — |

### How to edit a policy

1. Each page exports a `SECTIONS` array of `{ id, label }` for the TOC. If you add or remove a section, keep the array in sync with the `<PolicySection id="…">` blocks in the body — IDs must match exactly or the TOC scroll-spy breaks.
2. Bump `<PolicyLayout lastUpdated="…">` to today's date (format: `12 May 2026`).
3. If you disclose a new third party, link to that provider's privacy URL. Pattern: `<a href="…" rel="noopener">Provider name's privacy policy</a>`.
4. If you add a new cookie, the Cookie Policy table row must match the actual cookie that ships — name, lifetime, and purpose are factual, not aspirational.

### Do NOT

- **Do NOT remove** the ACL non-exclusion clause at `/terms#consumer-guarantees`. The exact sentence "Nothing in these Terms excludes, restricts, or modifies any consumer guarantee…" is mandatory under Australian Consumer Law.
- **Do NOT introduce** a mandatory-arbitration or class-action waiver clause. Flagged as unfair under ACCC standard-form-contract guidance for AU SMBs.
- **Do NOT remove** the OAIC complaints link at `/privacy#contact-complaints` — it's the required escalation path.
- **Do NOT add** legal commitments the business can't keep ("we respond within 24 hours", "all data is encrypted with AES-256-GCM", "we never share data" — when GA4 in fact does).
- **Do NOT change** the governing law away from Western Australia without explicit user instruction — it's tied to the sole trader's registered state.

### When to escalate to a lawyer instead of editing

Recommend a lawyer review (not self-drafting) for changes that materially affect:

- Liability caps, IP ownership of paid deliverables, or indemnities for revenue-bearing clients
- Handling health, financial, or other sensitive data categories
- Adding terms that bind enterprise clients (above small-business contract thresholds)
- Cross-border services beyond the existing US/EU processor disclosures
- Anything triggered by Tranche-2 privacy reform commencement

Budget A$300–800 in WA. Flag the trigger and what to ask the lawyer; don't ship guesses on these.

## Verification before reporting work complete

For UI changes, run `pnpm dev` and exercise the change in a browser. Type-check with `pnpm exec tsc --noEmit`. There is no test suite — manual verification is the only gate.

@AGENTS.md

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
