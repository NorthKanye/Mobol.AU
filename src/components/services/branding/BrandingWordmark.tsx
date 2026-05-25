import { WORDMARK_LABELS } from "./constants";

/**
 * Cell 2 — Wordmark variations.
 *
 * Five wordmark studies stacked absolutely in the same slot. The parent
 * passes `activeIdx` (-1 means none shown yet, 0–4 picks one); the row at
 * `activeIdx` gets the `wm-show` class which fades + slides it into view.
 * The five treatments live as inline-styled spans so the dramatic
 * tracking / weight / family differences land cleanly.
 */
type Props = {
  activeIdx: number;
};

export default function BrandingWordmark({ activeIdx }: Props) {
  const styleLabel = activeIdx >= 0 ? WORDMARK_LABELS[activeIdx] : "—";
  const pagerCur = activeIdx >= 0 ? activeIdx + 1 : 0;

  return (
    <div
      className="bcell relative bg-[#fafaf9] flex flex-col p-[14px] overflow-hidden min-w-0"
      data-cell="wordmark"
    >
      <div className="bcell-tag font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        Wordmark
      </div>

      <div className="wm-stack flex-1 relative flex items-center justify-center min-h-0">
        <div
          className={`wm-row ${activeIdx === 0 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontSize: "clamp(28px, 3.6vw, 46px)",
            lineHeight: 1,
          }}
        >
          Mobol
        </div>
        <div
          className={`wm-row ${activeIdx === 1 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            fontSize: "clamp(30px, 3.8vw, 50px)",
            lineHeight: 1,
          }}
        >
          Mobol
        </div>
        <div
          className={`wm-row ${activeIdx === 2 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontWeight: 500,
            letterSpacing: "0.02em",
            fontSize: "clamp(26px, 3.2vw, 42px)",
            lineHeight: 1,
          }}
        >
          mobol
        </div>
        <div
          className={`wm-row ${activeIdx === 3 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 600,
            letterSpacing: "0.34em",
            fontSize: "clamp(15px, 1.5vw, 19px)",
            lineHeight: 1,
          }}
        >
          M O B O L
        </div>
        <div
          className={`wm-row ${activeIdx === 4 ? "wm-show" : ""} absolute inset-0 flex items-center justify-center text-ink whitespace-nowrap`}
          style={{
            fontFamily: "var(--font-inter-tight)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontSize: "clamp(28px, 3.6vw, 46px)",
            lineHeight: 1,
          }}
        >
          <span
            className="inline-block align-middle rounded-full bg-[var(--color-accent)]"
            style={{
              width: "0.55em",
              height: "0.55em",
              marginRight: "0.18em",
              transform: "translateY(-0.08em)",
            }}
          />
          Mobol
        </div>
      </div>

      <div
        className="wm-meta flex-shrink-0 flex items-center justify-between text-ink-2 pt-2 border-t border-dashed border-border mt-2"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "9.5px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <span>{styleLabel}</span>
        <span className="text-ink-3 tabular-nums">
          {`0.${pagerCur} / 05`}
        </span>
      </div>
    </div>
  );
}
