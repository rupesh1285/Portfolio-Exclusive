"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  CINEMATIC ENTRY SEQUENCE:
  1. CRT scan line sweeps down the black void (0.6s)
  2. Letters slam in one-by-one — heavy overshoot + skew snap, L→R stagger (0.072s each)
  3. Each letter landing triggers a white impact flash that decays instantly
  4. Framing lines extend left & right below the word
  5. Sub-label [ PORTAL · 001 ] and corner coords fade in
  6. Hold — bubbles float inside filled letters
  7. Zoom-through
*/

const LETTERS = ["C","R","E","A","T","I","O","N","S"];

export default function SceneTwo_Portal({ onComplete }: { onComplete: () => void }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const svgRef        = useRef<SVGSVGElement>(null);
  const scanRef       = useRef<SVGLineElement>(null);
  const lineLeftRef   = useRef<SVGLineElement>(null);
  const lineRightRef  = useRef<SVGLineElement>(null);
  const sublabelRef   = useRef<SVGGElement>(null);
  const letterRefs    = useRef<(SVGTextElement | null)[]>([]);
  const impactRefs    = useRef<(SVGTextElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Idle bubble float ──
      gsap.to("#tb1", { attr: { cx: "+=38", cy: "+=22" }, duration: 5.2, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb2", { attr: { cx: "-=28", cy: "+=30" }, duration: 6.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb3", { attr: { cx: "+=20", cy: "-=35" }, duration: 4.9, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb4", { attr: { cx: "-=40", cy: "-=18" }, duration: 7.1, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb5", { attr: { cx: "+=15", cy: "+=40" }, duration: 5.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("#tb6", { attr: { cx: "-=32", cy: "+=12" }, duration: 6.3, ease: "sine.inOut", repeat: -1, yoyo: true });

      // ── Initial states ──
      gsap.set(letterRefs.current.filter(Boolean), {
        opacity: 0, y: -72, skewX: -10, transformOrigin: "50% 100%",
      });
      gsap.set(impactRefs.current.filter(Boolean), { opacity: 0 });
      gsap.set(lineLeftRef.current,  { scaleX: 0, opacity: 0, transformOrigin: "right center" });
      gsap.set(lineRightRef.current, { scaleX: 0, opacity: 0, transformOrigin: "left center" });
      gsap.set(sublabelRef.current,  { opacity: 0, y: 6 });
      gsap.set(scanRef.current, { opacity: 0, attr: { y1: "0%", y2: "0%" } });

      const tl = gsap.timeline({
        onComplete: () => { if (onCompleteRef.current) onCompleteRef.current(); }
      });

      // ── 1. CRT SCAN LINE ──
      tl.to(scanRef.current, { opacity: 0.75, duration: 0.06 })
        .to(scanRef.current, {
          attr: { y1: "105%", y2: "105%" },
          duration: 0.5,
          ease: "power1.inOut",
        })
        .to(scanRef.current, { opacity: 0, duration: 0.12 }, "-=0.08")
        .to({}, { duration: 0.08 });

      // ── 2. LETTER SLAM (L→R stagger) ──
      LETTERS.forEach((_, i) => {
        tl.to(letterRefs.current[i]!, {
            opacity: 1,
            y: 0,
            skewX: 0,
            duration: 0.38,
            ease: "back.out(3.2)",
          }, `<+=${i === 0 ? 0 : 0.068}`)
          .fromTo(impactRefs.current[i]!,
            { opacity: 0.8 },
            { opacity: 0, duration: 0.32, ease: "power2.out" },
            "<"
          );
      });

      // ── 3. FRAMING LINES ──
      tl.to(lineLeftRef.current, {
          scaleX: 1, opacity: 1, duration: 0.5, ease: "expo.out",
        }, "+=0.05")
        .to(lineRightRef.current, {
          scaleX: 1, opacity: 1, duration: 0.5, ease: "expo.out",
        }, "<+=0.04")

      // ── 4. SUB-LABEL ──
        .to(sublabelRef.current, {
          opacity: 1, y: 0, duration: 0.45, ease: "power2.out",
        }, "-=0.28")

      // ── 5. HOLD ──
        .to({}, { duration: 0.7 })

      // ── 6. ZOOM THROUGH ──
        .to(svgRef.current, {
          scale: 80,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 1.05,
          ease: "expo.inOut",
        })
        .to(containerRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Fixed viewBox — gives GSAP precise pixel coordinates to work with
  const VW = 1000;
  const VH = 600;
  const CY  = 308;   // vertical centre of the letters
  const SLOT = 91;   // width per letter slot (Bebas Neue at 148px ≈ 91px/letter)
  const WORD_W = SLOT * LETTERS.length;
  const START_X = (VW - WORD_W) / 2 + SLOT / 2;
  const LINE_Y  = CY + 84;  // horizontal framing lines sit here

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[60]"
      style={{ background: "#050505" }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full will-change-transform z-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>

          {/* Clips bubble fill strictly to letter shapes */}
          <clipPath id="text-clip">
            {LETTERS.map((letter, i) => (
              <text key={i}
                x={START_X + i * SLOT} y={CY}
                dominantBaseline="central" textAnchor="middle"
                fontFamily="'Bebas Neue', sans-serif" fontWeight="400"
                fontSize="148" letterSpacing="2"
              >{letter}</text>
            ))}
          </clipPath>

          {/* Mask: punches holes in the black surround */}
          <mask id="text-mask">
            <rect width="100%" height="100%" fill="white" />
            {LETTERS.map((letter, i) => (
              <text key={i}
                x={START_X + i * SLOT} y={CY}
                dominantBaseline="central" textAnchor="middle"
                fill="black"
                fontFamily="'Bebas Neue', sans-serif" fontWeight="400"
                fontSize="148" letterSpacing="2"
              >{letter}</text>
            ))}
          </mask>

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

          <filter id="glass-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Scan line glow */}
          <filter id="scan-glow" x="-2%" y="-800%" width="104%" height="1700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Subtle halo around each letter */}
          <filter id="letter-halo" x="-8%" y="-30%" width="116%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

        </defs>

        {/* Black surround — only the letter holes are transparent */}
        <rect width="100%" height="100%" fill="#050505" mask="url(#text-mask)" />

        {/* ── BUBBLE FILL — clipped to letter interiors ── */}
        <g clipPath="url(#text-clip)">
          <rect width="100%" height="100%" fill="#ADADAD" />

          <circle id="tb1" cx="18%" cy="48%" r="11%"
            fill="url(#bg1)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"
            filter="url(#glass-filter)" opacity="0.88" />
          <ellipse cx="16%" cy="43%" rx="3.2%" ry="1.6%"
            fill="rgba(255,255,255,0.75)" opacity="0.70" clipPath="url(#text-clip)" />

          <circle id="tb2" cx="72%" cy="50%" r="9.5%"
            fill="url(#bg2)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.0"
            filter="url(#glass-filter)" opacity="0.80" />
          <ellipse cx="70%" cy="46%" rx="2.8%" ry="1.4%"
            fill="rgba(255,255,255,0.70)" opacity="0.65" clipPath="url(#text-clip)" />

          <circle id="tb3" cx="40%" cy="40%" r="7%"
            fill="url(#bg3)" stroke="rgba(255,255,255,0.50)" strokeWidth="0.9"
            filter="url(#glass-filter)" opacity="0.78" />
          <ellipse cx="38.5%" cy="36%" rx="2%" ry="1%"
            fill="rgba(255,255,255,0.80)" opacity="0.70" clipPath="url(#text-clip)" />

          <circle id="tb4" cx="58%" cy="58%" r="7.5%"
            fill="url(#bg4)" stroke="rgba(255,255,255,0.40)" strokeWidth="0.9"
            filter="url(#glass-filter)" opacity="0.75" />
          <ellipse cx="56.5%" cy="54%" rx="2.2%" ry="1.1%"
            fill="rgba(255,255,255,0.70)" opacity="0.65" clipPath="url(#text-clip)" />

          <circle id="tb5" cx="84%" cy="36%" r="4.5%"
            fill="url(#bg1)" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" opacity="0.72" />
          <ellipse cx="83%" cy="33%" rx="1.3%" ry="0.7%"
            fill="rgba(255,255,255,0.80)" opacity="0.72" clipPath="url(#text-clip)" />

          <circle id="tb6" cx="10%" cy="58%" r="4%"
            fill="url(#bg2)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.7" opacity="0.68" />
          <ellipse cx="9%" cy="55%" rx="1.1%" ry="0.6%"
            fill="rgba(255,255,255,0.75)" opacity="0.68" clipPath="url(#text-clip)" />

          <rect width="100%" height="100%" fill="rgba(200,200,200,0.12)" />
        </g>

        {/* ── CRT SCAN LINE ── */}
        <line
          ref={scanRef}
          x1="0" y1="0%" x2={VW} y2="0%"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="1.5"
          filter="url(#scan-glow)"
        />

        {/* ── LETTER OUTLINES — GSAP slam targets ── */}
        <g filter="url(#letter-halo)">
          {LETTERS.map((letter, i) => (
            <text
              key={i}
              ref={el => { letterRefs.current[i] = el; }}
              x={START_X + i * SLOT}
              y={CY}
              dominantBaseline="central"
              textAnchor="middle"
              fill="none"
              stroke="rgba(255,255,255,0.20)"
              strokeWidth="1.5"
              fontFamily="'Bebas Neue', sans-serif"
              fontWeight="400"
              fontSize="148"
              style={{ opacity: 0 }}
            >{letter}</text>
          ))}
        </g>

        {/* ── IMPACT FLASHES — white fill that decays on each letter landing ── */}
        {LETTERS.map((letter, i) => (
          <text
            key={i}
            ref={el => { impactRefs.current[i] = el; }}
            x={START_X + i * SLOT}
            y={CY}
            dominantBaseline="central"
            textAnchor="middle"
            fill="rgba(255,255,255,0.50)"
            fontFamily="'Bebas Neue', sans-serif"
            fontWeight="400"
            fontSize="148"
            style={{ opacity: 0 }}
          >{letter}</text>
        ))}

        {/* ── FRAMING LINES ── */}
        <line
          ref={lineLeftRef}
          x1={38} y1={LINE_Y}
          x2={START_X - SLOT * 0.5 - 12} y2={LINE_Y}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.8"
          style={{ transformOrigin: `${START_X - SLOT * 0.5 - 12}px ${LINE_Y}px` }}
        />
        <line
          ref={lineRightRef}
          x1={START_X + LETTERS.length * SLOT - SLOT * 0.5 + 12} y1={LINE_Y}
          x2={VW - 38} y2={LINE_Y}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="0.8"
          style={{ transformOrigin: `${START_X + LETTERS.length * SLOT - SLOT * 0.5 + 12}px ${LINE_Y}px` }}
        />

        {/* ── SUB-LABEL & CORNER COORDS ── */}
        <g ref={sublabelRef} style={{ opacity: 0 }}>

          {/* Bracket ticks flanking the label */}
          <line x1={VW/2 - 92} y1={LINE_Y + 14} x2={VW/2 - 92} y2={LINE_Y + 26}
            stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
          <line x1={VW/2 + 92} y1={LINE_Y + 14} x2={VW/2 + 92} y2={LINE_Y + 26}
            stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />

          <text
            x={VW / 2} y={LINE_Y + 20}
            dominantBaseline="central" textAnchor="middle"
            fill="rgba(255,255,255,0.26)"
            fontFamily="'DM Mono', monospace"
            fontSize="10.5" letterSpacing="4.5"
          >PORTAL · 001</text>

          {/* Corner labels */}
          <text x={38} y={CY - 92}
            fill="rgba(255,255,255,0.10)"
            fontFamily="'DM Mono', monospace" fontSize="8.5" letterSpacing="2"
          >X:0500  Y:0300</text>

          <text x={VW - 38} y={CY - 92}
            textAnchor="end"
            fill="rgba(255,255,255,0.10)"
            fontFamily="'DM Mono', monospace" fontSize="8.5" letterSpacing="2"
          >ENTRY VECTOR LOCKED</text>

        </g>

      </svg>
    </div>
  );
}