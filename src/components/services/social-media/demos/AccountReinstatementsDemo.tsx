"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";
import { PLATFORM_ICON, ShieldIcon } from "../icons";

const ease = [0.16, 1, 0.3, 1] as const;

type CaseExample = {
  platform: "ig" | "tt" | "x";
  handle: string;
  ref: string;
  reason: string;
  channel: string;
};

const CASES: ReadonlyArray<CaseExample> = [
  {
    platform: "ig",
    handle: "@aster-lane",
    ref: "IM-22841",
    reason: "Automated suspension on a policy the account never broke.",
    channel: "Meta's IP review process",
  },
  {
    platform: "tt",
    handle: "@aster.lane",
    ref: "TT-09733",
    reason: "Disable triggered by a coordinated false-report cluster.",
    channel: "TikTok's policy review form",
  },
  {
    platform: "x",
    handle: "@aster_lane",
    ref: "X-44102",
    reason: "Permanent suspension cited platform-manipulation; the audit doesn't hold.",
    channel: "X's moderation review",
  },
];

type Stage = {
  label: string;
  detailTitle: string;
  detailBody: (c: CaseExample) => string;
};

const STAGES: ReadonlyArray<Stage> = [
  {
    label: "Submitted",
    detailTitle: "Brief received",
    detailBody: (c) =>
      `${c.handle} — ${c.platform === "ig" ? "Instagram" : c.platform === "tt" ? "TikTok" : "X"}. Client sent the notice and the platform's stated reason.`,
  },
  {
    label: "Reviewed",
    detailTitle: "Read against policy",
    detailBody: (c) =>
      `${c.reason} Strong-enough case to take to the platform.`,
  },
  {
    label: "Filed",
    detailTitle: "Appeal submitted",
    detailBody: (c) =>
      `Filed through ${c.channel}. Reference ${c.ref}. Documentation attached.`,
  },
  {
    label: "Acknowledged",
    detailTitle: "Platform confirmed receipt",
    detailBody: () =>
      "Receipt confirmed. Reviewer assigned. We replied to the follow-up question within the hour.",
  },
  {
    label: "Tracking",
    detailTitle: "Case open with the review team",
    detailBody: (c) =>
      `Reference ${c.ref} sits in the review queue. Typical window 3–7 business days; we follow up on day 4 if there's no movement.`,
  },
];

const FINAL_STAGE = STAGES.length - 1;

export default function AccountReinstatementsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(FINAL_STAGE);
  const [caseIdx, setCaseIdx] = useState(0);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      { duration: 1100, tick: () => setStage(0) },
      { duration: 1400, tick: () => setStage(1) },
      { duration: 1800, tick: () => setStage(2) },
      { duration: 1500, tick: () => setStage(3) },
      { duration: 1400, tick: () => setStage(FINAL_STAGE) },
      { duration: 6500, tick: () => setStage(FINAL_STAGE) },
      {
        duration: 800,
        tick: () => {
          setStage(0);
          setCaseIdx((i) => (i + 1) % CASES.length);
        },
      },
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);
  const activeStage = prefersReducedMotion ? FINAL_STAGE : stage;
  const c = CASES[caseIdx];
  const platform = PLATFORM_ICON[c.platform];
  const detail = STAGES[activeStage];

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Case file timeline: an account moves from brief through filing and is now tracked under platform review."
      className="relative mx-auto w-full max-w-lg"
    >
      <div
        className="flex h-[520px] flex-col gap-3.5 overflow-hidden rounded-[20px] border border-border bg-surface p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink">
            <ShieldIcon className="text-ink-2" />
            <span className="text-[13px] font-semibold tracking-[-0.01em]">
              Case file
            </span>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-bg px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-[0.12em] text-ink-2 border border-black/[0.04]"
          >
            <span
              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm"
              style={{ background: platform.chipBg }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={platform.iconUrl} alt="" aria-hidden="true" width={8} height={8} />
            </span>
            {c.ref}
          </span>
        </div>

        {/* Case row */}
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-bg px-3 py-2">
          <span
            className="inline-flex shrink-0 items-center justify-center w-7 h-7 rounded-md"
            style={{ background: platform.chipBg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={platform.iconUrl} alt="" aria-hidden="true" width={14} height={14} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-ink leading-tight">
              {c.handle}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-3 leading-tight">
              {platform.name} &middot; suspended
            </p>
          </div>
        </div>

        {/* Two-column body: timeline rail + detail card */}
        <div className="flex flex-1 gap-3 min-h-0">
          {/* Timeline rail */}
          <div className="relative w-[120px] shrink-0">
            <div
              className="absolute left-[5px] top-2 bottom-2 w-px"
              style={{ background: "var(--color-border)" }}
            />
            <div
              className="absolute left-[5px] top-2 w-px transition-all duration-700 ease-out"
              style={{
                height: `${(activeStage / (STAGES.length - 1)) * 100}%`,
                background: "var(--color-ink)",
                maxHeight: "calc(100% - 16px)",
              }}
            />
            <ul className="relative flex h-full flex-col justify-between py-1">
              {STAGES.map((s, i) => {
                const filled = i <= activeStage;
                const isActive = i === activeStage;
                return (
                  <li key={s.label} className="flex items-center gap-3">
                    <span
                      className={`relative inline-block w-[11px] h-[11px] rounded-full border-[1.5px] transition-colors duration-300 ${
                        filled ? "bg-ink border-ink" : "bg-surface border-border"
                      }`}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-[-3px] rounded-full border border-ink/20"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span
                      className={`text-[10.5px] font-medium leading-tight transition-colors ${
                        filled ? "text-ink" : "text-ink-3"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail card */}
          <div className="flex-1 min-w-0 rounded-xl border border-border bg-bg p-3.5 flex flex-col">
            <p className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-ink-3">
              Detail
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${caseIdx}-${activeStage}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}
                className="mt-2"
              >
                <p className="text-[12px] font-semibold text-ink leading-tight">
                  {detail.detailTitle}
                </p>
                <p className="mt-1.5 text-[11px] leading-[1.55] text-ink-body">
                  {detail.detailBody(c)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-ink-3">
            Mobol &middot; Recovery desk
          </span>
          <span className="text-[9.5px] font-mono tabular-nums text-ink-3">
            Open case
          </span>
        </div>
      </div>
    </div>
  );
}
