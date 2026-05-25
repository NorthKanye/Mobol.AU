import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bypass /_next/image entirely — emit plain <img> tags pointing at the
    // raw file paths in /public. We hit a known Next.js 16 / Turbopack issue
    // where the optimization endpoint can hang under HMR pressure, and Chrome
    // then caches the resulting 0-byte responses indefinitely (the IMG decoder
    // refuses to retry a cached broken response). Optimizing on the dev
    // server isn't earning its complexity for this site — assets in /public
    // are already pre-sized for their display contexts.
    // See: https://github.com/vercel/next.js/discussions/87796
    unoptimized: true,
  },
};

export default nextConfig;
