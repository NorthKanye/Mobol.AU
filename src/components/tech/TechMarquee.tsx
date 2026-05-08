import * as Logos from "./logoIcons";

const LOGOS = [
  { name: "OpenAI", Icon: Logos.OpenAI },
  { name: "Anthropic", Icon: Logos.Anthropic },
  { name: "React", Icon: Logos.React },
  { name: "Next.js", Icon: Logos.NextJs },
  { name: "TypeScript", Icon: Logos.TypeScript },
  { name: "JavaScript", Icon: Logos.JavaScript },
  { name: "Tailwind CSS", Icon: Logos.Tailwind },
  { name: "WordPress", Icon: Logos.WordPress },
  { name: "Figma", Icon: Logos.Figma },
  { name: "Vercel", Icon: Logos.Vercel },
  { name: "Stripe", Icon: Logos.Stripe },
  { name: "Meta", Icon: Logos.Meta },
  { name: "X", Icon: Logos.X },
  { name: "Amazon AWS", Icon: Logos.AWS },
  { name: "Microsoft Azure", Icon: Logos.Azure },
  { name: "Microsoft 365", Icon: Logos.Microsoft365 },
  { name: "Google Cloud", Icon: Logos.GoogleCloud },
  { name: "GitHub", Icon: Logos.GitHub },
] as const;

export default function TechMarquee() {
  return (
    <section
      aria-labelledby="tech-heading"
      className="relative w-full bg-surface border-t border-border py-14 lg:py-16"
    >
      <div className="max-w-[1280px] mx-auto px-8 text-center">
        <h2
          id="tech-heading"
          className="text-[11px] tracking-[0.22em] uppercase text-ink-2 font-medium"
        >
          Technologies we work with
        </h2>
      </div>

      {/* Triplicated row + triangular mask: animation translates by -33.333%
          per cycle so copy #2 lands flush where copy #1 was. The triangular
          mask (transparent 5% → black 50% → transparent 95%) is a peak-only
          gradient — logos read as solid only when crossing center, fading
          symmetrically toward both edges. Matches the Framer-built reference. */}
      <div
        className="relative mt-9 lg:mt-10 overflow-hidden
                   [mask-image:linear-gradient(to_right,transparent_5%,black_50%,black_50%,transparent_95%)]
                   [-webkit-mask-image:linear-gradient(to_right,transparent_5%,black_50%,black_50%,transparent_95%)]"
      >
        <ul className="flex w-max items-center gap-16 animate-marquee will-change-transform">
          {[0, 1, 2].flatMap((copy) =>
            LOGOS.map(({ name, Icon }) => (
              <li
                key={`${copy}-${name}`}
                aria-hidden={copy !== 0 ? "true" : undefined}
                className="shrink-0"
              >
                <Icon
                  title={name}
                  className="h-10 lg:h-12 w-auto text-ink-3 transition-colors duration-300 hover:text-ink"
                />
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
