"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "generatedVideo" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function GeneratedVideo({
  widget,
  reducedMotion,
  isLatest,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [progress, setProgress] = useState(reducedMotion || !isLatest ? 1 : 0);
  const animate = !reducedMotion && (playing || isLatest);

  useEffect(() => {
    if (!playing) return;
    setProgress(0);
    const start = Date.now();
    const durationMs = 8000;
    const id = window.setInterval(() => {
      const next = Math.min((Date.now() - start) / durationMs, 1);
      setProgress(next);
      if (next >= 1) setPlaying(false);
    }, 100);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            Video generation
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{widget.title}</p>
        </div>
        <span className="text-[11px] tabular-nums text-ink-2">{widget.duration}</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink border border-border">
        <Image
          src={widget.posterSrc}
          alt={widget.posterAlt}
          fill
          sizes="(max-width: 768px) 82vw, 360px"
          className={`object-cover transition-transform duration-700 ${
            playing ? "scale-[1.035]" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {animate ? (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0 1px, transparent 1px 5px)",
            }}
            aria-hidden="true"
          />
        ) : null}
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause generated video preview" : "Play generated video preview"}
          className="absolute left-3 bottom-3 w-10 h-10 rounded-full bg-surface text-ink flex items-center justify-center transition-transform hover:scale-[1.04] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
        >
          {playing ? (
            <span className="w-3 h-3 rounded-[2px] bg-current" aria-hidden="true" />
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
              <path d="M1 1 L9 6 L1 11 Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="absolute left-16 right-3 bottom-5 h-1 rounded-full bg-surface/30 overflow-hidden">
          <span
            className="block h-full rounded-full bg-surface transition-[width] duration-100"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      <ol className="mt-3 grid grid-cols-3 gap-1.5" aria-label="Storyboard frames">
        {widget.frames.map((frame, i) => (
          <li
            key={frame.time}
            className={`rounded-2xl border border-border bg-bg px-2.5 py-2 ${
              animate ? "animate-chat-thinking-step-in" : ""
            }`}
            style={{ animationDelay: animate ? `${i * 90}ms` : undefined }}
          >
            <p className="text-[10px] tabular-nums font-medium text-ink">{frame.time}</p>
            <p className="mt-1 text-[10px] leading-[1.3] text-ink-2">{frame.label}</p>
          </li>
        ))}
      </ol>

      <p className="mt-2.5 text-[10px] leading-[1.4] text-ink-3">
        Final video slot: {widget.placeholderSrc}
      </p>
      {widget.prompt ? (
        <>
          <button
            type="button"
            onClick={() => setShowPrompt((value) => !value)}
            aria-expanded={showPrompt}
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ink-2 hover:text-ink transition-colors"
          >
            <span
              aria-hidden="true"
              className={`transition-transform duration-200 ${
                showPrompt ? "rotate-90" : ""
              }`}
            >
              {">"}
            </span>
            Video prompt
          </button>
          {showPrompt ? (
            <p className="mt-1.5 rounded-2xl border border-border bg-bg px-3 py-2 text-[11px] leading-[1.45] text-ink-2 animate-chat-widget-in">
              {widget.prompt}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
