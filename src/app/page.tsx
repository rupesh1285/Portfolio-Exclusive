"use client";

import { useEffect, useRef, useState } from "react";
import SceneOne from "./SceneOne";
import TransitionSequence from "./TransitionSequence";
import SceneTwo_Portal from "./SceneTwo_Portal";
import SceneTwo from "./SceneTwo";
import SceneThree from "./SceneThree";

/* ════════════════════════════════════════════════════════════
   PRECISION CURSOR
════════════════════════════════════════════════════════════ */
function PrecisionCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const st = useRef({ mx:-200,my:-200,rx:-200,ry:-200,gx:-200,gy:-200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      st.current.mx = e.clientX; st.current.my = e.clientY;
      if (dotRef.current) { dotRef.current.style.left=e.clientX+"px"; dotRef.current.style.top=e.clientY+"px"; }
    };
    let raf = 0;
    const tick = () => {
      const s = st.current;
      s.rx += (s.mx-s.rx)*0.1;  s.ry += (s.my-s.ry)*0.1;
      s.gx += (s.mx-s.gx)*0.05; s.gy += (s.my-s.gy)*0.05;
      if (ringRef.current)  { ringRef.current.style.left=s.rx+"px";  ringRef.current.style.top=s.ry+"px";  }
      if (ghostRef.current) { ghostRef.current.style.left=s.gx+"px"; ghostRef.current.style.top=s.gy+"px"; }
      raf = requestAnimationFrame(tick);
    };
    const xl = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"60px",height:"60px",borderColor:"rgba(200,200,200,0.7)",background:"rgba(200,200,200,0.04)"}); };
    const xd = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"60px",height:"60px",borderColor:"rgba(18,18,18,0.55)",background:"rgba(18,18,18,0.04)"}); };
    const ct = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"30px",height:"30px",borderColor:"rgba(180,180,180,0.42)",background:"transparent"}); };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.querySelectorAll("[data-cursor-expand]").forEach(el=>{el.addEventListener("mouseenter",xl);el.addEventListener("mouseleave",ct);});
    document.querySelectorAll("[data-cursor-dark]").forEach(el=>{el.addEventListener("mouseenter",xd);el.addEventListener("mouseleave",ct);});
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ghostRef} className="fixed pointer-events-none z-[9990]" style={{width:52,height:52,borderRadius:"50%",border:"1px solid rgba(165,165,165,0.09)",transform:"translate(-50%,-50%)"}}/>
      <div ref={ringRef}  className="fixed pointer-events-none z-[9995]" style={{width:30,height:30,borderRadius:"50%",border:"1px solid rgba(180,180,180,0.42)",transform:"translate(-50%,-50%)",transition:"width 0.45s cubic-bezier(0.16,1,0.3,1),height 0.45s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,background 0.3s"}}/>
      <div ref={dotRef}   className="fixed pointer-events-none z-[9999]" style={{width:4,height:4,borderRadius:"50%",background:"#FFF",transform:"translate(-50%,-50%)",mixBlendMode:"difference"}}/>
    </>
  );
}

function useClock() {
  const [t, setT] = useState("");
  useEffect(()=>{
    const tick=()=>{
      const now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
      setT(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
    };
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  },[]);
  return t;
}

export default function Home() {
  const clock = useClock();
  
  // Cleaned up state: scene1 -> vault -> portal -> scene2and3
  const [phase, setPhase] = useState<"scene1" | "vault" | "portal" | "scene2and3">("scene1");
  const s2ScrollRef = useRef<HTMLDivElement>(null);

  const handleS2Wheel = (e: React.WheelEvent) => {
    if (!s2ScrollRef.current) return;
    if (s2ScrollRef.current.scrollTop <= 0 && e.deltaY < -20) {
      setPhase("scene1");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      <PrecisionCursor/>

      {(phase === "scene1" || phase === "vault") && (
        <div className="absolute inset-0 w-full h-full z-0">
          <SceneOne clock={clock} onReachBottom={() => { if (phase === "scene1") setPhase("vault"); }} />
        </div>
      )}

      {phase === "vault" && (
        <div className="absolute inset-0 w-full h-full z-50">
          <TransitionSequence onComplete={() => setPhase("portal")} />
        </div>
      )}

      {/* ── SCENE TWO IS RENDERED BENEATH THE PORTAL ── */}
      {(phase === "portal" || phase === "scene2and3") && (
        <div 
          ref={s2ScrollRef}
          onWheel={handleS2Wheel}
          className="absolute inset-0 w-full h-full z-10 overflow-y-auto bg-[#050505]" 
          style={{ scrollbarWidth: "none" }}
        >
          <SceneTwo />
          <SceneThree />
        </div>
      )}

      {/* ── THE PORTAL MASK ── */}
      {/* Sits on top of Scene Two and punches a transparent hole through it */}
      {phase === "portal" && (
        <div className="absolute inset-0 w-full h-full z-[60] pointer-events-none">
          <SceneTwo_Portal onComplete={() => setPhase("scene2and3")} />
        </div>
      )}

    </div>
  );
}