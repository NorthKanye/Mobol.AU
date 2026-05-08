type Props = {
  modelLabel?: string;
  modelLabelMobile?: string;
};

export default function ChatWindow({
  modelLabel = "mobol AI",
  modelLabelMobile = "AI",
}: Props) {
  return (
    <div
      className="absolute inset-x-0 top-0 h-[8.5%] flex items-center px-3 bg-[#f6f5f2] border-b border-border z-20"
      aria-hidden="true"
    >
      <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
      <span className="w-2 h-2 rounded-full bg-[#febc2e] ml-1.5" />
      <span className="w-2 h-2 rounded-full bg-[#28c840] ml-1.5" />

      <div className="absolute left-1/2 -translate-x-1/2 h-[60%] min-w-[28%] max-w-[44%] rounded-full bg-border/60 flex items-center justify-center px-2">
        <span className="text-[clamp(8px,1vw,11px)] text-ink-2 font-medium">
          <span className="hidden sm:inline">{modelLabel}</span>
          <span className="sm:hidden">{modelLabelMobile}</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 text-[10px] text-ink-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
        <span className="hidden md:inline">Online</span>
      </div>
    </div>
  );
}
