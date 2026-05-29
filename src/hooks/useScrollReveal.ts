"use client";

import { useEffect } from "react";
import type { RefObject } from "react";



/**
 * Adds `.s2-inview` to `.s2-reveal` descendants when they enter the main scroller.
 * Unobserves after reveal to minimize observer work during long scrolls.
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const scroller = root.closest(".scene-scroll-container");
    if (!(scroller instanceof HTMLElement)) return;

    const nodes = root.querySelectorAll<HTMLElement>(".s2-reveal");
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("s2-inview");
          io.unobserve(entry.target);
        }
      },
      { root: scroller, threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [containerRef]);
}
