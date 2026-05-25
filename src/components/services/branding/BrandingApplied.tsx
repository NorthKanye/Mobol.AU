import Image from "next/image";

/**
 * Cell 6 — Applied (generated brand-stationery photograph).
 *
 * The cell holds a centered card-shaped frame on a cool off-white surface.
 * The card lands via a 3D tilt + drop-shadow grow choreography driven by
 * `.card-s1` / `.card-s2` on the window root. The image at
 * `/branding/applied.jpg` is a generated editorial flat-lay of stationery
 * with the system applied — see the design plan for the prompt. Until the
 * asset exists the card falls back to a flat ink fill, which still reads
 * as "system applied to a single deliverable" without breaking the layout.
 */
export default function BrandingApplied() {
  return (
    <div
      className="bcell bcell-applied relative bg-[#f5f5f4] flex items-center justify-center overflow-hidden"
      data-cell="applied"
      style={{ padding: 14 }}
    >
      <div
        className="bcell-tag absolute top-3 left-3 font-mono text-[10.5px] text-ink-3 uppercase tracking-[0.08em] z-10"
        style={{ margin: 0 }}
      >
        Applied
      </div>

      <div
        className="card-mock relative bg-ink"
        style={{
          width: "82%",
          aspectRatio: "1 / 1",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Image
          src="/branding.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 12vw, 40vw"
          className="object-cover"
          priority={false}
        />
      </div>
    </div>
  );
}
