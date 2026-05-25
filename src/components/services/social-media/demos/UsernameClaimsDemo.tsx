"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePausedTimeline, type TimelinePhase } from "../../usePausedTimeline";
import { PLATFORM_ICON } from "../icons";

/**
 * UsernameClaimsDemo — hero handle reveal.
 *
 * A single credential-style card. Optical centre holds the handle
 * (@aster-lane) which presses in glyph by glyph with a soft ink shadow.
 * Above: a small case-ID eyebrow. Below the handle: four platform marks
 * pulsing in as quiet endorsements. Bottom: a Mobol-internal "Case open"
 * stamp. Final beat: the card lands — perspective tilt to flat and the
 * shadow deepens, mirroring BrandingMockup's card-mock gesture.
 *
 * Voice discipline: nothing here claims a platform outcome. The status
 * is "Case open · Mobol" — Mobol's internal state, not the platform's.
 */

const ease = [0.16, 1, 0.3, 1] as const;

const HANDLE = "@aster-lane";
const CHARS = HANDLE.split("");
const PLATFORMS = ["ig", "tt", "x", "li"] as const;

const FINAL_STAGE = 4;

const INK_SHADOW =
  "0 1px 0 rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.06)";

const CARD_LIFTED = {
  rotateX: 2,
  rotateZ: -0.4,
  y: 4,
  boxShadow:
    "0 1px 1px rgba(17,17,17,0.03), 0 6px 14px rgba(17,17,17,0.05), 0 16px 30px rgba(17,17,17,0.03)",
} as const;

const CARD_LANDED = {
  rotateX: 0,
  rotateZ: 0,
  y: 0,
  boxShadow:
    "0 1px 1px rgba(17,17,17,0.03), 0 12px 32px rgba(17,17,17,0.06), 0 32px 64px rgba(17,17,17,0.05)",
} as const;

export default function UsernameClaimsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(FINAL_STAGE);

  const phases = useMemo<TimelinePhase[]>(
    () => [
      // Eyebrow fades in — sets the frame before the dramatic press.
      { duration: 600, tick: () => setStage(1) },
      // Hero handle presses in, glyph by glyph. 11 chars × 70ms stagger
      // = 770ms cascade + 420ms last char + breathing room.
      { duration: 1400, tick: () => setStage(2) },
      // Platform marks pulse in.
      { duration: 1100, tick: () => setStage(3) },
      // Bottom "Case open" stamp slides in + card LANDS.
      { duration: 1000, tick: () => setStage(4) },
      // Hold the settled state.
      { duration: 7000, tick: () => setStage(4) },
      // Reset.
      { duration: 600, tick: () => setStage(0) },
    ],
    [],
  );

  const { prefersReducedMotion } = usePausedTimeline(ref, phases);
  const s = prefersReducedMotion ? FINAL_STAGE : stage;

  const eyebrowIn = s >= 1;
  const pressed = s >= 2;
  const platformsIn = s >= 3;
  const bottomIn = s >= 4;
  const landed = s >= 4;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Claim card for the username @aster-lane — Mobol case 22841, open with us. Instagram, TikTok, X, and LinkedIn acknowledge the four platforms in scope."
      className="relative mx-auto w-full max-w-lg"
      style={{ perspective: 900 }}
    >
      <motion.div
        className="relative flex h-[520px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface"
        initial={CARD_LIFTED}
        animate={
          prefersReducedMotion ? CARD_LANDED : landed ? CARD_LANDED : CARD_LIFTED
        }
        transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Eyebrow — case-ID syntax. Mobol-internal, not an issuance claim. */}
        <motion.p
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: eyebrowIn ? 1 : 0 }}
          transition={{ duration: 0.5, ease }}
          className="mt-8 px-8 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
        >
          Claims desk &middot; 22841
        </motion.p>

        {/* Hero handle — optical centre. Per-glyph press effect, soft ink
            shadow. Decorative spans are aria-hidden; the root aria-label
            carries the handle once for screen readers. */}
        <div className="flex flex-1 items-center justify-center px-6">
          {prefersReducedMotion ? (
            <span
              aria-hidden="true"
              className="block whitespace-nowrap text-center font-sans font-semibold text-ink leading-none tracking-[-0.025em]"
              style={{
                fontSize: "clamp(40px, 6.5vw, 56px)",
                textShadow: INK_SHADOW,
              }}
            >
              {HANDLE}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="block whitespace-nowrap text-center font-sans font-semibold text-ink leading-none tracking-[-0.025em]"
              style={{
                fontSize: "clamp(40px, 6.5vw, 56px)",
              }}
            >
              {CHARS.map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="inline-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    pressed ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
                  }
                  transition={{
                    duration: 0.42,
                    ease,
                    delay: pressed ? i * 0.07 : 0,
                  }}
                  style={{ textShadow: INK_SHADOW }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          )}
        </div>

        {/* Platform endorsement row — small (18px), raw icons. Native
            MageCDN colours; quietness comes from size, not desaturation.
            The pulse keyframe runs saturate(0.6) → 1.1 → 1 with a tiny
            scale overshoot, so each mark reads as "lighting up." */}
        <div className="flex items-center justify-center gap-5 px-8 pb-2">
          {PLATFORMS.map((key, i) => (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <motion.img
              key={key}
              src={PLATFORM_ICON[key].iconUrl}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="select-none"
              initial={{ opacity: 0, scale: 0.85, filter: "saturate(0.6)" }}
              animate={
                platformsIn
                  ? {
                      opacity: [0, 1, 1],
                      scale: [0.85, 1.08, 1],
                      filter: [
                        "saturate(0.6)",
                        "saturate(1.1)",
                        "saturate(1)",
                      ],
                    }
                  : { opacity: 0, scale: 0.85, filter: "saturate(0.6)" }
              }
              transition={{
                duration: 0.55,
                ease,
                delay: platformsIn ? 0.08 + i * 0.08 : 0,
                times: [0, 0.55, 1],
              }}
            />
          ))}
        </div>

        {/* Bottom stamp — Mobol-internal status. Tiny emerald square
            (printed-mark feel) + "Case open" on the left; "Mobol" on
            the right. The x-translate on entry feels like a press in
            from the margin. */}
        <div className="mt-auto flex items-center justify-between border-t border-border px-6 py-3.5">
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, x: -4 }}
            animate={{
              opacity: bottomIn ? 1 : 0,
              x: bottomIn ? 0 : -4,
            }}
            transition={{ duration: 0.45, ease }}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2"
          >
            <span
              aria-hidden="true"
              className="inline-block h-[5px] w-[5px] rounded-[1px]"
              style={{ background: "#1f7a4a" }}
            />
            Case open
          </motion.span>
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: bottomIn ? 1 : 0 }}
            transition={{ duration: 0.45, ease, delay: 0.1 }}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
          >
            Mobol
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
