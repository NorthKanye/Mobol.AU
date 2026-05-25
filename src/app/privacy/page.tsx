import type { Metadata } from "next";
import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Mobol collects, uses, and protects the personal information of people who visit our site or contact us.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy policy — Mobol",
    description:
      "How Mobol collects, uses, and protects the personal information of people who visit our site or contact us.",
    url: "/privacy",
    type: "website",
  },
};

const SECTIONS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-we-collect", label: "What we collect" },
  { id: "how-we-use", label: "How we use it" },
  { id: "third-parties", label: "Third parties" },
  { id: "overseas-disclosures", label: "Overseas disclosures" },
  { id: "your-rights", label: "Your rights" },
  { id: "retention-security", label: "Retention and security" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact-complaints", label: "Contact and complaints" },
];

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy policy"
      lastUpdated="24 May 2026"
      sections={SECTIONS}
    >
      <PolicySection id="who-we-are" title="Who we are">
        <p>
          This site is operated by <strong>Mobol</strong>, a registered
          business name of a sole trader based in Western Australia.
          ABN <strong>81 902 687 376</strong>. You can reach us at{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>.
        </p>
        <p>
          Because we currently operate below the AU$3 million turnover
          threshold and do not trade in personal information, deal in health
          records, or hold government contracts, we are not strictly bound by
          the <em>Privacy Act 1988</em> (Cth) today. Even so, we have written
          this policy to reflect the Australian Privacy Principles (APPs) as
          a baseline of good practice. If our circumstances change, or when
          the Tranche-2 privacy reforms expand who is covered, the
          commitments below will already be in place.
        </p>
      </PolicySection>

      <PolicySection id="what-we-collect" title="What we collect">
        <p>
          We only collect personal information that we genuinely need.
          Concretely, that means:
        </p>
        <ul>
          <li>
            <strong>Contact form submissions</strong> — your name, email
            address, project type, and the message you send us, plus any
            optional fields you choose to fill in (company name, phone
            number, indicative budget) when you reach out through{" "}
            <a href="/contact">/contact</a>.
          </li>
          <li>
            <strong>AI chat conversations</strong> — the messages you type
            into the assistant on our contact page, plus basic technical
            metadata (browser type, timestamps). The conversation is
            processed by OpenAI on our behalf to generate replies.
          </li>
          <li>
            <strong>Site analytics</strong> — once you accept analytics
            cookies, Google Analytics 4 records anonymised technical data
            (device type, approximate location, truncated IP, pages viewed,
            referrers). We do not enable analytics for visitors who decline
            consent.
          </li>
          <li>
            <strong>Server logs</strong> — our hosting provider records
            standard request metadata (IP address, user agent, timestamp)
            for security and operational reasons.
          </li>
        </ul>
        <p>
          We do not knowingly collect sensitive information (health data,
          racial or ethnic origin, religious beliefs, sexual orientation,
          biometric or genetic data). Please do not send us this kind of
          information through the contact form or chat.
        </p>
      </PolicySection>

      <PolicySection id="how-we-use" title="How we use it">
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>respond to enquiries and provide a quote or proposal;</li>
          <li>
            deliver the services we have agreed to provide under a separate
            proposal or statement of work;
          </li>
          <li>
            keep the site secure, diagnose problems, and improve how it
            works;
          </li>
          <li>
            send occasional follow-ups about an active conversation — we
            will not add you to a marketing list without your consent,
            consistent with the <em>Spam Act 2003</em> (Cth).
          </li>
        </ul>
        <p>
          We do not sell personal information. We do not use it for
          automated decision-making that has a legal or similarly
          significant effect on you.
        </p>
      </PolicySection>

      <PolicySection id="third-parties" title="Third parties">
        <p>
          We use a small number of trusted service providers to run this
          site. Each is bound by its own privacy policy and contractual
          commitments:
        </p>
        <ul>
          <li>
            <strong>OpenAI</strong> — powers the AI assistant on the contact
            page. Messages you send to the assistant are transmitted to
            OpenAI for processing. See{" "}
            <a
              href="https://openai.com/policies/privacy-policy/"
              rel="noopener"
            >
              OpenAI&rsquo;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Google Analytics 4 (Google LLC)</strong> — site
            analytics, loaded only after you accept analytics cookies. See{" "}
            <a
              href="https://policies.google.com/privacy"
              rel="noopener"
            >
              Google&rsquo;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Vercel</strong> — site hosting and content delivery.
            Vercel processes technical request data on our behalf. See{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              rel="noopener"
            >
              Vercel&rsquo;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Resend</strong> — sends contact form notifications to
            our inbox. Contact form details are transmitted to Resend so the
            email can be delivered. See{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              rel="noopener"
            >
              Resend&rsquo;s privacy policy
            </a>
            .
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="overseas-disclosures" title="Overseas disclosures">
        <p>
          The providers above are based outside Australia, primarily in the
          United States and the European Union. Where personal information
          is transferred overseas, we take reasonable steps to ensure it is
          handled to a standard comparable to the APPs, including by
          relying on the contractual privacy commitments offered by each
          provider.
        </p>
      </PolicySection>

      <PolicySection id="your-rights" title="Your rights">
        <p>
          You can ask us to:
        </p>
        <ul>
          <li>
            <strong>access</strong> the personal information we hold about
            you;
          </li>
          <li>
            <strong>correct</strong> anything that is inaccurate, out of
            date, incomplete, or misleading;
          </li>
          <li>
            <strong>delete</strong> information we no longer need to keep,
            subject to any record-keeping obligations we have;
          </li>
          <li>
            <strong>opt out</strong> of analytics by declining the cookie
            banner, clearing your cookies, or using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener"
            >
              Google Analytics opt-out browser add-on
            </a>
            .
          </li>
        </ul>
        <p>
          Email{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a> with
          your request. We aim to respond within 30 days. There is no charge
          for a reasonable request.
        </p>
      </PolicySection>

      <PolicySection id="retention-security" title="Retention and security">
        <p>
          We retain contact form messages and related correspondence for up
          to 24 months from your last interaction, then delete or
          de-identify them, unless you are an active client and we are
          required to keep the records for tax, accounting, or contractual
          reasons. Analytics data is retained per Google&rsquo;s default
          retention settings.
        </p>
        <p>
          We use reasonable technical and organisational safeguards to
          protect personal information, including encryption in transit,
          access controls on our hosting provider, and minimisation of what
          we collect. If we ever become aware of an eligible data breach
          that is likely to result in serious harm, we will assess it
          promptly and, where the <em>Notifiable Data Breaches</em> scheme
          applies, notify affected individuals and the OAIC.
        </p>
      </PolicySection>

      <PolicySection id="children" title="Children">
        <p>
          This site is not directed at children under 18 and we do not
          knowingly collect personal information from them. If you believe
          a child has provided us with personal information, please contact
          us and we will delete it.
        </p>
      </PolicySection>

      <PolicySection id="changes" title="Changes to this policy">
        <p>
          We may update this policy as our services, providers, or
          obligations change. The &ldquo;last updated&rdquo; date at the top
          of the page is authoritative. Material changes will be flagged on
          this page; minor edits will not.
        </p>
      </PolicySection>

      <PolicySection
        id="contact-complaints"
        title="Contact and complaints"
      >
        <p>
          For privacy questions or to make a complaint, email{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>. We
          take complaints seriously and will respond in writing.
        </p>
        <p>
          If you are not satisfied with our response, you can escalate to
          the Office of the Australian Information Commissioner (OAIC) at{" "}
          <a
            href="https://www.oaic.gov.au/privacy/privacy-complaints"
            rel="noopener"
          >
            oaic.gov.au/privacy/privacy-complaints
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
