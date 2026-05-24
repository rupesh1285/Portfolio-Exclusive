"use client";

import { memo } from "react";

export default memo(function BackgroundStage() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: "#060608", contain: "strict" }}>

      {/* ── Premium Light Leaks (opacity-only animation — no transform/scale to avoid compositing thrash) ─── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:1,
        background:"radial-gradient(ellipse 70% 55% at -5% 0%, rgba(42,44,52,0.75) 0%, transparent 65%)",
        animation:"leakPulse1 14s ease-in-out infinite",
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:1,
        background:"radial-gradient(ellipse 60% 50% at 108% 105%, rgba(28,30,36,0.8) 0%, transparent 62%)",
        animation:"leakPulse2 18s ease-in-out infinite 3s",
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:1,
        background:"radial-gradient(ellipse 45% 40% at 52% 48%, rgba(20,20,24,0.5) 0%, transparent 68%)",
        animation:"leakPulse1 22s ease-in-out infinite 7s",
      }}/>

      {/* ── Carbon Fibre Weave ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex:2,
        backgroundImage:`
          repeating-linear-gradient(0deg,   transparent 0, transparent 3px, rgba(255,255,255,0.011) 3px, rgba(255,255,255,0.011) 4px),
          repeating-linear-gradient(90deg,  transparent 0, transparent 3px, rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 4px)
        `,
      }}/>

      {/* ── Vignette ────────────────────────────────── */}
      <div className="absolute inset-0 z-[4] pointer-events-none" style={{
        background:"radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(5,5,7,0.96) 100%)",
      }}/>


      {/* Inline keyframes for light leaks — opacity only, no scale/transform */}
      <style>{`
        @keyframes leakPulse1 { 0%,100%{opacity:0.6} 50%{opacity:0.9} }
        @keyframes leakPulse2 { 0%,100%{opacity:0.5} 50%{opacity:0.8} }
      `}</style>
    </div>
  );
});