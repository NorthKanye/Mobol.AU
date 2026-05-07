"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "agentFeed" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

// Rolling activity feed with timestamps. Items appear top-down, most recent
// first (the orchestrator passes them in display order; we just reveal one
// at a time with a staggered fade-in).
export default function AgentFeed({ widget, reducedMotion, isLatest }: Props) {
  const perItem = widget.perItemMs ?? 380;
  const total = widget.items.length;
  const [revealed, setRevealed] = useState(
    reducedMotion || !isLatest ? total : 0,
  );

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setRevealed(total);
      return;
    }
    setRevealed(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(
        window.setTimeout(() => setRevealed(i), i * perItem),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion, isLatest, total, perItem]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-[#28c840] ${
              reducedMotion ? "" : "animate-chat-typing-dot"
            }`}
            aria-hidden="true"
          />
          Agent · running
        </p>
        <span className="text-[10px] tabular-nums text-ink-3">
          {Math.min(revealed, total)} events
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {widget.items.map((item, i) => {
          if (i >= revealed) return null;
          return (
            <li
              key={i}
              className={`flex items-baseline gap-2.5 text-[12px] leading-[1.4] ${
                reducedMotion ? "" : "animate-chat-message-in"
              }`}
            >
              <span className="shrink-0 text-[10px] tabular-nums text-ink-3 font-medium w-10">
                {item.time}
              </span>
              <span className="flex-1 min-w-0 text-ink-body">{item.text}</span>
              {item.tag ? (
                <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full border border-border bg-bg text-[9px] uppercase tracking-[0.14em] text-ink-2">
                  {item.tag}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
