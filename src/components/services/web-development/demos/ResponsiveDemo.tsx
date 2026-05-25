"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

type Bp = {
  key: "mobile" | "tablet" | "desktop";
  label: string;
  width: number;
  height: number;
  pxLabel: string;
};

const breakpoints: Bp[] = [
  { key: "mobile", label: "Mobile", width: 132, height: 260, pxLabel: "375 × 667" },
  { key: "tablet", label: "Tablet", width: 200, height: 240, pxLabel: "768 × 1024" },
  { key: "desktop", label: "Desktop", width: 312, height: 200, pxLabel: "1440 × 900" },
];

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
    </svg>
  );
}
function TabletIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z" />
    </svg>
  );
}
function DesktopIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z" />
    </svg>
  );
}

export default function ResponsiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(2); // start desktop

  const phases = useMemo<TimelinePhase[]>(
    () =>
      breakpoints.map((_, idx) => ({
        duration: 3200,
        tick: () => setActive((idx + 1) % breakpoints.length),
      })),
    []
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);

  const current = breakpoints[active];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of a website adapting from mobile to tablet to desktop layouts"
      className="relative w-full max-w-xl mx-auto"
    >
      <div
        className="flex justify-center gap-2 mb-6"
        aria-hidden="true"
      >
        {breakpoints.map((bp, i) => (
          <span
            key={bp.key}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] transition-colors ${
              active === i
                ? "bg-ink text-white"
                : "bg-[#f5f5f5] text-ink-2"
            }`}
          >
            {bp.key === "mobile" && <PhoneIcon />}
            {bp.key === "tablet" && <TabletIcon />}
            {bp.key === "desktop" && <DesktopIcon />}
            {bp.label}
          </span>
        ))}
      </div>

      {/* Fixed-height stage: the device frame morphs width/height *inside*
          this constant-size box, so its size changes never reflow the page.
          308px clears the tallest frame (mobile, 284px) with breathing room. */}
      <div
        className="flex items-center justify-center"
        style={{ height: 308 }}
      >
        <motion.div
          className="rounded-3xl p-3"
          style={{ backgroundColor: "#1a1a1a", boxShadow: "var(--shadow-card)" }}
          animate={
            prefersReducedMotion
              ? { width: breakpoints[2].width + 24, height: breakpoints[2].height + 24 }
              : { width: current.width + 24, height: current.height + 24 }
          }
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <motion.div className="bg-surface rounded-2xl overflow-hidden h-full">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.05]">
                <div className="w-6 h-2 bg-[#e5e5e5] rounded" />
                <AnimatePresence mode="wait">
                  {active === 0 ? (
                    <motion.div
                      key="hamburger"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="w-4 h-0.5 bg-ink-3 rounded" />
                      <span className="w-4 h-0.5 bg-ink-3 rounded" />
                      <span className="w-4 h-0.5 bg-ink-3 rounded" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="nav"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-1.5"
                    >
                      {[1, 2, 3, active === 2 ? 4 : null]
                        .filter(Boolean)
                        .map((i) => (
                          <span
                            key={String(i)}
                            className="w-4 h-1 bg-[#e5e5e5] rounded"
                          />
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 p-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    {active === 0 && (
                      <div className="space-y-2">
                        <div className="w-full h-12 bg-[#f5f5f5] rounded-lg" />
                        <div className="space-y-1">
                          <div className="w-full h-2 bg-[#e5e5e5] rounded" />
                          <div className="w-3/4 h-2 bg-[#e5e5e5] rounded" />
                        </div>
                        <div className="w-full h-7 bg-ink rounded-lg" />
                        <div className="grid grid-cols-1 gap-1.5">
                          <div className="h-9 bg-[#f5f5f5] rounded-lg" />
                          <div className="h-9 bg-[#f5f5f5] rounded-lg" />
                        </div>
                      </div>
                    )}
                    {active === 1 && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1 h-16 bg-[#f5f5f5] rounded-lg" />
                          <div className="flex-1 space-y-1 py-2">
                            <div className="w-full h-2 bg-[#e5e5e5] rounded" />
                            <div className="w-3/4 h-2 bg-[#e5e5e5] rounded" />
                            <div className="w-14 h-3.5 bg-ink rounded mt-1.5" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-7 bg-[#f5f5f5] rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {active === 2 && (
                      <div className="flex gap-2.5 h-full">
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2.5">
                            <div className="w-20 h-14 bg-[#f5f5f5] rounded-lg" />
                            <div className="flex-1 space-y-1 py-1">
                              <div className="w-full h-2 bg-[#e5e5e5] rounded" />
                              <div className="w-3/4 h-2 bg-[#e5e5e5] rounded" />
                              <div className="w-12 h-2.5 bg-ink rounded mt-1" />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="h-7 bg-[#f5f5f5] rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="w-14 space-y-1.5">
                          <div className="h-5 bg-[#f5f5f5] rounded-lg" />
                          <div className="h-5 bg-[#f5f5f5] rounded-lg" />
                          <div className="h-5 bg-[#f5f5f5] rounded-lg" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center" aria-hidden="true">
        <div className="flex items-center gap-2 bg-[#f5f5f5] px-3 py-1.5 rounded-full">
          <span className="text-[11px] text-ink-2 font-mono tabular-nums">
            {current.pxLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
