"use client";

import { useEffect, useRef, useState } from "react";
import SceneOne from "./SceneOne";
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

/* ════════════════════════════════════════════════════════════
   HUD SCROLLBAR
════════════════════════════════════════════════════════════ */
function HudScrollbar() {
  return (
    <div className="fixed right-7 top-1/2 -translate-y-1/2 z-[9000] pointer-events-none"
      style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10,height:300}}>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(160,160,160,0.45)",marginBottom:4}}>01</span>
      <div style={{width:1,flex:1,background:"rgba(150,150,150,0.16)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",
          background:"linear-gradient(to bottom,rgba(180,180,180,0.45),rgba(255,255,255,0.8))",
          transformOrigin:"top",transform:"scaleY(var(--scroll-total,0))",transition:"transform 0.06s linear"}}/>
      </div>
      <div className="hud-dot" style={{width:3,height:3,borderRadius:"50%",background:"rgba(200,200,200,0.55)"}}/>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(160,160,160,0.45)",marginTop:4}}>03</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IST CLOCK
════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   ROOT PAGE — ORCHESTRATOR
════════════════════════════════════════════════════════════ */
export default function Home() {
  const clock = useClock();

  // 0 = Black Scene, 1 = White Scene, 2 = Charcoal Scene
  const [activeScene, setActiveScene] = useState(0); 
  const isAnimating = useRef(false);
  const s1Ref = useRef<HTMLDivElement>(null); 
  const s2Ref = useRef<HTMLDivElement>(null); 

  // The Custom Wheel Engine
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      if (activeScene === 0) {
        if (e.deltaY > 15) { 
          e.preventDefault();
          transitionTo(1);
        }
      } 
      else if (activeScene === 1) {
        const el = s1Ref.current;
        if (!el) return;
        
        const atTop = el.scrollTop <= 0;
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 5;

        if (e.deltaY < -15 && atTop) {
          e.preventDefault();
          transitionTo(0);
        } 
        else if (e.deltaY > 15 && atBottom) {
          e.preventDefault();
          transitionTo(2);
        }
      } 
      else if (activeScene === 2) {
        const el = s2Ref.current;
        if (!el) return;
        
        const atTop = el.scrollTop <= 0;
        if (e.deltaY < -15 && atTop) {
          e.preventDefault();
          transitionTo(1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeScene]);

  const transitionTo = (sceneIndex: number) => {
    isAnimating.current = true;
    setActiveScene(sceneIndex);
    setTimeout(() => {
      isAnimating.current = false;
    }, 1000); 
  };

  return (
    <>
      <PrecisionCursor/>
      <HudScrollbar/>

      <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">

        {/* ══ SCENE 0: BLACK HERO ═══════════════ */}
        <div className="absolute inset-0 w-full h-full z-0">
          <SceneOne clock={clock} />
        </div>

        {/* ══ SCENE 1: WHITE WORLD ═══════ */}
        <div 
          ref={s1Ref}
          className="absolute inset-0 w-full h-full z-10 overflow-y-auto"
          style={{ 
            clipPath: activeScene >= 1 ? "circle(150% at 0% 100%)" : "circle(0% at 0% 100%)",
            transition: "clip-path 1s cubic-bezier(0.65, 0, 0.05, 1)",
            pointerEvents: activeScene >= 1 ? "auto" : "none",
            scrollbarWidth: "none",
          }}>
          <SceneTwo /> 
        </div>

        {/* ══ SCENE 2: CHARCOAL ENGINE ROOM ══════════════ */}
        <div 
          ref={s2Ref}
          className="absolute inset-0 w-full h-full z-20 overflow-y-auto"
          style={{ 
            transform: activeScene === 2 ? "translateY(0%)" : "translateY(100%)",
            transition: "transform 1s cubic-bezier(0.65, 0, 0.05, 1)",
            pointerEvents: activeScene === 2 ? "auto" : "none",
            boxShadow: "0 -30px 80px rgba(0,0,0,0.9)",
            scrollbarWidth: "none",
          }}>
          <SceneThree />
        </div>

      </div>
    </>
  );
}