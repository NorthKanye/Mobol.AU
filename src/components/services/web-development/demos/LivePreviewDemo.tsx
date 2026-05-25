"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

type State = {
  name: string;
  weight: 400 | 500 | 700;
  spacing: "compact" | "normal" | "airy";
  shape: "sharp" | "soft" | "pill";
};

const states: State[] = [
  { name: "Editorial", weight: 400, spacing: "airy", shape: "sharp" },
  { name: "Modern",    weight: 500, spacing: "normal", shape: "soft" },
  { name: "Bold",      weight: 700, spacing: "compact", shape: "pill" },
];

const spacingMap: Record<State["spacing"], { padY: string; gap: string; cardPad: string }> = {
  compact: { padY: "py-3", gap: "gap-2", cardPad: "p-3" },
  normal:  { padY: "py-5", gap: "gap-3", cardPad: "p-4" },
  airy:    { padY: "py-8", gap: "gap-4", cardPad: "p-5" },
};

const shapeMap: Record<State["shape"], { radiusBig: string; radiusSm: string; chip: string }> = {
  sharp: { radiusBig: "rounded-none",  radiusSm: "rounded-none",  chip: "rounded-sm" },
  soft:  { radiusBig: "rounded-xl",    radiusSm: "rounded-lg",    chip: "rounded-md" },
  pill:  { radiusBig: "rounded-3xl",   radiusSm: "rounded-2xl",   chip: "rounded-full" },
};

export default function LivePreviewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const phases = useMemo<TimelinePhase[]>(
    () =>
      states.map((_, idx) => ({
        duration: 3200,
        tick: () => setActiveIdx((idx + 1) % states.length),
      })),
    []
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const current = states[activeIdx];
  const spacing = spacingMap[current.spacing];
  const shape = shapeMap[current.shape];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of a live website preview cycling through editorial, modern, and bold typographic styles"
      className="relative w-full max-w-xl mx-auto"
    >
      <div className="relative">
        <div
          className="hidden md:block absolute -left-2 top-10 w-44 bg-surface rounded-xl border border-black/[0.07] p-4 z-10"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="text-[10px] font-medium text-ink-3 uppercase tracking-[0.22em] mb-3 font-mono">
            Live preview
          </div>

          <div className="mb-3">
            <div className="text-[10px] text-ink-3 mb-1.5 uppercase tracking-[0.14em] font-mono">
              Weight
            </div>
            <div className="flex gap-1">
              {[400, 500, 700].map((w) => (
                <span
                  key={w}
                  className={`flex-1 text-center py-1 text-[11px] rounded ${
                    current.weight === w
                      ? "bg-ink text-white"
                      : "bg-[#f5f5f5] text-ink-2"
                  }`}
                  style={{ fontWeight: w }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-[10px] text-ink-3 mb-1.5 uppercase tracking-[0.14em] font-mono">
              Spacing
            </div>
            <div className="flex gap-1">
              {(["compact", "normal", "airy"] as const).map((s) => (
                <span
                  key={s}
                  className={`flex-1 text-center py-1 text-[10px] rounded ${
                    current.spacing === s
                      ? "bg-ink text-white"
                      : "bg-[#f5f5f5] text-ink-2"
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-ink-3 mb-1.5 uppercase tracking-[0.14em] font-mono">
              Shape
            </div>
            <div className="flex gap-1.5">
              {(["sharp", "soft", "pill"] as const).map((shp) => (
                <span
                  key={shp}
                  className={`flex-1 h-6 ${
                    shp === "sharp"
                      ? "rounded-none"
                      : shp === "soft"
                      ? "rounded-lg"
                      : "rounded-full"
                  } ${
                    current.shape === shp ? "bg-ink" : "bg-[#e5e5e5]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-full py-2 bg-ink text-white text-[11px] font-medium rounded-md text-center">
            Publish
          </div>
        </div>

        <motion.div
          className="md:ml-32 bg-surface rounded-2xl overflow-hidden border border-black/[0.07]"
          style={{ boxShadow: "var(--shadow-card)" }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.7, 1] }}
          transition={{ duration: 0.5 }}
          key={activeIdx}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f5f5f5] border-b border-black/[0.05]">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-surface rounded-full px-3 py-0.5 text-[10px] text-ink-3 max-w-[160px] truncate font-mono">
                yoursite.com
              </div>
            </div>
          </div>

          {/* Fixed height so the spacing scale (compact/normal/airy) still
              changes the layout inside, but the browser frame itself never
              resizes — the page below the demo stays put. Tallest state
              (airy) measures ~370px; 384px leaves headroom. */}
          <div className={`${spacing.padY} px-6 h-[384px] overflow-hidden`}>
            <div
              className={`flex items-center justify-between mb-4`}
              style={{ fontWeight: current.weight }}
            >
              <span className="text-[14px] text-ink">Studio</span>
              <span className="flex gap-3 text-[11px] text-ink-2">
                <span>Work</span>
                <span>About</span>
                <span>Contact</span>
              </span>
            </div>

            <motion.h3
              key={current.name + "-h"}
              className={`text-ink leading-[1.05] tracking-tighter-display text-[clamp(1.25rem,2vw,1.65rem)]`}
              style={{ fontWeight: current.weight }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Built with the same
              <br />
              system you ship in.
            </motion.h3>

            <p
              className={`mt-3 text-[12px] text-ink-2 leading-[1.55] max-w-[80%]`}
              style={{ fontWeight: Math.max(400, current.weight - 200) }}
            >
              Edit copy, swap blocks, adjust the brand &mdash; live, with your
              team in the room.
            </p>

            <div className={`mt-5 flex ${spacing.gap}`}>
              <span
                className={`px-3.5 py-1.5 bg-ink text-white text-[11px] font-medium ${shape.chip}`}
              >
                Start editing
              </span>
              <span
                className={`px-3.5 py-1.5 bg-[#f5f5f5] text-ink-2 text-[11px] font-medium ${shape.chip}`}
              >
                See plans
              </span>
            </div>

            <div className={`mt-6 grid grid-cols-3 ${spacing.gap}`}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${spacing.cardPad} ${shape.radiusSm} bg-[#f7f7f7]`}
                >
                  <div className={`w-7 h-7 ${shape.chip} bg-ink mb-2`} />
                  <div className="h-1.5 w-full bg-[#e5e5e5] rounded mb-1" />
                  <div className="h-1.5 w-2/3 bg-[#e5e5e5] rounded" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 bg-surface px-2.5 py-1 rounded-full border border-black/[0.07] shadow-sm">
        {!prefersReducedMotion && (
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-ink"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
        {prefersReducedMotion && (
          <span className="w-1.5 h-1.5 rounded-full bg-ink" />
        )}
        <span className="text-[10px] text-ink-2 font-mono uppercase tracking-[0.16em]">
          Live preview &middot; {current.name}
        </span>
      </div>
    </div>
  );
}
