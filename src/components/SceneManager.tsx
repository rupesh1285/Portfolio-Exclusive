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

  // Pre-mount adjacent scenes so they are ready before the user scrolls.
  // This eliminates the lag caused by dynamic imports loading mid-animation.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMountedScenes((prev) => {
        const next = new Set(prev);
        // Mount scenes adjacent to the active one
        if (activeScene > 0) next.add(activeScene - 1);
        if (activeScene < scenes.length - 1) next.add(activeScene + 1);
        if (next.size === prev.size) return prev; // No change, skip re-render
        return next;
      });
    }, 300); // Small delay so it doesn't compete with the initial render
    return () => clearTimeout(timer);
  }, [activeScene, scenes.length]);

  const runAnimation = useCallback((currentIndex: number, nextIndex: number) => {
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
        gsap.set(currentLayer, { visibility: "hidden" });
        gsap.set(currentLayer, { clearProps: "transform,opacity,zIndex" });
        gsap.set(nextLayer, { clearProps: "transform,opacity" });
        setActiveScene(nextIndex);
        // Small cooldown to prevent accidental double-transitions
        setTimeout(() => { isAnimating.current = false; }, 200);
      }
    });

    // Define unique transitions — all with force3D for GPU compositing
    // Scene 1 <-> 2: Smooth curtain rise/fall
    if ((currentIndex === 0 && nextIndex === 1) || (currentIndex === 1 && nextIndex === 0)) {
      if (nextIndex > currentIndex) {
        gsap.set(nextLayer, { yPercent: 100 });
        tl.to(nextLayer, { yPercent: 0, duration: 1, ease: "power2.inOut", force3D: true });
      } else {
        gsap.set(currentLayer, { zIndex: 10 });
        gsap.set(nextLayer, { zIndex: 5 });
        tl.to(currentLayer, { yPercent: 100, duration: 1, ease: "power2.inOut", force3D: true });
      }
    } 
    // Scene 2 <-> 3: Cinematic Z-Axis Lens Dive
    else if ((currentIndex === 1 && nextIndex === 2) || (currentIndex === 2 && nextIndex === 1)) {
      if (nextIndex > currentIndex) {
        gsap.set(nextLayer, { scale: 0.6, opacity: 0, filter: "blur(20px)" });
        tl.to(currentLayer, { scale: 1.6, opacity: 0, filter: "blur(20px)", duration: 1.2, ease: "power3.inOut", force3D: true }, 0)
          .to(nextLayer, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.inOut", force3D: true }, 0);
      } else {
        gsap.set(nextLayer, { scale: 1.6, opacity: 0, filter: "blur(20px)" });
        tl.to(currentLayer, { scale: 0.6, opacity: 0, filter: "blur(20px)", duration: 1.2, ease: "power3.inOut", force3D: true }, 0)
          .to(nextLayer, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.inOut", force3D: true }, 0);
      }
    }
    // Scene 3 <-> 4: Right wipe
    else if ((currentIndex === 2 && nextIndex === 3) || (currentIndex === 3 && nextIndex === 2)) {
      if (nextIndex > currentIndex) {
        gsap.set(nextLayer, { xPercent: 100 });
        tl.to(nextLayer, { xPercent: 0, duration: 1, ease: "power2.inOut", force3D: true });
      } else {
        gsap.set(currentLayer, { zIndex: 10 });
        gsap.set(nextLayer, { zIndex: 5 });
        tl.to(currentLayer, { xPercent: 100, duration: 1, ease: "power2.inOut", force3D: true });
      }
    } else {
      // Fallback crossfade
      gsap.set(nextLayer, { opacity: 0 });
      tl.to(currentLayer, { opacity: 0, duration: 0.6, force3D: true }, 0)
        .to(nextLayer, { opacity: 1, duration: 0.6, force3D: true }, 0.1);
    }
  }, []);

  const animateTo = useCallback((nextIndex: number) => {
    if (isAnimating.current || nextIndex === activeScene) return;
    
    isAnimating.current = true;
    const currentIndex = activeScene;

    // Check if the scene is already mounted
    const alreadyMounted = mountedScenes.has(nextIndex);

    if (alreadyMounted) {
      // Scene is ready — animate immediately on the next frame
      requestAnimationFrame(() => {
        runAnimation(currentIndex, nextIndex);
      });
    } else {
      // Scene not yet mounted — mount it first, then wait for it to render
      setMountedScenes((prev) => {
        const next = new Set(prev);
        next.add(nextIndex);
        return next;
      });
      // Wait for React to render + browser to paint the new scene
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runAnimation(currentIndex, nextIndex);
        });
      });
    }
  }, [activeScene, mountedScenes, runAnimation]);

  useEffect(() => {
    const intentAccumulator = { up: 0, down: 0 };
    const INTENT_THRESHOLD = 2; // Reduced for snappier response

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
      preventDefault: false,
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
