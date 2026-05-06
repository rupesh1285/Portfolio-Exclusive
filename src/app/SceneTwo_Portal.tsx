"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SceneTwo_Portal({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // 1. Clear the flash left over from the vault doors
      tl.to(flashRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" })
        
        // 2. Hold to admire the glass bubbles floating strictly INSIDE the text
        .to({}, { duration: 0.4 })
        
        // 3. Fly through the text hole!
        // We scale the entire SVG massively. As it grows, the hole grows.
        .to(svgRef.current, {
          scale: 80,
          opacity: 0,
          transformOrigin: "50% 50%", // Forces perfect center zoom
          duration: 1.0,
          ease: "expo.inOut"
        })
        
        // 4. Clean up the portal layer
        .to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[60]">
      
      {/* White flash catching the impact from the vault */}
      <div ref={flashRef} className="absolute inset-0 w-full h-full bg-[#f8f9fa] z-[100]" />

      {/* ── THE BULLETPROOF SVG MASK ── */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full will-change-transform z-50">
        <defs>
          <mask id="text-mask">
            {/* White makes the mask opaque (shows the #F7F7F7 background rect) */}
            <rect width="100%" height="100%" fill="white" />
            
            {/* Black makes the mask transparent (punches a hole to show the bubbles underneath) */}
            <text 
              x="50%" 
              y="50%" 
              dominantBaseline="central" 
              textAnchor="middle" 
              fill="black" 
              fontFamily="'Courier New', Courier, 'DM Mono', monospace" 
              fontWeight="900" 
              fontSize="14vw" 
              letterSpacing="0.02em"
            >
              CREATIONS
            </text>
          </mask>
        </defs>

        {/* This covers the screen and hides SceneTwo, EXCEPT inside the text */}
        <rect width="100%" height="100%" fill="#F7F7F7" mask="url(#text-mask)" />
        
        {/* The glass stroke overlaying the hole, giving the letters definition */}
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="central" 
          textAnchor="middle" 
          fill="none" 
          stroke="rgba(0, 0, 0, 0.15)" 
          strokeWidth="4" 
          fontFamily="'Courier New', Courier, 'DM Mono', monospace" 
          fontWeight="900" 
          fontSize="14vw" 
          letterSpacing="0.02em"
        >
          CREATIONS
        </text>
      </svg>
      
    </div>
  );
}