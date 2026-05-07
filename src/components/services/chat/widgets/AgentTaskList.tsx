"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "agentTasks" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

type Status = "pending" | "running" | "done";

function statusFor(activeIdx: number, finishedCount: number, i: number): Status {
  if (i < finishedCount) return "done";
  if (i === activeIdx) return "running";
  return "pending";
}

const STATUS_COPY: Record<Status, string> = {
  pending: "queued",
  running: "running",
  done: "done",
};

export default function AgentTaskList({ widget, reducedMotion, isLatest }: Props) {
  const perItem = widget.perItemMs ?? 480;
  const [activeIdx, setActiveIdx] = useState(reducedMotion || !isLatest ? -1 : -1);
  const [finishedCount, setFinishedCount] = useState(
    reducedMotion || !isLatest ? widget.items.length : 0,
  );

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setActiveIdx(-1);
      setFinishedCount(widget.items.length);
      return;
    }
    setActiveIdx(-1);
    setFinishedCount(0);
    const timers: number[] = [];
    widget.items.forEach((_, i) => {
      // Each item: starts running at i*perItem, finishes at (i+1)*perItem
      timers.push(
        window.setTimeout(() => {
          setActiveIdx(i);
        }, i * perItem),
      );
      timers.push(
        window.setTimeout(() => {
          setFinishedCount((c) => Math.max(c, i + 1));
        }, (i + 1) * perItem),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion, isLatest, widget.items, perItem]);

  const allDone = finishedCount >= widget.items.length;

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
          Agent loop
        </p>
        <p className="text-[10px] tabular-nums text-ink-3">
          {Math.min(finishedCount, widget.items.length)}/{widget.items.length}
        </p>
      </div>
      <ul className="flex flex-col gap-2" aria-label="Agent tasks">
        {widget.items.map((item, i) => {
          const status = statusFor(activeIdx, finishedCount, i);
          const checked = status === "done";
          const running = status === "running";
          return (
            <li
              key={i}
              className="flex items-center gap-2.5 text-[13px] leading-tight"
            >
              <span
                className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  checked
                    ? "bg-ink border-ink text-surface"
                    : running
                      ? "border-ink/50 text-transparent"
                      : "border-border text-transparent"
                }`}
                aria-hidden="true"
              >
                {running ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-ink animate-chat-agent-spin" />
                ) : (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6.5 L5 9.5 L10 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`flex-1 min-w-0 truncate ${
                  checked
                    ? "text-ink-2"
                    : running
                      ? "text-ink"
                      : "text-ink-body"
                }`}
              >
                {item}
              </span>
              <span
                className={`shrink-0 text-[10px] uppercase tracking-[0.16em] tabular-nums ${
                  checked
                    ? "text-[#2a8a4f]"
                    : running
                      ? "text-ink-2 animate-chat-typing-dot"
                      : "text-ink-3"
                }`}
              >
                {STATUS_COPY[status]}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
        <p className="text-[10px] font-medium text-ink-2 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              allDone ? "bg-[#28c840]" : "bg-[#febc2e]"
            } ${!allDone && !reducedMotion ? "animate-chat-typing-dot" : ""}`}
            aria-hidden="true"
          />
          {allDone ? "Loop complete" : "Working through queue"}
        </p>
        <p className="text-[10px] tabular-nums text-ink-3">
          {(((finishedCount + (activeIdx >= 0 && !allDone ? 0.5 : 0)) * (perItem / 1000))).toFixed(1)}s
        </p>
      </div>
    </div>
  );
}
