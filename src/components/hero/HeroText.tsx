import Link from "next/link";

export default function HeroText() {
  return (
    <div className="max-w-[520px]">
      <p className="text-[11px] tracking-[0.22em] uppercase text-ink-3 mb-8">
        Digital agency for ambitious brands
      </p>

      <h1 className="text-ink font-bold leading-[1.02] tracking-tighter-display text-[clamp(2.5rem,3.8vw,3.875rem)]">
        Brand identities
        <br />
        and premium
        <br />
        websites.
      </h1>

      <p className="mt-7 text-[15px] leading-[1.55] text-ink-body max-w-[400px]">
        Mobol is a digital agency creating thoughtful brands, intuitive
        websites, and engaging digital experiences that help businesses grow
        and scale.
      </p>

      <div className="mt-10 flex items-center gap-7">
        <Link
          href="#contact"
          data-smile-trigger
          className="
            inline-flex items-center justify-center
            h-[48px] px-6
            rounded-full
            bg-ink text-surface
            text-[14px] font-medium
            transition-transform hover:scale-[1.02] active:scale-[0.99]
            focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink
          "
        >
          Start a project
        </Link>
        <Link
          href="#work"
          className="
            inline-flex items-center gap-1.5
            text-[14px] font-medium text-ink
            rounded-sm
            transition-opacity hover:opacity-70
            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink
          "
        >
          View our work
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
