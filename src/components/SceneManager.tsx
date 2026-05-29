"use client";

import { useEffect, useRef, useState, ReactNode, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useSceneScroll } from "@/hooks/useSceneScroll";

gsap.registerPlugin(Observer);

type SceneManagerProps = {
  scenes: { id: string; render: () => ReactNode }[];
};

export default function SceneManager({ scenes }: SceneManagerProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [mountedScenes, setMountedScenes] = useState<Set<number>>(new Set([0]));
  const isAnimating = useRef(false);
  
  // Refs for each scene's scrolling container
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Refs for each scene's outer fixed layer (for animation)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // eslint-disable-next-line react-hooks/refs
  const { checkScroll } = useSceneScroll({ current: sceneRefs.current[activeScene] });

  const animateTo = useCallback((nextIndex: number) => {
    if (isAnimating.current || nextIndex === activeScene) return;
    
    // Ensure the incoming scene is mounted before animating
    setMountedScenes((prev) => {
      if (!prev.has(nextIndex)) {
        const next = new Set(prev);
        next.add(nextIndex);
        return next;
      }
      return prev;
    });

    isAnimating.current = true;
    const currentIndex = activeScene;
    
    const currentLayer = layerRefs.current[currentIndex];
    const nextLayer = layerRefs.current[nextIndex];
    
    if (!currentLayer || !nextLayer) {
      isAnimating.current = false;
      return;
    }

    // Ensure next layer is visible for animation
    gsap.set(nextLayer, { visibility: "visible", zIndex: 10 });
    gsap.set(currentLayer, { zIndex: 5 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Immediately hide the outgoing scene BEFORE clearing its transforms.
        // This prevents it from teleporting back to the center of the screen for 1 frame
        // before React's state update kicks in to hide it.
        gsap.set(currentLayer, { visibility: "hidden" });
        gsap.set(currentLayer, { clearProps: "transform,opacity,zIndex" });
        
        gsap.set(nextLayer, { clearProps: "transform,opacity" });
        setActiveScene(nextIndex);
        isAnimating.current = false;
      }
    });

    // Define unique transitions based on index pairing
    // Scene 1 <-> 2 (index 0 <-> 1): Curtain rise/fall
    if ((currentIndex === 0 && nextIndex === 1) || (currentIndex === 1 && nextIndex === 0)) {
      if (nextIndex > currentIndex) {
        // Curtain rise (0 -> 1)
        gsap.set(nextLayer, { yPercent: 100 });
        tl.to(nextLayer, { yPercent: 0, duration: 0.8, ease: "power3.inOut" });
      } else {
        // Curtain fall (1 -> 0)
        gsap.set(currentLayer, { zIndex: 10 });
        gsap.set(nextLayer, { zIndex: 5 });
        tl.to(currentLayer, { yPercent: 100, duration: 0.8, ease: "power3.inOut" });
      }
    } 
    // Scene 2 <-> 3 (index 1 <-> 2): Scale + fade
    else if ((currentIndex === 1 && nextIndex === 2) || (currentIndex === 2 && nextIndex === 1)) {
      if (nextIndex > currentIndex) {
        // 1 -> 2
        gsap.set(nextLayer, { opacity: 0 });
        tl.to(currentLayer, { scale: 0.92, opacity: 0.3, duration: 0.7, ease: "power2.inOut" }, 0)
          .to(nextLayer, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0);
      } else {
        // 2 -> 1
        gsap.set(nextLayer, { scale: 0.92, opacity: 0.3 });
        tl.to(currentLayer, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0)
          .to(nextLayer, { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" }, 0);
      }
    }
    // Scene 3 <-> 4 (index 2 <-> 3): Right wipe
    else if ((currentIndex === 2 && nextIndex === 3) || (currentIndex === 3 && nextIndex === 2)) {
      if (nextIndex > currentIndex) {
        // 2 -> 3
        gsap.set(nextLayer, { xPercent: 100 });
        tl.to(nextLayer, { xPercent: 0, duration: 0.8, ease: "power3.inOut" });
      } else {
        // 3 -> 2
        gsap.set(currentLayer, { zIndex: 10 });
        gsap.set(nextLayer, { zIndex: 5 });
        tl.to(currentLayer, { xPercent: 100, duration: 0.8, ease: "power3.inOut" });
      }
    } else {
      // Fallback simple crossfade for arbitrary jumps
      gsap.set(nextLayer, { opacity: 0 });
      tl.to(currentLayer, { opacity: 0, duration: 0.5 }, 0)
        .to(nextLayer, { opacity: 1, duration: 0.5 }, 0);
    }
  }, [activeScene]);

  useEffect(() => {
    // Only one scene active at a time. The rest are hidden.
    // However, during animation, both outgoing and incoming need to be visible.
    // This is handled by the GSAP timeline and CSS classes.
    const intentAccumulator = { up: 0, down: 0 };
    const INTENT_THRESHOLD = 3; // Number of consecutive scroll events to trigger transition (handles trackpad inertia)

    const handleScrollIntent = (direction: "up" | "down") => {
      if (isAnimating.current) return;
      
      const { isAtTop, isAtBottom } = checkScroll();

      if (direction === "down" && isAtBottom) {
        intentAccumulator.down++;
        intentAccumulator.up = 0;
        if (intentAccumulator.down >= INTENT_THRESHOLD && activeScene < scenes.length - 1) {
          intentAccumulator.down = 0;
          animateTo(activeScene + 1);
        }
      } else if (direction === "up" && isAtTop) {
        intentAccumulator.up++;
        intentAccumulator.down = 0;
        if (intentAccumulator.up >= INTENT_THRESHOLD && activeScene > 0) {
          intentAccumulator.up = 0;
          animateTo(activeScene - 1);
        }
      } else {
        // Reset if scrolling within bounds
        intentAccumulator.up = 0;
        intentAccumulator.down = 0;
      }
    };

    const observer = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => handleScrollIntent("up"),
      onUp: () => handleScrollIntent("down"),
      tolerance: 10,
      preventDefault: false, // Let native scroll happen when within bounds
    });

    return () => observer.kill();
  }, [activeScene, checkScroll, scenes.length, animateTo]);

  // Expose goToScene globally for nav links
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__goToScene = (idx: number) => {
      if (idx >= 0 && idx < scenes.length) animateTo(idx);
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__goToScene;
    };
  }, [activeScene, scenes.length, animateTo]);

  return (
    <>
      {scenes.map((sceneDef, index) => {
        const isActive = index === activeScene;
        const isMounted = mountedScenes.has(index);
        return (
          <div
            key={sceneDef.id}
            ref={(el) => { layerRefs.current[index] = el; }}
            className={`scene-layer ${isActive ? "active" : ""}`}
            style={{ visibility: isActive ? "visible" : "hidden", zIndex: isActive ? 10 : 1 }}
          >
            <div
              ref={(el) => { sceneRefs.current[index] = el; }}
              className="scene-scroll-container"
            >
              {isMounted ? sceneDef.render() : null}
            </div>
          </div>
        );
      })}
    </>
  );
}
