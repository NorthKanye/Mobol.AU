"use client";

import { useEffect, useRef, useState } from "react";
import BrandingMark from "./BrandingMark";
import BrandingWordmark from "./BrandingWordmark";
import BrandingPalette from "./BrandingPalette";
import BrandingApplied from "./BrandingApplied";
import { PALETTE, WORDMARK_LABELS, VOICE_PAIRS } from "./constants";

// Re-export so any existing `import { PALETTE } from "./BrandingMockup"`
// keeps working — see ./constants.ts for the canonical source.
export { PALETTE, WORDMARK_LABELS, VOICE_PAIRS };

/**
 * Animated macOS-style window for the Branding service card.
 *
 * The canvas is a persistent 2×2 grid of four cells — Mark, Wordmark,
 * Palette, Applied — that all sit visible from the start. Content fills
 * each cell in sequence as a JS async loop walks through the system:
 * `runLoop()` toggles state classes on the window root and on individual
 * elements, while a scanner rectangle slides between cells to read like
 * an art-director's eye reviewing the work.
 *
 * Why JS-driven instead of CSS @keyframes: each stage holds open for as
 * long as its content needs (6 palette swatches × 150ms + 6 names × 550ms
 * is a different beat than the 6-stage mark construction), and forcing
 * every stage into equal slices of a fixed cycle made some beats feel
 * rushed and others padded. An async `await wait(ms)` sequence lets each
 * beat breathe at its own pace.
 *
 * Pause / reduced-motion / unmount safety: the loop respects a `cancelled`
 * flag set in the cleanup function, so unmounting mid-stage doesn't leak
 * a setState into a teardown component. Reduced-motion users skip the
 * loop entirely and see the system in its final filled state.
 */

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type ScannerRect = { left: number; top: number; width: number; height: number } | null;

export default function BrandingMockup() {
  const winRef = useRef<HTMLDivElement | null>(null);

  const [stageLabel, setStageLabel] = useState("Mobol — Identity v3.2");
  const [wordmarkIdx, setWordmarkIdx] = useState(-1);
  const [paletteShownCount, setPaletteShownCount] = useState(0);
  const [paletteActiveIdx, setPaletteActiveIdx] = useState(-1);
  const [paletteReadout, setPaletteReadout] = useState<{
    name: string;
    hex: string;
    role: string;
  }>({ name: "—", hex: "", role: "" });
  const [markStage, setMarkStage] = useState(0); // 0..6 — staged mark construction
  const [cardStage, setCardStage] = useState(0); // 0..2 — applied card lands then shadow grows
  const [scannerRect, setScannerRect] = useState<ScannerRect>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const win = winRef.current;
    if (!win) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      // Materialize final state — system complete. markStage=6 lands the mark
      // in its "construction guides faded out" final form; cardStage=2 lands
      // the applied card with its full drop-shadow elevated.
      setMarkStage(6);
      setCardStage(2);
      setWordmarkIdx(4);
      setPaletteShownCount(PALETTE.length);
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
      setMarkStage(0);
      setCardStage(0);
      setPaletteShownCount(0);
      setPaletteActiveIdx(-1);
      setPaletteReadout({ name: "—", hex: "", role: "" });
      setWordmarkIdx(0);
      setScannerRect(null);
    };

    const runLoop = async () => {
      while (!cancelled) {
        resetAll();
        await wait(700);
        if (cancelled) return;

        // ── 1. Mark construction (6-stage) ──
        // s1: anchor points pop in (staggered) ; s2: crosshair axes draw ;
        // s3: phi guides + x-height ring fade in ; s4: ring draws from 12 o'clock ;
        // s5: M stem draws ; s6: construction guides fade out, mark sits clean.
        setStageLabel("Constructing mark");
        moveScanner('[data-cell="mark"]');
        await wait(300);
        if (cancelled) return;
        setMarkStage(1);
        await wait(600);
        if (cancelled) return;
        setMarkStage(2);
        await wait(550);
        if (cancelled) return;
        setMarkStage(3);
        await wait(400);
        if (cancelled) return;
        setMarkStage(4);
        await wait(1100);
        if (cancelled) return;
        setMarkStage(5);
        await wait(1300);
        if (cancelled) return;
        setMarkStage(6);
        await wait(700);
        if (cancelled) return;

        // ── 2. Wordmark studies cycle ──
        setStageLabel("Wordmark studies");
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
        setStageLabel("Palette");
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
          setPaletteReadout({
            name: PALETTE[i].name,
            hex: PALETTE[i].hex,
            role: PALETTE[i].role,
          });
          await wait(550);
        }
        setPaletteActiveIdx(-1);
        await wait(300);
        if (cancelled) return;

        // ── 4. Applied (image lands, then drop-shadow grows) ──
        setStageLabel("Applied");
        moveScanner('[data-cell="applied"]');
        await wait(200);
        if (cancelled) return;
        setCardStage(1);
        await wait(900);
        if (cancelled) return;
        setCardStage(2);
        await wait(800);
        if (cancelled) return;
        await wait(800);
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

  // Build the modifier classes that drive the cell-level CSS transitions.
  // markStage emits CUMULATIVE classes (e.g. at stage 4: mark-s1 + mark-s2 +
  // mark-s3 + mark-s4) so each stage's "show me" rule keeps applying as the
  // sequence progresses. Later-stage overrides (e.g. .mark-s6 fading the
  // construction guides) win because they appear later in the CSS cascade.
  // Legacy booleans .show-grid/.draw-ring/.draw-stroke are derived from
  // markStage so existing CSS rules continue to work unchanged.
  const showGrid = markStage >= 1;
  const drawRing = markStage >= 4;
  const drawStroke = markStage >= 5;
  const markStageClasses = Array.from(
    { length: Math.min(markStage, 6) },
    (_, i) => `mark-s${i + 1}`,
  );
  const winClasses = [
    "brand-window",
    showGrid && "show-grid",
    drawRing && "draw-ring",
    drawStroke && "draw-stroke",
    ...markStageClasses,
    cardStage >= 1 && "card-in", // legacy class — keeps existing .card-mock rule active
    cardStage >= 1 && `card-s${cardStage}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={winRef}
      role="img"
      aria-label="Animated diagram of a brand identity system being built across four grid cells: mark, wordmark, palette, applied"
      className={`${winClasses} absolute inset-0 rounded-2xl overflow-hidden bg-surface border border-black/[0.04]`}
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

      {/* 2×2 grid board — four cells, all visible from the start */}
      <div
        className="absolute inset-x-0 top-[9%] bottom-0 grid bg-border"
        style={{
          gridTemplateColumns: "1fr 1fr",
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
