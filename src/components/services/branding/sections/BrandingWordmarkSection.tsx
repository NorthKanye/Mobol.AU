"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { WORDMARK_LABELS } from "../constants";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

/**
 * Section 02 — Wordmark studies (standalone).
 *
 * Five typographic studies stacked in the same slot. We don't reuse
 * BrandingWordmark verbatim because that component is sized for a
 * 2×2 cell with a 46px type ceiling — at full-row width we want the
 * type roughly twice that, and the labels read better as a small
 * meta strip beneath the wordmark itself rather than the cramped
 * "0.x / 05" pager the mockup uses.
 *
 * Reduced motion: pinned on the final Lockup study (idx 4).
 */
export default function BrandingWordmarkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(reduce ? 4 : 0);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 1500, tick: () => setIdx(0) },
      { duration: 1500, tick: () => setIdx(1) },
      { duration: 1500, tick: () => setIdx(2) },
      { duration: 1500, tick: () => setIdx(3) },
      { duration: 2500, tick: () => setIdx(4) }, // hold the lockup
    ],
    [],
  );

  usePausedTimeline(ref, phases);

  const styleLabel = WORDMARK_LABELS[Math.max(0, idx)];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Five wordmark studies cycling through display, editorial, mono, all-caps, and the final mark + wordmark lockup"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.04]"
    >
      <div className="brand-window absolute inset-0 flex flex-col items-stretch justify-center px-10 lg:px-16">
        <div className="wm-stack relative flex-1 flex items-center justify-center min-h-0">
          {/* Display · Inter Tight 800 */}
          <div
            className={`wm-row ${idx === 0 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: "clamp(56px, 8vw, 112px)",
              lineHeight: 1,
            }}
          >
            Mobol
          </div>
          {/* Editorial · Geist 300 light */}
          <div
            className={`wm-row ${idx === 1 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              letterSpacing: "0.02em",
              fontSize: "clamp(58px, 8.4vw, 116px)",
              lineHeight: 1,
            }}
          >
            Mobol
          </div>
          {/* Mono · JetBrains 500 lowercase */}
          <div
            className={`wm-row ${idx === 2 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              fontSize: "clamp(50px, 7vw, 96px)",
              lineHeight: 1,
            }}
          >
            mobol
          </div>
          {/* Caps · Inter Tight 600 / +340 */}
          <div
            className={`wm-row ${idx === 3 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              letterSpacing: "0.34em",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              lineHeight: 1,
            }}
          >
            M O B O L
          </div>
          {/* Lockup · mark + wordmark */}
          <div
            className={`wm-row ${idx === 4 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: "clamp(56px, 8vw, 112px)",
              lineHeight: 1,
            }}
          >
            <span
              className="inline-block align-middle rounded-full bg-[var(--color-accent)]"
              style={{
                width: "0.55em",
                height: "0.55em",
                marginRight: "0.18em",
                transform: "translateY(-0.08em)",
              }}
            />
            Mobol
          </div>
        </div>

        {/* Meta strip — wordmark spec for the current study */}
        <div
          className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-border text-ink-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span>{styleLabel}</span>
          <span className="text-ink-3 tabular-nums">
            {`0.${Math.max(0, idx) + 1} / 05`}
          </span>
        </div>
      </div>
    </div>
  );
}
