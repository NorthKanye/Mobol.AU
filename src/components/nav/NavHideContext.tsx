"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Ctx = {
  hidden: boolean;
  setHidden: (v: boolean) => void;
  peeking: boolean;
  scrollHidden: boolean;
};

const NavHideCtx = createContext<Ctx | null>(null);

// Cursor zones for peek-on-hover. Y < REVEAL_PX reveals the nav; Y >
// HIDE_PX re-hides it. The gap is hysteresis so the nav doesn't flicker
// when the cursor sits near the boundary.
const REVEAL_PX = 80;
const HIDE_PX = 140;

export function NavHideProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  const scrollHidden = pastHero && scrollDirection === "down";
  const isAnyHidden = hidden || scrollHidden;

  // Mirror "hide intent" to <html data-chat-expanded> — drives both the
  // nav slide-up and the 80ms transition-delay on the contact cards.
  useEffect(() => {
    const el = document.documentElement;
    if (hidden) el.setAttribute("data-chat-expanded", "true");
    else el.removeAttribute("data-chat-expanded");
    return () => el.removeAttribute("data-chat-expanded");
  }, [hidden]);

  // Mirror scroll-based hide to <html data-nav-hidden> — drives the same
  // slide-up animation as data-chat-expanded via parallel CSS selectors.
  useEffect(() => {
    const el = document.documentElement;
    if (scrollHidden) el.setAttribute("data-nav-hidden", "true");
    else el.removeAttribute("data-nav-hidden");
    return () => el.removeAttribute("data-nav-hidden");
  }, [scrollHidden]);

  // Mirror peek state — overrides the nav slide-up while the user's
  // cursor is near the top of the viewport.
  useEffect(() => {
    const el = document.documentElement;
    if (peeking) el.setAttribute("data-nav-peeking", "true");
    else el.removeAttribute("data-nav-peeking");
    return () => el.removeAttribute("data-nav-peeking");
  }, [peeking]);

  // Observe [data-hero-end]: the sentinel placed at the bottom of the hero
  // section. When it scrolls above the viewport top, the user is "past
  // the hero" and the nav becomes eligible to hide on downward scroll.
  // Pages without a hero (e.g. /contact) never set pastHero=true.
  useEffect(() => {
    const sentinel = document.querySelector("[data-hero-end]");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only "above viewport" counts as past — not "below viewport,
          // hasn't reached yet" (which also reads as not-intersecting).
          const aboveViewport =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          setPastHero(aboveViewport);
        }
      },
      { rootMargin: "0px", threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Track scroll direction. rAF-throttled: coalesces multiple scroll
  // events per frame into one direction calc, and only updates state when
  // direction actually changes (so we re-render at most once per direction
  // flip, not once per pixel scrolled).
  useEffect(() => {
    let lastY = window.scrollY;
    let rafId: number | null = null;

    const compute = () => {
      rafId = null;
      const y = window.scrollY;
      const dy = y - lastY;
      if (dy > 0) {
        setScrollDirection((prev) => (prev === "down" ? prev : "down"));
      } else if (dy < 0) {
        setScrollDirection((prev) => (prev === "up" ? prev : "up"));
      }
      lastY = y;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // While the nav is hidden (by chat or by scroll), watch the cursor:
  // near the top reveals the pill, moving back down re-hides it. Lets
  // the user navigate without scrolling/clicking back. No-op on touch
  // devices (no mousemove fires).
  useEffect(() => {
    if (!isAnyHidden) {
      setPeeking(false);
      return;
    }
    const onMove = (e: MouseEvent) => {
      if (e.clientY < REVEAL_PX) setPeeking(true);
      else if (e.clientY > HIDE_PX) setPeeking(false);
    };
    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      setPeeking(false);
    };
  }, [isAnyHidden]);

  const value = useMemo(
    () => ({ hidden, setHidden, peeking, scrollHidden }),
    [hidden, peeking, scrollHidden],
  );
  return <NavHideCtx.Provider value={value}>{children}</NavHideCtx.Provider>;
}

export function useNavHide() {
  const ctx = useContext(NavHideCtx);
  if (!ctx) throw new Error("useNavHide must be used inside NavHideProvider");
  return ctx;
}
