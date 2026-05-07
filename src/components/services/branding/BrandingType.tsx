/**
 * Cell 4 — Type specimen.
 *
 * A big "Aa" in the project's display font on the left, mono metadata
 * key/value rows on the right (Family / Wts / Track), and a five-step
 * scale ramp at the bottom (12 / 16 / 20 / 28 / 40) with a 1.5px ruler
 * line that grows L→R underneath when the window root has `.scale-on`.
 */
export default function BrandingType() {
  return (
    <div
      className="bcell relative bg-[#faf8f4] flex flex-col p-[14px] overflow-hidden min-w-0"
      data-cell="type"
    >
      <div className="bcell-tag font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        04 · Type
      </div>

      <div className="type-spec flex items-center gap-3.5 flex-1 min-h-0 min-w-0">
        <div
          className="type-aa text-ink flex-shrink-0"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 800,
            fontSize: "clamp(48px, 6vw, 78px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          Aa
        </div>
        <div className="type-meta flex flex-col gap-1 font-mono text-[9.5px] flex-1 min-w-0">
          <div className="type-meta-row flex justify-between gap-2">
            <span className="text-ink-3">Family</span>
            <span className="text-ink font-semibold">Inter Tight</span>
          </div>
          <div className="type-meta-row flex justify-between gap-2">
            <span className="text-ink-3">Wts</span>
            <span className="text-ink font-semibold">400/600/800</span>
          </div>
          <div className="type-meta-row flex justify-between gap-2">
            <span className="text-ink-3">Track</span>
            <span className="text-ink font-semibold">−0.03</span>
          </div>
        </div>
      </div>

      <div
        className="type-scale flex-shrink-0 flex items-baseline gap-2 pt-2.5 mt-2 border-t border-dashed border-[#e3dfd6] text-ink relative overflow-hidden"
        style={{
          fontFamily: "var(--font-inter-tight)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
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
