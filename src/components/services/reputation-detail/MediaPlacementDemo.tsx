"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePausedTimeline } from "@/components/services/usePausedTimeline";

type Publication = {
  id: string;
  shortName: string;
  fullName: string;
  domain: string;
  path: string;
  sectionLabel: string;
  kicker: string;
  kickerFilled: boolean;
  headline: string;
  dek: string;
  byline: string;
  date: string;
  readTime: string;
  lede: string;
  rule: boolean;
  ticker?: string;
  masthead: React.ReactNode;
};

const PUBLICATIONS: Publication[] = [
  {
    id: "forbes",
    shortName: "Forbes",
    fullName: "Forbes",
    domain: "forbes.com",
    path: "/innovation/forge-logistics",
    sectionLabel: "INNOVATION",
    kicker: "INNOVATION",
    kickerFilled: false,
    headline:
      "The operator quietly reshaping Australia's $50B last-mile logistics sector",
    dek: "Yael Brennan built Forge Logistics to $28M revenue in three years without a single cold-sales call.",
    byline: "Sarah Chen",
    date: "18 May 2026",
    readTime: "6 min read",
    lede: "In a Perth warehouse that smells of diesel and cardboard, Yael Brennan is doing what most logistics operators told her was impossible — running a profitable regional network at 94% on-time delivery.",
    rule: false,
    masthead: (
      <span className="font-bold text-[22px] leading-none uppercase tracking-[0.12em] text-ink">
        FORBES
      </span>
    ),
  },
  {
    id: "afr",
    shortName: "AFR",
    fullName: "Australian Financial Review",
    domain: "afr.com",
    path: "/young-rich/yael-brennan-forge-logistics",
    sectionLabel: "YOUNG RICH 2026",
    kicker: "POWER LIST",
    kickerFilled: false,
    headline:
      "Yael Brennan, 34, turned a Perth delivery startup into a $42M logistics force",
    dek: "Forge Logistics now handles last-mile for four of Australia's top-ten retailers — and Brennan is just getting started.",
    byline: "James Whitfield",
    date: "12 May 2026",
    readTime: "8 min read",
    lede: "Three years after founding Forge Logistics with $180,000 in savings and a leased Hilux, Yael Brennan has been named to the AFR Young Rich list with an estimated net worth of $42 million.",
    rule: true,
    masthead: (
      <div>
        <span className="block text-[9px] font-mono tracking-[0.24em] text-ink-2 mb-0.5">
          AFR
        </span>
        <span className="block font-bold text-[13px] leading-none uppercase tracking-[0.28em] text-ink">
          FINANCIAL REVIEW
        </span>
      </div>
    ),
  },
  {
    id: "bloomberg",
    shortName: "Bloomberg",
    fullName: "Bloomberg",
    domain: "bloomberg.com",
    path: "/markets/forge-logistics-series-a",
    sectionLabel: "MARKETS",
    kicker: "FUNDING",
    kickerFilled: true,
    headline:
      "Forge Logistics closes $15M Series A to expand regional-freight network across WA and SA",
    dek: "Round led by Blackbird Ventures with participation from Main Sequence; capital funds 12 depot openings by Q3 2027.",
    byline: "Lena Park",
    date: "9 Apr 2026",
    readTime: "4 min read",
    lede: "Perth-based Forge Logistics has closed a $15 million Series A round, giving the regional freight operator capital to build out a network of 12 new depots across Western Australia and South Australia by the end of next year.",
    rule: false,
    ticker: "LOGISTICS ▲0.4% · ASX 200 ▲1.2%",
    masthead: (
      <span className="font-bold text-[19px] leading-none tracking-[-0.01em] text-ink">
        Bloomberg
      </span>
    ),
  },
  {
    id: "australian",
    shortName: "Austral.",
    fullName: "The Australian",
    domain: "theaustralian.com.au",
    path: "/business/forge-logistics-exclusive",
    sectionLabel: "BUSINESS EXCLUSIVE",
    kicker: "EXCLUSIVE",
    kickerFilled: false,
    headline:
      "From a Perth garage to a national fleet: inside Forge Logistics' 36-month sprint",
    dek: "Founder Yael Brennan speaks exclusively to The Australian about bootstrapping, the Series A, and why she turned down two acquisition offers.",
    byline: "Michael Tran",
    date: "3 Mar 2026",
    readTime: "7 min read",
    lede: "When Yael Brennan registered Forge Logistics in February 2023, she had one truck, one driver, and contracts with three local retailers. Today the company operates 140 vehicles across four states.",
    rule: true,
    masthead: (
      <span className="font-bold text-[14px] leading-none uppercase tracking-[0.18em] text-ink">
        THE AUSTRALIAN
      </span>
    ),
  },
  {
    id: "techcrunch",
    shortName: "TC",
    fullName: "TechCrunch",
    domain: "techcrunch.com",
    path: "/startups/forge-logistics-15m-series-a",
    sectionLabel: "STARTUPS",
    kicker: "SERIES A",
    kickerFilled: true,
    headline:
      "Forge Logistics nabs $15M to bring real-time freight visibility to regional Australia",
    dek: "The startup's proprietary dispatch layer cuts empty-truck rates to under 8% — half the industry average — which drove the raise.",
    byline: "Riley Okafor",
    date: "9 Apr 2026",
    readTime: "3 min read",
    lede: "Forge Logistics, a Perth startup building software-first last-mile logistics for regional Australia, has raised $15 million in Series A funding led by Blackbird Ventures.",
    rule: false,
    masthead: (
      <span className="font-bold text-[20px] leading-none tracking-[-0.02em] lowercase text-ink">
        techcrunch
      </span>
    ),
  },
];

function LockIcon({ size = 9 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function MediaPlacementDemo() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const userPausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const [activePub, setActivePub] = useState(0);

  const phases = useMemo(
    () => [
      {
        duration: 4500,
        tick: () => {
          setActivePub((p) => (p + 1) % PUBLICATIONS.length);
        },
      },
    ],
    []
  );

  usePausedTimeline(rootRef, phases, {
    amount: 0.2,
    shouldRun: () => !isHoveredRef.current && !userPausedRef.current,
  });

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const selectTab = (idx: number) => {
    userPausedRef.current = true;
    setActivePub(idx);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      userPausedRef.current = false;
    }, 8000);
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next =
        (activePub + dir + PUBLICATIONS.length) % PUBLICATIONS.length;
      selectTab(next);
      const btn = document.getElementById(`media-tab-${PUBLICATIONS[next].id}`);
      btn?.focus();
    }
  };

  const pub = PUBLICATIONS[activePub];

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] p-5 sm:p-6"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-ink-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
          <span>Press placement</span>
        </div>
        <div className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-ink-2">
          <span className="text-ink font-semibold">3</span> placed this quarter
        </div>
      </div>

      {/* Browser chrome */}
      <div className="mt-4 rounded-t-xl border border-border border-b-0 bg-[#f6f6f6] px-3 h-9 flex items-center gap-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-ink-3/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-ink-3/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-ink-3/50" />
        </div>
        <div className="flex-1 rounded bg-surface border border-border/80 px-2 py-[3px] flex items-center gap-1.5 text-[10px] font-mono text-ink-2 overflow-hidden">
          <span className="text-ink-3 shrink-0">
            <LockIcon size={9} />
          </span>
          <motion.span
            key={pub.id}
            initial={reduce ? false : { opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="truncate"
          >
            <span className="text-ink">{pub.domain}</span>
            <span className="text-ink-3">{pub.path}</span>
          </motion.span>
        </div>
      </div>

      {/* Article frame */}
      <div
        role="tabpanel"
        id={`media-panel-${pub.id}`}
        aria-labelledby={`media-tab-${pub.id}`}
        className="rounded-b-xl border border-border border-t-0 bg-surface overflow-hidden px-5 pt-4 pb-5 min-h-[340px]"
      >
        <motion.div
          key={pub.id}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Masthead row */}
            <div className="flex items-end justify-between gap-3 min-h-[28px]">
              {pub.masthead}
              {pub.ticker && (
                <span className="text-[8px] font-mono text-ink-3 tracking-[0.08em] hidden sm:block whitespace-nowrap">
                  {pub.ticker}
                </span>
              )}
            </div>

            {pub.rule && <hr className="my-2 border-border" />}
            {!pub.rule && <div className="mt-2" />}

            {/* Section label */}
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-ink-2">
              {pub.sectionLabel}
            </p>

            {/* Kicker pill */}
            <div className="mt-2">
              <span
                className={`inline-block px-1.5 py-[2px] text-[9px] font-mono uppercase tracking-[0.18em] rounded ${
                  pub.kickerFilled
                    ? "bg-ink text-surface"
                    : "border border-ink text-ink"
                }`}
              >
                {pub.kicker}
              </span>
            </div>

            {/* Headline */}
            <h3 className="mt-2.5 text-ink font-bold tracking-tighter-display leading-[1.08] text-[clamp(0.95rem,1.55vw,1.15rem)] line-clamp-3">
              {pub.headline}
            </h3>

            {/* Dek */}
            <p className="mt-1.5 text-[11px] leading-[1.45] text-ink-2 line-clamp-2">
              {pub.dek}
            </p>

            {/* Byline row */}
            <div className="mt-2.5 pt-2 border-t border-border text-[9px] font-mono text-ink-2 tracking-[0.06em] flex items-center gap-1.5">
              <span>
                By <span className="text-ink">{pub.byline}</span>
              </span>
              <span className="text-ink-3">·</span>
              <span>{pub.date}</span>
              <span className="text-ink-3">·</span>
              <span>{pub.readTime}</span>
            </div>

            {/* Hero image skeleton */}
            <div className="mt-3 h-[58px] rounded-lg bg-bg border border-border overflow-hidden relative">
              {!reduce && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-bg via-border/40 to-bg" />
              )}
              <span className="absolute left-2 bottom-1.5 text-[8px] font-mono text-ink-3">
                Photo · {pub.fullName}
              </span>
            </div>

            {/* Lede */}
            <p className="mt-3 text-[11px] leading-[1.6] text-ink-body line-clamp-4">
              {pub.lede}
            </p>
        </motion.div>
      </div>

      {/* Publication tablist */}
      <div
        role="tablist"
        aria-label="Publication tabs"
        onKeyDown={onTabKeyDown}
        className="mt-4 flex gap-1.5"
      >
        {PUBLICATIONS.map((p, idx) => {
          const isActive = idx === activePub;
          return (
            <button
              key={p.id}
              id={`media-tab-${p.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`media-panel-${p.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(idx)}
              className={`flex-1 rounded-md py-1.5 px-1 text-[8.5px] font-mono uppercase tracking-[0.1em] text-center truncate transition-colors ${
                isActive
                  ? "bg-ink text-surface font-semibold"
                  : "border border-border text-ink-3 hover:text-ink hover:border-ink"
              }`}
            >
              {p.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
