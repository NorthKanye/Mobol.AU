"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RenderedMessage } from "./types";
import ChatMessage from "./ChatMessage";
import ChatTypingIndicator from "./ChatTypingIndicator";

type Props = {
  messages: RenderedMessage[];
  showTypingDots: boolean;
  reducedMotion: boolean;
  onToggleThinkingAction: (id: string) => void;
};

export default function ChatThread({
  messages,
  showTypingDots,
  reducedMotion,
  onToggleThinkingAction,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Suspends auto-scroll when the user manually scrolls up to read history.
  const [stickToBottom, setStickToBottom] = useState(true);
  const stickToBottomRef = useRef(true);
  const autoScrollUntil = useRef(0);
  const prevMessageCount = useRef(0);
  const prevTypingDots = useRef(false);

  useEffect(() => {
    stickToBottomRef.current = stickToBottom;
  }, [stickToBottom]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      if (Date.now() < autoScrollUntil.current) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distanceFromBottom < 8);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Track typewriter reveal length so growing text keeps pinning the bottom.
  const lastMessage = messages[messages.length - 1];
  const typewriterLen = lastMessage?.status === "revealing" ? lastMessage.text.length : 0;

  // Discrete-event scroll: instant during typewriter, smooth on new messages
  // and typing-dot toggles. The smooth scroll is wrapped in rAF so layout has
  // settled (otherwise the new widget's animation can mis-measure scrollHeight).
  useLayoutEffect(() => {
    if (!stickToBottom) return;
    const el = ref.current;
    if (!el) return;

    const messageAdded = messages.length > prevMessageCount.current;
    const typingChanged = showTypingDots !== prevTypingDots.current;
    const isDiscreteEvent = messageAdded || typingChanged;

    prevMessageCount.current = messages.length;
    prevTypingDots.current = showTypingDots;

    if (reducedMotion || !isDiscreteEvent) {
      autoScrollUntil.current = Date.now() + 120;
      el.scrollTop = el.scrollHeight;
    } else {
      autoScrollUntil.current = Date.now() + 650;
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages.length, typewriterLen, showTypingDots, stickToBottom, reducedMotion]);

  // ResizeObserver catches height changes from widget reveals and async-loaded
  // images that the dispatch-driven effect above can't see. Skip the scroll
  // when we're already at/near the bottom to avoid jitter during typewriter
  // growth (the imperative scroll above handles that pin).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (!inner) return;
    const ro = new ResizeObserver(() => {
      if (!stickToBottomRef.current) return;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distanceFromBottom < 4) return;
      if (reducedMotion) {
        autoScrollUntil.current = Date.now() + 120;
        el.scrollTop = el.scrollHeight;
      } else {
        autoScrollUntil.current = Date.now() + 650;
        requestAnimationFrame(() => {
          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        });
      }
    });
    ro.observe(el);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-busy={showTypingDots}
      className="flex-1 overflow-y-auto chat-thread chat-mask-fade-top px-4 sm:px-5 py-5"
    >
      <div className="flex flex-col gap-4">
        {messages.map((m, i) => {
          const isFirstInGroup = i === 0 || messages[i - 1].role !== m.role;
          return (
            <ChatMessage
              key={m.id}
              message={m}
              reducedMotion={reducedMotion}
              isLatest={i === messages.length - 1}
              isFirstInGroup={isFirstInGroup}
              onToggleThinkingAction={onToggleThinkingAction}
            />
          );
        })}
        {showTypingDots ? (
          <div className="w-full flex justify-start">
            <div className="shrink-0 w-[22px] mr-2" aria-hidden="true" />
            <ChatTypingIndicator reducedMotion={reducedMotion} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
