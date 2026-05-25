import FooterBaseline from "./FooterBaseline";
import FooterColumns from "./FooterColumns";
import FooterCta from "./FooterCta";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-labelledby="footer-cta-heading"
      className="relative w-full bg-surface border-t border-[var(--color-border)]"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-14 lg:pt-16 pb-8">
        <FooterCta />

        <div className="mt-12 lg:mt-14 border-t border-[var(--color-border)] pt-10">
          <FooterColumns />
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6">
          <FooterBaseline />
        </div>
      </div>
    </footer>
  );
}
