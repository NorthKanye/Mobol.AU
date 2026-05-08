type Props = {
  reducedMotion: boolean;
};

export default function ChatTypingIndicator({ reducedMotion }: Props) {
  return (
    <div
      className="flex items-center gap-1 px-3 py-2 w-fit"
      role="status"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full bg-ink-2 ${reducedMotion ? "" : "animate-chat-typing-dot"}`}
          style={{ animationDelay: reducedMotion ? undefined : `${i * 140}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
