"use client";

import { useEffect, useRef, useState } from "react";
import BrandingMark from "./BrandingMark";
import BrandingWordmark from "./BrandingWordmark";
import BrandingPalette from "./BrandingPalette";
import BrandingType from "./BrandingType";
import BrandingVoice from "./BrandingVoice";
import BrandingApplied from "./BrandingApplied";

/**
 * Animated macOS-style window for Services Row 03 (Branding).
 *
 * The canvas is a persistent 3×2 grid of six cells — Mark, Wordmark,
 * Palette, Type, Voice, Applied — that all sit visible from the start.
 * Content fills each cell in sequence as a JS async loop walks through
 * the system: `runLoop()` toggles state classes on the window root and
 * on individual elements, while a scanner rectangle slides between cells
 * to read like an art-director's eye reviewing the work.
 *
 * Why JS-driven instead of CSS @keyframes: the reference design holds each
 * stage open for as long as its content needs (4 voice tokens × 280ms
 * needs different time than 6 swatches × 150ms + 6 names × 550ms), and
 * forcing every stage into equal slices of a fixed cycle made some beats
 * feel rushed and others feel padded. An async `await wait(ms)` sequence
 * lets each beat breathe at its own pace.
 *
 * Pause / reduced-motion / unmount safety: the loop respects a `cancelled`
 * flag set in the cleanup function, so unmounting mid-stage doesn't leak
 * a setState into a teardown component. Reduced-motion users skip the
 * loop entirely and see the system in its final filled state.
 */

export const PALETTE = [
  { name: "Ink", hex: "#0E0E0E" },
  { name: "Bone", hex: "#F4F1EA" },
  { name: "Clay", hex: "#C75A3A" },
  { name: "Moss", hex: "#3F5641" },
  { name: "Sand", hex: "#D9C9A8" },
  { name: "Sky", hex: "#7CA7C7" },
] as const;

export const WORDMARK_LABELS = [
  "Display · Inter Tight 800",
  "Editorial · Italic serif",
  "Mono · lowercase",
  "Caps · tracked +340",
  "With mark · primary lockup",
] as const;

export const VOICE_PAIRS = [
  { yes: "Direct", no: "Vague" },
  { yes: "Confident", no: "Loud" },
  { yes: "Warm", no: "Cute" },
  { yes: "Considered", no: "Precious" },
] as const;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type ScannerRect = { left: number; top: number; width: number; height: number } | null;

export default function BrandingMockup() {
  const winRef = useRef<HTMLDivElement | null>(null);

  const [stageLabel, setStageLabel] = useState("Mobol — Identity v3.2");
  const [wordmarkIdx, setWordmarkIdx] = useState(-1);
  const [paletteShownCount, setPaletteShownCount] = useState(0);
  const [paletteActiveIdx, setPaletteActiveIdx] = useState(-1);
  const [paletteReadout, setPaletteReadout] = useState({ name: "—", hex: "" });
  const [voiceShownCount, setVoiceShownCount] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [drawRing, setDrawRing] = useState(false);
  const [drawStroke, setDrawStroke] = useState(false);
  const [scaleOn, setScaleOn] = useState(false);
  const [cardIn, setCardIn] = useState(false);
  const [scannerRect, setScannerRect] = useState<ScannerRect>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const win = winRef.current;
    if (!win) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      // Materialize final state — system complete
      setShowGrid(true);
      setDrawRing(true);
      setDrawStroke(true);
      setScaleOn(true);
      setCardIn(true);
      setWordmarkIdx(4);
      setPaletteShownCount(PALETTE.length);
      setVoiceShownCount(VOICE_PAIRS.length);
      setStageLabel("System · v3.2");
      return;
    }

    let cancelled = false;

    const moveScanner = (selector: string | null) => {
      if (cancelled) return;
      if (!selector) {
        setScannerRect(null);
        return;
      }
      const win = winRef.current;
      if (!win) return;
      const target = win.querySelector(selector);
      if (!target) return;
      const winR = win.getBoundingClientRect();
      const elR = target.getBoundingClientRect();
      const pad = 4;
      setScannerRect({
        left: elR.left - winR.left - pad,
        top: elR.top - winR.top - pad,
        width: elR.width + pad * 2,
        height: elR.height + pad * 2,
      });
    };

    const resetAll = () => {
      setShowGrid(false);
      setDrawRing(false);
      setDrawStroke(false);
      setScaleOn(false);
      setCardIn(false);
      setPaletteShownCount(0);
      setPaletteActiveIdx(-1);
      setPaletteReadout({ name: "—", hex: "" });
      setVoiceShownCount(0);
      setWordmarkIdx(0);
      setScannerRect(null);
    };

    const runLoop = async () => {
      while (!cancelled) {
        resetAll();
        await wait(700);
        if (cancelled) return;

        // ── 1. Mark construction ──
        setStageLabel("01 · Constructing mark");
        moveScanner('[data-cell="mark"]');
        await wait(400);
        if (cancelled) return;
        setShowGrid(true);
        await wait(700);
        if (cancelled) return;
        setDrawRing(true);
        await wait(900);
        if (cancelled) return;
        setDrawStroke(true);
        await wait(1400);
        if (cancelled) return;

        // ── 2. Wordmark studies cycle ──
        setStageLabel("02 · Wordmark studies");
        moveScanner('[data-cell="wordmark"]');
        for (let i = 0; i < WORDMARK_LABELS.length; i++) {
          if (cancelled) return;
          setWordmarkIdx(i);
          await wait(950);
        }
        setWordmarkIdx(4); // settle on the final lockup
        await wait(500);
        if (cancelled) return;

        // ── 3. Palette: drop swatches in, then walk through naming each ──
        setStageLabel("03 · Palette");
        moveScanner('[data-cell="palette"]');
        for (let i = 1; i <= PALETTE.length; i++) {
          if (cancelled) return;
          setPaletteShownCount(i);
          await wait(150);
        }
        await wait(400);
        if (cancelled) return;
        for (let i = 0; i < PALETTE.length; i++) {
          if (cancelled) return;
          setPaletteActiveIdx(i);
          setPaletteReadout({ name: PALETTE[i].name, hex: PALETTE[i].hex });
          await wait(550);
        }
        setPaletteActiveIdx(-1);
        await wait(300);
        if (cancelled) return;

        // ── 4. Type system ──
        setStageLabel("04 · Type system");
        moveScanner('[data-cell="type"]');
        setScaleOn(true);
        await wait(1700);
        if (cancelled) return;

        // ── 5. Voice tokens slide in ──
        setStageLabel("05 · Voice & tone");
        moveScanner('[data-cell="voice"]');
        for (let i = 1; i <= VOICE_PAIRS.length; i++) {
          if (cancelled) return;
          setVoiceShownCount(i);
          await wait(280);
        }
        await wait(700);
        if (cancelled) return;

        // ── 6. Applied (business card flies in) ──
        setStageLabel("06 · Applied");
        moveScanner('[data-cell="applied"]');
        setCardIn(true);
        await wait(1400);
        if (cancelled) return;

        // ── Final beat: zoom out, system complete ──
        setStageLabel("System · v3.2");
        moveScanner(null);
        await wait(2200);
      }
    };

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            runLoop();
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(win);

    // Re-position scanner on resize so it stays aligned to its current cell
    let resizeTO: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(() => setScannerRect(null), 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      io.disconnect();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTO);
    };
  }, []);

  // Build the modifier classes that drive the cell-level CSS transitions
  const winClasses = [
    "brand-window",
    showGrid && "show-grid",
    drawRing && "draw-ring",
    drawStroke && "draw-stroke",
    scaleOn && "scale-on",
    cardIn && "card-in",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={winRef}
      role="img"
      aria-label="Animated diagram of a brand identity system being built across six grid cells: mark, wordmark, palette, type, voice, applied"
      className={`${winClasses} aspect-[4/3] w-full rounded-2xl overflow-hidden relative bg-surface border border-black/[0.04]`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Chrome bar — keeps the macOS family feel of rows 01/02 */}
      <div className="absolute inset-x-0 top-0 h-[9%] flex items-center px-3 bg-[#f6f5f2] border-b border-border z-20">
        <span
          className="w-2 h-2 rounded-full bg-[#ff5f57]"
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full bg-[#febc2e] ml-1.5"
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full bg-[#28c840] ml-1.5"
          aria-hidden="true"
        />

        {/* Center pill — stage label updates as the system builds */}
        <div
          className="absolute left-1/2 -translate-x-1/2 h-[60%] min-w-[40%] max-w-[60%] rounded-full bg-border/60 flex items-center justify-center px-3"
          aria-hidden="true"
        >
          <span className="text-[clamp(8px,1vw,11px)] text-ink-2 font-medium font-mono whitespace-nowrap tracking-[0.01em]">
            {stageLabel}
          </span>
        </div>

        {/* Right accessory — building indicator */}
        <div
          className="ml-auto flex items-center gap-1.5 text-[10px] text-ink-3 font-mono"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]" />
          <span className="hidden md:inline">building</span>
        </div>
      </div>

      {/* 3×2 grid board — six cells, all visible from the start */}
      <div
        className="absolute inset-x-0 top-[9%] bottom-0 grid bg-border"
        style={{
          gridTemplateColumns: "1.1fr 1.4fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "1px",
        }}
      >
        <BrandingMark />
        <BrandingWordmark activeIdx={wordmarkIdx} />
        <BrandingPalette
          shownCount={paletteShownCount}
          activeIdx={paletteActiveIdx}
          readout={paletteReadout}
        />
        <BrandingType />
        <BrandingVoice shownCount={voiceShownCount} />
        <BrandingApplied />
      </div>

      {/* Scanner — JS-positioned via getBoundingClientRect, CSS-eased */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="brand-scanner absolute pointer-events-none border-[1.5px] border-ink rounded-[4px] z-10"
          style={{
            opacity: scannerRect ? 0.9 : 0,
            left: scannerRect?.left ?? 0,
            top: scannerRect?.top ?? 0,
            width: scannerRect?.width ?? 0,
            height: scannerRect?.height ?? 0,
            boxShadow: "0 0 0 4px rgba(14, 14, 14, 0.04)",
          }}
        />
      )}
    </div>
  );
}
