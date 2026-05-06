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
      // ── Idle bubble float animations (inside the text fill) ──
      // Each bubble gets a slow, organic drift so the text looks alive
      gsap.to("#tb1", { cx: "+=38", cy: "+=22",  duration: 5.2, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb2", { cx: "-=28", cy: "+=30",  duration: 6.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb3", { cx: "+=20", cy: "-=35",  duration: 4.9, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb4", { cx: "-=40", cy: "-=18",  duration: 7.1, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb5", { cx: "+=15", cy: "+=40",  duration: 5.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb6", { cx: "-=32", cy: "+=12",  duration: 6.3, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb7", { cx: "+=44", cy: "-=28",  duration: 8.0, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb8", { cx: "-=18", cy: "-=44",  duration: 5.5, ease: "sine.inOut", repeat: -1, yoyo: true });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // 1. Clear the white flash left over from the vault doors
      tl.to(flashRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" })

        // 2. Hold — let the viewer see the animated bubble-filled text
        .to({}, { duration: 0.6 })

        // 3. Fly through! Scale the SVG so the text (and its fill) explodes outward
        .to(svgRef.current, {
          scale: 80,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 1.0,
          ease: "expo.inOut",
        })

        // 4. Clean up
        .to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[60]">

      {/* White flash from the vault impact */}
      <div ref={flashRef} className="absolute inset-0 w-full h-full bg-[#f8f9fa] z-[100]" />

      {/* ── THE PORTAL SVG ── */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full will-change-transform z-50"
           xmlns="http://www.w3.org/2000/svg">
        <defs>

          {/* ── 1. ClipPath: text shape used to clip the bubble layer ── */}
          <clipPath id="text-clip">
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fontFamily="'Courier New', Courier, 'DM Mono', monospace"
              fontWeight="900"
              fontSize="14vw"
              letterSpacing="0.02em"
            >
              CREATIONS
            </text>
          </clipPath>

          {/* ── 2. Mask: same text shape used to punch a hole in the white surround ── */}
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="white" />
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

          {/* ── Radial gradients for each bubble ── */}
          <radialGradient id="bg1" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="45%"  stopColor="#D8D8D8" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#B0B0B0" stopOpacity="0.30" />
          </radialGradient>
          <radialGradient id="bg2" cx="30%" cy="28%" r="65%">
            <stop offset="0%"   stopColor="#F0F0F0" stopOpacity="0.90" />
            <stop offset="50%"  stopColor="#C8C8C8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#989898" stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id="bg3" cx="38%" cy="25%" r="60%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="55%"  stopColor="#CCCCCC" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#A0A0A0" stopOpacity="0.20" />
          </radialGradient>
          <radialGradient id="bg4" cx="32%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#EFEFEF" stopOpacity="0.92" />
            <stop offset="48%"  stopColor="#C0C0C0" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#909090" stopOpacity="0.22" />
          </radialGradient>

          {/* Glass filter: inner glow + soft blur */}
          <filter id="glass-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

        </defs>

        {/* ── LAYER 1: White surround (hides Scene Two outside the letters) ── */}
        <rect width="100%" height="100%" fill="#F7F7F7" mask="url(#text-mask)" />

        {/* ── LAYER 2: Animated bubble fill, clipped strictly inside the text ── */}
        <g clipPath="url(#text-clip)">

          {/* Deep grey base fill so letters aren't transparent */}
          <rect width="100%" height="100%" fill="#C4C4C4" />

          {/* Subtle diagonal texture lines */}
          <rect width="100%" height="100%"
            fill="url(#tex-lines)"
            opacity="0.08"
          />

          {/* Large background bubble — upper left */}
          <circle id="tb1" cx="22%" cy="44%" r="12%" fill="url(#bg1)"
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.2"
            filter="url(#glass-filter)" opacity="0.88" />
          {/* Specular highlight on tb1 */}
          <ellipse cx="20%" cy="40%" rx="3.5%" ry="1.8%"
            fill="rgba(255,255,255,0.75)" opacity="0.7"
            clipPath="url(#text-clip)" />

          {/* Large background bubble — right */}
          <circle id="tb2" cx="75%" cy="52%" r="10%" fill="url(#bg2)"
            stroke="rgba(255,255,255,0.5)" strokeWidth="1.0"
            filter="url(#glass-filter)" opacity="0.80" />
          <ellipse cx="73%" cy="48%" rx="3%" ry="1.5%"
            fill="rgba(255,255,255,0.70)" opacity="0.65"
            clipPath="url(#text-clip)" />

          {/* Medium bubble — centre-left */}
          <circle id="tb3" cx="40%" cy="38%" r="7.5%" fill="url(#bg3)"
            stroke="rgba(255,255,255,0.55)" strokeWidth="0.9"
            filter="url(#glass-filter)" opacity="0.78" />
          <ellipse cx="38.5%" cy="34.5%" rx="2.2%" ry="1.1%"
            fill="rgba(255,255,255,0.80)" opacity="0.70"
            clipPath="url(#text-clip)" />

          {/* Medium bubble — centre-right */}
          <circle id="tb4" cx="60%" cy="58%" r="8%" fill="url(#bg4)"
            stroke="rgba(255,255,255,0.45)" strokeWidth="0.9"
            filter="url(#glass-filter)" opacity="0.75" />
          <ellipse cx="58.5%" cy="54%" rx="2.5%" ry="1.2%"
            fill="rgba(255,255,255,0.70)" opacity="0.65"
            clipPath="url(#text-clip)" />

          {/* Small accent bubbles */}
          <circle id="tb5" cx="85%" cy="35%" r="5%" fill="url(#bg1)"
            stroke="rgba(255,255,255,0.6)" strokeWidth="0.8"
            opacity="0.72" />
          <ellipse cx="84%" cy="32%" rx="1.5%" ry="0.8%"
            fill="rgba(255,255,255,0.80)" opacity="0.72"
            clipPath="url(#text-clip)" />

          <circle id="tb6" cx="12%" cy="60%" r="4.5%" fill="url(#bg2)"
            stroke="rgba(255,255,255,0.5)" strokeWidth="0.7"
            opacity="0.68" />
          <ellipse cx="11%" cy="57%" rx="1.3%" ry="0.7%"
            fill="rgba(255,255,255,0.75)" opacity="0.68"
            clipPath="url(#text-clip)" />

          <circle id="tb7" cx="50%" cy="70%" r="6%" fill="url(#bg3)"
            stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"
            opacity="0.65" />
          <ellipse cx="48.5%" cy="66.5%" rx="1.8%" ry="0.9%"
            fill="rgba(255,255,255,0.70)" opacity="0.62"
            clipPath="url(#text-clip)" />

          <circle id="tb8" cx="30%" cy="65%" r="3.5%" fill="url(#bg4)"
            stroke="rgba(255,255,255,0.45)" strokeWidth="0.7"
            opacity="0.62" />
          <ellipse cx="29%" cy="62.5%" rx="1.0%" ry="0.5%"
            fill="rgba(255,255,255,0.72)" opacity="0.60"
            clipPath="url(#text-clip)" />

          {/* Frosted glass overlay — gives the text a cohesive frosted look */}
          <rect width="100%" height="100%"
            fill="rgba(220,220,220,0.18)"
          />

        </g>

        {/* ── LAYER 3: Crisp letter outline on top ── */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="none"
          stroke="rgba(80,80,80,0.30)"
          strokeWidth="2.5"
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