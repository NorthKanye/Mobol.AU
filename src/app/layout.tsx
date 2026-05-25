import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import PillNav from "@/components/nav/PillNav";
import { NavHideProvider } from "@/components/nav/NavHideContext";
import Footer from "@/components/footer/Footer";
import CookieBanner from "@/components/cookies/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mobol.example"),
  title: {
    default: "Mobol — Digital agency for ambitious brands",
    template: "%s — Mobol",
  },
  description:
    "Mobol is a digital agency creating thoughtful brands, intuitive websites, and engaging digital experiences that help businesses grow and scale.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-surface text-ink font-sans antialiased selection:bg-ink selection:text-bg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-surface focus:text-sm focus:font-medium focus:shadow-[0_8px_24px_rgba(17,17,17,0.18)]"
        >
          Skip to content
        </a>
        <NavHideProvider>
          <PillNav />
          <main id="main-content">{children}</main>
          <Footer />
        </NavHideProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
