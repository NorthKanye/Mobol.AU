"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "liveStat" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

function formatNumber(n: number) {
  return Math.floor(n).toLocaleString("en-US");
}

export default function LiveStatCounter({ widget, reducedMotion, isLatest }: Props) {
  const { from, to, label, suffix } = widget;
  const durationMs = widget.durationMs ?? 1800;
  const [value, setValue] = useState(reducedMotion || !isLatest ? to : from);

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setValue(to);
      return;
    }
    setValue(from);
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic so the number lands gracefully
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [from, to, durationMs, reducedMotion, isLatest]);

  return (
    <div className="bg-surface border border-border rounded-2xl px-4 py-3 max-w-[380px]">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-2 mb-1">
        {label}
      </p>
      <p className="text-[28px] sm:text-[32px] font-bold tabular-nums tracking-tighter-display text-ink leading-[1]">
        {formatNumber(value)}
        {suffix ? (
          <span className="text-ink-2 text-[16px] font-semibold ml-1">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}
