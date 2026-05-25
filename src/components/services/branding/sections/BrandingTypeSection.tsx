"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

/**
 * Section 04 — Type system as a live hierarchy composer.
 *
 * Five-phase animation:
 *   0  Specimen — giant "Aa" + metadata column (Family / Wts / Track)
 *   1  Aa shrinks and slides to top-left; H1 types in below it
 *   2  H2 + body + caption cascade in via staggered AnimatePresence
 *   3  Baseline grid lines fade in behind the text; size labels
 *      appear in the gutter
 *   4  Hold the composed mini-page
 *
 * The reflow from "specimen layout" to "composed page" uses motion's
 * `layout` prop on the Aa block so the transition between the giant
 * centered specimen and the small top-corner glyph is a FLIP, not a
 * crossfade — it's the "the system goes from study to applied" beat.
 *
 * Reduced motion: lands directly in phase 3 (fully composed mini-page).
 */

const HEADLINE = "Found, and worth the click.";
const SUBHEAD = "Page-one placement for the queries your customers search.";
const BODY =
  "We treat the type system as part of the build — the same scale and rhythm whether it's a hero, a footer, or a CMS body field.";
const CAPTION = "Display + body in Geist Sans. Mono for technical labels.";

type TypeLineProps = {
  show: boolean;
  delay: number;
  size: number;
  weight: number;
  tracking: string;
  family?: "sans" | "mono";
  className?: string;
  showLabel: boolean;
  label: string;
  children: React.ReactNode;
};

function TypeLine({
  show,
  delay,
  size,
  weight,
  tracking,
  family = "sans",
  className,
  showLabel,
  label,
  children,
}: TypeLineProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: show ? 1 : 0,
          y: show ? 0 : 12,
        }}
        transition={{ duration: 0.55, delay: show ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
        className={`text-ink ${className ?? ""}`}
        style={{
          fontFamily: family === "mono" ? "var(--font-mono)" : "var(--font-sans)",
          fontWeight: weight,
          letterSpacing: tracking,
          fontSize: `${size}px`,
          lineHeight: 1.15,
        }}
      >
        {children}
      </motion.div>
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLabel ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute -left-14 top-1/2 -translate-y-1/2 text-ink-3 tabular-nums hidden lg:inline"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export default function BrandingTypeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(reduce ? 4 : 0);

  // Phases drive a single `phase` 0..4, then loop.
  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 1200, tick: () => setPhase(0) }, // specimen
      { duration: 1100, tick: () => setPhase(1) }, // shrink + H1 types in
      { duration: 1600, tick: () => setPhase(2) }, // body cascade
      { duration: 1500, tick: () => setPhase(3) }, // baseline grid + gutter
      { duration: 4500, tick: () => setPhase(4) }, // hold
      { duration: 0, tick: () => setPhase(0) }, // reset
    ],
    [],
  );

  usePausedTimeline(ref, phases);

  const composed = phase >= 1;
  const showH1 = phase >= 1;
  const showRest = phase >= 2;
  const showGrid = phase >= 3;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="The type system composing itself — a giant Aa specimen shrinks to the corner while a headline, subhead, body, and caption cascade in on a baseline grid"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.04]"
    >
      <div className="absolute inset-0 p-8 lg:p-12 flex flex-col">
        {/* Top row: Aa specimen + meta column when expanded; or Aa shrunk to corner */}
        <div className="flex items-start gap-6">
          <motion.div
            layout
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-ink leading-none"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              fontSize: composed ? "44px" : "clamp(120px, 16vw, 180px)",
              lineHeight: 0.85,
            }}
          >
            Aa
          </motion.div>

          {/* Meta column — only shown in phase 0 */}
          <AnimatePresence>
            {!composed && (
              <motion.div
                key="meta"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-2 pt-3 lg:pt-6"
              >
                {[
                  { label: "Family", value: "Geist Sans" },
                  { label: "Wts", value: "300 / 600 / 800" },
                  { label: "Track", value: "−0.04 → +0.34" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline gap-3"
                  >
                    <span
                      className="text-ink-3"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="text-ink"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "13px",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Composed mini-page */}
        <div className="relative mt-6 lg:ml-16 flex-1 flex flex-col justify-center gap-4 lg:gap-5">
          {/* Baseline grid behind the text */}
          <AnimatePresence>
            {showGrid && (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
              >
                {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                  <motion.div
                    key={y}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.5 }}
                    transition={{
                      duration: 0.5,
                      delay: y * 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute left-0 right-0 h-px bg-border origin-left"
                    style={{ top: `${y * 100}%` }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* H1 */}
          <TypeLine
            show={showH1}
            delay={0.05}
            size={40}
            weight={700}
            tracking="-0.025em"
            showLabel={showGrid}
            label="40 / −0.025"
          >
            {HEADLINE}
          </TypeLine>

          {/* H2 / subhead */}
          <TypeLine
            show={showRest}
            delay={0.05}
            size={20}
            weight={500}
            tracking="-0.01em"
            showLabel={showGrid}
            label="20 / −0.01"
            className="text-ink-body"
          >
            {SUBHEAD}
          </TypeLine>

          {/* Body */}
          <TypeLine
            show={showRest}
            delay={0.2}
            size={15}
            weight={400}
            tracking="0em"
            showLabel={showGrid}
            label="15 / 1.55"
            className="text-ink-body max-w-[44ch]"
          >
            {BODY}
          </TypeLine>

          {/* Caption — mono */}
          <TypeLine
            show={showRest}
            delay={0.35}
            size={11}
            weight={500}
            tracking="0.08em"
            family="mono"
            showLabel={showGrid}
            label="11 · mono"
            className="text-ink-3 uppercase"
          >
            {CAPTION}
          </TypeLine>
        </div>
      </div>
    </div>
  );
}
