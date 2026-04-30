"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TransitionSequence({ onComplete }: { onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 1. Store the callback in a ref so it doesn't trigger effect re-runs
  const onCompleteRef = useRef(onComplete);

  // 2. Keep the ref perfectly in sync with the latest prop
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      
      // ── INFINITE AURORA ANIMATIONS (Outside the main timeline) ──
      // By keeping these separate, they don't block the onComplete trigger!
      gsap.to(".aurora-1", { x: "15vw", y: "15vh", scale: 1.2, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".aurora-2", { x: "-15vw", y: "-15vh", scale: 1.4, duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".aurora-3", { x: "20vw", y: "-20vh", scale: 1.1, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });

      // ── MAIN SEQUENCE TIMELINE ──
      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // 1. Concurrent Radial Fade & Shutter Drop
      tl.to(".radial-dim", { opacity: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".solid-dim", { opacity: 1, duration: 1.8, ease: "power2.inOut" }, 0.2)

      // 2. The Heavy Vault Drop (Locks shut)
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
        
      // 4. Recessed LEDs Booting Up
        .to(".status-led", {
          opacity: 1,
          duration: 0.1,
          stagger: 0.1,
          ease: "power2.in",
        }, "-=0.2")

      // 5. The Text Reveal
        .fromTo(textRef.current, 
          { opacity: 0, y: 15, letterSpacing: "0.1em", scale: 0.95 }, 
          { opacity: 1, y: 0, letterSpacing: "0.5em", scale: 1, duration: 1.5, ease: "power2.out" }, 
          "-=0.5"
        )

      // ════════ THE FAST OPENING SEQUENCE ════════

      // 6. The Disengage (Lights power off, Text blurs out)
        .to(".status-led, .light-trail", {
          opacity: 0,
          duration: 0.15,
          ease: "power4.out",
          stagger: 0.05
        }, "+=0.5") 
        
        .to(textRef.current, {
          opacity: 0,
          scale: 1.1,
          filter: "blur(10px)",
          duration: 0.3,
          ease: "power2.in"
        }, "<")

      // 7. Mechanical Unlock Shudder & Blinding Light Power-on
        .to(containerRef.current, {
          y: 3,
          yoyo: true,
          repeat: 4,
          duration: 0.04,
          ease: "sine.inOut"
        }, "+=0.2")

        .to(".white-reveal", {
          opacity: 1,
          duration: 0.15,
          ease: "power2.in"
        }, "<")

      // 8. The Explosive Pull Apart
        .to(".shutter-top", {
          yPercent: 0,
          duration: 1.2, 
          ease: "expo.inOut",
          force3D: true
        }, "<+=0.1")
        .to(".shutter-bottom", {
          yPercent: 0,
          duration: 1.2, 
          ease: "expo.inOut",
          force3D: true
        }, "<")

      // 9. THE MASSIVE "CREATIONS" REVEAL
        .fromTo(".creations-text", {
          opacity: 0,
          scale: 1.4, // Starts massive, rushing towards the screen
          filter: "blur(12px)"
        }, {
          opacity: 1,
          scale: 1, // Snaps into perfect size
          filter: "blur(0px)",
          duration: 1.8,
          ease: "expo.out"
        }, "<+=0.2"); // Triggers just a split second after the doors begin to move

    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const edgePath = "M 0,480 L 420,480 L 470,530 L 530,530 L 580,480 L 1000,480";

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[9999]">
      
      {/* ── THE BLINDING NEON WHITE REVEAL SCREEN w/ AURORA ── */}
      <div className="white-reveal absolute inset-0 w-full h-full bg-[#f8f9fa] opacity-0 z-[15] overflow-hidden">
        
        {/* Animated Aurora Blobs (Blurred into a smooth mesh gradient) */}
        <div className="aurora-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-normal opacity-40 blur-[120px]" 
          style={{ background: "radial-gradient(circle, #00f3ff, transparent 70%)" }} />
          
        <div className="aurora-2 absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-normal opacity-30 blur-[150px]" 
          style={{ background: "radial-gradient(circle, #ff00ea, transparent 70%)" }} />
          
        <div className="aurora-3 absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] rounded-full mix-blend-normal opacity-35 blur-[140px]" 
          style={{ background: "radial-gradient(circle, #7000ff, transparent 70%)" }} />
      </div>

      {/* ── THE TRANSPARENT "CREATIONS" TEXT ── */}
      <div className="creations-text absolute inset-0 flex items-center justify-center z-[16] opacity-0 pointer-events-none">
        <h1 style={{ 
          fontFamily: "'Inter', 'SF Pro Display', sans-serif", 
          fontWeight: 900,
          fontSize: '14vw', 
          color: 'transparent', 
          WebkitTextStroke: '3px rgba(10, 10, 12, 0.95)', // The premium dark outline masking the aurora
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          margin: 0
        }}>
          Creations
        </h1>
      </div>

      {/* ── PREMIUM CLASSY BACKDROP ── */}
      <div className="radial-dim absolute inset-0 w-full h-full opacity-0 z-0" 
        style={{ background: "radial-gradient(circle at center, transparent 0%, #000000 100%)" }} />
      <div className="solid-dim absolute inset-0 w-full h-full bg-[#030303] opacity-0 z-10" />

      {/* ── TOP SHUTTER ── */}
      <div className="shutter-top absolute top-[-100vh] left-0 w-full h-[100vh] will-change-transform z-20">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="shutterGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141416" />
              <stop offset="100%" stopColor="#0a0a0c" />
            </linearGradient>

            <linearGradient id="plateGradTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1f" />
              <stop offset="100%" stopColor="#101012" />
            </linearGradient>

            <linearGradient id="edgeHighlightTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a4a52" />
              <stop offset="50%" stopColor="#2a2a2e" />
              <stop offset="100%" stopColor="#101012" />
            </linearGradient>

            <linearGradient id="crispChrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="25%" stopColor="#555555" />
              <stop offset="48%" stopColor="#f0f0f0" />
              <stop offset="52%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#666666" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
            
            <filter id="plateShadowTop" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="25" stdDeviation="20" floodOpacity="0.95" floodColor="#000" />
            </filter>

            <filter id="whiteGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="clipTop">
              <path d="M 0,0 L 1000,0 L 1000,481 L 580,481 L 530,531 L 470,531 L 420,481 L 0,481 Z" />
            </clipPath>
          </defs>
          
          <path d="M 0,0 L 1000,0 L 1000,481 L 580,481 L 530,531 L 470,531 L 420,481 L 0,481 Z" fill="url(#shutterGradTop)" />
          
          <g clipPath="url(#clipTop)">
            <path d="M -10,-10 L 1010,-10 L 850,360 L 150,360 Z" fill="url(#plateGradTop)" filter="url(#plateShadowTop)" />
            <path d="M -10,-10 L 150,360 L 850,360 L 1010,-10" fill="none" stroke="url(#edgeHighlightTop)" strokeWidth="3.5" strokeLinejoin="round" />
            
            <path d="M 180,-10 L 180,220 L 220,260 L 220,320" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <circle cx="220" cy="320" r="4" fill="#000" opacity="0.9" />
            <path d="M 180,-10 L 180,220 L 220,260 L 220,320" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <circle cx="220" cy="320" r="1.5" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />
            
            <path d="M 820,-10 L 820,150 L 770,200 L 770,300" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <circle cx="770" cy="300" r="4" fill="#000" opacity="0.9" />
            <rect x="788" y="78" width="7" height="7" fill="#000" opacity="0.9" />
            <path d="M 820,-10 L 820,150 L 770,200 L 770,300" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <circle cx="770" cy="300" r="1.5" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />
            <rect x="790" y="80" width="3" height="3" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />

            <path d="M 485,-10 L 485,120 L 450,155 L 450,220" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <rect x="446.5" y="218" width="7" height="7" fill="#000" opacity="0.9" />
            <path d="M 485,-10 L 485,120 L 450,155 L 450,220" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <rect x="448.5" y="220" width="3" height="3" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />

            <path d="M 495,-10 L 505,-10 L 505,360 L 495,360 Z" fill="#030303" stroke="#111" strokeWidth="2" />

            <circle cx="475" cy="330" r="4.5" fill="#000" />
            <circle cx="525" cy="330" r="4.5" fill="#000" />
            <circle cx="475" cy="330" r="2.5" fill="#ffffff" filter="url(#whiteGlow)" className="status-led opacity-0" />
            <circle cx="525" cy="330" r="2.5" fill="#ffffff" filter="url(#whiteGlow)" className="status-led opacity-0" />
          </g>
          
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
              <stop offset="0%" stopColor="#0a0a0c" />
              <stop offset="100%" stopColor="#040405" />
            </linearGradient>

            <linearGradient id="plateGradBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101012" />
              <stop offset="100%" stopColor="#08080a" />
            </linearGradient>

            <linearGradient id="edgeHighlightBot" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#4a4a52" />
              <stop offset="50%" stopColor="#2a2a2e" />
              <stop offset="100%" stopColor="#0a0a0c" />
            </linearGradient>

            <clipPath id="clipBot">
              <path d="M 0,1000 L 1000,1000 L 1000,480 L 580,480 L 530,530 L 470,530 L 420,480 L 0,480 Z" />
            </clipPath>
          </defs>
          
          <path d="M 0,1000 L 1000,1000 L 1000,480 L 580,480 L 530,530 L 470,530 L 420,480 L 0,480 Z" fill="url(#shutterGradBot)" />
          
          <g clipPath="url(#clipBot)">
            <filter id="plateShadowBot" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="-25" stdDeviation="20" floodOpacity="0.95" floodColor="#000" />
            </filter>
            
            <path d="M -10,1010 L 1010,1010 L 850,640 L 150,640 Z" fill="url(#plateGradBot)" filter="url(#plateShadowBot)" />
            <path d="M -10,1010 L 150,640 L 850,640 L 1010,1010" fill="none" stroke="url(#edgeHighlightBot)" strokeWidth="3.5" strokeLinejoin="round" />

            <path d="M 180,1010 L 180,780 L 220,740 L 220,680" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <circle cx="220" cy="680" r="4" fill="#000" opacity="0.9" />
            <path d="M 180,1010 L 180,780 L 220,740 L 220,680" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <circle cx="220" cy="680" r="1.5" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />

            <path d="M 820,1010 L 820,850 L 770,800 L 770,700" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <circle cx="770" cy="700" r="4" fill="#000" opacity="0.9" />
            <rect x="788" y="918" width="7" height="7" fill="#000" opacity="0.9" />
            <path d="M 820,1010 L 820,850 L 770,800 L 770,700" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <circle cx="770" cy="700" r="1.5" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />
            <rect x="790" y="920" width="3" height="3" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />

            <path d="M 485,1010 L 485,880 L 450,845 L 450,780" fill="none" stroke="#000" strokeWidth="6" opacity="0.9" />
            <rect x="446.5" y="778" width="7" height="7" fill="#000" opacity="0.9" />
            <path d="M 485,1010 L 485,880 L 450,845 L 450,780" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.85" filter="url(#whiteGlow)" className="light-trail" />
            <rect x="448.5" y="780" width="3" height="3" fill="#fff" filter="url(#whiteGlow)" className="light-trail" />

            <path d="M 495,1010 L 505,1010 L 505,640 L 495,640 Z" fill="#030303" stroke="#111" strokeWidth="2" />
            
            <circle cx="475" cy="670" r="4.5" fill="#000" />
            <circle cx="525" cy="670" r="4.5" fill="#000" />
            <circle cx="475" cy="670" r="2.5" fill="#ffffff" filter="url(#whiteGlow)" className="status-led opacity-0" />
            <circle cx="525" cy="670" r="2.5" fill="#ffffff" filter="url(#whiteGlow)" className="status-led opacity-0" />
          </g>

          <path d={edgePath} fill="none" stroke="#000" strokeWidth="6" strokeLinejoin="miter" />
          <path d={edgePath} fill="none" stroke="#222" strokeWidth="16" strokeLinejoin="miter" />
          <path d={edgePath} fill="none" stroke="url(#crispChrome)" strokeWidth="12" strokeLinejoin="miter" />
          <path d="M 0,483 L 422,483 L 472,533 L 528,533 L 578,483 L 1000,483" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" strokeLinejoin="miter" />
        </svg>
      </div>

      {/* ── PREMIUM TRANSITION TEXT ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-start z-[100]" style={{ paddingTop: '36vh' }}>
        <div ref={textRef} className="will-change-transform">
          <p style={{ 
            fontFamily: "'Inter', 'SF Pro Display', sans-serif", 
            fontSize: 10, 
            fontWeight: 600,
            textTransform: "uppercase", 
            color: "#ffffff",
            textShadow: "0 0 20px rgba(255,255,255,0.6)",
            margin: 0
          }}>
            Breaching Dimensional Threshold...
          </p>
        </div>
      </div>

    </div>
  );
}