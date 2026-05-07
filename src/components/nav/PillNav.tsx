import Link from "next/link";

const links = [
  { href: "#who", label: "who we are" },
  { href: "#what", label: "what we do" },
  { href: "#work", label: "work" },
  { href: "#contact", label: "contact" },
];

export default function PillNav() {
  return (
    <>
      {/* Nav-gap mask — covers the 24px transparent strip above the pill so
          the strap can't be seen leaking into it during the lanyard's
          scroll-out transit. z-45 sits above the lanyard (z-10 in Hero) and
          below the nav (z-50). bg-color matches the page background so it
          reads as part of the paper, not as a visible bar. */}
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 h-6 z-[45] pointer-events-none"
        style={{ background: "var(--color-bg)" }}
      />
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-6 pointer-events-none">
      {/* nav-wrapper — fixed-aspect frame that contains both the SVG-drawn
          nav silhouette and the actual interactive content. The SVG path
          and the tab live in the same coordinate space, so the tab is part
          of the nav's shape rather than a separate element glued below it.
          overflow-hidden caps the retracting tab and slot so they cannot
          leak into the gap above the wrapper (viewport y < 24). The body's
          drop-shadow stays within the 122px box, so it survives the clip. */}
      <div className="pointer-events-auto relative w-full max-w-[1200px] h-[122px] overflow-hidden">
        {/* Nav silhouette — split into TWO paths so the tab can be slid
            up independently on scroll (see `.tab-retract` in globals.css).
            Both paths are #ffffff and meet flush at y=78 between x=843
            and x=977, so visually they're indistinguishable from the
            previous single-path silhouette while at scroll y=0.

            Body path: rounded-pill rectangle. Tab path: dropped portion
            with concave ears at top and rounded bottom corners. */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 122"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          {/* Body — rounded pill, always visible */}
          <path
            d="M 39 0 L 1161 0 A 39 39 0 0 1 1161 78 L 39 78 A 39 39 0 0 1 39 0 Z"
            fill="#ffffff"
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(17,17,17,0.04)) drop-shadow(0 6px 14px rgba(17,17,17,0.06))",
            }}
          />
          {/* Tab — pops up and out of view via .tab-retract when the
              hero scrolls past the header. No drop-shadow on the tab
              path itself: the body's drop-shadow is sufficient at rest,
              and a tab-only shadow would leak below the body during
              the transit upward. */}
          <g className="tab-retract">
            <path
              d="M 977 78 A 16 16 0 0 0 961 94 L 961 100 A 16 16 0 0 1 945 116 L 875 116 A 16 16 0 0 1 859 100 L 859 94 A 16 16 0 0 0 843 78 Z"
              fill="#ffffff"
            />
          </g>
        </svg>

        {/* Threading slot — the small horizontal handle inside the tab,
            representing where the lanyard ribbon threads through the
            plastic clip. Positioned with percentages so it scales with
            the wrapper at narrower viewports (the underlying SVG path
            scales the same way via `preserveAspectRatio="none"`).
            Hidden below sm so it disappears in lockstep with the lanyard
            on mobile (no orphaned grey rect with nothing hanging from it). */}
        <span
          aria-hidden="true"
          className="tab-retract absolute rounded-[4px] z-[2] hidden sm:block"
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
            // Fade the slot out as it retracts into the body region — a
            // grey stripe on the white pill body would otherwise read as
            // a visual artifact. Linear from 1 (untouched) at tab-pull≤18
            // to 0 at tab-pull≥78 (slot fully inside the body region).
            opacity:
              "calc(1 - (var(--tab-pull, 0px) - 18px) / 60px)",
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
    </>
  );
}
