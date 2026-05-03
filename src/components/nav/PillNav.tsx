import Link from "next/link";

const links = [
  { href: "#who", label: "who we are" },
  { href: "#what", label: "what we do" },
  { href: "#work", label: "work" },
  { href: "#contact", label: "contact" },
];

export default function PillNav() {
  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-6 pointer-events-none">
      {/* nav-wrapper — fixed-aspect frame that contains both the SVG-drawn
          nav silhouette and the actual interactive content. The SVG path
          and the tab live in the same coordinate space, so the tab is part
          of the nav's shape rather than a separate element glued below it. */}
      <div className="pointer-events-auto relative w-full max-w-[1200px] h-[122px]">
        {/* Nav silhouette — one SVG path traces the entire shape:
            rounded-pill body on top, concave "ears" that curve INWARD
            before the tab drops down, the tab's vertical sides, the tab's
            rounded bottom corners, and back symmetrically on the other
            side. The concave ears are what make the tab grow from the nav
            body seamlessly (instead of looking like a chip stuck on).

            Path-level `filter: drop-shadow` casts ONE shadow tracing the
            entire union — there's no seam in the geometry, so there's
            no seam in the shadow either. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 122"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          <path
            d="M 39 0 L 1161 0 A 39 39 0 0 1 1161 78 L 977 78 A 16 16 0 0 0 961 94 L 961 100 A 16 16 0 0 1 945 116 L 875 116 A 16 16 0 0 1 859 100 L 859 94 A 16 16 0 0 0 843 78 L 39 78 A 39 39 0 0 1 39 0 Z"
            fill="#ffffff"
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(17,17,17,0.04)) drop-shadow(0 6px 14px rgba(17,17,17,0.06))",
            }}
          />
        </svg>

        {/* Threading slot — the small horizontal handle inside the tab,
            representing where the lanyard ribbon threads through the
            plastic clip. Positioned with percentages so it scales with
            the wrapper at narrower viewports (the underlying SVG path
            scales the same way via `preserveAspectRatio="none"`). */}
        <span
          aria-hidden="true"
          className="absolute rounded-[4px] z-[2]"
          style={{
            left: "calc(892 / 1200 * 100%)",
            top: "calc(96 / 122 * 100%)",
            width: "calc(36 / 1200 * 100%)",
            height: "calc(5 / 122 * 100%)",
            background: "#cfcfcf",
            // Inset shadow sells the slot as a real cutout: top edge dark
            // from the strap pressing down through it, bottom edge a hair
            // brighter from the white tab beneath catching ambient light.
            boxShadow:
              "inset 0 1px 1.5px rgba(0,0,0,0.45), inset 0 -0.5px 0 rgba(255,255,255,0.6)",
          }}
        />

        {/* Navigation content — sits on top of the SVG in the nav-body
            region (top 78px). Padding mirrors the user's spec: pl-10 for
            logo breathing room, pr-3 to butt the CTA against the right
            rounded edge. */}
        <nav
          className="relative z-10 h-[78px] flex items-center justify-between pl-10 pr-3"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="
              text-[22px] font-semibold tracking-[-0.02em] text-ink leading-none
              rounded-sm
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
            "
          >
            mobol
          </Link>

          <ul className="hidden md:flex items-center justify-center gap-16 text-[15px] text-ink">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="
                    py-2 rounded-sm
                    transition-opacity hover:opacity-70
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
                  "
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="#contact"
            className="
              inline-flex items-center justify-center
              h-[50px] px-7
              rounded-full
              bg-ink text-surface
              text-[15px] font-normal
              transition-transform hover:scale-[1.02] active:scale-[0.99]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink
            "
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
