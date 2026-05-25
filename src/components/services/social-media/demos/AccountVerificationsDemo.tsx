"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";
import { CheckIcon, FileIcon, VerifiedDot } from "../icons";

const ease = [0.16, 1, 0.3, 1] as const;

type ItemState = "empty" | "half" | "done";

const ITEMS: ReadonlyArray<string> = [
  "Account is the authentic owner",
  "Public-facing brand or person",
  "Consistent presence across surfaces",
  "Recent activity within 30 days",
  "Identity documents on file",
];

type DocCard = { glyph: string; label1: string; label2: string };
const DOCS: ReadonlyArray<DocCard> = [
  { glyph: "ID", label1: "AU driver's", label2: "licence" },
  { glyph: "AB", label1: "ABN", label2: "certificate" },
  { glyph: "PR", label1: "Press", label2: "citations" },
];

const FINAL_STAGE = 11;

function CheckCircle({ state }: { state: ItemState }) {
  if (state === "done") {
    return (
      <span className="relative inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-ink shrink-0">
        <span className="text-white">
          <CheckIcon />
        </span>
      </span>
    );
  }
  if (state === "half") {
    return (
      <span className="relative inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border-[1.5px] border-ink overflow-hidden shrink-0">
        <span
          className="absolute inset-0 bg-ink"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      </span>
    );
  }
  return (
    <span className="inline-block w-[14px] h-[14px] rounded-full border-[1.5px] border-border shrink-0" />
  );
}

export default function AccountVerificationsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(FINAL_STAGE);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 700, tick: () => setStage(0) }, // header
      { duration: 600, tick: () => setStage(1) }, // checklist title
      { duration: 700, tick: () => setStage(2) }, // item 1 ticks
      { duration: 600, tick: () => setStage(3) }, // item 2
      { duration: 600, tick: () => setStage(4) }, // item 3
      { duration: 700, tick: () => setStage(5) }, // item 4
      { duration: 1000, tick: () => setStage(6) }, // item 5 -> half
      { duration: 900, tick: () => setStage(7) }, // doc cards fade
      { duration: 800, tick: () => setStage(8) }, // doc tags appear
      { duration: 700, tick: () => setStage(9) }, // item 5 -> done
      { duration: 1000, tick: () => setStage(10) }, // status bar
      { duration: 700, tick: () => setStage(FINAL_STAGE) },
      { duration: 7000, tick: () => setStage(FINAL_STAGE) }, // hold
      { duration: 700, tick: () => setStage(0) }, // reset
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);
  const s = prefersReducedMotion ? FINAL_STAGE : stage;

  const showHeader = s >= 0;
  const showChecklistTitle = s >= 1;
  const item5State: ItemState = s >= 9 ? "done" : s >= 6 ? "half" : "empty";
  const itemStates: ReadonlyArray<ItemState> = [
    s >= 2 ? "done" : "empty",
    s >= 3 ? "done" : "empty",
    s >= 4 ? "done" : "empty",
    s >= 5 ? "done" : "empty",
    item5State,
  ];
  const showDocs = s >= 7;
  const showDocTags = s >= 8;
  const showStatusBar = s >= 10;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Verification application: five eligibility items confirmed, three identity documents on file, application submitted for review."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col gap-3.5 overflow-hidden rounded-[20px] border border-border bg-surface p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: showHeader ? 1 : 0, y: showHeader ? 0 : 4 }}
          transition={{ duration: 0.4, ease }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-ink">
            <VerifiedDot />
            <span className="text-[13px] font-semibold tracking-[-0.01em]">
              Verification application
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-3">
            @aster-lane &middot; IG
          </span>
        </motion.div>

        {/* Eligibility */}
        <div className="rounded-xl border border-border bg-bg p-3.5">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showChecklistTitle ? 1 : 0 }}
            transition={{ duration: 0.4, ease }}
            className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-ink-2"
          >
            Eligibility
          </motion.p>
          <ul className="mt-2 space-y-2">
            {ITEMS.map((item, i) => {
              const state = itemStates[i];
              return (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle state={state} />
                  <span
                    className={`text-[11.5px] leading-tight transition-colors duration-300 ${
                      state === "done" ? "text-ink" : state === "half" ? "text-ink-body" : "text-ink-3"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Documents */}
        <div>
          <p className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-ink-2">
            Documents
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DOCS.map((d, i) => (
              <motion.div
                key={d.glyph}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: showDocs ? 1 : 0,
                  y: showDocs ? 0 : 6,
                }}
                transition={{
                  duration: 0.4,
                  ease,
                  delay: showDocs ? i * 0.12 : 0,
                }}
                className="rounded-lg border border-border bg-bg p-2.5 flex flex-col items-start"
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-ink-2">
                  <FileIcon />
                </span>
                <p className="mt-2 text-[10.5px] font-semibold text-ink leading-tight">
                  {d.label1}
                </p>
                <p className="text-[10.5px] text-ink-body leading-tight">
                  {d.label2}
                </p>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showDocTags ? 1 : 0 }}
                  transition={{
                    duration: 0.35,
                    ease,
                    delay: showDocTags ? i * 0.12 : 0,
                  }}
                  className="mt-1.5 text-[9.5px] font-mono uppercase tracking-[0.12em] text-ink-3"
                >
                  On file
                </motion.span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: showStatusBar ? 1 : 0,
            y: showStatusBar ? 0 : 6,
          }}
          transition={{ duration: 0.45, ease }}
          className="mt-auto rounded-lg bg-ink/[0.04] px-3 py-2.5 flex items-center justify-between"
        >
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.12em] text-ink">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#1f7a4a" }}
            />
            Submitted
          </span>
          <span className="text-[10.5px] font-mono tabular-nums text-ink-2">
            #V-22841 &middot; awaiting review
          </span>
        </motion.div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-ink-3">
            Mobol &middot; Verification desk
          </span>
          <span className="text-[9.5px] text-ink-3">
            Application reference
          </span>
        </div>
      </div>
    </div>
  );
}
