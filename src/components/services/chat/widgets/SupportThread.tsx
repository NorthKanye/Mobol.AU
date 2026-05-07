"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "supportThread" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

// Mini chat-in-chat. Renders a faux thread of customer<->AI exchanges
// streaming in pair-by-pair. Each exchange = one user bubble + one AI reply.
export default function SupportThread({ widget, reducedMotion, isLatest }: Props) {
  const perExchange = widget.perExchangeMs ?? 900;
  const total = widget.exchanges.length;
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
        window.setTimeout(() => setRevealed(i), i * perExchange),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reducedMotion, isLatest, total, perExchange]);

  return (
    <div className="bg-surface border border-border rounded-2xl p-3 max-w-[380px]">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
          Support · live
        </p>
        <span className="flex items-center gap-1 text-[10px] text-ink-2">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full bg-[#28c840] ${
              reducedMotion ? "" : "animate-chat-typing-dot"
            }`}
          />
          on-brand
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {widget.exchanges.map((ex, i) => {
          const visible = i < revealed;
          if (!visible) return null;
          return (
            <li key={i} className="flex flex-col gap-1.5">
              <div className="self-end max-w-[80%] bg-bg text-ink text-[12px] leading-[1.4] rounded-2xl px-2.5 py-1.5">
                {ex.user}
              </div>
              <div className="self-start max-w-[88%] text-ink text-[12px] leading-[1.4] px-1">
                {ex.ai}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
