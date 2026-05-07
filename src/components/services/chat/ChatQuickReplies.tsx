"use client";

type Props = {
  replies: ReadonlyArray<string>;
  reducedMotion: boolean;
  onPickAction: (text: string) => void;
};

export default function ChatQuickReplies({
  replies,
  reducedMotion,
  onPickAction,
}: Props) {
  if (replies.length === 0) return null;
  return (
    <div
      role="group"
      aria-label="Suggested questions"
      className="px-3 pt-2.5 pb-1 flex flex-wrap items-center gap-1.5"
    >
      {replies.map((text, i) => (
        <button
          key={text}
          type="button"
          onClick={() => onPickAction(text)}
          aria-label={`Send "${text}"`}
          style={{
            animationDelay: reducedMotion ? undefined : `${i * 80}ms`,
          }}
          className={`inline-flex items-center max-w-full bg-bg border border-border rounded-full px-3 py-1.5 text-[12px] leading-tight text-ink hover:bg-surface hover:border-ink/20 transition-colors ${
            reducedMotion ? "" : "animate-chat-chip-in"
          }`}
        >
          <span className="truncate">{text}</span>
        </button>
      ))}
    </div>
  );
}
