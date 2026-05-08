import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import PillNav from "@/components/nav/PillNav";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

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
  themeColor: "#f0efec",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-ink font-sans antialiased selection:bg-ink selection:text-bg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-surface focus:text-sm focus:font-medium focus:shadow-[0_8px_24px_rgba(17,17,17,0.18)]"
        >
          Skip to content
        </a>
        <PillNav />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
