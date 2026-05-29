"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import SceneManager from "@/components/SceneManager";
import dynamic from "next/dynamic";
import SceneOne from "./SceneOne";

// Dynamically import scenes so they are code-split and lazy loaded
const SceneTwo = dynamic(() => import("@/components/scene2/SceneTwo"), { ssr: false });
const SceneThree = dynamic(() => import("./SceneThree"), { ssr: false });
const SceneFour = dynamic(() => import("./SceneFour"), { ssr: false });

function PrecisionCursor({ lenisFrameRef }: { lenisFrameRef?: MutableRefObject<(() => void) | null> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const st = useRef({ mx: -200, my: -200, rx: -200, ry: -200, gx: -200, gy: -200 });

  const [hoverState, setHoverState] = useState<"normal" | "xl" | "xd">("normal");

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      st.current.mx = e.clientX;
      st.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const tick = () => {
      const s = st.current;
      s.rx += (s.mx - s.rx) * 0.12;
      s.ry += (s.my - s.ry) * 0.12;
      s.gx += (s.mx - s.gx) * 0.055;
      s.gy += (s.my - s.gy) * 0.055;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) translate(-50%, -50%)`;
      }
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${s.gx}px, ${s.gy}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", onMove);
    const attach = () => {
      document.querySelectorAll("[data-cursor-expand]").forEach((el) => {
        el.addEventListener("mouseenter", () => setHoverState("xl"));
        el.addEventListener("mouseleave", () => setHoverState("normal"));
      });
      document.querySelectorAll("[data-cursor-dark]").forEach((el) => {
        el.addEventListener("mouseenter", () => setHoverState("xd"));
        el.addEventListener("mouseleave", () => setHoverState("normal"));
      });
    };
    attach();

    if (lenisFrameRef) {
      lenisFrameRef.current = tick;
      return () => {
        lenisFrameRef.current = null;
        window.removeEventListener("mousemove", onMove);
      };
    }

    let raf = 0;
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [lenisFrameRef]);

  const baseColor = "255,255,255"; // Always white; mix-blend-difference handles inversion perfectly on all backgrounds
  
  // Compute ring styles based on hover state
  let ringScale = 1;
  let ringBorderOpacity = 0.6;
  let ringBgOpacity = 0;
  if (hoverState === "xl") {
    ringScale = 2; // 28 * 2 = 56
    ringBorderOpacity = 0.8;
    ringBgOpacity = 0.1;
  } else if (hoverState === "xd") {
    ringScale = 2;
    ringBorderOpacity = 0.9;
    ringBgOpacity = 0.15;
  }

  return (
    <>
      <div
        ref={ghostRef}
        className="fixed pointer-events-none z-[9990] mix-blend-difference"
        style={{ top: 0, left: 0, willChange: "transform" }}
      >
        <div style={{
          width: 48, height: 48,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `1px solid rgba(${baseColor}, 0.2)`,
          transition: "border-color 0.3s",
        }} />
      </div>

      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9995] mix-blend-difference"
        style={{ top: 0, left: 0, willChange: "transform" }}
      >
        <div style={{
          width: 28, height: 28,
          borderRadius: "50%",
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          border: `1px solid rgba(${baseColor}, ${ringBorderOpacity})`,
          background: `rgba(${baseColor}, ${ringBgOpacity})`,
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, background 0.3s",
        }} />
      </div>

      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{ top: 0, left: 0, willChange: "transform" }}
      >
        <div style={{
          width: 5, height: 5,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `rgba(${baseColor}, 1)`,
          transition: "background 0.3s",
        }} />
      </div>
    </>
  );
}

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      setT(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Home() {
  const clock = useClock();

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#030303]">
      <PrecisionCursor />
      <SceneManager
        scenes={[
          { id: "scene1", render: () => <SceneOne clock={clock} /> },
          { id: "scene2", render: () => <SceneTwo /> },
          { id: "scene3", render: () => <SceneThree /> },
          { id: "scene4", render: () => <SceneFour /> },
        ]}
      />
    </div>
  );
}
