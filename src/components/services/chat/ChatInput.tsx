"use client";

import { useState } from "react";
import type { Phase } from "./types";

type Props = {
  phase: Phase;
  onSendMessageAction: (text: string) => void;
};

export default function ChatInput({ phase, onSendMessageAction }: Props) {
  const [value, setValue] = useState("");
  const disabled = phase !== "done";

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSendMessageAction(trimmed);
    setValue("");
  };

  const placeholder = (() => {
    switch (phase) {
      case "responding":
        return "AI is responding…";
      case "playing":
      case "paused":
      case "idle":
        return "";
      case "done":
      default:
        return "Ask about AI for your business…";
    }
  })();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-border bg-surface px-3 py-2.5 flex items-center gap-2"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        disabled={disabled}
        rows={1}
        maxLength={280}
        placeholder={placeholder}
        aria-label="Message the AI"
        className="flex-1 resize-none bg-bg rounded-full px-4 py-2 text-[13px] leading-[1.4] text-ink placeholder:text-ink-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink/15 disabled:opacity-60 disabled:cursor-not-allowed max-h-20"
      />
      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className="shrink-0 w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center transition-transform hover:scale-[1.04] active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 10 V2 M2.5 5.5 L6 2 L9.5 5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
