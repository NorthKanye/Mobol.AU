import Link from "next/link";
import {
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
} from "./SocialIcons";
import { services as serviceCatalog } from "@/lib/services";

const services = serviceCatalog.map((s) => ({ label: s.label, href: s.href }));

const site = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
];

const legal = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const socials = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink-2">
      {children}
    </p>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-[15px] text-ink transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink rounded-sm"
    >
      {children}
    </Link>
  );
}

export default function FooterColumns() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
      <nav aria-label="Services">
        <ColumnHeading>Services</ColumnHeading>
        <ul className="mt-5 space-y-3">
          {services.map((s) => (
            <li key={s.label}>
              <FooterLink href={s.href}>{s.label}</FooterLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Site">
        <ColumnHeading>Site</ColumnHeading>
        <ul className="mt-5 space-y-3">
          {site.map((s) => (
            <li key={s.label}>
              <FooterLink href={s.href}>{s.label}</FooterLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Legal">
        <ColumnHeading>Legal</ColumnHeading>
        <ul className="mt-5 space-y-3">
          {legal.map((s) => (
            <li key={s.label}>
              <FooterLink href={s.href}>{s.label}</FooterLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Social">
        <ColumnHeading>Social</ColumnHeading>
        <ul className="mt-5 flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-all duration-200 hover:opacity-60 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink"
              >
                <Icon />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
