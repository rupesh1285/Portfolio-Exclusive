"use client";

import type { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";
import SceneManager from "@/components/SceneManager";
import SceneOne from "./SceneOne";
import SceneTwo from "@/components/scene2/SceneTwo";
import SceneThree from "./SceneThree";
import SceneFour from "./SceneFour";

function PrecisionCursor({ lenisFrameRef }: { lenisFrameRef?: MutableRefObject<(() => void) | null> }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const st = useRef({ mx: -200, my: -200, rx: -200, ry: -200, gx: -200, gy: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      st.current.mx = e.clientX;
      st.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const tick = () => {
      const s = st.current;
      s.rx += (s.mx - s.rx) * 0.12;
      s.ry += (s.my - s.ry) * 0.12;
      s.gx += (s.mx - s.gx) * 0.055;
      s.gy += (s.my - s.gy) * 0.055;
      if (ringRef.current) {
        ringRef.current.style.left = s.rx + "px";
        ringRef.current.style.top = s.ry + "px";
      }
      if (ghostRef.current) {
        ghostRef.current.style.left = s.gx + "px";
        ghostRef.current.style.top = s.gy + "px";
      }
    };

    const xl = () => {
      if (!ringRef.current) return;
      Object.assign(ringRef.current.style, {
        width: "56px",
        height: "56px",
        borderColor: "rgba(220,220,220,0.65)",
        background: "rgba(220,220,220,0.06)",
      });
    };
    const xd = () => {
      if (!ringRef.current) return;
      Object.assign(ringRef.current.style, {
        width: "56px",
        height: "56px",
        borderColor: "rgba(18,18,18,0.5)",
        background: "rgba(18,18,18,0.06)",
      });
    };
    const ct = () => {
      if (!ringRef.current) return;
      Object.assign(ringRef.current.style, {
        width: "28px",
        height: "28px",
        borderColor: "rgba(180,180,180,0.4)",
        background: "transparent",
      });
    };

    window.addEventListener("mousemove", onMove);
    const attach = () => {
      document.querySelectorAll("[data-cursor-expand]").forEach((el) => {
        el.addEventListener("mouseenter", xl);
        el.addEventListener("mouseleave", ct);
      });
      document.querySelectorAll("[data-cursor-dark]").forEach((el) => {
        el.addEventListener("mouseenter", xd);
        el.addEventListener("mouseleave", ct);
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

  return (
    <>
      <div
        ref={ghostRef}
        className="fixed pointer-events-none z-[9990]"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "1px solid rgba(160,160,160,0.08)",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9995]"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(180,180,180,0.38)",
          transform: "translate(-50%,-50%)",
          transition:
            "width 0.4s cubic-bezier(0.16,1,0.3,1),height 0.4s cubic-bezier(0.16,1,0.3,1),border-color 0.28s,background 0.28s",
        }}
      />
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#FFF",
          transform: "translate(-50%,-50%)",
        }}
      />
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
          <SceneOne key="scene1" clock={clock} />,
          <SceneTwo key="scene2" />,
          <SceneThree key="scene3" />,
          <SceneFour key="scene4" />,
        ]}
      />
    </div>
  );
}
