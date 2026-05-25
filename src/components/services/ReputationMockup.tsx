"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Reputation Management — Services bottom card 06 ("Reputation Studio").
 *
 * Dashboard mockup laid out vertically: header → three KPI blocks
 * (avg rating · placements live · response rate) → Press & Coverage
 * panel → Review Pulse table (Google · Trustpilot · Facebook) →
 * footer with monitored count + Review queue CTA.
 *
 * Motion: phase-based reveal on first viewport entry.
 *   1. KPI numbers tick up in parallel via easeOutQuart (rAF).
 *   2. Press & Coverage panel fades up.
 *   3. Review Pulse rows stagger in.
 *   4. Footer + Review queue button fade in.
 * Plays once per session (`hasPlayedRef`); no replay on scroll-flap.
 * IntersectionObserver toggles `.rep-paused` to freeze any in-flight
 * motion. Reduced-motion short-circuits to the resolved frame.
 */

type Phase = "idle" | "kpi" | "press" | "reviews" | "footer" | "done";

const KPI_TARGETS = { rating: 4.9, placements: 18, responseRate: 92 } as const;
const KPI_DURATION_MS = 700;
const PRESS_HOLD_MS = 320;
const REVIEW_STAGGER_MS = 110;
const REVIEW_FADE_DUR_MS = 460;
const FOOTER_DELAY_MS = 220;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function StarSvg({
  size,
  fill,
}: {
  size: number;
  fill: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      aria-hidden="true"
    >
      <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
    </svg>
  );
}

function TrendingUpIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

function CheckCircleIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5l3 3 5-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285f4"
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.598 4.598 0 0 1-1.996 3.018v2.51h3.232c1.891-1.741 2.982-4.305 2.982-7.351z"
      />
      <path
        fill="#34a853"
        d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.232-2.51c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H3.064v2.59A9.996 9.996 0 0 0 12 22z"
      />
      <path
        fill="#fbbc05"
        d="M6.405 13.9A6.005 6.005 0 0 1 6.09 12c0-.659.114-1.3.314-1.9V7.51H3.064A9.997 9.997 0 0 0 2 12c0 1.614.387 3.14 1.064 4.49l3.341-2.59z"
      />
      <path
        fill="#ea4335"
        d="M12 5.977c1.469 0 2.786.505 3.823 1.496l2.868-2.868C16.96 2.99 14.696 2 12 2A9.996 9.996 0 0 0 3.064 7.51l3.341 2.59C7.19 7.737 9.395 5.977 12 5.977z"
      />
    </svg>
  );
}

function TrustpilotMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="#00b67a" />
      <path
        d="M12 5l1.9 4.4 4.8.4-3.6 3.1 1.1 4.7L12 15.2 7.8 17.6l1.1-4.7L5.3 9.8l4.8-.4z"
        fill="#ffffff"
      />
    </svg>
  );
}

type Pill = { bg: string; fg: string };
const PILLS = {
  live: { bg: "#ecf6f0", fg: "#1f7a4a" } satisfies Pill,
  scheduled: { bg: "#eaf0fc", fg: "#1a4cbe" } satisfies Pill,
  responded: { bg: "#ecf6f0", fg: "#1f7a4a" } satisfies Pill,
  needsReply: { bg: "#fdf3e3", fg: "#7a4d00" } satisfies Pill,
  escalated: { bg: "#fbecec", fg: "#a02828" } satisfies Pill,
};

function StatusPill({
  label,
  pill,
  withDot = false,
}: {
  label: string;
  pill: Pill;
  withDot?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold tracking-tight whitespace-nowrap"
      style={{ background: pill.bg, color: pill.fg }}
    >
      {withDot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: pill.fg }}
        />
      )}
      {label}
    </span>
  );
}

type Review = {
  id: string;
  name: string;
  rating: number;
  filledStars: number; // 0–5
  Mark: React.ComponentType;
  status: { label: string; pill: Pill };
};

const REVIEWS: Review[] = [
  {
    id: "google",
    name: "Google",
    rating: 4.9,
    filledStars: 5,
    Mark: GoogleG,
    status: { label: "Responded", pill: PILLS.responded },
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    rating: 4.8,
    filledStars: 5,
    Mark: TrustpilotMark,
    status: { label: "Needs reply", pill: PILLS.needsReply },
  },
  {
    id: "facebook",
    name: "Facebook",
    rating: 4.6,
    filledStars: 5,
    Mark: () => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="https://s.magecdn.com/social/tc-facebook.svg"
        alt=""
        aria-hidden="true"
        width={14}
        height={14}
      />
    ),
    status: { label: "Escalated", pill: PILLS.escalated },
  },
];

export default function ReputationMockup() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [kpiProgress, setKpiProgress] = useState(0); // 0–1
  const hasPlayedRef = useRef(false);

  // IntersectionObserver — kick off the demo on first entry only.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = (matches: boolean) => {
      setReducedMotion(matches);
      if (matches) {
        hasPlayedRef.current = true;
        setPhase("done");
        setKpiProgress(1);
      }
    };
    applyMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => applyMotion(e.matches);
    mq.addEventListener("change", onChange);

    const obs = new IntersectionObserver(
      ([entry]) => {
        const offscreen = !entry.isIntersecting;
        root.classList.toggle("rep-paused", offscreen);
        if (!entry.isIntersecting) return;
        if (hasPlayedRef.current) return;
        setPhase("kpi");
        setKpiProgress(0);
      },
      { threshold: 0.1 },
    );
    obs.observe(root);
    return () => {
      obs.disconnect();
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Phase machine: kpi → press → reviews → footer → done.
  useEffect(() => {
    if (reducedMotion) return;

    if (phase === "kpi") {
      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / KPI_DURATION_MS, 1);
        setKpiProgress(easeOutQuart(progress));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setPhase("press");
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    if (phase === "press") {
      const t = setTimeout(() => setPhase("reviews"), PRESS_HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === "reviews") {
      const totalDur =
        REVIEW_STAGGER_MS * (REVIEWS.length - 1) + REVIEW_FADE_DUR_MS;
      const t = setTimeout(() => setPhase("footer"), totalDur);
      return () => clearTimeout(t);
    }

    if (phase === "footer") {
      const t = setTimeout(() => {
        hasPlayedRef.current = true;
        setPhase("done");
      }, FOOTER_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [phase, reducedMotion]);

  // Derived display values
  const ratingDisplay = (KPI_TARGETS.rating * kpiProgress).toFixed(1);
  const placementsDisplay = Math.round(
    KPI_TARGETS.placements * kpiProgress,
  ).toString();
  const responseDisplay = Math.round(
    KPI_TARGETS.responseRate * kpiProgress,
  ).toString();

  const showPress = reducedMotion || ["press", "reviews", "footer", "done"].includes(phase);
  const showReviews = reducedMotion || ["reviews", "footer", "done"].includes(phase);
  const showFooter = reducedMotion || ["footer", "done"].includes(phase);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Reputation Studio dashboard: 4.9 average rating across Google, Trustpilot and Facebook, 18 placements live, 92% response rate, 128 reviews monitored."
      className="absolute inset-0 bg-surface flex flex-col px-5 pt-4 pb-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
          Reputation Studio
        </span>
        <StatusPill label="Protected" pill={PILLS.live} withDot />
      </div>

      {/* KPI row */}
      <div className="mt-3 flex items-stretch">
        <div className="flex-1 flex flex-col items-start gap-0.5 pr-2">
          <div className="flex items-center gap-1">
            <StarSvg size={12} fill="#f5b700" />
            <span className="text-[18px] font-bold tabular-nums leading-none text-ink">
              {ratingDisplay}
            </span>
          </div>
          <span className="text-[8.5px] text-ink-2">avg rating</span>
        </div>
        <div className="flex-1 flex flex-col items-start gap-0.5 pl-3 pr-2 border-l border-border">
          <div className="flex items-center gap-1">
            <TrendingUpIcon size={12} color="#1f7a4a" />
            <span className="text-[18px] font-bold tabular-nums leading-none text-ink">
              {placementsDisplay}
            </span>
          </div>
          <span className="text-[8.5px] text-ink-2">placements live</span>
        </div>
        <div className="flex-1 flex flex-col items-start gap-0.5 pl-3 border-l border-border">
          <div className="flex items-center gap-1">
            <CheckCircleIcon size={12} color="#1f7a4a" />
            <span className="text-[18px] font-bold tabular-nums leading-none text-ink">
              {responseDisplay}%
            </span>
          </div>
          <span className="text-[8.5px] text-ink-2">response rate</span>
        </div>
      </div>

      {/* Press & Coverage */}
      <div
        className={`mt-3 rounded-lg border border-border bg-surface px-3 py-2.5 ${
          reducedMotion
            ? ""
            : showPress
              ? "animate-rep-press-in"
              : "opacity-0"
        }`}
      >
        <p className="text-[8.5px] font-semibold tracking-[0.18em] uppercase text-ink-2">
          Press &amp; Coverage
        </p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <Image
            src="/reputation-image.png"
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            className="shrink-0 w-9 h-9 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[10.5px] font-semibold text-ink truncate">
              Founder interview published
            </p>
            <p className="text-[9px] text-ink-2 truncate">
              Positioning our vision for the future
            </p>
          </div>
          <StatusPill label="Live" pill={PILLS.live} withDot />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[9.5px] text-ink-body">
            Brand feature secured
          </span>
          <StatusPill label="Scheduled" pill={PILLS.scheduled} />
        </div>
      </div>

      {/* Review Pulse */}
      <div className="mt-3">
        <p className="text-[8.5px] font-semibold tracking-[0.18em] uppercase text-ink-2">
          Review Pulse
        </p>
        <div className="mt-1">
          {REVIEWS.map((r, i) => {
            const Mark = r.Mark;
            const isLast = i === REVIEWS.length - 1;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-2 py-1.5 ${
                  isLast ? "" : "border-b border-border"
                } ${
                  reducedMotion
                    ? ""
                    : showReviews
                      ? "animate-rep-badge-in"
                      : "opacity-0"
                }`}
                style={{
                  animationDelay:
                    !reducedMotion && showReviews
                      ? `${i * REVIEW_STAGGER_MS}ms`
                      : undefined,
                }}
              >
                <Mark />
                <span className="text-[10.5px] font-semibold text-ink shrink-0">
                  {r.name}
                </span>
                <span className="flex items-center gap-px ml-auto">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarSvg
                      key={idx}
                      size={9}
                      fill={idx < r.filledStars ? "#f5b700" : "#e0ddd6"}
                    />
                  ))}
                </span>
                <span className="text-[10.5px] font-bold tabular-nums text-ink shrink-0">
                  {r.rating.toFixed(1)}
                </span>
                <StatusPill label={r.status.label} pill={r.status.pill} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`mt-auto pt-2 border-t border-border flex items-center justify-between ${
          reducedMotion
            ? ""
            : showFooter
              ? "animate-rep-press-in"
              : "opacity-0"
        }`}
      >
        <span className="text-[9.5px] text-ink-2">
          128 reviews monitored
        </span>
        <span
          role="button"
          aria-disabled="true"
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10.5px] font-semibold text-white select-none"
          style={{ background: "#1a4cbe" }}
        >
          Review queue
          <ChevronRightIcon />
        </span>
      </div>
    </div>
  );
}
