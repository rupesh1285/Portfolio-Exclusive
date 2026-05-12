"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Fires once when the sentinel nears the viewport of `.main-scroll`. */
  onReveal: () => void;
  /** Extra rootMargin bottom — larger = earlier prefetch. */
  prefetchPx?: number;
};

/**
 * Lazy-route / code-split trigger: mount the next section when the user scrolls near this node.
 */
export function BelowFoldSentinel({ onReveal, prefetchPx = 280 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const root = document.querySelector(".main-scroll");
    if (!el || !(root instanceof HTMLElement)) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit || fired.current) return;
        fired.current = true;
        onReveal();
        io.disconnect();
      },
      { root, threshold: 0, rootMargin: `0px 0px ${prefetchPx}px 0px` },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [onReveal, prefetchPx]);

  return (
    <div
      ref={ref}
      className="pointer-events-none h-px w-full shrink-0 select-none"
      style={{ contain: "strict" }}
      aria-hidden
    />
  );
}
