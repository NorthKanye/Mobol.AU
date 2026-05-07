import type { ChatWidget } from "../types";

type Props = {
  widget: Extract<ChatWidget, { type: "cta" }>;
  reducedMotion: boolean;
  isLatest: boolean;
};

export default function CTACard({ widget, reducedMotion, isLatest }: Props) {
  const animate = !reducedMotion && isLatest;
  return (
    <a
      href={widget.href}
      className={`group relative block overflow-hidden bg-ink text-surface rounded-2xl p-4 max-w-[380px] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${animate ? "animate-chat-cta-in" : ""}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Soft warm-paper sheen — sits behind text, slides on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(240,239,236,0.18), transparent 60%)",
        }}
      />
      {/* Decorative corner mark */}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-surface/40 group-hover:bg-surface transition-colors"
      />
      <div className="relative">
        {widget.eyebrow ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-surface/55">
            {widget.eyebrow}
          </p>
        ) : null}
        <p className="mt-2 text-[16px] font-semibold tracking-display text-surface leading-[1.25]">
          {widget.label}
        </p>
        <span className="mt-3.5 inline-flex items-center gap-2 text-[12px] font-medium text-surface">
          <span className="relative w-5 h-5 rounded-full bg-surface/12 group-hover:bg-surface/22 transition-colors overflow-hidden">
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className="absolute inset-0 m-auto transition-transform duration-300 group-hover:translate-x-3"
              aria-hidden="true"
            >
              <path
                d="M2.5 6 H9.5 M6 2.5 L9.5 6 L6 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className="absolute inset-0 m-auto -translate-x-3 transition-transform duration-300 group-hover:translate-x-0"
              aria-hidden="true"
            >
              <path
                d="M2.5 6 H9.5 M6 2.5 L9.5 6 L6 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Reach the studio
        </span>
      </div>
    </a>
  );
}
