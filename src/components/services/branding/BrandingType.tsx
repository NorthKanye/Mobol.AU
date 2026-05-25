/**
 * Cell 4 — Type specimen.
 *
 * A confident "Aa" on the left, a tight three-row mono meta column on
 * the right (Family / Wts / Track), and a five-step scale ramp at the
 * bottom (12 / 16 / 20 / 28 / 40) rendered in JetBrains Mono with a
 * 1.5px ruler line that grows L→R when the window root has `.scale-on`.
 *
 * Kept deliberately minimal — Pair and Mono treatments live in the
 * Wordmark cell already (rows 2 and 3), so repeating them here just
 * crowds a narrow column. Scale digits use JetBrains Mono so the ramp
 * reads as "specimen labels" rather than display numbers.
 */
export default function BrandingType() {
  return (
    <div
      className="bcell relative bg-[#fafaf9] flex flex-col p-[14px] overflow-hidden min-w-0"
      data-cell="type"
    >
      <div className="bcell-tag font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        Type
      </div>

      <div className="type-spec flex items-center gap-3 flex-1 min-h-0 min-w-0">
        <div
          className="type-aa text-ink flex-shrink-0"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 800,
            fontSize: "clamp(44px, 5.4vw, 70px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          Aa
        </div>
        <div className="type-meta flex flex-col gap-[5px] flex-1 min-w-0">
          {[
            { label: "Family", value: "Inter Tight" },
            { label: "Wts", value: "400/600/800" },
            { label: "Track", value: "−0.03" },
          ].map((row) => (
            <div
              key={row.label}
              className="type-meta-row flex items-baseline justify-between gap-2"
            >
              <span
                className="text-ink-3"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {row.label}
              </span>
              <span
                className="text-ink truncate"
                style={{
                  fontFamily: "var(--font-inter-tight)",
                  fontWeight: 600,
                  fontSize: "10.5px",
                  letterSpacing: "-0.005em",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="type-scale flex-shrink-0 flex items-baseline gap-2 pt-2.5 mt-2 border-t border-dashed border-border text-ink relative overflow-hidden tabular-nums"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontWeight: 500,
          letterSpacing: "0",
        }}
      >
        <span style={{ fontSize: "10px" }}>12</span>
        <span style={{ fontSize: "13px" }}>16</span>
        <span style={{ fontSize: "17px" }}>20</span>
        <span style={{ fontSize: "22px" }}>28</span>
        <span style={{ fontSize: "28px" }}>40</span>
        <span className="type-ruler absolute bottom-1 left-0 h-[1.5px] bg-ink" />
      </div>
    </div>
  );
}
