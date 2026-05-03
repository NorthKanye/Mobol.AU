import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mobol — Digital agency for ambitious brands",
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
    <html lang="en" className={interTight.variable}>
      <body className="min-h-screen bg-bg text-ink font-sans antialiased selection:bg-ink selection:text-bg">
        {children}
      </body>
    </html>
  );
}
