import Link from "next/link";

export default function AiCta() {
  return (
    <section
      aria-labelledby="ai-cta-heading"
      className="mt-32 lg:mt-40 rounded-3xl bg-ink text-white px-8 sm:px-16 py-20 sm:py-24"
    >
      <div className="max-w-[640px] mx-auto text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60 font-mono">
          Start with AI
        </p>
        <h2
          id="ai-cta-heading"
          className="mt-5 font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.75rem,3vw,2.75rem)]"
        >
          Got a process AI could
          <br />
          take off your plate?
        </h2>
        <p className="mt-6 text-[15px] leading-[1.55] text-white/70">
          Tell us where the time goes. The repetitive questions, the manual
          follow-ups, the content backlog. We&apos;ll map an AI layer for it
          and reply within two business days with a shape, a timeline, and a
          rough number.
        </p>
        <Link
          href="/contact"
          className="mt-9 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-ink text-[14px] font-medium hover:bg-white/90 transition-colors"
        >
          Book a scoping call
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
