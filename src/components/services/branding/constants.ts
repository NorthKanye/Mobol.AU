/**
 * Shared constants for the branding system — extracted from BrandingMockup
 * so the standalone section wrappers under ./sections/ can import them
 * without pulling in the 350-line mockup file (which would create a
 * circular import once it consumes the section wrappers transitively).
 *
 * BrandingMockup re-exports these for back-compat with any consumer that
 * still imports them from "./BrandingMockup".
 */

export const PALETTE = [
  { name: "Ink", hex: "#111111", role: "primary" },
  { name: "Paper", hex: "#FAFAF9", role: "surface" },
  { name: "Ember", hex: "#E94F4F", role: "accent" },
  { name: "Marigold", hex: "#FBBF24", role: "highlight" },
  { name: "Slate", hex: "#4B5563", role: "ink-2" },
  { name: "Mist", hex: "#D1D5DB", role: "ink-3" },
] as const;

export const WORDMARK_LABELS = [
  "Display · Inter Tight 800 / −0.04",
  "Editorial · Geist Sans 300 light",
  "Mono · JetBrains 500 / lowercase",
  "Caps · Inter Tight 600 / +340",
  "Lockup · mark + wordmark",
] as const;

export const VOICE_PAIRS = [
  { yes: "Direct", no: "Vague" },
  { yes: "Confident", no: "Loud" },
  { yes: "Warm", no: "Cute" },
  { yes: "Considered", no: "Precious" },
] as const;
