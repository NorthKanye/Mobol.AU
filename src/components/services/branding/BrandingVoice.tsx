import { VOICE_PAIRS } from "./constants";

/**
 * Cell 5 — Voice & tone tokens.
 *
 * Four "yes / not that" pairs that slide in left-to-right via the .in
 * class (parent toggles by index). Each pair is a small pill of the
 * desired trait next to a struck-through opposite, framed as picks
 * and antonyms rather than a long brand-voice paragraph. A small
 * `yes →` mono prefix on each row ties it to the documentation tone
 * used across the rest of the system board.
 */
type Props = {
  shownCount: number;
};

export default function BrandingVoice({ shownCount }: Props) {
  return (
    <div
      className="bcell relative bg-[#fafaf9] flex flex-col p-[14px] overflow-hidden"
      data-cell="voice"
    >
      <div className="bcell-tag font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
        Voice
      </div>

      <div className="voice-tokens flex-1 flex flex-col gap-[7px] justify-center min-h-0">
        {VOICE_PAIRS.map((p, i) => (
          <div
            key={p.yes}
            className={`vtok flex items-center gap-2 text-[11px] ${i < shownCount ? "in" : ""}`}
          >
            <span
              className="vtok-prefix text-ink-3"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "8.5px",
                letterSpacing: "0.04em",
              }}
            >
              yes →
            </span>
            <span
              className="vtok-yes text-ink font-semibold px-[9px] py-[3px] bg-surface border border-border rounded-full"
              style={{ letterSpacing: "-0.005em" }}
            >
              {p.yes}
            </span>
            <span
              className="vtok-x text-ink-3 font-medium line-through"
              style={{ textDecorationColor: "var(--color-border)" }}
            >
              {p.no}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
