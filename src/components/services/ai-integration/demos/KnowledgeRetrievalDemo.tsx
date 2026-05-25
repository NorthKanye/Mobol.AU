"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";

const ease = [0.16, 1, 0.3, 1] as const;

const QUESTION = "Can I use the Night Renewal Serum with retinol?";

const ANSWER: ReadonlyArray<string> = [
  "Yes — introduce it slowly. Use the serum on alternate nights for the first two weeks, then build up if your skin stays calm.",
  "If you already use a strong retinoid, keep the Barrier Cream in the routine and avoid layering exfoliating acids on the same night.",
];

type Source = { tag: string; title: string; match: string; policy?: boolean };

const SOURCES: ReadonlyArray<Source> = [
  {
    tag: "Product doc",
    title: "Night Renewal Serum — usage notes",
    match: "Alternate-night use is recommended for retinol routines in the first two weeks.",
  },
  {
    tag: "Policy",
    title: "Ingredient compatibility policy",
    match: "Do not combine exfoliating acids and retinoids in the same evening routine.",
    policy: true,
  },
  {
    tag: "Brand voice",
    title: "Aster Lane support tone",
    match: "Give clear advice, avoid medical claims, and suggest patch testing for sensitive skin.",
  },
];

const FINAL_STAGE = 4;

export default function KnowledgeRetrievalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(FINAL_STAGE);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 2400, tick: () => setStage(1) },
      { duration: 2400, tick: () => setStage(2) },
      { duration: 3600, tick: () => setStage(3) },
      { duration: 2000, tick: () => setStage(4) },
      { duration: 6000, tick: () => setStage(4) },
      { duration: 800, tick: () => setStage(0) },
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);
  const stg = prefersReducedMotion ? FINAL_STAGE : stage;
  const showQuestion = stg >= 1;
  const searching = !prefersReducedMotion && stg === 2;
  const showAnswer = stg >= 3;
  const showSources = stg >= 4;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animated mockup of AI knowledge retrieval: a product question is answered from Aster Lane's own documents, with the three sources cited."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col gap-3.5 overflow-hidden rounded-[20px] border border-border bg-surface p-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg px-3 py-2.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-ink-3"
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-[12.5px] text-ink-body">{showQuestion ? QUESTION : ""}</p>
        </div>

        {searching && (
          <div className="flex items-center gap-2 text-[11px] text-ink-2">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1.5 w-1.5 rounded-full bg-ink-3"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.16 }}
              />
            ))}
            <span className="ml-1">Searching the Aster Lane knowledge base&hellip;</span>
          </div>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-2 font-mono">
                Answer
              </p>
              <span className="rounded-full border border-border bg-bg px-2 py-0.5 text-[9.5px] text-ink-2">
                grounded in 3 sources
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {ANSWER.map((para, i) => (
                <p key={i} className="text-[12px] leading-[1.5] text-ink-body">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {showSources && (
          <motion.div
            className="mt-auto space-y-1.5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-2 font-mono">
              Sources
            </p>
            {SOURCES.map((src) => (
              <motion.div
                key={src.title}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease }}
                className="rounded-xl border border-border bg-bg px-3 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      src.policy
                        ? "rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent"
                        : "rounded-full bg-ink/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-ink-2"
                    }
                  >
                    {src.tag}
                  </span>
                  <span className="text-[11px] font-medium text-ink">{src.title}</span>
                </div>
                <p className="mt-1 border-l-2 border-border pl-2 text-[10.5px] leading-[1.45] text-ink-2">
                  {src.match}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
