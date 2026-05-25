import Link from "next/link";

export default function WebDevCta() {
  return (
    <section
      aria-labelledby="webdev-cta-heading"
      className="mt-32 lg:mt-40 rounded-3xl bg-ink text-white px-8 sm:px-16 py-20 sm:py-24"
    >
      <div className="max-w-[640px] mx-auto text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60 font-mono">
          Start a project
        </p>
        <h2
          id="webdev-cta-heading"
          className="mt-5 font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.75rem,3vw,2.75rem)]"
        >
          Got a build in mind?
          <br />
          Let&apos;s scope it together.
        </h2>
        <p className="mt-6 text-[15px] leading-[1.55] text-white/70">
          Tell us about the site, the stack you&apos;re considering, and the
          team that&apos;ll be editing it. We&apos;ll reply within two business
          days with a shape, a timeline, and a rough number.
        </p>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors"
        >
          Start a project
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
