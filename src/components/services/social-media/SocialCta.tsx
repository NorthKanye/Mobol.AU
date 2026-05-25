import Link from "next/link";

export default function SocialCta() {
  return (
    <section
      aria-labelledby="social-cta-heading"
      className="mt-32 lg:mt-40 rounded-3xl bg-ink text-white px-8 sm:px-16 py-20 sm:py-24"
    >
      <div className="max-w-[640px] mx-auto text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60 font-mono">
          Start with social
        </p>
        <h2
          id="social-cta-heading"
          className="mt-5 font-bold leading-[1.05] tracking-tighter-display text-[clamp(1.75rem,3vw,2.75rem)]"
        >
          Got a handle, account, or
          <br />
          inbox we should look at?
        </h2>
        <p className="mt-6 text-[15px] leading-[1.55] text-white/70">
          Tell us what&apos;s stuck &mdash; a username you want, an account
          that&apos;s locked, an inbox that&apos;s overflowing, a verification
          you&apos;ve been putting off. We&apos;ll reply within two business
          days with a shape, a timeline, and a rough number.
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
