/**
 * Cell 6 — Applied (business card mock).
 *
 * A black business card sits centered on a warm bone background. The card
 * starts tilted, scaled-down, and translated, then settles into its final
 * resting tilt when the parent gets `.card-in`. Its content — M-mark up
 * top, name + role at the bottom — is the system applied to a single
 * deliverable, the punctuation mark on the loop.
 */
export default function BrandingApplied() {
  return (
    <div
      className="bcell bcell-applied relative bg-[#efece6] flex items-center justify-center overflow-hidden"
      data-cell="applied"
      style={{ padding: 14 }}
    >
      <div
        className="bcell-tag absolute top-3 left-3 font-mono text-[9.5px] text-ink-3 uppercase tracking-[0.08em]"
        style={{ margin: 0 }}
      >
        06 · Applied
      </div>

      <div
        className="card-mock relative text-surface overflow-hidden"
        style={{
          width: "78%",
          aspectRatio: "1.7 / 1",
          background: "#0E0E0E",
          borderRadius: 6,
          boxShadow:
            "0 1px 2px rgba(0,0,0,.08), 0 14px 30px -12px rgba(0,0,0,.35)",
        }}
      >
        <div className="card-front absolute inset-0 flex flex-col justify-between px-4 py-3.5">
          <div className="card-mark w-[22px] h-[22px] text-surface">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M7 16 V8 L12 12 L17 8 V16" />
            </svg>
          </div>
          <div>
            <div
              className="card-name text-surface"
              style={{
                fontFamily: "var(--font-inter-tight)",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "-0.015em",
                lineHeight: 1.1,
              }}
            >
              Ada Okafor
            </div>
            <div
              className="card-role"
              style={{
                fontSize: "9.5px",
                color: "rgba(255,255,255,.55)",
                marginTop: 2,
                letterSpacing: "0.02em",
              }}
            >
              Founder, Mobol
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
