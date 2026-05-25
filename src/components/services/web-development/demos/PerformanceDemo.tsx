"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const metrics = [
  { name: "Performance", score: 98 },
  { name: "Accessibility", score: 100 },
  { name: "Best Practices", score: 95 },
  { name: "SEO", score: 100 },
] as const;

const vitals = [
  { name: "LCP", value: "1.2s", target: "< 2.5s" },
  { name: "FID", value: "8ms", target: "< 100ms" },
  { name: "CLS", value: "0.02", target: "< 0.1" },
  { name: "TTFB", value: "180ms", target: "< 800ms" },
] as const;

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export default function PerformanceDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState<number[]>(metrics.map(() => 0));
  const [showVitals, setShowVitals] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      {
        duration: 900,
        tick: () => {
          setAnalyzing(true);
          setScores(metrics.map(() => 0));
          setShowVitals(false);
        },
      },
      {
        duration: 1500,
        tick: () => {
          setAnalyzing(false);
          setScores(metrics.map((m) => m.score));
        },
      },
      {
        duration: 800,
        tick: () => setShowVitals(true),
      },
      {
        duration: 4500,
        tick: () => {},
      },
    ],
    []
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  // Reduced-motion: show the final state instantly
  const displayScores = prefersReducedMotion
    ? metrics.map((m) => m.score)
    : scores;
  const displayShowVitals = prefersReducedMotion ? true : showVitals;
  const displayAnalyzing = prefersReducedMotion ? false : analyzing;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of a Lighthouse performance report showing high scores and Core Web Vitals"
      className="relative w-full max-w-lg mx-auto"
    >
      <div
        className="bg-surface rounded-2xl overflow-hidden border border-black/[0.07]"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="px-6 py-4 border-b border-black/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-medium text-ink">
                Lighthouse Report
              </div>
              <div className="text-[11px] text-ink-3 font-mono uppercase tracking-[0.14em]">
                Performance analysis
              </div>
            </div>
          </div>
          {displayAnalyzing && (
            <motion.div
              className="flex items-center gap-2 text-[11px] text-ink-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.span
                className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Analyzing&hellip;
            </motion.div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, i) => (
              <div key={metric.name} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 64 64"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r={RING_R}
                      fill="none"
                      stroke="#e5e5e5"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r={RING_R}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      initial={false}
                      animate={{
                        strokeDashoffset:
                          RING_C - (RING_C * displayScores[i]) / 100,
                      }}
                      transition={{ duration: 1.1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[16px] font-bold text-ink tabular-nums">
                      {displayScores[i]}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-ink-2">{metric.name}</div>
              </div>
            ))}
          </div>

          {/* Core Web Vitals + summary are always mounted and in flow, so
              the card height is constant. A skeleton overlay (absolutely
              positioned — out of flow) covers them during the analysing /
              score-fill phase, then fades out to reveal the real report.
              The card never resizes, so nothing below the demo reflows. */}
          <div className="relative">
            <div>
              <div className="text-[10px] font-medium text-ink-3 uppercase tracking-[0.18em] mb-3 font-mono">
                Core Web Vitals
              </div>
              <div className="grid grid-cols-2 gap-3">
                {vitals.map((vital) => (
                  <div
                    key={vital.name}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-ink">
                        {vital.name}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    </div>
                    <div className="text-[16px] font-bold text-ink tabular-nums">
                      {vital.value}
                    </div>
                    <div className="text-[10px] text-ink-3">{vital.target}</div>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 p-4 rounded-xl border"
                style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-[#166534]">
                      All metrics pass Core Web Vitals
                    </div>
                    <div className="text-[11px] text-[#15803d]">
                      Ready for production traffic.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0 bg-surface"
              initial={false}
              animate={{ opacity: displayShowVitals ? 0 : 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ pointerEvents: "none" }}
              aria-hidden="true"
            >
              <div className="text-[10px] font-medium text-ink-3 uppercase tracking-[0.18em] mb-3 font-mono">
                Core Web Vitals
              </div>
              <div className="grid grid-cols-2 gap-3">
                {vitals.map((vital) => (
                  <div
                    key={vital.name}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    <div className="flex items-center justify-between mb-1 h-4">
                      <span className="h-2.5 w-9 rounded bg-[#e3e3e3]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e3e3e3]" />
                    </div>
                    <div className="h-4 w-12 rounded bg-[#e3e3e3] mb-1" />
                    <div className="h-2.5 w-10 rounded bg-[#ededed]" />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl border border-black/[0.06] bg-[#f5f5f5]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e3e3e3] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="h-2.5 w-36 rounded bg-[#e3e3e3]" />
                    <div className="h-2.5 w-28 rounded bg-[#ededed]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {!prefersReducedMotion && (
        <motion.div
          className="absolute -top-3 right-4 flex items-center gap-1.5 bg-[#22c55e] text-white px-2.5 py-1 rounded-full shadow-md text-[11px] font-medium"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Fast
        </motion.div>
      )}
    </div>
  );
}
