"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TransitionSequence({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Concurrent Radial Fade & Shutter Drop
      tl.to(".radial-dim", { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".solid-dim", { opacity: 1, duration: 1.8, ease: "power2.inOut" }, 0.2)

      // 2. The Heavy Vault Drop
      tl.to(".shutter-top", { yPercent: 100, duration: 2.6, ease: "power3.inOut", force3D: true }, 0)
        .to(".shutter-bottom", { yPercent: -100, duration: 2.6, ease: "power3.inOut", force3D: true }, 0)
        
      // 3. The Impact Micro-Shake
        .to(containerRef.current, {
          y: 2.5,
          yoyo: true,
          repeat: 3,
          duration: 0.08,
          ease: "sine.inOut",
        }, "-=0.25") 
        
      // 4. The Text Reveal
        .fromTo(textRef.current, 
          { opacity: 0, y: 15, letterSpacing: "0.2em" }, 
          { opacity: 1, y: 0, letterSpacing: "0.6em", duration: 2.8, ease: "power2.out" }, 
          "-=0.5"
        );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // EXACT SAME LOCK PATH (Untouched per your request)
  const edgePath = "M 0,480 L 420,480 L 470,530 L 530,530 L 580,480 L 1000,480";

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[9999]">
      
      {/* ── PLAIN RADIAL BACKDROP ── */}
      <div className="radial-dim absolute inset-0 w-full h-full opacity-0 z-0" 
        style={{ background: "radial-gradient(circle at center, transparent 0%, #010101 100%)" }} />
      <div className="solid-dim absolute inset-0 w-full h-full bg-[#050505] opacity-0 z-10" />

      {/* ── TOP SHUTTER ── */}
      <div className="shutter-top absolute top-[-100vh] left-0 w-full h-[100vh] will-change-transform z-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="shutterGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#121214" />
              <stop offset="100%" stopColor="#080809" />
            </linearGradient>

            {/* Armor Plate Gradient (Creates a subtle curved bulge) */}
            <linearGradient id="plateGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1c" />
              <stop offset="100%" stopColor="#0d0d0f" />
            </linearGradient>

            {/* EXACT SAME CRISP CHROME */}
            <linearGradient id="crispChrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="25%" stopColor="#555555" />
              <stop offset="48%" stopColor="#f0f0f0" />
              <stop offset="52%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#666666" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>

            {/* Clean Vertical Brushed Metal Pattern (No Glitchy Filters) */}
            <pattern id="brushedMetal" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1" height="8" fill="#ffffff" opacity="0.015" />
              <rect x="3" y="0" width="1" height="8" fill="#000000" opacity="0.04" />
              <rect x="5" y="0" width="1" height="8" fill="#ffffff" opacity="0.01" />
            </pattern>
            
            {/* 3D Drop Shadow for the Armor Plates */}
            <filter id="plateShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodOpacity="0.75" floodColor="#000" />
            </filter>

            {/* Clipping path ensures the designer plates NEVER bleed over the lock */}
            <clipPath id="clipTop">
              <path d="M 0,0 L 1000,0 L 1000,481 L 580,481 L 530,531 L 470,531 L 420,481 L 0,481 Z" />
            </clipPath>
          </defs>
          
          {/* Base Shutter Body & Vertical Texture */}
          <path d="M 0,0 L 1000,0 L 1000,481 L 580,481 L 530,531 L 470,531 L 420,481 L 0,481 Z" fill="url(#shutterGradTop)" />
          <path d="M 0,0 L 1000,0 L 1000,481 L 580,481 L 530,531 L 470,531 L 420,481 L 0,481 Z" fill="url(#brushedMetal)" />
          
          {/* ── DESIGNER ARMOR PLATES (Clipped safely inside) ── */}
          <g clipPath="url(#clipTop)">
            {/* Left Angled Plate */}
            <path d="M -10,-10 L 250,-10 L 380,240 L 380,485 L -10,485 Z" fill="url(#plateGradTop)" filter="url(#plateShadow)" stroke="#2a2a2e" strokeWidth="1.5" strokeLinejoin="miter" />
            {/* Right Angled Plate */}
            <path d="M 1010,-10 L 750,-10 L 620,240 L 620,485 L 1010,485 Z" fill="url(#plateGradTop)" filter="url(#plateShadow)" stroke="#2a2a2e" strokeWidth="1.5" strokeLinejoin="miter" />
          </g>
          
          {/* ── UNTOUCHED LAYERED METALLIC EDGE ── */}
          <path d={edgePath} fill="none" stroke="#222" strokeWidth="16" strokeLinejoin="miter" />
          <path d={edgePath} fill="none" stroke="url(#crispChrome)" strokeWidth="12" strokeLinejoin="miter" />
          <path d="M 0,477 L 418,477 L 468,527 L 532,527 L 582,477 L 1000,477" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinejoin="miter" />
        </svg>
      </div>

      {/* ── BOTTOM SHUTTER ── */}
      <div className="shutter-bottom absolute top-[100vh] left-0 w-full h-[100vh] will-change-transform z-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="shutterGradBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080809" />
              <stop offset="100%" stopColor="#040404" />
            </linearGradient>

            <linearGradient id="plateGradBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d0d0f" />
              <stop offset="100%" stopColor="#050506" />
            </linearGradient>

            <clipPath id="clipBot">
              <path d="M 0,1000 L 1000,1000 L 1000,480 L 580,480 L 530,530 L 470,530 L 420,480 L 0,480 Z" />
            </clipPath>
          </defs>
          
          {/* Base Shutter Body & Vertical Texture */}
          <path d="M 0,1000 L 1000,1000 L 1000,480 L 580,480 L 530,530 L 470,530 L 420,480 L 0,480 Z" fill="url(#shutterGradBot)" />
          <path d="M 0,1000 L 1000,1000 L 1000,480 L 580,480 L 530,530 L 470,530 L 420,480 L 0,480 Z" fill="url(#brushedMetal)" />
          
          {/* ── DESIGNER ARMOR PLATES (Clipped safely inside) ── */}
          <g clipPath="url(#clipBot)">
            {/* Left Angled Plate (Mirrors Top) */}
            <path d="M -10,1010 L 250,1010 L 380,760 L 380,475 L -10,475 Z" fill="url(#plateGradBot)" filter="url(#plateShadow)" stroke="#1a1a1c" strokeWidth="1.5" strokeLinejoin="miter" />
            {/* Right Angled Plate (Mirrors Top) */}
            <path d="M 1010,1010 L 750,1010 L 620,760 L 620,475 L 1010,475 Z" fill="url(#plateGradBot)" filter="url(#plateShadow)" stroke="#1a1a1c" strokeWidth="1.5" strokeLinejoin="miter" />
          </g>

          {/* Pitch Black Seam Void */}
          <path d={edgePath} fill="none" stroke="#000" strokeWidth="6" strokeLinejoin="miter" />

          {/* ── UNTOUCHED LAYERED METALLIC EDGE (Bottom) ── */}
          <path d={edgePath} fill="none" stroke="#222" strokeWidth="16" strokeLinejoin="miter" />
          <path d={edgePath} fill="none" stroke="url(#crispChrome)" strokeWidth="12" strokeLinejoin="miter" />
          <path d="M 0,483 L 422,483 L 472,533 L 528,533 L 578,483 L 1000,483" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" strokeLinejoin="miter" />
        </svg>
      </div>

      {/* ── TRANSITION TEXT ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-start z-[100]" style={{ paddingTop: '36vh' }}>
        <div ref={textRef} className="will-change-transform">
          <p style={{ 
            fontFamily: "'DM Mono', 'Courier New', monospace", 
            fontSize: 11, 
            fontWeight: 500,
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 0 15px rgba(255,255,255,0.4)",
            margin: 0
          }}>
            Moving to another dimension...
          </p>
        </div>
      </div>

    </div>
  );
}