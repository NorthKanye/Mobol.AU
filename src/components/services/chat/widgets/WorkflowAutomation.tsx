"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "workflowAutomation" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const STATUS_COPY = {
  queued: "queued",
  running: "running",
  done: "done",
} satisfies Record<string, string>;

export default function WorkflowAutomation({
  widget,
  reducedMotion,
  isLatest,
}: Props) {
  const perItem = 420;
  const total = widget.systems.length;
  const [revealed, setRevealed] = useState(reducedMotion || !isLatest ? total : 0);

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setRevealed(total);
      return;
    }
    setRevealed(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(window.setTimeout(() => setRevealed(i), i * perItem));
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isLatest, reducedMotion, total]);

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            Workflow automation
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{widget.title}</p>
        </div>
        <span className="rounded-full bg-bg border border-border px-2 py-1 text-[10px] text-ink-2">
          {Math.min(revealed, total)}/{total}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {widget.systems.map((system, i) => {
          if (i >= revealed) return null;
          const isRunning = system.status === "running";
          return (
            <li
              key={`${system.name}-${system.action}`}
              className={`rounded-2xl border border-border bg-bg px-3 py-2.5 ${
                reducedMotion ? "" : "animate-chat-message-in"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                    system.status === "done"
                      ? "bg-ink border-ink text-surface"
                      : isRunning
                        ? "border-ink/50"
                        : "border-border"
                  }`}
                >
                  {system.status === "done" ? (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.5 L5 9.5 L10 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-ink ${
                        isRunning && !reducedMotion ? "animate-chat-agent-spin" : ""
                      }`}
                    />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-medium text-ink truncate">
                      {system.name}
                    </p>
                    <span
                      className={`shrink-0 text-[9px] uppercase tracking-[0.14em] ${
                        isRunning ? "text-ink" : "text-ink-2"
                      }`}
                    >
                      {STATUS_COPY[system.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-[1.35] text-ink-body">
                    {system.action}
                  </p>
                  <p className="mt-1 text-[10px] leading-[1.35] text-ink-2">
                    {system.detail}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {widget.summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border px-3 py-2">
            <p className="text-[18px] font-semibold tabular-nums tracking-display text-ink">
              {item.value}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-ink-2">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
