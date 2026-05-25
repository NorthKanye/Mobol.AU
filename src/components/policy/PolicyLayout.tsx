import type { ReactNode } from "react";
import PolicyToc, { type PolicyTocSection } from "./PolicyToc";

interface PolicyLayoutProps {
  title: string;
  kicker?: string;
  lastUpdated: string;
  sections: PolicyTocSection[];
  children: ReactNode;
}

export default function PolicyLayout({
  title,
  kicker = "POLICIES",
  lastUpdated,
  sections,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="bg-white pt-32 sm:pt-40 pb-20 sm:pb-28">
      <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-10">
        <header className="mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2 mb-3">
            {kicker}
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,3.25rem)] tracking-display font-medium text-ink leading-[1.05]">
            {title}
          </h1>
          <p className="mt-3 text-sm text-ink-2">
            Last updated {lastUpdated}
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          <PolicyToc sections={sections} />
          <article className="policy-prose mt-2 lg:mt-0">
            {children}
            <footer className="policy-section mt-12 text-sm text-ink-2">
              Questions about this policy? Email{" "}
              <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>.
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
