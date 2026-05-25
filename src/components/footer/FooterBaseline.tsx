"use client";

function UpArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:-translate-y-0.5"
    >
      <path
        d="M6 10 V2 M2.5 5.5 L6 2 L9.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FooterBaseline() {
  return (
    <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[12px] text-ink-2">
        © 2026 Mobol — Perth, AU. All rights reserved.
      </p>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[13px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
      >
        <UpArrow />
        Back to top
      </button>
    </div>
  );
}
