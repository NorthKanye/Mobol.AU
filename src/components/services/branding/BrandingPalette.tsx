import { PALETTE } from "./BrandingMockup";

/**
 * Cell 3 — Color palette.
 *
 * Six swatches in a 3×2 sub-grid. The parent walks the loop:
 *   shownCount: how many swatches have been "popped in" (.in class)
 *   activeIdx:  which swatch is currently highlighted (.active class)
 *   readout:    the name + hex shown beneath the grid
 * Bone gets a hairline inset border (.is-bone) so it doesn't disappear
 * against the cell's #faf8f4 background.
 */
type Props = {
  shownCount: number;
  activeIdx: number;
  readout: { name: string; hex: string };
};

export default function BrandingPalette({ shownCount, activeIdx, readout }: Props) {
  return (
    <div
      className="bcell relative bg-[#faf8f4] flex flex-col p-[14px] overflow-hidden"
      data-cell="palette"
    >
      <div className="bcell-tag font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        03 · Palette
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
            s.name === "Bone" && "is-bone",
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

      <div className="pal-readout flex-shrink-0 flex justify-between items-baseline pt-2 mt-2 border-t border-dashed border-[#e3dfd6] font-mono text-[10px]">
        <span className="text-ink font-semibold">{readout.name}</span>
        <span className="text-ink-3 tabular-nums">{readout.hex}</span>
      </div>
    </div>
  );
}
