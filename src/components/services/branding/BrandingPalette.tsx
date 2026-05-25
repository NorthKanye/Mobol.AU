import { PALETTE } from "./constants";

/**
 * Cell 3 — Color palette.
 *
 * Six swatches in a 3×2 sub-grid. The parent walks the loop:
 *   shownCount: how many swatches have been "popped in" (.in class)
 *   activeIdx:  which swatch is currently highlighted (.active class)
 *   readout:    the name + hex + role shown beneath the grid
 * Paper gets a hairline inset border (.is-paper) so the off-white swatch
 * doesn't disappear against the cell's own off-white background.
 */
type Props = {
  shownCount: number;
  activeIdx: number;
  readout: { name: string; hex: string; role: string };
};

export default function BrandingPalette({ shownCount, activeIdx, readout }: Props) {
  return (
    <div
      className="bcell relative bg-[#fafaf9] flex flex-col p-[14px] overflow-hidden"
      data-cell="palette"
    >
      <div className="bcell-tag font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        Palette
      </div>

      <div
        className="pal-grid flex-1 grid gap-1.5 min-h-0"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
        }}
      >
        {PALETTE.map((s, i) => {
          const cls = [
            "swatch relative rounded-[6px]",
            i < shownCount && "in",
            i === activeIdx && "active",
            s.name === "Paper" && "is-paper",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div
              key={s.hex}
              className={cls}
              style={{ backgroundColor: s.hex }}
              data-name={s.name}
              data-hex={s.hex}
            />
          );
        })}
      </div>

      <div className="pal-readout flex-shrink-0 flex items-baseline gap-2 pt-2 mt-2 border-t border-dashed border-border">
        <span
          className="text-ink"
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 600,
            fontSize: "11px",
            letterSpacing: "-0.01em",
          }}
        >
          {readout.name}
        </span>
        <span
          className="text-ink-3 tabular-nums ml-auto"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "9.5px",
          }}
        >
          {readout.hex}
        </span>
        <span
          className="text-ink-2"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "9px",
            minWidth: "52px",
            textAlign: "right",
          }}
        >
          {readout.role}
        </span>
      </div>
    </div>
  );
}
