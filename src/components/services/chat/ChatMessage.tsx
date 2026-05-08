import type { RenderedMessage } from "./types";
import { renderWidget } from "./widgets";
import ThinkingStepsReveal from "./ThinkingStepsReveal";

type Props = {
  message: RenderedMessage;
  reducedMotion: boolean;
  isLatest: boolean;
  onToggleThinkingAction: (id: string) => void;
};

export default function ChatMessage({
  message,
  reducedMotion,
  isLatest,
  onToggleThinkingAction,
}: Props) {
  const isUser = message.role === "user";
  const animateIn = !reducedMotion;
  const showCaret =
    !reducedMotion &&
    message.role === "assistant" &&
    message.status === "revealing" &&
    message.text.length > 0;

  // Hide widget until thinking-steps reveal completes (so the chart doesn't
  // flash in alongside the thinking sequence). Other messages without a
  // thinking slice render the widget immediately.
  const widgetReady = !message.thinking || message.thinking.revealComplete;

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} max-w-[88%]`}
      >
        {message.thinking ? (
          <ThinkingStepsReveal
            thinking={message.thinking}
            reducedMotion={reducedMotion}
            onToggleAction={() => onToggleThinkingAction(message.id)}
          />
        ) : null}
        {message.text || (isUser && message.fullText) ? (
          <div
            className={`${
              isUser
                ? "bg-bg text-ink rounded-2xl px-4 py-2.5 text-[14px] leading-[1.45]"
                : "text-ink text-[14px] leading-[1.5] px-1"
            } ${animateIn ? "animate-chat-message-in" : ""}`}
          >
            {message.text}
            {showCaret ? (
              <span
                aria-hidden="true"
                className="inline-block w-[1px] h-[1em] align-[-2px] ml-[1px] bg-ink animate-chat-typing-dot"
              />
            ) : null}
          </div>
        ) : null}
        {message.widget && widgetReady ? (
          <div className={animateIn ? "animate-chat-widget-in" : ""}>
            {renderWidget(message.widget, {
              reducedMotion,
              isLatest,
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
