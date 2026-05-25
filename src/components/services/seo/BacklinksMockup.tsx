"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Backlinks & Authority mockup (SEO section 04).
 *
 * Quality Link Ledger: a vetted placement becomes a live contextual link to a
 * target page, then the authority and referring-domain metrics compound.
 */

type Phase = "incoming" | "vetting" | "approved" | "transfer" | "compound" | "hold" | "reset";

type Placement = {
  id: string;
  source: string;
  kind: string;
  detail: string;
  da: number;
  anchor: string;
  chips: string[];
  authorityGain: number;
};

type LivePlacement = {
  id: string;
  source: string;
  kind: string;
};

const ease = [0.16, 1, 0.3, 1] as const;
const CHECKS = ["Relevant topic", "Real audience", "Natural anchor"];

const SEED_AUTHORITY = 41;
const SEED_DOMAINS = 43;
const SEED_QUALITY_LINKS = 0;

const SEED_LIVE_PLACEMENTS: LivePlacement[] = [
  { id: "seed-resource", source: "Local resource", kind: "Guide" },
  { id: "seed-partner", source: "Partner citation", kind: "Directory" },
];

const PLACEMENTS: Placement[] = [
  {
    id: "au-press",
    source: "AU business press",
    kind: "Founder profile",
    detail: "Editorial mention with service-page context",
    da: 78,
    anchor: "web design Perth",
    chips: ["AU", "Editorial", "Relevant"],
    authorityGain: 4,
  },
  {
    id: "industry-resource",
    source: "Industry resource",
    kind: "Guide inclusion",
    detail: "Curated supplier page with a natural anchor",
    da: 64,
    anchor: "Perth web design team",
    chips: ["Follow", "Guide", "Qualified"],
    authorityGain: 3,
  },
  {
    id: "partner-citation",
    source: "Partner citation",
    kind: "Supplier directory",
    detail: "Verified profile linking to the target service",
    da: 52,
    anchor: "client web services",
    chips: ["Verified", "Partner", "Niche"],
    authorityGain: 2,
  },
  {
    id: "community-citation",
    source: "Community citation",
    kind: "Resource update",
    detail: "Useful local reference with a clean service link",
    da: 58,
    anchor: "local web design support",
    chips: ["Local", "Resource", "Clean"],
    authorityGain: 2,
  },
];

const FINAL_AUTHORITY = SEED_AUTHORITY + PLACEMENTS.reduce(
  (total, item) => total + item.authorityGain,
  0,
);
const FINAL_DOMAINS = SEED_DOMAINS + PLACEMENTS.length;

function authorityColor(value: number) {
  if (value >= 70) return "#1f6c45";
  if (value >= 55) return "#6b4f00";
  return "#666";
}

function resetLedger() {
  return {
    authority: SEED_AUTHORITY,
    domains: SEED_DOMAINS,
    qualityLinks: SEED_QUALITY_LINKS,
    livePlacements: SEED_LIVE_PLACEMENTS,
    activeChecks: 0,
  };
}

export default function BacklinksMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pausedOffscreen, setPausedOffscreen] = useState(false);

  const [phase, setPhase] = useState<Phase>("incoming");
  const [cycleIdx, setCycleIdx] = useState(0);
  const [loopId, setLoopId] = useState(0);
  const [activeChecks, setActiveChecks] = useState(0);
  const [authority, setAuthority] = useState(SEED_AUTHORITY);
  const [domains, setDomains] = useState(SEED_DOMAINS);
  const [qualityLinks, setQualityLinks] = useState(SEED_QUALITY_LINKS);
  const [livePlacements, setLivePlacements] = useState<LivePlacement[]>(SEED_LIVE_PLACEMENTS);
  const [targetPulse, setTargetPulse] = useState(false);
  const [authorityRing, setAuthorityRing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const placement = PLACEMENTS[cycleIdx];
  const checksComplete = activeChecks >= CHECKS.length;
  const showConnector = phase === "transfer" || phase === "compound" || phase === "hold";
  const placementApproved = phase === "approved" || showConnector;
  const queueVisible = phase !== "reset";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) {
      const finalAuthority = PLACEMENTS.reduce(
        (score, item) => score + item.authorityGain,
        SEED_AUTHORITY,
      );
      setActiveChecks(CHECKS.length);
      setAuthority(finalAuthority);
      setDomains(SEED_DOMAINS + PLACEMENTS.length);
      setQualityLinks(SEED_QUALITY_LINKS + PLACEMENTS.length);
      setLivePlacements([
        ...PLACEMENTS.map((item) => ({
          id: item.id,
          source: item.source,
          kind: item.kind,
        })).reverse(),
        ...SEED_LIVE_PLACEMENTS,
      ].slice(0, 4));
      setPhase("hold");
      return;
    }

    if (typeof window.IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting;
        root.classList.toggle("bl-paused", offscreen);
        setPausedOffscreen(offscreen);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "incoming") return;
    setActiveChecks(0);
    setTargetPulse(false);
    setAuthorityRing(false);
    const t = setTimeout(() => setPhase("vetting"), 720);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "vetting") return;
    if (activeChecks >= CHECKS.length) {
      const t = setTimeout(() => setPhase("approved"), 360);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setActiveChecks((count) => count + 1),
      activeChecks === 0 ? 260 : 320,
    );
    return () => clearTimeout(t);
  }, [phase, activeChecks, reducedMotion, pausedOffscreen]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "approved") return;
    const t = setTimeout(() => setPhase("transfer"), 540);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "transfer") return;
    const t = setTimeout(() => setPhase("compound"), 720);
    return () => clearTimeout(t);
  }, [phase, reducedMotion, pausedOffscreen]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "compound") return;

    const startAuthority = authority;
    const targetAuthority = startAuthority + placement.authorityGain;
    const startTime = performance.now();
    const duration = 760;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setAuthority(Math.round(startAuthority + (targetAuthority - startAuthority) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    setDomains((count) => count + 1);
    setQualityLinks((count) => count + 1);
    setLivePlacements((items) => [
      { id: placement.id, source: placement.source, kind: placement.kind },
      ...items,
    ].slice(0, 4));
    setTargetPulse(true);
    setAuthorityRing(true);

    const pulseTimer = setTimeout(() => {
      setTargetPulse(false);
      setAuthorityRing(false);
    }, 680);
    const nextTimer = setTimeout(() => setPhase("hold"), 880);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(pulseTimer);
      clearTimeout(nextTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pausedOffscreen, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "hold") return;

    const t = setTimeout(() => {
      const nextIdx = cycleIdx + 1;
      if (nextIdx >= PLACEMENTS.length) {
        setPhase("reset");
      } else {
        setCycleIdx(nextIdx);
        setPhase("incoming");
      }
    }, 1900);

    return () => clearTimeout(t);
  }, [phase, cycleIdx, reducedMotion, pausedOffscreen]);

  useEffect(() => {
    if (reducedMotion || pausedOffscreen) return;
    if (phase !== "reset") return;

    setResetting(true);
    const fadeTimer = setTimeout(() => {
      const seed = resetLedger();
      setAuthority(seed.authority);
      setDomains(seed.domains);
      setQualityLinks(seed.qualityLinks);
      setLivePlacements(seed.livePlacements);
      setActiveChecks(seed.activeChecks);
      setCycleIdx(0);
      setLoopId((id) => id + 1);
    }, 340);
    const nextTimer = setTimeout(() => {
      setResetting(false);
      setPhase("incoming");
    }, 720);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(nextTimer);
    };
  }, [phase, reducedMotion, pausedOffscreen]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated authority ledger: a vetted placement becomes a live contextual link to a target service page, then referring domains and authority metrics compound."
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/[0.04] bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <motion.div
        className="flex h-full flex-col"
        animate={{ opacity: resetting ? 0.18 : 1 }}
        transition={{ duration: 0.28, ease }}
        aria-hidden="true"
      >
        <div className="flex h-[13%] min-h-[34px] items-center justify-between border-b border-border px-2.5 sm:min-h-[42px] sm:px-3.5">
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-ink-3">
              Authority ledger
            </p>
            <p className="mt-0.5 hidden text-[10px] font-medium text-ink sm:block">
              Contextual link built for one target page
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f3ec] px-1.5 py-1 sm:px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1f6c45]" />
            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#1f6c45] sm:text-[8px] sm:tracking-[0.18em]">
              Quality over count
            </span>
          </span>
        </div>

        <div className="relative grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr]">
          {showConnector && (
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 42 33 C 51 29, 58 25, 67 29"
                fill="none"
                stroke="#111"
                strokeWidth="0.45"
                strokeLinecap="round"
                pathLength="1"
                className="bl-transfer-line"
              />
            </svg>
          )}

          <div className="flex min-w-0 flex-col border-r border-border px-2 py-2 sm:px-3 sm:py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ink-3 sm:text-[8px] sm:tracking-[0.22em]">
                Placement queue
              </span>
              <span className="rounded-full border border-border bg-bg px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-ink-3 sm:px-2 sm:text-[8px] sm:tracking-[0.16em]">
                Outreach
              </span>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <AnimatePresence mode="wait">
                {queueVisible && (
                  <motion.div
                    key={`placement-${loopId}-${placement.id}`}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: placementApproved ? 0.985 : 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.38, ease }}
                    className={`rounded-xl border bg-surface px-2 py-1.5 sm:px-3 sm:py-2.5 ${
                      placementApproved ? "border-ink/20" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold tracking-[-0.01em] text-ink sm:text-[12px]">
                          {placement.source}
                        </p>
                        <p className="mt-0.5 truncate text-[9px] text-ink-body sm:text-[10px]">
                          {placement.kind}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-md bg-bg px-1.5 py-0.5 font-mono text-[8px] font-bold tabular-nums sm:py-1 sm:text-[9px]"
                        style={{ color: authorityColor(placement.da) }}
                      >
                        DA {placement.da}
                      </span>
                    </div>
                    <p className="mt-2 hidden text-[10px] leading-snug text-ink-3 sm:line-clamp-2">
                      {placement.detail}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2">
                      {placement.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-border bg-bg px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.15em] text-ink-3"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hidden grid-cols-2 gap-1.5 sm:grid">
                {PLACEMENTS.filter((item) => item.id !== placement.id)
                  .slice(0, 2)
                  .map((item) => (
                    <div
                      key={`ghost-${item.id}`}
                      className="rounded-lg border border-border bg-bg/70 px-2 py-1.5 opacity-70"
                    >
                      <p className="truncate text-[9px] font-medium text-ink">{item.source}</p>
                      <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.14em] text-ink-3">
                        {item.kind}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-auto rounded-xl border border-border bg-bg px-2 py-1.5 sm:px-2.5 sm:py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ink-3 sm:text-[8px] sm:tracking-[0.22em]">
                  Vetting
                </span>
                <span className="font-mono text-[7px] tabular-nums text-ink-3 sm:text-[8px]">
                  {activeChecks}/{CHECKS.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {CHECKS.map((check, index) => {
                  const active = index < activeChecks;
                  return (
                    <div
                      key={check}
                      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-1 transition-colors sm:px-2 ${
                        active
                          ? "border-ink bg-surface text-ink"
                          : "border-border bg-bg text-ink-3"
                      }`}
                    >
                      <span
                        className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-ink bg-ink text-surface"
                            : "border-border bg-bg text-transparent"
                        }`}
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
                        </svg>
                      </span>
                      <span className="max-w-[76px] truncate text-[8px] font-medium sm:max-w-none sm:text-[9px]">
                        {check}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-col px-2 py-2 sm:px-3 sm:py-3">
            <div
              className={`relative rounded-xl border bg-surface px-2 py-2 sm:px-3 sm:py-3 ${
                targetPulse ? "bl-target-pulse border-ink/20" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ink-3 sm:text-[8px] sm:tracking-[0.22em]">
                  Target page
                </span>
                <span className="rounded-full bg-ink px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white sm:px-2 sm:tracking-[0.16em]">
                  Live
                </span>
              </div>
              <p className="mt-2 hidden truncate font-mono text-[9px] text-ink-3 sm:block">
                client.com.au/services/perth-web-design
              </p>
              <p className="mt-1 text-[11px] font-semibold tracking-[-0.01em] text-ink sm:text-[13px]">
                Perth web design team
              </p>
              <div className="mt-2 rounded-lg bg-bg px-2 py-1.5 sm:mt-3 sm:px-2.5 sm:py-2">
                <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-ink-3 sm:tracking-[0.18em]">
                  Anchor context
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="max-w-full truncate rounded-full bg-ink px-1.5 py-1 text-[9px] font-medium text-white sm:px-2 sm:text-[10px]">
                    {placement.anchor}
                  </span>
                  {checksComplete && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, ease }}
                      className="hidden font-mono text-[8px] uppercase tracking-[0.16em] text-[#1f6c45] sm:inline"
                    >
                      approved
                    </motion.span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 min-h-0 flex-1 rounded-xl border border-border bg-bg px-2 py-1.5 sm:mt-2.5 sm:px-2.5 sm:py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ink-3 sm:text-[8px] sm:tracking-[0.22em]">
                  Live referring domains
                </span>
                {authorityRing && (
                  <span className="bl-authority-ring rounded-full bg-[#e8f3ec] px-1.5 py-0.5 font-mono text-[7px] font-bold text-[#1f6c45]">
                    +1
                  </span>
                )}
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <AnimatePresence initial={false}>
                  {livePlacements.map((item, index) => (
                    <motion.div
                      key={`${loopId}-${item.id}`}
                      layout
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.32, ease }}
                      className={`items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2 py-1 sm:py-1.5 ${
                        index > 2 ? "hidden sm:flex" : "flex"
                      } ${
                        index === 0 && phase === "compound" ? "bl-ledger-chip-land" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-medium text-ink sm:text-[10px]">
                          {item.source}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.14em] text-ink-3">
                          {item.kind}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#e8f3ec] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-[#1f6c45]">
                        linked
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="grid h-[15%] min-h-[40px] grid-cols-3 border-t border-border bg-bg sm:min-h-[46px]">
          <Metric label="Referring domains" value={`${SEED_DOMAINS} -> ${domains}`} target={FINAL_DOMAINS} />
          <Metric label="Authority" value={`${SEED_AUTHORITY} -> ${authority}`} target={FINAL_AUTHORITY} />
          <Metric label="Quality links" value={`+${qualityLinks}`} target={PLACEMENTS.length} />
        </div>
      </motion.div>
    </div>
  );
}

function Metric({
  label,
  value,
  target,
}: {
  label: string;
  value: string;
  target: number;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-center border-r border-border px-2 last:border-r-0 sm:px-3">
      <span className="truncate font-mono text-[6px] uppercase tracking-[0.14em] text-ink-3 sm:text-[7px] sm:tracking-[0.18em]">
        {label}
      </span>
      <span className="mt-0.5 font-mono text-[10px] font-bold tabular-nums text-ink sm:text-[13px]">
        {value}
        <span className="ml-0.5 text-[7px] font-medium text-ink-3 sm:ml-1 sm:text-[9px]">
          /{target}
        </span>
      </span>
    </div>
  );
}
