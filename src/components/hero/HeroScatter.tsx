export default function HeroScatter() {
  return (
    <>
      {/* ── Bottom-left: oversized macOS-style window, anchored half off-canvas ── */}
      <div
        className="
          pointer-events-none
          hidden lg:block
          absolute
          -left-44 xl:-left-28 2xl:-left-16
          -bottom-28 xl:-bottom-24
          select-none
          animate-float-slow
          z-0
        "
        aria-hidden="true"
      >
        <div
          className="
            relative
            w-[420px] h-[300px] xl:w-[480px] xl:h-[340px]
            rounded-2xl bg-surface
            shadow-[0_4px_10px_rgba(17,17,17,0.05),_0_28px_60px_rgba(17,17,17,0.10)]
            border border-black/[0.05]
            overflow-hidden
            -rotate-[12deg] origin-top-right
          "
        >
          {/* Window chrome — traffic-light dots */}
          <div className="flex items-center gap-2 px-5 h-10 border-b border-black/[0.04]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>

          {/* Window body — clean placeholder canvas */}
          <div className="relative flex-1 h-[calc(100%-40px)] bg-[#fafaf9]">
            {/* Subtle grid hint */}
            <div
              className="absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(17,17,17,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.04) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Soft floating shape */}
            <div
              className="
                absolute top-10 left-10
                w-[160px] h-[100px]
                rounded-xl bg-ink/[0.06]
                border border-black/[0.04]
              "
            />
            <div
              className="
                absolute top-[78px] left-[120px]
                w-[180px] h-[120px]
                rounded-xl bg-surface
                border border-black/[0.06]
                shadow-[0_8px_18px_rgba(17,17,17,0.06)]
              "
            >
              {/* Mini header line */}
              <div className="flex items-center gap-1.5 px-3 pt-3">
                <span className="w-1 h-1 rounded-full bg-ink/30" />
                <span className="w-1 h-1 rounded-full bg-ink/30" />
                <span className="w-1 h-1 rounded-full bg-ink/30" />
              </div>
              {/* Body lines */}
              <div className="px-3 mt-3 space-y-1.5">
                <div className="h-1.5 w-3/4 rounded-full bg-ink/10" />
                <div className="h-1.5 w-1/2 rounded-full bg-ink/10" />
                <div className="h-1.5 w-2/3 rounded-full bg-ink/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom-right: +38% growth stat card ─────────── */}
      <div
        className="
          pointer-events-none
          hidden lg:block
          absolute right-8 lg:right-12 xl:right-20 2xl:right-28 bottom-12
          select-none
          animate-float-slower
          z-0
        "
        aria-hidden="true"
      >
        <div
          className="
            rotate-[6deg]
            w-[180px]
            rounded-2xl bg-surface
            shadow-[0_2px_4px_rgba(17,17,17,0.04),_0_22px_44px_rgba(17,17,17,0.10)]
            border border-black/[0.04]
            p-4
          "
        >
          <div className="w-9 h-9 rounded-full bg-[#E8F0F6] flex items-center justify-center mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 11 L7 7 L9.5 9.5 L13 5 M13 5 H9.5 M13 5 V8.5"
                stroke="#5B8DA8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[11px] text-ink-2 leading-tight">Client growth</p>
          <p className="mt-1 text-[28px] font-bold tracking-tight text-ink leading-none">
            +38%
          </p>
          <p className="mt-1.5 text-[10px] text-ink-2 leading-tight">vs last quarter</p>
        </div>
      </div>
    </>
  );
}
