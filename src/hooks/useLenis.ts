"use client";

import type { RefObject } from "react";
import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

type LenisOpts = {
  /** Runs after Lenis each frame (e.g. merge custom cursor into one RAF). */
  onFrame?: (time: number) => void;
};

/**
 * Smooth scroll on a custom overflow container (not window).
 * Returns a ref to the Lenis instance so callers can `resize()` after layout changes.
 * With `prefers-reduced-motion: reduce`, Lenis is skipped but the per-frame `onFrame` hook still runs
 * so merged work (e.g. custom cursor) keeps updating.
 */
export function useLenis(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  opts?: LenisOpts,
): RefObject<Lenis | null> {
  const lenisRef = useRef<Lenis | null>(null);
  const onFrameRef = useRef(opts?.onFrame);
  onFrameRef.current = opts?.onFrame;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      let raf = 0;
      const tick = (time: number) => {
        onFrameRef.current?.(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const lenis = new Lenis({
      wrapper,
      content,
      /** Lower = silkier / less “rigid” wheel interpolation */
      lerp: 0.048,
      wheelMultiplier: 0.72,
      smoothWheel: true,
      /** Smoothes touch scroll on trackpads / mobile */
      syncTouch: true,
      syncTouchLerp: 0.085,
      touchMultiplier: 0.95,
      touchInertiaMultiplier: 28,
      autoResize: true,
    });

    lenisRef.current = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      onFrameRef.current?.(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [wrapperRef, contentRef]);

  return lenisRef;
}
