"use client";

import { useEffect, useRef, useState } from "react";

/**
 * On-Page Optimization mockup (SEO section 02) — "Search-ready page".
 *
 * A Mobol page panel that scans a normal website page, highlights the signals
 * search engines read, then shows the plain-English result of that cleanup.
 *
 * Story (what a first-time viewer reads in 3 seconds):
 *   Page preview → progress bar scans → page signals light up → the right-hand
 *   "Search engines can read" panel fills with clear labels → "Ready to index".
 *
 * Anti-bug discipline:
 *   NO `<AnimatePresence mode="wait">` anywhere. All 6 signals, page preview
 *   areas, and the header score live in the DOM at all times; only opacity,
 *   values, and a single CSS class change. The reset phase fades everything
 *   back to a dim state, then the pageIdx advance mutates the data in place —
 *   never an unmount, never a blank window between cycles.
 */

type Phase = "idle" | "scan" | "verdict" | "hold" | "reset";
type SignalArea = "url" | "title" | "summary" | "schema" | "images" | "links";

type Signal = {
  label: string;
  technical: string;
  result: string;
  detail: string;
  score: number;
  area: SignalArea;
};

type Page = {
  url: string;
  type: string;
  title: string;
  summary: string;
  schema: string;
  imageNote: string;
  linkNote: string;
  score: number;
  signals: Signal[];
};

const PAGES: Page[] = [
  {
    url: "mobol.com.au/blog/perth-web-design",
    type: "Blog post",
    title: "Perth web design that pays back",
    summary:
      "A practical guide for choosing a Perth website team, written for real business searches.",
    schema: "Blog post details",
    imageNote: "4 images labelled",
    linkNote: "6 helpful links",
    score: 92,
    signals: [
      {
        label: "Page name",
        technical: "Title tag",
        result: "Search title clear",
        detail: "Matches the page topic",
        score: 94,
        area: "title",
      },
      {
        label: "Search summary",
        technical: "Meta description",
        result: "Preview text written",
        detail: "Clear reason to click",
        score: 91,
        area: "summary",
      },
      {
        label: "Correct web address",
        technical: "Canonical",
        result: "One main URL",
        detail: "No duplicate confusion",
        score: 100,
        area: "url",
      },
      {
        label: "Business/page details",
        technical: "Schema",
        result: "Article details",
        detail: "Added for crawlers",
        score: 96,
        area: "schema",
      },
      {
        label: "Image descriptions",
        technical: "Alt text",
        result: "Images labelled",
        detail: "Missing labels added",
        score: 92,
        area: "images",
      },
      {
        label: "Helpful next links",
        technical: "Internal links",
        result: "Links mapped",
        detail: "Readers can keep moving",
        score: 95,
        area: "links",
      },
    ],
  },
  {
    url: "mobol.com.au/services/shopify",
    type: "Landing page",
    title: "Shopify Plus development in Australia",
    summary:
      "A focused service page for Shopify builds, migrations, and support across Australia.",
    schema: "Service + LocalBusiness",
    imageNote: "5 images labelled",
    linkNote: "9 related pages",
    score: 96,
    signals: [
      {
        label: "Page name",
        technical: "Title tag",
        result: "Service page",
        detail: "Offer is named clearly",
        score: 97,
        area: "title",
      },
      {
        label: "Search summary",
        technical: "Meta description",
        result: "Location clear",
        detail: "Australia included",
        score: 95,
        area: "summary",
      },
      {
        label: "Correct web address",
        technical: "Canonical",
        result: "One main URL",
        detail: "Correct page chosen",
        score: 100,
        area: "url",
      },
      {
        label: "Business/page details",
        technical: "Schema",
        result: "Business details",
        detail: "Structured data added",
        score: 98,
        area: "schema",
      },
      {
        label: "Image descriptions",
        technical: "Alt text",
        result: "Images labelled",
        detail: "Every image has context",
        score: 100,
        area: "images",
      },
      {
        label: "Helpful next links",
        technical: "Internal links",
        result: "Links mapped",
        detail: "Next steps are connected",
        score: 92,
        area: "links",
      },
    ],
  },
  {
    url: "mobol.com.au/services/ai-integration",
    type: "Landing page",
    title: "AI integration for Perth teams",
    summary:
      "Automation, assistants, and practical AI tools explained without burying the offer.",
    schema: "Service + FAQ",
    imageNote: "8 images labelled",
    linkNote: "4 priority links",
    score: 90,
    signals: [
      {
        label: "Page name",
        technical: "Title tag",
        result: "Offer named",
        detail: "Plain search phrase",
        score: 93,
        area: "title",
      },
      {
        label: "Search summary",
        technical: "Meta description",
        result: "Preview tightened",
        detail: "Short enough for search",
        score: 88,
        area: "summary",
      },
      {
        label: "Correct web address",
        technical: "Canonical",
        result: "One main URL",
        detail: "Duplicate paths avoided",
        score: 100,
        area: "url",
      },
      {
        label: "Business/page details",
        technical: "Schema",
        result: "FAQ details",
        detail: "Answers marked clearly",
        score: 94,
        area: "schema",
      },
      {
        label: "Image descriptions",
        technical: "Alt text",
        result: "Images labelled",
        detail: "Screen readers included",
        score: 86,
        area: "images",
      },
      {
        label: "Helpful next links",
        technical: "Internal links",
        result: "Links mapped",
        detail: "Priority pages connected",
        score: 85,
        area: "links",
      },
    ],
  },
];

const IDLE_MS = 380;
const SCAN_MS = 1500;
const SIGNAL_DELAY_BASE = 240;
const SIGNAL_STAGGER = 240;
const SIGNAL_TICK_MS = 320;
const VERDICT_MS = 700;
const SCORE_TICK_MS = 520;
const HOLD_MS = 3500;
const RESET_MS = 600;

type SignalDisplay = { revealed: boolean; score: number };

const INITIAL_SIGNALS: SignalDisplay[] = Array.from({ length: 6 }, () => ({
  revealed: false,
  score: 0,
}));

function CheckIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
        active
          ? "border-ink bg-ink text-surface"
          : "border-border bg-bg text-transparent"
      }`}
    >
      <svg
        width="9"
        height="9"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
      </svg>
    </span>
  );
}

export default function OnPageMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedOffscreen, setPausedOffscreen] = useState(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [pageIdx, setPageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [signalDisplay, setSignalDisplay] =
    useState<SignalDisplay[]>(INITIAL_SIGNALS);
  const [headerScore, setHeaderScore] = useState(0);

  const page = PAGES[pageIdx];

  // Mount
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      const lastIdx = PAGES.length - 1;
      const last = PAGES[lastIdx];
      setPageIdx(lastIdx);
      setProgress(1);
      setSignalDisplay(
        last.signals.map((signal) => ({
          revealed: true,
          score: signal.score,
        })),
      );
      setHeaderScore(last.score);
      setPhase("hold");
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const off = !entry.isIntersecting;
        root.classList.toggle("onpage-paused", off);
        setPausedOffscreen(off);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // idle -> scan
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "idle") return;
    const t = setTimeout(() => setPhase("scan"), IDLE_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // scan: one rAF drives progress + per-signal reveal + per-signal score tick
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "scan") return;
    const start = performance.now();
    const signals = page.signals;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / SCAN_MS);
      setProgress(t);

      const nextDisplay: SignalDisplay[] = signals.map((signal, i) => {
        const revealStart = SIGNAL_DELAY_BASE + i * SIGNAL_STAGGER;
        if (elapsed < revealStart) return { revealed: false, score: 0 };
        const localT = Math.min(1, (elapsed - revealStart) / SIGNAL_TICK_MS);
        const eased = 1 - Math.pow(1 - localT, 4);
        return { revealed: true, score: Math.round(signal.score * eased) };
      });
      setSignalDisplay(nextDisplay);

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setSignalDisplay(
          signals.map((signal) => ({ revealed: true, score: signal.score })),
        );
        setPhase("verdict");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, page.signals, reducedMotion, pausedOffscreen]);

  // verdict: rAF the header score from 0 -> target + advance to hold
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "verdict") return;
    const start = performance.now();
    const target = page.score;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SCORE_TICK_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      setHeaderScore(Math.round(target * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setHeaderScore(target);
      }
    };
    raf = requestAnimationFrame(tick);

    const next = setTimeout(() => setPhase("hold"), VERDICT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(next);
    };
  }, [phase, page.score, reducedMotion, pausedOffscreen]);

  // hold -> reset
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("reset"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // reset -> advance pageIdx -> idle (no unmount, no blank window)
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "reset") return;
    const t = setTimeout(() => {
      setPageIdx((i) => (i + 1) % PAGES.length);
      setProgress(0);
      setSignalDisplay(INITIAL_SIGNALS);
      setHeaderScore(0);
      setPhase("idle");
    }, RESET_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  const isResetting = phase === "reset";
  const isScored = phase === "verdict" || phase === "hold" || isResetting;
  const showScoreNumber = headerScore > 0;
  const showVerdictPulse = phase === "verdict";
  const revealedCount = signalDisplay.filter((signal) => signal.revealed).length;

  const isAreaReady = (area: SignalArea) =>
    page.signals.some(
      (signal, i) => signal.area === area && signalDisplay[i]?.revealed,
    );

  const focusClasses = (area: SignalArea) =>
    isAreaReady(area)
      ? "border-ink bg-surface shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
      : "border-border bg-bg";

  const mutedOpacity = isResetting ? 0.42 : 1;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="On-page SEO panel: a website page preview is scanned, key signals like page name, search summary, image labels, and links are highlighted, then a search-engine-readable preview lands with a Ready to index status."
      className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-2xl border border-black/[0.04] bg-surface sm:aspect-[4/3]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header strip */}
      <div
        className="flex items-center gap-2 border-b border-border px-4 pb-2.5 pt-3"
        aria-hidden="true"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          className="shrink-0 text-ink-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="6" cy="6" r="3.4" />
          <path d="M6 0.5 V2.2 M6 9.8 V11.5 M0.5 6 H2.2 M9.8 6 H11.5" />
        </svg>
        <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-ink-2">
          {page.url}
        </span>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.04] bg-bg px-2 py-1"
          style={{
            opacity: isResetting ? 0.45 : 1,
            transition: "opacity 600ms ease",
          }}
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-3">
            Search clarity
          </span>
          <span className="font-mono text-[12px] font-bold tabular-nums text-ink">
            {showScoreNumber ? headerScore : "--"}
          </span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-[5px] bg-bg" aria-hidden="true">
        <div
          className="h-full bg-ink"
          style={{
            width: `${progress * 100}%`,
            transition: isResetting
              ? "width 580ms cubic-bezier(0.16, 1, 0.3, 1)"
              : "width 80ms linear",
          }}
        />
      </div>

      {/* Page preview -> crawler-readable preview */}
      <div
        className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.88fr)_minmax(0,1.12fr)] sm:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] sm:grid-rows-none"
        aria-hidden="true"
      >
        <div className="min-w-0 border-b border-border bg-[#fafafa] p-3 sm:border-b-0 sm:border-r sm:p-4">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-1.5 border-b border-border bg-bg px-2.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/14" />
              <span className="h-1.5 w-1.5 rounded-full bg-ink/10" />
              <div
                className={`ml-1 min-w-0 flex-1 rounded-full border px-2 py-1 transition-colors duration-300 ${focusClasses(
                  "url",
                )}`}
                style={{ opacity: mutedOpacity }}
              >
                <p className="truncate font-mono text-[8px] text-ink-3">
                  {page.url}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 p-2.5 sm:p-3">
              <div
                className={`rounded-lg border p-2 transition-colors duration-300 ${focusClasses(
                  "title",
                )}`}
                style={{ opacity: mutedOpacity }}
              >
                <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink sm:text-[14px]">
                  {page.title}
                </p>
              </div>

              <div
                className={`rounded-lg border p-2 transition-colors duration-300 ${focusClasses(
                  "summary",
                )}`}
                style={{ opacity: mutedOpacity }}
              >
                <p className="line-clamp-2 text-[9px] leading-snug text-ink-2 sm:text-[10px]">
                  {page.summary}
                </p>
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-[0.86fr_1fr] gap-2">
                <div
                  className={`flex flex-col justify-between rounded-lg border p-2 transition-colors duration-300 ${focusClasses(
                    "images",
                  )}`}
                  style={{ opacity: mutedOpacity }}
                >
                  <div className="grid grid-cols-2 gap-1">
                    <span className="aspect-square rounded bg-ink/10" />
                    <span className="aspect-square rounded bg-ink/6" />
                    <span className="aspect-square rounded bg-ink/6" />
                    <span className="aspect-square rounded bg-ink/10" />
                  </div>
                  <p className="mt-1 truncate font-mono text-[8px] text-ink-3">
                    {page.imageNote}
                  </p>
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <div
                    className={`rounded-lg border p-2 transition-colors duration-300 ${focusClasses(
                      "schema",
                    )}`}
                    style={{ opacity: mutedOpacity }}
                  >
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-3">
                      Details
                    </p>
                    <p className="mt-1 truncate text-[9px] font-medium text-ink sm:text-[10px]">
                      {page.schema}
                    </p>
                  </div>
                  <div
                    className={`min-h-0 flex-1 rounded-lg border p-2 transition-colors duration-300 ${focusClasses(
                      "links",
                    )}`}
                    style={{ opacity: mutedOpacity }}
                  >
                    <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-3">
                      Next pages
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="h-1.5 w-7 rounded-full bg-ink/18" />
                      <span className="h-1.5 w-5 rounded-full bg-ink/10" />
                      <span className="h-1.5 w-8 rounded-full bg-ink/12" />
                    </div>
                    <p className="mt-1.5 truncate font-mono text-[8px] text-ink-3">
                      {page.linkNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-surface p-3 sm:p-4">
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-3">
                  Search engines can read
                </p>
                <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-tight text-ink sm:text-[15px]">
                  {page.title}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full border border-border bg-bg px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-ink-3"
                style={{
                  opacity: isScored ? 1 : 0.48,
                  transition: "opacity 320ms ease",
                }}
              >
                {page.type}
              </span>
            </div>

            <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 content-start gap-2">
              {page.signals.map((signal, i) => {
                const state = signalDisplay[i] ?? { revealed: false, score: 0 };
                const revealed = state.revealed;
                return (
                  <div
                    key={signal.area}
                    className={`min-w-0 rounded-lg border p-2 transition-colors duration-300 ${
                      revealed
                        ? "border-ink bg-surface"
                        : "border-border bg-bg"
                    }`}
                    style={{
                      opacity: isResetting ? 0.42 : revealed ? 1 : 0.48,
                      transition:
                        "opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, background-color 300ms ease",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckIcon active={revealed} />
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold leading-tight text-ink sm:text-[11px]">
                          {signal.result}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[8px] text-ink-3">
                          {signal.technical}
                        </p>
                      </div>
                    </div>
                    <p
                      className="mt-1.5 hidden text-[9.5px] leading-snug text-ink-2 sm:line-clamp-2"
                      style={{
                        opacity: revealed ? 1 : 0,
                        transition: "opacity 280ms ease 60ms",
                      }}
                    >
                      {signal.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer caption */}
      <div
        className="flex items-center justify-between gap-3 border-t border-border px-4 py-2"
        aria-hidden="true"
      >
        <span className="truncate font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
          On-page setup · {revealedCount}/{page.signals.length} signals clear
        </span>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] ${
            isScored
              ? "border-[#1f6c45]/20 bg-[#e8f3ec] text-[#1f6c45]"
              : "border-border bg-bg text-ink-3"
          } ${showVerdictPulse ? "onpage-score-land" : ""}`}
          style={{ transition: "color 320ms ease, border-color 320ms ease" }}
        >
          {isScored ? "Ready to index" : "Checking page"}
        </span>
      </div>
    </div>
  );
}
