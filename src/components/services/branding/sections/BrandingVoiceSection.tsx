"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

/**
 * Section 05 — Voice as a redline editor.
 *
 * Cycles through four voice pairs. For each pair:
 *   1  Reset — clear canvas
 *   2  Typing — the "before" copy reveals left-to-right via animated
 *      width (CSS clip), caret blinks at the leading edge
 *   3  Critique — strikethrough draws across the before line (scaleX 0→1),
 *      an Ember "→ Direct" chip pops into the gutter, and the rewritten
 *      "after" copy fades in beneath
 *
 * The pair index advances every 3.7s; the whole loop is ~15s.
 *
 * Reduced motion: all four pairs render statically with strikethroughs
 * and after-copy already in place — the page reads as a finished
 * style-guide spread.
 */

type Step = "reset" | "typing" | "after";

type VoiceEntry = {
  yes: string;
  no: string;
  before: string;
  after: string;
};

const VOICE_DATA: readonly VoiceEntry[] = [
  {
    yes: "Direct",
    no: "Vague",
    before:
      "We take data security seriously and follow industry-standard practices.",
    after: "Your data is safe.",
  },
  {
    yes: "Confident",
    no: "Loud",
    before:
      "Don't miss out — sign up now for the best deals on web design ever!!",
    after: "Sites that earn the click. Start a project.",
  },
  {
    yes: "Warm",
    no: "Cute",
    before:
      "Heyyy 🎉 just dropping in to say we built you something super cool!",
    after: "Your site is ready — take a look when you have a minute.",
  },
  {
    yes: "Considered",
    no: "Precious",
    before:
      "Crafted with meticulous attention to every artisanal pixel detail.",
    after: "Designed to ship, documented to extend.",
  },
];

export default function BrandingVoiceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pairIdx, setPairIdx] = useState(reduce ? VOICE_DATA.length - 1 : 0);
  const [step, setStep] = useState<Step>(reduce ? "after" : "reset");

  const phases = useMemo<TimelinePhase[]>(() => {
    const out: TimelinePhase[] = [];
    VOICE_DATA.forEach((_, idx) => {
      out.push({
        duration: 200,
        tick: () => {
          setPairIdx(idx);
          setStep("reset");
        },
      });
      out.push({ duration: 1700, tick: () => setStep("typing") });
      out.push({ duration: 1800, tick: () => setStep("after") });
    });
    return out;
  }, []);

  usePausedTimeline(ref, phases);

  // For reduced-motion, render all four pairs stacked statically.
  if (reduce) {
    return <ReducedVoicePanel />;
  }

  const entry = VOICE_DATA[pairIdx];
  const showTyping = step !== "reset";
  const showCritique = step === "after";

  return (
    <div
      role="img"
      aria-label="A voice and tone editor that cycles through four pairs — before copy gets struck through, an Ember chip names the picked voice, and the rewritten line appears beneath"
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.04]"
    >
      {/* Editor chrome */}
      <div className="absolute inset-x-0 top-0 h-9 px-3 flex items-center gap-1.5 border-b border-border bg-[#f6f5f2]">
        <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span
          className="ml-3 text-ink-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.04em",
          }}
        >
          voice.md
        </span>
        <span
          className="ml-auto text-ink-3 tabular-nums"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
          }}
        >
          {`0${pairIdx + 1}`} · {entry.yes}
        </span>
      </div>

      {/* Editor body */}
      <div className="absolute inset-0 pt-9 px-8 lg:px-14 flex flex-col justify-center">
        <div className="relative">
          {/* Pair label (eyebrow) */}
          <motion.div
            key={`label-${pairIdx}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-ink-3 mb-4"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            yes → {entry.yes}{" "}
            <span className="text-ink-3/70">/ not {entry.no}</span>
          </motion.div>

          {/* Before line — typewriter reveal + strikethrough */}
          <div className="relative">
            <motion.div
              key={`before-${pairIdx}`}
              className="text-ink-body relative inline-block overflow-hidden whitespace-normal"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.6vw, 18px)",
                lineHeight: 1.45,
                letterSpacing: "-0.005em",
                maxWidth: "100%",
              }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{
                clipPath: showTyping ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              }}
              transition={{
                duration: showTyping ? 1.4 : 0,
                ease: showTyping ? "linear" : "easeOut",
              }}
            >
              {entry.before}
              {/* Caret — blinks while typing */}
              <motion.span
                aria-hidden="true"
                className="inline-block align-baseline bg-ink ml-0.5"
                style={{ width: "2px", height: "1em" }}
                animate={{
                  opacity: showTyping && !showCritique ? [1, 0, 1] : 0,
                }}
                transition={{
                  duration: 0.9,
                  repeat: showTyping && !showCritique ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Strikethrough line — drawn left-to-right on critique */}
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 top-1/2 h-px bg-ink origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showCritique ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
              style={{ transform: "translateY(-1px)" }}
            />

            {/* Gutter chip — Ember accent naming the picked voice */}
            <motion.div
              key={`chip-${pairIdx}`}
              className="absolute -right-2 lg:-right-6 -top-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
                fontFamily: "var(--font-sans)",
              }}
              initial={{ opacity: 0, scale: 0.6, y: 6 }}
              animate={{
                opacity: showCritique ? 1 : 0,
                scale: showCritique ? 1 : 0.6,
                y: showCritique ? 0 : 6,
              }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: showCritique ? 0.2 : 0,
              }}
            >
              → {entry.yes}
            </motion.div>
          </div>

          {/* After line — fades in beneath */}
          <motion.div
            key={`after-${pairIdx}`}
            className="text-ink mt-6"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "clamp(18px, 2vw, 24px)",
              lineHeight: 1.3,
              letterSpacing: "-0.015em",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: showCritique ? 1 : 0,
              y: showCritique ? 0 : 8,
            }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: showCritique ? 0.35 : 0,
            }}
          >
            {entry.after}
          </motion.div>
        </div>

        {/* Pager dots */}
        <div className="absolute bottom-5 left-8 lg:left-14 flex items-center gap-1.5">
          {VOICE_DATA.map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === pairIdx ? "w-6 bg-ink" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReducedVoicePanel() {
  return (
    <div
      role="img"
      aria-label="Four voice pairs — Direct, Confident, Warm, Considered — each showing a struck-through before line and a rewritten after line"
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface border border-black/[0.04]"
    >
      <div className="absolute inset-0 p-8 lg:p-10 flex flex-col gap-5 justify-center">
        {VOICE_DATA.map((entry, i) => (
          <div key={entry.yes} className="border-l-2 border-[var(--color-accent)] pl-4">
            <p
              className="text-ink-3 mb-1"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {`0${i + 1}`} · yes → {entry.yes} / not {entry.no}
            </p>
            <p
              className="text-ink-3 line-through"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
              }}
            >
              {entry.before}
            </p>
            <p
              className="text-ink mt-1"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              {entry.after}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
