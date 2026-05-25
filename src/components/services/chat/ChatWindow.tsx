type Props = {
  modelLabel?: string;
  modelLabelMobile?: string;
};

export default function ChatWindow({
  modelLabel = "Mobol AI",
  modelLabelMobile = "AI",
}: Props) {
  return (
    <div
      className="absolute inset-x-0 top-0 h-14 flex items-center px-4 bg-surface/96 backdrop-blur-sm border-b border-border z-20"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center text-[12px] font-semibold">
          m
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-tight text-ink truncate">
            <span className="hidden sm:inline">{modelLabel}</span>
            <span className="sm:hidden">{modelLabelMobile}</span>
          </p>
          <p className="text-[10px] leading-tight text-ink-2 truncate">
            Multi-industry AI layer
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-bg px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
        <span className="text-[10px] font-medium text-ink-2">
          <span className="hidden sm:inline">AI layer online</span>
          <span className="sm:hidden">live</span>
        </span>
      </div>
    </div>
  );
}
