"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "imageAnalysis" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function ImageAnalysisDemo({
  widget,
  reducedMotion,
  isLatest,
}: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const animate = !reducedMotion && isLatest;

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            {widget.eyebrow ?? "Image analysis"}
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-ink">
            {widget.title}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-bg border border-border px-2 py-1 text-[10px] text-ink-2">
          vision + gen
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {[widget.before, widget.after].map((image, i) => (
          <figure
            key={image.src}
            className={`overflow-hidden rounded-2xl border border-border bg-bg ${
              animate ? "animate-chat-image-in" : ""
            }`}
            style={{ animationDelay: animate ? `${i * 120}ms` : undefined }}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 42vw, 190px"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-border bg-surface px-2.5 py-1.5 text-[10px] font-medium text-ink">
              {image.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-bg px-3 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-2">
          AI read
        </p>
        <ul className="mt-2 space-y-1.5">
          {widget.findings.map((finding, i) => (
            <li
              key={finding}
              className={`flex gap-2 text-[11px] leading-[1.4] text-ink-body ${
                animate ? "animate-chat-thinking-step-in" : ""
              }`}
              style={{ animationDelay: animate ? `${180 + i * 80}ms` : undefined }}
            >
              <span
                aria-hidden="true"
                className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink"
              />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-border pt-2 text-[11px] leading-[1.45] text-ink-2">
          {widget.recommendation}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowPrompt((value) => !value)}
        aria-expanded={showPrompt}
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-2 hover:text-ink transition-colors"
      >
        <span
          aria-hidden="true"
          className={`transition-transform duration-200 ${
            showPrompt ? "rotate-90" : ""
          }`}
        >
          {">"}
        </span>
        Renovation prompt
      </button>
      {showPrompt ? (
        <p className="mt-1.5 rounded-2xl border border-border bg-bg px-3 py-2 text-[11px] leading-[1.45] text-ink-2 animate-chat-widget-in">
          {widget.prompt}
        </p>
      ) : null}
    </div>
  );
}
