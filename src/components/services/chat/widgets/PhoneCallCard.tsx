"use client";

import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "phone" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

const METER_BARS = 14;

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function PhoneCallCard({ widget, reducedMotion, isLatest }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reducedMotion || !isLatest) {
      setTick(widget.durationSec);
      return;
    }
    setTick(0);
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setTick(Math.min(elapsed, widget.durationSec));
      if (elapsed >= widget.durationSec) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [reducedMotion, isLatest, widget.durationSec]);

  const liveMeter = !reducedMotion && isLatest;

  return (
    <div className="bg-surface border border-border rounded-2xl px-3 py-2.5 max-w-[380px]">
      <div className="flex items-center gap-3">
        <div
          className="shrink-0 w-9 h-9 rounded-full bg-ink text-surface flex items-center justify-center relative"
          aria-hidden="true"
        >
          {liveMeter ? (
            <span className="absolute inset-0 rounded-full ring-2 ring-[#28c840]/30 animate-chat-phone-pulse" />
          ) : null}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-[#28c840] ${reducedMotion ? "" : "animate-chat-typing-dot"}`}
              aria-hidden="true"
            />
            <p className="text-[13px] font-medium text-ink truncate">
              {widget.name ?? "Live AI Phone Agent"}
            </p>
          </div>
          <p className="text-[11px] text-ink-2 mt-0.5">
            Connected · qualifying lead
          </p>
        </div>
        <span className="shrink-0 text-[11px] tabular-nums text-ink-2 font-medium">
          {formatDuration(tick)}
        </span>
      </div>
      <div className="mt-2.5 flex items-end gap-[2px] h-3.5" aria-hidden="true">
        {Array.from({ length: METER_BARS }, (_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-[1.5px] bg-ink/40 ${liveMeter ? "animate-chat-phone-meter" : ""}`}
            style={{
              height: liveMeter ? "100%" : "32%",
              animationDelay: liveMeter ? `${i * 90}ms` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
