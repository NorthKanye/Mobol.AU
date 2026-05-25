import type { Metadata } from "next";
import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "What cookies and similar technologies Mobol uses, why we use them, and how you can control them.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Cookie policy — Mobol",
    description:
      "What cookies and similar technologies Mobol uses, why we use them, and how you can control them.",
    url: "/cookies",
    type: "website",
  },
};

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "what-we-use", label: "What we use" },
  { id: "your-choices", label: "Your choices" },
  { id: "do-not-track", label: "Do Not Track" },
  { id: "third-parties", label: "Third-party cookies" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact" },
];

export default function CookiesPage() {
  return (
    <PolicyLayout
      title="Cookie policy"
      lastUpdated="24 May 2026"
      sections={SECTIONS}
    >
      <PolicySection id="overview" title="Overview">
        <p>
          Cookies are small text files that a website stores on your
          device when you visit. They let the site remember preferences
          and help us understand how people use it. Similar technologies
          — such as <code>localStorage</code> and pixel tags — work in
          related ways and are covered by this policy.
        </p>
        <p>
          Australia does not have an EU-style law that requires consent
          before any cookie is set. The Office of the Australian
          Information Commissioner (OAIC) does, however, expect
          transparency and reasonable choice when online tracking is
          used. This page sets out what we use and how you can control
          it. For background, see the{" "}
          <a
            href="https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/tracking-pixels-and-privacy-obligations"
            rel="noopener"
          >
            OAIC guidance on tracking pixels and online tracking
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection id="what-we-use" title="What we use">
        <p>
          We try to keep this list short and current.
        </p>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Purpose</th>
                <th scope="col">Provider</th>
                <th scope="col">Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>mobol_cookie_consent_v1</code>
                </td>
                <td>
                  Remembers your choice to accept or decline analytics
                  cookies so we don&rsquo;t ask again on every visit.
                  Essential.
                </td>
                <td>Mobol (first party, localStorage)</td>
                <td>Until you clear it</td>
              </tr>
              <tr>
                <td>
                  <code>_ga</code>, <code>_ga_*</code>
                </td>
                <td>
                  Google Analytics 4 — measures site usage and
                  performance. Only set after you accept analytics
                  cookies.
                </td>
                <td>Google LLC</td>
                <td>Up to 2 years</td>
              </tr>
              <tr>
                <td>OpenAI session cookies</td>
                <td>
                  Issued by OpenAI when the AI assistant at{" "}
                  <a href="/contact">/contact</a> is in use, to support
                  the chat session.
                </td>
                <td>OpenAI</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Hosting cookies</td>
                <td>
                  Standard request handling, security, and performance
                  signals from our hosting provider.
                </td>
                <td>Vercel</td>
                <td>Session to short term</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PolicySection>

      <PolicySection id="your-choices" title="Your choices">
        <p>
          You have a few ways to control cookies on this site:
        </p>
        <ul>
          <li>
            <strong>Use the banner</strong> — when you first arrive,
            choose Accept or Reject. We do not load analytics if you
            decline.
          </li>
          <li>
            <strong>Change your mind</strong> — clear this site&rsquo;s
            cookies and localStorage in your browser to see the banner
            again on your next visit.
          </li>
          <li>
            <strong>Browser controls</strong> — every modern browser
            lets you block or delete cookies on a per-site basis.
            Blocking essential cookies may stop parts of the site
            working.
          </li>
          <li>
            <strong>Google Analytics opt-out</strong> — install the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener"
            >
              Google Analytics opt-out browser add-on
            </a>{" "}
            to opt out across every site you visit.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="do-not-track" title="Do Not Track">
        <p>
          We honour the browser &ldquo;Do Not Track&rdquo; signal where
          it is reliably detectable: if your browser sends DNT, we treat
          it as a refusal of analytics cookies and will not initialise
          Google Analytics, even if you have not interacted with the
          banner.
        </p>
      </PolicySection>

      <PolicySection id="third-parties" title="Third-party cookies">
        <p>
          Some of the cookies above are set by third parties whose
          services we use. Their use of cookies is governed by their own
          policies:
        </p>
        <ul>
          <li>
            <a
              href="https://policies.google.com/technologies/cookies"
              rel="noopener"
            >
              Google &mdash; how Google uses cookies
            </a>
          </li>
          <li>
            <a
              href="https://openai.com/policies/privacy-policy/"
              rel="noopener"
            >
              OpenAI privacy policy
            </a>
          </li>
          <li>
            <a
              href="https://vercel.com/legal/privacy-policy"
              rel="noopener"
            >
              Vercel privacy policy
            </a>
          </li>
          <li>
            <a
              href="https://resend.com/legal/privacy-policy"
              rel="noopener"
            >
              Resend privacy policy
            </a>{" "}
            &mdash; contact form email delivery runs server-side and does
            not set browser cookies through this site.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="changes" title="Changes to this policy">
        <p>
          We may update this policy when we add or remove tools, or when
          guidance changes. The &ldquo;last updated&rdquo; date at the
          top of the page is authoritative.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="Contact">
        <p>
          Questions about cookies or analytics? Email{" "}
          <a href="mailto:hello@mobol.com.au">hello@mobol.com.au</a>. For
          how we handle personal information more generally, see our{" "}
          <a href="/privacy">Privacy policy</a>.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
