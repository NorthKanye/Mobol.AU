"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SEO — Services bottom card 05.
 *
 * SERP-style mockup that cycles through three search queries. For each
 * query: typewriter renders the query, the brand row physically climbs
 * from position #4 → #3 → #2 → #1 in the result list (animated `top`),
 * then the typewriter erases and the next query begins. Loops indefinitely.
 *
 * Phase machine: typing → climbing → top → erasing. Caret blink is pure
 * CSS. IntersectionObserver toggles `.seo-paused` to halt the caret and
 * prevent further phase ticks. `prefers-reduced-motion` short-circuits to
 * a single resolved frame: brand at #1 with the first query fully typed.
 */

type Phase = "typing" | "climbing" | "top" | "erasing";

const QUERIES = [
  "design studio for ai products",
  "perth web design agency",
  "ai product design partner",
];

const RESULTS = [
  {
    id: "r1",
    url: "studioarc.co",
    title: "Studio Arc — Brand & product design",
    description:
      "Independent brand and product design studio shaping startups, e-commerce and venture portfolios. Sydney-based, working globally.",
    letter: "S",
    favColor: "#2a64bf",
  },
  {
    id: "r2",
    url: "northwind.studio",
    title: "Northwind — UI/UX for AI startups",
    description:
      "User-centred interface and product design for early-stage AI tools — dashboards, onboarding flows and opinionated launch playbooks.",
    letter: "N",
    favColor: "#2e8b57",
  },
  {
    id: "r3",
    url: "lumen.io",
    title: "Lumen — Product & brand consultancy",
    description:
      "End-to-end product strategy, brand identity and creative direction. Partnering with consumer and B2B teams across Europe and the US.",
    letter: "L",
    favColor: "#d97706",
  },
];

const BRAND = {
  id: "brand",
  url: "mobol.studio",
  title: "Mobol — Studios for ambitious teams",
  description:
    "Brand identity, web development and AI integration under one roof. Built for teams that want design and engineering shipped together.",
  letter: "M",
  favColor: "#111111",
};

const TYPING_INTERVAL_MS = 35;
const ERASING_INTERVAL_MS = 22;
const CLIMB_STEP_MS = 700;
const TOP_HOLD_MS = 1300;
const RESET_HOLD_MS = 1800;

export default function SeoMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedOffscreen, setPausedOffscreen] = useState(false);
  const [queryIndex, setQueryIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [displayed, setDisplayed] = useState("");
  // Brand position 4 → 1 (smaller = better)
  const [brandPos, setBrandPos] = useState(4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setDisplayed(QUERIES[0]);
      setBrandPos(1);
      setPhase("top");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting;
        root.classList.toggle("seo-paused", offscreen);
        setPausedOffscreen(offscreen);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // Typing phase: append characters
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "typing") return;

    const target = QUERIES[queryIndex];
    if (displayed === target) {
      // Done typing — pause briefly, then climb
      const t = setTimeout(() => setPhase("climbing"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDisplayed(target.slice(0, displayed.length + 1));
    }, TYPING_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [phase, displayed, queryIndex, reducedMotion, pausedOffscreen]);

  // Climbing phase: brand position decrements 4 → 3 → 2 → 1
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "climbing") return;

    if (brandPos === 1) {
      const t = setTimeout(() => setPhase("top"), 200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setBrandPos((p) => p - 1);
    }, CLIMB_STEP_MS);
    return () => clearTimeout(t);
  }, [phase, brandPos, reducedMotion, pausedOffscreen]);

  // Top phase: hold at #1
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "top") return;

    const isFinalQuery = queryIndex === QUERIES.length - 1;
    const hold = isFinalQuery ? RESET_HOLD_MS : TOP_HOLD_MS;
    const t = setTimeout(() => setPhase("erasing"), hold);
    return () => clearTimeout(t);
  }, [phase, queryIndex, reducedMotion, pausedOffscreen]);

  // Erasing phase: chip away the query, then advance
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "erasing") return;

    if (displayed.length === 0) {
      // Advance query (or restart sequence)
      const next = (queryIndex + 1) % QUERIES.length;
      setQueryIndex(next);
      setBrandPos(4);
      setPhase("typing");
      return;
    }
    const t = setTimeout(() => {
      setDisplayed((s) => s.slice(0, -1));
    }, ERASING_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [phase, displayed, queryIndex, reducedMotion, pausedOffscreen]);

  // Compute non-brand row positions: they fill the slots that aren't the
  // brand's. Brand at pos N pushes results below into positions {N+1..4};
  // results above stay at {1..N-1}. Non-brand list keeps stable order
  // (r1, r2, r3) and skips brand's slot.
  const slots: { id: string; url: string; title: string; isBrand: boolean }[] =
    [];
  let nonBrandIdx = 0;
  for (let pos = 1; pos <= 4; pos++) {
    if (pos === brandPos) {
      slots.push({ ...BRAND, isBrand: true });
    } else {
      const r = RESULTS[nonBrandIdx++];
      slots.push({ ...r, isBrand: false });
    }
  }

  // Convert slots → row position lookup by id (for absolute top placement)
  const positionById: Record<string, number> = {};
  slots.forEach((s, i) => {
    positionById[s.id] = i + 1;
  });

  const allRows = [...RESULTS.map((r) => ({ ...r, isBrand: false })), { ...BRAND, isBrand: true }];

  const showCaret = !reducedMotion && (phase === "typing" || phase === "erasing");

  // Each row gets a top in % of the result-list area. 4 rows evenly: 25% each.
  // Brand row settles to 0% when at #1; row heights derived purely from `top`.
  const rowTopPercent = (pos: number) => ((pos - 1) / 4) * 100;

  // Rank chip — neutral pill with the numeral colored by position.
  // Colors are darkened from the natural greens/ambers to clear AA on
  // bg-bg at 8.5px (small text).
  const rankColor =
    brandPos === 1
      ? "#1f6c45"
      : brandPos === 2
        ? "#465f1d"
        : brandPos === 3
          ? "#6b4f00"
          : "#404040";

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated diagram of a search results page where the brand climbs from position 4 to position 1 across multiple queries"
      className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/[0.04] flex flex-col bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Search header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border">
        <div
          className="flex-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3f2ef] min-w-0"
          aria-hidden="true"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink-2 shrink-0"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.5-4.5" />
          </svg>
          <span className="text-[15px] font-medium text-ink tracking-[-0.01em] truncate">
            {displayed}
          </span>
          {showCaret && (
            <span
              className="seo-caret inline-block w-[1.5px] h-[16px] bg-ink shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-bold tabular-nums shrink-0 bg-bg border border-black/[0.04] transition-colors duration-300"
          style={{ color: rankColor }}
          aria-hidden="true"
        >
          <svg
            width="9"
            height="9"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9 V3 M3 6 L6 3 L9 6" />
          </svg>
          Rank #{brandPos}
        </span>
      </div>

      {/* Google-style meta line */}
      <div className="px-4 pt-2 pb-1.5 text-[11px] font-mono text-ink-3 tabular-nums">
        About 1.2M results · 0.34 seconds
      </div>

      {/* SERP results (absolute-positioned rows; brand row animates `top`) */}
      <div className="relative flex-1 px-4 pb-2 min-h-0" aria-hidden="true">
        {allRows.map((row) => {
          const pos = positionById[row.id];
          const landed = row.isBrand && phase === "top";
          return (
            <div
              key={row.id}
              className={`seo-row absolute left-4 right-4 flex items-start gap-2.5 px-2.5 py-1.5 rounded-md ${
                row.isBrand ? "seo-row-brand" : ""
              }`}
              data-landed={landed ? "true" : undefined}
              style={{
                top: `${rowTopPercent(pos)}%`,
                height: "22%",
              }}
            >
              <span
                className={`text-[14px] font-bold tabular-nums shrink-0 leading-[1.3] ${
                  row.isBrand ? "text-ink" : "text-ink-2"
                }`}
              >
                {pos}
              </span>
              <div className="flex flex-col min-w-0 leading-[1.2]">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white shrink-0 leading-none"
                    style={{ background: row.favColor }}
                  >
                    {row.letter}
                  </span>
                  <span
                    className={`text-[12px] font-mono tabular-nums truncate ${
                      row.isBrand ? "text-ink" : "text-ink-3"
                    }`}
                  >
                    {row.url}
                  </span>
                </span>
                <span
                  className={`text-[15px] tracking-[-0.015em] truncate mt-1 ${
                    row.isBrand
                      ? "text-ink font-bold"
                      : "text-[#1a4cbe] font-medium"
                  }`}
                >
                  {row.title}
                </span>
                <span
                  className={`text-[12px] leading-[1.5] mt-1 line-clamp-2 ${
                    row.isBrand ? "text-ink-body" : "text-ink-2"
                  }`}
                >
                  {row.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — Google wordmark + tiny page indicator */}
      <div className="flex items-center justify-between px-5 pb-3 pt-2">
        <span className="text-[14px] font-medium text-ink-2">Google</span>
        <span className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`text-[12px] font-medium tabular-nums ${
                n === 1 ? "text-ink" : "text-ink-3"
              }`}
            >
              {n}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
