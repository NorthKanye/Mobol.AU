"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Keyword Research mockup (SEO section 01).
 *
 * Phase machine: typing → loading → results → decide → hold → erasing.
 * Signature beat is `decide`: the highest-opportunity row detaches and
 * snaps up into a dedicated "Priority" pill above the table; remaining
 * rows fade to 60% opacity to emphasize the pick. IntersectionObserver
 * pause + prefers-reduced-motion follow the SeoMockup pattern exactly.
 */

type Phase = "typing" | "loading" | "results" | "decide" | "hold" | "erasing";

type Row = {
  keyword: string;
  volume: number;
  kd: number;
  opportunity: number;
  winner?: boolean;
};

const QUERIES: { query: string; rows: Row[] }[] = [
  {
    query: "perth web design",
    rows: [
      { keyword: "perth web design", volume: 720, kd: 38, opportunity: 78, winner: true },
      { keyword: "web design perth", volume: 480, kd: 42, opportunity: 71 },
      { keyword: "best web designer perth", volume: 320, kd: 28, opportunity: 65 },
      { keyword: "perth web development", volume: 290, kd: 51, opportunity: 52 },
      { keyword: "shopify designer perth", volume: 170, kd: 22, opportunity: 47 },
      { keyword: "perth design studio", volume: 110, kd: 18, opportunity: 41 },
    ],
  },
  {
    query: "shopify developer perth",
    rows: [
      { keyword: "shopify developer perth", volume: 390, kd: 31, opportunity: 82, winner: true },
      { keyword: "shopify expert perth", volume: 260, kd: 28, opportunity: 74 },
      { keyword: "shopify agency perth", volume: 190, kd: 36, opportunity: 63 },
      { keyword: "shopify plus perth", volume: 110, kd: 44, opportunity: 51 },
      { keyword: "shopify themes perth", volume: 90, kd: 19, opportunity: 45 },
      { keyword: "shopify migration perth", volume: 70, kd: 25, opportunity: 38 },
    ],
  },
  {
    query: "ai integration agency",
    rows: [
      { keyword: "ai integration agency", volume: 880, kd: 47, opportunity: 73, winner: true },
      { keyword: "openai integration agency", volume: 220, kd: 33, opportunity: 64 },
      { keyword: "ai automation agency", volume: 640, kd: 52, opportunity: 67 },
      { keyword: "ai consulting agency", volume: 510, kd: 49, opportunity: 58 },
      { keyword: "claude integration agency", volume: 130, kd: 24, opportunity: 56 },
      { keyword: "ai development agency", volume: 420, kd: 56, opportunity: 50 },
    ],
  },
];

const TYPING_MS = 35;
const ERASING_MS = 22;
const LOADING_MS = 600;
const ROW_STAGGER_MS = 110;
const HOLD_BEFORE_DECIDE_MS = 1200;
const DECIDE_SETTLE_MS = 520;
const HOLD_MS = 3500;
const RESET_HOLD_MS = 1100;

function kdColor(kd: number) {
  if (kd < 35) return "#1f6c45";
  if (kd <= 55) return "#6b4f00";
  return "#9a3030";
}

function kdBg(kd: number) {
  if (kd < 35) return "#e8f3ec";
  if (kd <= 55) return "#fbf2dc";
  return "#fbe7e7";
}

export default function KeywordResearchMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedOffscreen, setPausedOffscreen] = useState(false);

  const [queryIndex, setQueryIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [displayed, setDisplayed] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);

  const query = QUERIES[queryIndex];
  const winner = query.rows.find((r) => r.winner) ?? query.rows[0];

  // Mount: reduced-motion + IntersectionObserver
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setDisplayed(QUERIES[0].query);
      setVisibleCount(QUERIES[0].rows.length);
      setPhase("hold");
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting;
        root.classList.toggle("kw-paused", offscreen);
        setPausedOffscreen(offscreen);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // typing
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "typing") return;
    const target = query.query;
    if (displayed === target) {
      const t = setTimeout(() => setPhase("loading"), 320);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDisplayed(target.slice(0, displayed.length + 1));
    }, TYPING_MS);
    return () => clearTimeout(t);
  }, [phase, displayed, query.query, reducedMotion, pausedOffscreen]);

  // loading → results
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "loading") return;
    const t = setTimeout(() => {
      setVisibleCount(0);
      setPhase("results");
    }, LOADING_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // results cascade
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "results") return;
    if (visibleCount >= query.rows.length) {
      const t = setTimeout(() => setPhase("decide"), HOLD_BEFORE_DECIDE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setVisibleCount((c) => c + 1),
      visibleCount === 0 ? 200 : ROW_STAGGER_MS,
    );
    return () => clearTimeout(t);
  }, [phase, visibleCount, query.rows.length, reducedMotion, pausedOffscreen]);

  // decide → hold
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "decide") return;
    const t = setTimeout(() => setPhase("hold"), DECIDE_SETTLE_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // hold → erasing
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("erasing"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // erasing → next query
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "erasing") return;
    if (displayed.length === 0) {
      const t = setTimeout(() => {
        setVisibleCount(0);
        setQueryIndex((i) => (i + 1) % QUERIES.length);
        setPhase("typing");
      }, RESET_HOLD_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDisplayed((s) => s.slice(0, -1));
    }, ERASING_MS);
    return () => clearTimeout(t);
  }, [phase, displayed, reducedMotion, pausedOffscreen]);

  const showCaret =
    !reducedMotion && (phase === "typing" || phase === "erasing");
  const showPriority = phase === "decide" || phase === "hold" || phase === "erasing";
  const tableDim = showPriority;
  const showLoadingRow = phase === "loading";

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated keyword research panel: a query is typed, results cascade in as a sortable table, and the highest-opportunity keyword snaps up into a Priority pill."
      className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/[0.04] flex flex-col bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header — search field */}
      <div
        className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-border"
        aria-hidden="true"
      >
        <div className="flex-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f3f2ef] min-w-0">
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
          <span className="text-[14px] font-medium text-ink tracking-[-0.01em] truncate min-w-0">
            {displayed}
          </span>
          {showCaret && (
            <span
              className="kw-caret inline-block w-[1.5px] h-[14px] bg-ink shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3 bg-bg border border-black/[0.04] shrink-0">
          Research
        </span>
      </div>

      {/* Priority pill area (always present to prevent layout jump) */}
      <div className="px-4 pt-3 min-h-[56px]" aria-hidden="true">
        <AnimatePresence mode="wait">
          {showPriority ? (
            <motion.div
              key={`priority-${queryIndex}`}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-ink text-surface px-3.5 py-2.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/55 shrink-0">
                  Priority
                </span>
                <span className="text-[13px] font-medium text-white tracking-[-0.01em] truncate">
                  {winner.keyword}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono tabular-nums text-white/70">
                  {winner.opportunity}
                </span>
                <div className="w-[64px] h-[5px] rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${winner.opportunity}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink-3"
            >
              {phase === "loading"
                ? "Analyzing…"
                : phase === "typing"
                  ? "Awaiting query"
                  : phase === "results"
                    ? "Scoring opportunity"
                    : " "}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="flex-1 px-4 pt-3 pb-3 min-h-0 flex flex-col" aria-hidden="true">
        <div className="grid grid-cols-[1fr_42px_34px_84px] gap-3 text-[9px] uppercase tracking-[0.18em] text-ink-3 font-mono pb-2 border-b border-border">
          <span>Keyword</span>
          <span className="text-right">Vol</span>
          <span className="text-right">KD</span>
          <span>Opportunity</span>
        </div>
        <div className="flex-1 flex flex-col">
          {query.rows.map((row, i) => {
            const visible = i < visibleCount;
            const rowOpacity = !visible
              ? 0
              : tableDim
                ? row.winner
                  ? 1
                  : 0.42
                : 1;
            const barTarget = visible ? row.opportunity : 0;
            return (
              <div
                key={`${queryIndex}-${row.keyword}`}
                className="kw-row-fade grid grid-cols-[1fr_42px_34px_84px] gap-3 items-center py-[7px] border-b border-border/60 last:border-b-0"
                style={{
                  opacity: rowOpacity,
                  transition: "opacity 360ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <span className="text-[12px] text-ink truncate tracking-[-0.005em]">
                  {row.keyword}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-ink-2 text-right">
                  {row.volume}
                </span>
                <span
                  className="inline-flex items-center justify-center px-1.5 py-[2px] rounded-[4px] text-[9px] font-bold tabular-nums justify-self-end"
                  style={{ color: kdColor(row.kd), background: kdBg(row.kd) }}
                >
                  {row.kd}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[4px] rounded-full bg-bg overflow-hidden">
                    <div
                      className="kw-bar h-full bg-ink"
                      style={{
                        width: `${barTarget}%`,
                        transition: "width 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-ink-3 w-[18px] text-right">
                    {visible ? row.opportunity : ""}
                  </span>
                </div>
              </div>
            );
          })}
          {showLoadingRow && (
            <div
              className="kw-loading flex items-center gap-2 py-3 text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3"
              style={{ animation: "kwLoadingPulse 1.05s ease-in-out infinite" }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-ink-3" />
              <span>Searching {query.query}…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
