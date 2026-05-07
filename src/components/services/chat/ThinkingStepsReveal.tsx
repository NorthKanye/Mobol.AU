"use client";

import type { ThinkingState } from "./types";

type Props = {
  thinking: ThinkingState;
  reducedMotion: boolean;
  onToggleAction: () => void;
};

// Renders both the reveal sequence (while activeIndex < steps.length) and
// the collapsed/expanded persistent bar (after revealComplete). The component
// is intentionally stateless about reveal timing — useChatScript advances
// `activeIndex` via PatchMessage; we just render the current snapshot.
export default function ThinkingStepsReveal({
  thinking,
  reducedMotion,
  onToggleAction,
}: Props) {
  const { steps, activeIndex, expanded, revealComplete } = thinking;
  // While revealing, the panel is force-expanded so users see the steps.
  const showExpanded = revealComplete ? expanded : true;
  const stepsCount = steps.length;

  return (
    <div className="w-full max-w-[420px]">
      {revealComplete ? (
        <CollapsedToggle
          stepsCount={stepsCount}
          expanded={expanded}
          onToggleAction={onToggleAction}
        />
      ) : (
        <RevealHeader allDone={activeIndex >= stepsCount} reducedMotion={reducedMotion} />
      )}

      {showExpanded ? (
        <ol
          role="list"
          className={`relative mt-2 pl-1 ${revealComplete && expanded ? "animate-chat-thinking-step-in" : ""}`}
        >
          {/* Connector line — runs the height of the list, behind the icon column */}
          <span
            aria-hidden="true"
            className={`absolute left-[5px] top-2 bottom-2 w-px bg-border ${
              !revealComplete && !reducedMotion ? "animate-chat-thinking-line" : ""
            }`}
          />
          {steps.map((step, i) => {
            const status: StepStatus = revealComplete
              ? "complete"
              : i < activeIndex
                ? "complete"
                : i === activeIndex
                  ? "active"
                  : "pending";
            return (
              <Step
                key={i}
                step={step}
                status={status}
                reducedMotion={reducedMotion}
                isFirst={i === 0}
              />
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}

function RevealHeader({
  allDone,
  reducedMotion,
}: {
  allDone: boolean;
  reducedMotion: boolean;
}) {
  const label = allDone ? "Done" : "Thinking";
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-2 uppercase tracking-[0.18em]">
      <span
        aria-hidden="true"
        className={`inline-block w-3 h-3 rounded-full border ${
          allDone ? "bg-ink border-ink" : "border-ink-2"
        } ${!allDone && !reducedMotion ? "animate-chat-typing-dot" : ""}`}
      />
      <span>{label}</span>
    </div>
  );
}

function CollapsedToggle({
  stepsCount,
  expanded,
  onToggleAction,
}: {
  stepsCount: number;
  expanded: boolean;
  onToggleAction: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleAction}
      aria-expanded={expanded}
      aria-label={expanded ? "Hide reasoning steps" : "Show reasoning steps"}
      className="group inline-flex items-center gap-1.5 text-[11px] text-ink-2 hover:text-ink transition-colors py-0.5"
    >
      <svg
        width="9"
        height="9"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
      >
        <path
          d="M4 2.5 L8 6 L4 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        Thinking <span className="text-ink-3">·</span> {stepsCount} steps
      </span>
    </button>
  );
}

type StepStatus = "pending" | "active" | "complete";

function Step({
  step,
  status,
  reducedMotion,
  isFirst,
}: {
  step: { label: string; details?: string[]; sources?: string[] };
  status: StepStatus;
  reducedMotion: boolean;
  isFirst: boolean;
}) {
  const isComplete = status === "complete";
  const isActive = status === "active";
  const isPending = status === "pending";
  const showShimmer = isActive && !reducedMotion;

  return (
    <li
      role="listitem"
      className={`relative flex gap-2.5 py-1.5 ${
        isFirst ? "" : "mt-0.5"
      } ${isPending ? "opacity-30" : ""} ${
        !reducedMotion && !isPending ? "animate-chat-thinking-step-in" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className={`relative shrink-0 mt-1 w-3 h-3 rounded-full border flex items-center justify-center ${
          isComplete
            ? "bg-ink border-ink text-surface"
            : isActive
              ? "bg-ink border-ink"
              : "bg-surface border-border"
        }`}
      >
        {isComplete ? (
          <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.5 L5 9.5 L10 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-[12px] leading-[1.45] font-medium ${
            showShimmer ? "animate-chat-shimmer" : isComplete ? "text-ink" : "text-ink-2"
          }`}
        >
          {step.label}
          {isActive ? <span aria-hidden="true">…</span> : null}
        </p>
        {(step.details && step.details.length > 0) || (step.sources && step.sources.length > 0) ? (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink-2">
            {step.details?.map((d, i) => (
              <span key={i} className="leading-[1.4]">
                {d}
              </span>
            ))}
            {step.sources?.map((s, i) => (
              <span
                key={`s-${i}`}
                className="inline-flex items-center px-1.5 py-0.5 rounded-full border border-border bg-bg text-[10px] text-ink-2 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

