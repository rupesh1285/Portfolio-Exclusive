"use client";

import type { RefObject } from "react";
import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

type LenisOpts = {
  /** Called every frame after Lenis (e.g. merge custom cursor RAF). */
  onFrame?: (time: number) => void;
};

/**
 * Smooth scroll on a custom overflow container (not window).
 * Skips entirely when user prefers reduced motion.
 */
export function useLenis(
  wrapperRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  opts?: LenisOpts,
) {
  const onFrameRef = useRef(opts?.onFrame);
  onFrameRef.current = opts?.onFrame;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      wrapper,
      content,
      lerp: 0.09,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.15,
      autoResize: true,
    });

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
    };
  }, [wrapperRef, contentRef]);
}
