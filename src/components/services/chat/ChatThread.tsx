"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RenderedMessage } from "./types";
import ChatMessage from "./ChatMessage";
import ChatTypingIndicator from "./ChatTypingIndicator";

type Props = {
  messages: RenderedMessage[];
  showTypingDots: boolean;
  reducedMotion: boolean;
};

export default function ChatThread({ messages, showTypingDots, reducedMotion }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Suspends auto-scroll when the user manually scrolls up to read history.
  const [stickToBottom, setStickToBottom] = useState(true);
  const lastTypewriterLen = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distanceFromBottom < 8);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Track typewriter reveal length so growing text keeps pinning the bottom.
  const lastMessage = messages[messages.length - 1];
  const typewriterLen = lastMessage?.status === "revealing" ? lastMessage.text.length : 0;

  useLayoutEffect(() => {
    if (!stickToBottom) return;
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    lastTypewriterLen.current = typewriterLen;
  }, [messages.length, typewriterLen, showTypingDots, stickToBottom]);

  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-busy={showTypingDots}
      className="flex-1 overflow-y-auto chat-thread chat-mask-fade-top px-4 py-4"
    >
      <div className="flex flex-col gap-3">
        {messages.map((m, i) => (
          <ChatMessage
            key={m.id}
            message={m}
            reducedMotion={reducedMotion}
            isLatest={i === messages.length - 1}
          />
        ))}
        {showTypingDots ? (
          <div className="w-full flex justify-start">
            <ChatTypingIndicator reducedMotion={reducedMotion} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
