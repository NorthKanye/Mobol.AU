"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import BrandingMark from "../BrandingMark";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

/**
 * Section 01 — Mark construction (standalone).
 *
 * Drives the same `.mark-s1` … `.mark-s6` CSS state machine that the
 * 2×2 BrandingMockup uses, but for a single full-row BrandingMark cell.
 * Phase durations are tuned so the recognisable "engineered" beat
 * (anchors → axes) lands inside the first 1.5s — viewers who scroll
 * past quickly still see the gesture.
 *
 * Reduced motion: stage is pinned at 6 (the clean final mark) so all
 * `.mark-s1` … `.mark-s6` classes are present from first paint.
 */
export default function BrandingMarkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(reduce ? 6 : 0);

  // Phases drive a stage counter 0 → 6 → reset.
  // Total loop ≈ 8s (6s build + 2.5s clean hold).
  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 600, tick: () => setStage(1) }, // anchors
      { duration: 550, tick: () => setStage(2) }, // crosshair axes
      { duration: 400, tick: () => setStage(3) }, // phi guides
      { duration: 1100, tick: () => setStage(4) }, // ring draws
      { duration: 1300, tick: () => setStage(5) }, // M stem draws
      { duration: 700, tick: () => setStage(6) }, // guides fade out
      { duration: 2500, tick: () => {} }, // hold the clean mark
      { duration: 0, tick: () => setStage(0) }, // reset for next loop
    ],
    [],
  );

  usePausedTimeline(ref, phases);

  const classes = [
    "brand-window",
    stage >= 1 && "show-grid",
    stage >= 4 && "draw-ring",
    stage >= 5 && "draw-stroke",
    ...Array.from({ length: Math.min(stage, 6) }, (_, i) => `mark-s${i + 1}`),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated brand mark being constructed on a grid — anchors, axes, golden-ratio guides, ring, and the M stem drawing on in sequence"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.04]"
    >
      <div
        className={`${classes} absolute inset-0 grid`}
        style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}
      >
        {/* Grid (single cell) so BrandingMark's `.bcell` — which has no
            explicit width/height — stretches to fill via grid-item default. */}
        <BrandingMark />
      </div>
    </div>
  );
}
