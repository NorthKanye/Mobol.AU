"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "generatedAssets" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function GeneratedAssets({
  widget,
  reducedMotion,
  isLatest,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const active = widget.variants[activeIndex] ?? widget.variants[0];
  const animate = !reducedMotion && isLatest;

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            {widget.eyebrow ?? "Image generation"}
          </p>
          <p className="mt-0.5 text-[12px] text-ink-body">
            {widget.title ?? "Generated campaign pack"}
          </p>
        </div>
        <span className="rounded-full bg-bg border border-border px-2 py-1 text-[10px] text-ink-2">
          {widget.badge ?? `${widget.variants.length} iterations`}
        </span>
      </div>

      {active ? (
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg border border-border ${
            animate ? "animate-chat-image-in" : ""
          }`}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes="(max-width: 768px) 82vw, 360px"
            className="object-cover"
          />
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-full bg-surface/88 backdrop-blur-sm px-2.5 py-1.5 border border-white/60">
            <span className="text-[11px] font-medium text-ink">{active.label}</span>
            <span className="text-[10px] text-ink-2">{active.note}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-2.5 grid grid-cols-3 gap-1.5" role="tablist" aria-label="Generated image variants">
        {widget.variants.map((variant, i) => (
          <button
            key={variant.src}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-[5/4] overflow-hidden rounded-xl border transition-all ${
              activeIndex === i
                ? "border-ink ring-2 ring-ink/10"
                : "border-border hover:border-ink/25"
            }`}
          >
            <Image
              src={variant.src}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
            <span className="absolute inset-x-1 bottom-1 rounded-full bg-surface/86 px-1.5 py-0.5 text-[9px] font-medium text-ink">
              {variant.label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowPrompt((value) => !value)}
        aria-expanded={showPrompt}
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-2 hover:text-ink transition-colors"
      >
        <span
          aria-hidden="true"
          className={`transition-transform duration-200 ${showPrompt ? "rotate-90" : ""}`}
        >
          {">"}
        </span>
        Prompt details
      </button>
      {showPrompt ? (
        <p className="mt-1.5 rounded-2xl border border-border bg-bg px-3 py-2 text-[11px] leading-[1.45] text-ink-2 animate-chat-widget-in">
          {widget.prompt}
        </p>
      ) : null}
    </div>
  );
}
