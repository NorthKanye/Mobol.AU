import type { Metadata } from "next";
import SocialHero from "@/components/services/social-media/SocialHero";
import ServiceSection from "@/components/services/ServiceSection";
import SocialCta from "@/components/services/social-media/SocialCta";
import UsernameClaimsDemo from "@/components/services/social-media/demos/UsernameClaimsDemo";
import AccountReinstatementsDemo from "@/components/services/social-media/demos/AccountReinstatementsDemo";
import AccountManagementDemo from "@/components/services/social-media/demos/AccountManagementDemo";
import AccountVerificationsDemo from "@/components/services/social-media/demos/AccountVerificationsDemo";

export const metadata: Metadata = {
  title: "Social Media in Perth | Mobol",
  description:
    "Username claims, account reinstatements, day-to-day management, and platform verification by Mobol — quiet, process-led social media work for businesses across Perth and Australia.",
  alternates: { canonical: "/services/social-media" },
  openGraph: {
    title: "Social Media — Mobol",
    description:
      "Quiet, hands-on social media work — claims, reinstatements, management, and verification, from Perth.",
    url: "/services/social-media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media — Mobol",
    description: "Social media services by Mobol.",
  },
};

const JSON_LD_STRING = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Social Media",
  description:
    "Username claims, account reinstatements, day-to-day management, and platform verification support by Mobol.",
  url: "/services/social-media",
  provider: {
    "@type": "Organization",
    name: "Mobol",
  },
  serviceType: [
    "Social Media Management",
    "Username Claims",
    "Account Reinstatement",
    "Platform Verification Support",
    "Creator Management",
    "Brand Deal Negotiation",
  ],
  areaServed: "AU",
}).replace(/</g, "\\u003c");

export default function SocialMediaPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-12 sm:pb-16">
      <script type="application/ld+json">{JSON_LD_STRING}</script>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <SocialHero />

        <div className="mt-24 lg:mt-32 space-y-24 lg:space-y-32">
          <ServiceSection
            category="Claims"
            title="The handle you actually want"
            body="Strong usernames are usually taken. Plenty are also dormant, mistyped, or held by accounts the platform has flagged. We work the legitimate channels — trademark match, brand alignment, dormant-handle review — and put a clean case in front of the right team."
            bullets={[
              "Trademark and brand-backed cases",
              "Dormant handle review",
              "Across Instagram, TikTok, X, LinkedIn",
              "Honest read on what's realistic up front",
            ]}
            demoOnLeft={true}
            demo={<UsernameClaimsDemo />}
          />

          <ServiceSection
            category="Recovery"
            title="Locked out, not out for good"
            body="A disabled account is usually a system call, not a verdict. We read the actual notice, line it up against the platform's own policy, and run the appeal through the route that gets read."
            bullets={[
              "Suspensions, disables, shadowbans",
              "Plain-language case write-up",
              "Filed through platform review channels",
              "Tells you what's realistic up front",
            ]}
            demoOnLeft={false}
            demo={<AccountReinstatementsDemo />}
          />

          <ServiceSection
            category="Management"
            title="Looking after the account"
            body="Posting, replies, brand deals, the messages that need a human — handled in your voice, on a rhythm you can sustain. Reporting on what's actually moved, not vanity charts."
            bullets={[
              "Content cadence you can keep",
              "Brand deals scoped and negotiated",
              "Inbox triaged daily",
              "Monthly read on what's working",
            ]}
            demoOnLeft={true}
            demo={<AccountManagementDemo />}
          />

          <ServiceSection
            category="Verification"
            title="Going for the tick"
            body="Verification still matters for trust, search, and impersonation defence. We help you prepare the application the way the platform asks for it — eligible categories, clean documents, consistent presence — without the shortcut services that get accounts banned."
            bullets={[
              "Eligibility review before you apply",
              "Document and citation pack assembled",
              "Application submitted, first time",
              "No grey-market workarounds",
            ]}
            demoOnLeft={false}
            demo={<AccountVerificationsDemo />}
          />
        </div>

        <SocialCta />
      </div>
    </div>
  );
}
