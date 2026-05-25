"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "toolCall" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function ToolCallConsole({ widget, reducedMotion, isLatest }: Props) {
  const perCall = widget.perCallMs ?? 800;
  const total = widget.calls.length;
  const [shown, setShown] = useState(reducedMotion || !isLatest ? total : 0);
  const [expanded, setExpanded] = useState(0);

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setShown(total);
      return;
    }
    setShown(0);
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(window.setTimeout(() => setShown(i), i * perCall));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion, isLatest, total, perCall]);

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            {widget.title ?? "Tool calls"}
          </p>
          {widget.subtitle ? (
            <p className="mt-0.5 text-[11px] text-ink-2">{widget.subtitle}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-bg border border-border px-2 py-1 text-[10px] tabular-nums text-ink-2">
          {Math.min(shown, total)}/{total}
        </span>
      </div>
      <ul className="space-y-2">
        {widget.calls.map((call, i) => {
          const visible = shown > i;
          if (!visible) return null;
          const isExpanded = expanded === i;
          return (
            <li
              key={call.name}
              className={`rounded-2xl border border-border bg-bg px-3 py-2.5 ${
                reducedMotion ? "" : "animate-chat-message-in"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded((value) => (value === i ? -1 : i))}
                aria-expanded={isExpanded}
                className="w-full text-left flex items-start gap-2.5"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#28c840]"
                />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-ink truncate">
                      {call.label ?? call.name}
                    </span>
                    <span className="text-[10px] text-ink-2 font-mono">
                      {isExpanded ? "hide" : "result"}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[10px] font-mono text-ink-2 truncate">
                    {call.name}({call.args})
                  </span>
                </span>
              </button>
              {isExpanded ? (
                <div className="mt-2 rounded-xl bg-surface border border-border px-2.5 py-2 text-[11px] leading-[1.45] font-mono text-ink-body animate-chat-widget-in">
                  {call.result}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
