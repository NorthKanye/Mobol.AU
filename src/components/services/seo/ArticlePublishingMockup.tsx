"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Article Publishing mockup (SEO section 03).
 *
 * Shows one finished article moving from editorial checks to the client's
 * owned website, then into off-site publication variants. The read should be:
 * article prepared -> website blog live -> distributed articles live.
 */

type Phase =
  | "prepare"
  | "publishOwned"
  | "distribute"
  | "signals"
  | "hold"
  | "reset";

type Destination = {
  kind: string;
  label: string;
  url: string;
};

type PublishingRun = {
  label: string;
  articleType: string;
  title: string;
  excerpt: string;
  ownedUrl: string;
  checks: string[];
  destinations: Destination[];
};

const RUNS: PublishingRun[] = [
  {
    label: "Run 01",
    articleType: "Blog post",
    title: "Local SEO checklist for Perth service businesses",
    excerpt:
      "Search intent, service pages, and internal links shaped into one publish-ready article.",
    ownedUrl: "client.com.au/blog/local-seo-perth",
    checks: ["Voice", "Internal links", "Schema", "CTA"],
    destinations: [
      {
        kind: "Guest article",
        label: "Industry partner",
        url: "partner site / local-search",
      },
      {
        kind: "Resource update",
        label: "Community directory",
        url: "resource hub / guide",
      },
      {
        kind: "LinkedIn article",
        label: "Owner channel",
        url: "linkedin.com / article",
      },
    ],
  },
  {
    label: "Run 02",
    articleType: "Article",
    title: "How AI integration changes booking workflows",
    excerpt:
      "A practical explainer repurposed for search, partner audiences, and social reach.",
    ownedUrl: "client.com.au/articles/ai-booking-workflows",
    checks: ["Intent", "Examples", "FAQ schema", "CTA"],
    destinations: [
      {
        kind: "Partner piece",
        label: "Software roundup",
        url: "partner site / workflow-guide",
      },
      {
        kind: "Newsletter",
        label: "Client list",
        url: "email archive / article",
      },
      {
        kind: "LinkedIn article",
        label: "Team channel",
        url: "linkedin.com / article",
      },
    ],
  },
  {
    label: "Run 03",
    articleType: "Guide",
    title: "Website migration checklist before launch",
    excerpt:
      "Canonical tags, redirects, copy checks, and launch notes turned into useful content.",
    ownedUrl: "client.com.au/blog/migration-checklist",
    checks: ["Redirects", "Canonical", "Screenshots", "CTA"],
    destinations: [
      {
        kind: "Guest guide",
        label: "Build partner",
        url: "partner site / migration",
      },
      {
        kind: "Resource page",
        label: "Support hub",
        url: "resource hub / checklist",
      },
      {
        kind: "LinkedIn article",
        label: "Studio channel",
        url: "linkedin.com / article",
      },
    ],
  },
];

const CHECK_STAGGER_MS = 360;
const READY_SETTLE_MS = 520;
const OWNED_LIVE_MS = 900;
const DESTINATION_STAGGER_MS = 620;
const SIGNAL_DUR_MS = 720;
const HOLD_MS = 3300;
const RESET_MS = 620;

const ease = [0.16, 1, 0.3, 1] as const;

function CheckIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
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

export default function ArticlePublishingMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedOffscreen, setPausedOffscreen] = useState(false);

  const [runIdx, setRunIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("prepare");
  const [visibleChecks, setVisibleChecks] = useState(0);
  const [ownedLive, setOwnedLive] = useState(false);
  const [visibleDestinations, setVisibleDestinations] = useState(0);
  const [liveUrlCount, setLiveUrlCount] = useState(0);
  const [indexedCount, setIndexedCount] = useState(0);

  const run = RUNS[runIdx];
  const totalUrls = run.destinations.length + 1;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setVisibleChecks(RUNS[0].checks.length);
      setOwnedLive(true);
      setVisibleDestinations(RUNS[0].destinations.length);
      setLiveUrlCount(RUNS[0].destinations.length + 1);
      setIndexedCount(1);
      setPhase("hold");
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const off = !entry.isIntersecting;
        root.classList.toggle("pub-paused", off);
        setPausedOffscreen(off);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  // prepare: reveal article-readiness checks one by one.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "prepare") return;
    if (visibleChecks >= run.checks.length) {
      const t = setTimeout(() => setPhase("publishOwned"), READY_SETTLE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setVisibleChecks((c) => c + 1),
      visibleChecks === 0 ? 260 : CHECK_STAGGER_MS,
    );
    return () => clearTimeout(t);
  }, [
    phase,
    run.checks.length,
    visibleChecks,
    reducedMotion,
    pausedOffscreen,
  ]);

  // publishOwned: the owned website article goes live first.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "publishOwned") return;
    setOwnedLive(true);
    setLiveUrlCount(1);
    const t = setTimeout(() => setPhase("distribute"), OWNED_LIVE_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // distribute: off-site variants land one at a time.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "distribute") return;
    if (visibleDestinations >= run.destinations.length) {
      const t = setTimeout(() => setPhase("signals"), 520);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        const nextVisible = visibleDestinations + 1;
        setVisibleDestinations(nextVisible);
        setLiveUrlCount(1 + nextVisible);
      },
      visibleDestinations === 0 ? 420 : DESTINATION_STAGGER_MS,
    );
    return () => clearTimeout(t);
  }, [
    phase,
    run.destinations.length,
    visibleDestinations,
    reducedMotion,
    pausedOffscreen,
  ]);

  // signals: settle the indexed owned-page signal.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "signals") return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SIGNAL_DUR_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      setIndexedCount(Math.round(eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const doneTimer = setTimeout(() => setPhase("hold"), SIGNAL_DUR_MS + 180);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
    };
  }, [phase, reducedMotion, pausedOffscreen]);

  // hold -> reset.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("reset"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  // reset -> next run.
  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "reset") return;
    const t = setTimeout(() => {
      setRunIdx((i) => (i + 1) % RUNS.length);
      setVisibleChecks(0);
      setOwnedLive(false);
      setVisibleDestinations(0);
      setLiveUrlCount(0);
      setIndexedCount(0);
      setPhase("prepare");
    }, RESET_MS);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  const isResetting = phase === "reset";
  const ownedFresh = phase === "publishOwned";
  const showOwnedConnector = ownedLive;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated publishing hub: an article passes editorial checks, publishes to the website blog, then distributes into off-site article placements with live URL and indexed-page counters."
      className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-black/[0.04] bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between gap-3 border-b border-border px-4 pb-2 pt-3"
        aria-hidden="true"
      >
        <span className="min-w-0 truncate text-[9px] font-mono uppercase tracking-[0.22em] text-ink-3">
          Publishing hub · {run.label}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.04] bg-bg px-2 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              ownedLive ? "bg-[#1f6c45]" : "bg-ink-3"
            }`}
          />
          <span className="text-[8px] font-mono uppercase tracking-[0.18em] text-ink-3">
            {ownedLive ? "Live" : "Draft"}
          </span>
        </span>
      </div>

      <div
        className="relative min-h-0 flex-1 px-4 py-4"
        aria-hidden="true"
        style={{
          opacity: isResetting ? 0.42 : 1,
          transition: "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <svg
          viewBox="0 0 480 300"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        >
          {showOwnedConnector && (
            <path
              d="M 194 102 C 245 74 265 66 304 62"
              fill="none"
              stroke="#cfcfcf"
              strokeWidth="1.2"
              strokeLinecap="round"
              pathLength={1}
              className={ownedFresh ? "pub-connector-drawing" : ""}
            />
          )}
          {run.destinations.map((_, i) => {
            if (i >= visibleDestinations) return null;
            const y = 151 + i * 44;
            const fresh =
              phase === "distribute" && visibleDestinations === i + 1;
            return (
              <path
                key={`${runIdx}-connector-${i}`}
                d={`M 194 ${132 + i * 18} C 245 ${142 + i * 24} 268 ${y} 304 ${y}`}
                fill="none"
                stroke="#d6d6d6"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={1}
                className={fresh ? "pub-connector-drawing" : ""}
              />
            );
          })}
        </svg>

        <div className="relative z-10 grid h-full grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-3">
          {/* Article editor */}
          <div className="flex min-w-0 flex-col rounded-xl border border-border bg-surface px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-ink-3">
                Article
              </span>
              <span className="rounded-full bg-bg px-2 py-1 text-[8px] font-mono uppercase tracking-[0.18em] text-ink-3">
                {run.articleType}
              </span>
            </div>

            <h4 className="mt-3 text-[13px] font-bold leading-[1.2] tracking-[-0.01em] text-ink">
              {run.title}
            </h4>
            <p className="mt-2 line-clamp-3 text-[10.5px] leading-[1.45] text-ink-2">
              {run.excerpt}
            </p>

            <div className="mt-3 space-y-1.5 border-t border-border pt-3">
              {run.checks.map((check, i) => {
                const active = i < visibleChecks;
                return (
                  <motion.div
                    key={`${runIdx}-${check}`}
                    initial={false}
                    animate={{
                      opacity: active ? 1 : 0.42,
                      x: active ? 0 : -4,
                    }}
                    transition={{ duration: 0.28, ease }}
                    className="flex items-center gap-2 rounded-md bg-bg px-2 py-1.5"
                  >
                    <CheckIcon active={active} />
                    <span className="truncate text-[10.5px] font-medium text-ink">
                      {check}
                    </span>
                    <span className="ml-auto text-[8px] font-mono uppercase tracking-[0.16em] text-ink-3">
                      {active ? "Ready" : "Queued"}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto pt-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                <motion.div
                  className="h-full bg-ink"
                  initial={false}
                  animate={{
                    width: `${(visibleChecks / run.checks.length) * 100}%`,
                  }}
                  transition={{ duration: 0.36, ease }}
                />
              </div>
            </div>
          </div>

          {/* Owned website + off-site distribution */}
          <div className="flex min-w-0 flex-col gap-2.5">
            <div
              className={`rounded-xl border border-border bg-surface px-3 py-2.5 ${
                ownedFresh ? "pub-destination-land" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-ink-3">
                  Website blog
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[8px] font-mono uppercase tracking-[0.18em] ${
                    ownedLive
                      ? "bg-[#e8f3ec] text-[#1f6c45]"
                      : "bg-bg text-ink-3"
                  }`}
                >
                  {indexedCount > 0 ? "Indexed" : ownedLive ? "Live" : "Queued"}
                </span>
              </div>
              <div className="mt-2 rounded-lg border border-border bg-bg p-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                  <span className="min-w-0 truncate text-[10px] font-mono text-ink-2">
                    {run.ownedUrl}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-4/5 rounded-full bg-ink/75" />
                  <div className="h-1.5 w-full rounded-full bg-border" />
                  <div className="h-1.5 w-3/5 rounded-full bg-border" />
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-ink-3">
                  Off-site versions
                </span>
                <span className="text-[8px] font-mono tabular-nums text-ink-3">
                  {visibleDestinations}/{run.destinations.length}
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5">
                {run.destinations.map((destination, i) => {
                  const active = i < visibleDestinations;
                  const fresh =
                    phase === "distribute" && visibleDestinations === i + 1;
                  return (
                    <motion.div
                      key={`${runIdx}-${destination.kind}`}
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0.34,
                        y: active ? 0 : 5,
                      }}
                      transition={{ duration: 0.32, ease }}
                      className={`rounded-lg border border-border bg-bg px-2.5 py-2 ${
                        fresh ? "pub-destination-land" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full border ${
                            active
                              ? "border-ink bg-ink"
                              : "border-ink-3 bg-transparent"
                          }`}
                        />
                        <span className="min-w-0 truncate text-[10.5px] font-medium text-ink">
                          {destination.kind}
                        </span>
                        <span className="ml-auto shrink-0 text-[8px] font-mono uppercase tracking-[0.16em] text-ink-3">
                          {active ? "Live" : "Ready"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 pl-4">
                        <span className="shrink-0 text-[8px] font-mono uppercase tracking-[0.16em] text-ink-3">
                          {destination.label}
                        </span>
                        <span className="min-w-0 truncate text-[9px] font-mono text-ink-3">
                          {destination.url}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div className="rounded-lg border border-border bg-surface px-2 py-1.5">
                <div className="text-[7.5px] font-mono uppercase tracking-[0.16em] text-ink-3">
                  Live URLs
                </div>
                <div className="mt-0.5 text-[12px] font-mono font-bold tabular-nums text-ink">
                  {liveUrlCount}/{totalUrls}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface px-2 py-1.5">
                <div className="text-[7.5px] font-mono uppercase tracking-[0.16em] text-ink-3">
                  Indexed
                </div>
                <div className="mt-0.5 text-[12px] font-mono font-bold tabular-nums text-ink">
                  {indexedCount}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface px-2 py-1.5">
                <div className="text-[7.5px] font-mono uppercase tracking-[0.16em] text-ink-3">
                  Versions
                </div>
                <div className="mt-0.5 text-[12px] font-mono font-bold tabular-nums text-ink">
                  {ownedLive ? visibleDestinations + 1 : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
