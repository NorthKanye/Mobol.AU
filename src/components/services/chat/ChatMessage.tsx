import type { RenderedMessage } from "./types";
import { renderWidget } from "./widgets";
import ThinkingStepsReveal from "./ThinkingStepsReveal";

type Props = {
  message: RenderedMessage;
  reducedMotion: boolean;
  isLatest: boolean;
  isFirstInGroup: boolean;
  onToggleThinkingAction: (id: string) => void;
};

export default function ChatMessage({
  message,
  reducedMotion,
  isLatest,
  isFirstInGroup,
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
  // The thinking-step → widget transition already has a built-in 200ms beat
  // in useChatScript (post-collapse). For plain bubbles, default to 140ms so
  // the widget eases in just after the message bubble lands.
  const widgetDelayMs =
    message.widgetEnterDelayMs ?? (message.thinking ? 0 : 140);

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="shrink-0 w-[22px] mr-2 mt-[2px]" aria-hidden="true">
          {isFirstInGroup ? (
            <div className="w-[22px] h-[22px] rounded-full bg-ink text-surface flex items-center justify-center text-[10px] font-semibold leading-none tracking-tight">
              M
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className={`flex flex-col gap-2.5 ${isUser ? "items-end" : "items-start"} max-w-[88%]`}
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
                ? "bg-[#E5E3DC] text-ink rounded-[20px] px-3.5 py-2 text-[13px] leading-[1.45]"
                : "text-ink text-[13px] sm:text-[14px] leading-[1.55] px-1 max-w-[420px]"
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
          <div
            className={animateIn ? "animate-chat-widget-in" : ""}
            style={
              animateIn ? { animationDelay: `${widgetDelayMs}ms` } : undefined
            }
          >
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
