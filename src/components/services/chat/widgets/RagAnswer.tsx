"use client";

import { useState } from "react";
import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "ragAnswer" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function RagAnswer({ widget, reducedMotion, isLatest }: Props) {
  const [activeSource, setActiveSource] = useState(0);
  const animate = !reducedMotion && isLatest;
  const active = widget.sources[activeSource];

  return (
    <div className="bg-surface border border-border rounded-[20px] p-3.5 max-w-[420px] shadow-[0_16px_42px_rgba(17,17,17,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-2">
            RAG answer
          </p>
          <p className="mt-1 text-[13px] leading-[1.35] font-medium text-ink">
            {widget.question}
          </p>
        </div>
        {widget.confidence ? (
          <span className="shrink-0 rounded-full bg-bg border border-border px-2 py-1 text-[10px] text-ink-2">
            {widget.confidence}
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {widget.answer.map((line, i) => (
          <p
            key={i}
            className={`text-[12px] leading-[1.5] text-ink-body ${
              animate ? "animate-chat-message-in" : ""
            }`}
            style={{ animationDelay: animate ? `${i * 90}ms` : undefined }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Knowledge sources">
          {widget.sources.map((source, i) => (
            <button
              key={source.label}
              type="button"
              role="tab"
              aria-selected={activeSource === i}
              onClick={() => setActiveSource(i)}
              className={`rounded-full border px-2.5 py-1 text-[11px] leading-tight transition-colors ${
                activeSource === i
                  ? "bg-ink text-surface border-ink"
                  : "bg-bg text-ink-2 border-border hover:border-ink/25 hover:text-ink"
              }`}
            >
              {source.label}
            </button>
          ))}
        </div>
        {active ? (
          <div
            className={`mt-2.5 rounded-2xl bg-bg border border-border px-3 py-2.5 ${
              animate ? "animate-chat-widget-in" : ""
            }`}
          >
            <p className="text-[11px] font-medium text-ink">{active.detail}</p>
            <p className="mt-1 text-[11px] leading-[1.45] text-ink-2">
              {active.match}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
