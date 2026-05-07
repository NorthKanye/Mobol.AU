"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "toolCall" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

// Renders a developer-feel console of tool calls. Each call = a "→ call" line
// followed by a "← result" line, revealed sequentially. Mono font, ink palette.
export default function ToolCallConsole({ widget, reducedMotion, isLatest }: Props) {
  const perCall = widget.perCallMs ?? 800;
  const total = widget.calls.length;
  const [shown, setShown] = useState(
    reducedMotion || !isLatest ? total * 2 : 0,
  );

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setShown(total * 2);
      return;
    }
    setShown(0);
    const timers: number[] = [];
    for (let i = 1; i <= total * 2; i++) {
      // Each "call" shows its line then its result, alternating
      timers.push(
        window.setTimeout(() => setShown(i), i * (perCall / 2)),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion, isLatest, total, perCall]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
          Tool calls · runtime
        </p>
        <span className="text-[10px] tabular-nums text-ink-3">
          {Math.min(Math.ceil(shown / 2), total)}/{total}
        </span>
      </div>
      <pre
        className="text-[11px] leading-[1.5] text-ink font-mono whitespace-pre-wrap break-words"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace' }}
      >
        {widget.calls.map((c, i) => {
          const callShown = shown >= i * 2 + 1;
          const resultShown = shown >= i * 2 + 2;
          return (
            <span key={i}>
              {callShown ? (
                <span className={reducedMotion ? "" : "animate-chat-message-in"}>
                  <span className="text-ink-2">→ </span>
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-ink-body">({c.args})</span>
                  {"\n"}
                </span>
              ) : null}
              {resultShown ? (
                <span className={reducedMotion ? "" : "animate-chat-message-in"}>
                  <span className="text-[#2a8a4f]">← </span>
                  <span className="text-ink-body">{c.result}</span>
                  {i < widget.calls.length - 1 ? "\n" : ""}
                </span>
              ) : null}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
