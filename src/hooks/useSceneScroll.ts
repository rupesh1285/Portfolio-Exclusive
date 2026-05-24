"use client";

import { RefObject, useCallback } from "react";

export function useSceneScroll(ref: RefObject<HTMLElement | null>) {
  const checkScroll = useCallback(() => {
    if (!ref.current) return { isAtTop: true, isAtBottom: true };
    const el = ref.current;
    
    // Allow a 5px tolerance for sub-pixel rounding
    const isAtTop = el.scrollTop <= 5;
    const isAtBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 5;
    
    return { isAtTop, isAtBottom };
  }, [ref]);

  return { checkScroll };
}
