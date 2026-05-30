"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const mono = { fontFamily: "'DM Mono', ui-monospace, monospace" } as const;
const luxury = { fontFamily: "'Cinzel', serif", fontWeight: 500 } as const;
const cormorant = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

const ROLES = [
  "Full-Stack Architect",
  "Creative Developer",
  "UI/UX Engineer",
  "Product Builder"
];

export default function SceneOne({ clock }: { clock: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  
  // Typewriter effect state
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && roleText === currentRole) {
      typingSpeed = 2500; // Pause at the end of the word
      setIsDeleting(true);
    } else if (isDeleting && roleText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
      typingSpeed = 600; // Pause before typing next word
    }

    const timer = setTimeout(() => {
      setRoleText(currentRole.substring(0, roleText.length + (isDeleting ? -1 : 1)));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  // Hero entrance
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-char",
        { opacity: 0, filter: "blur(12px)", scale: 0.85, y: 30 },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 1.6,
          stagger: 0.04,
          ease: "expo.out",
        }
      )
      .fromTo(
        ".hero-sub",
        { opacity: 0, y: 20, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=1.1"
      )
      .fromTo(
        ".s1-hero-foot", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 1 }, 
        "-=0.6"
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Scroll-driven section reveals
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = root.closest(".scene-scroll-container");
    if (!root || !(scroller instanceof HTMLElement)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.classList.contains("s1-block-about")) {
            gsap.fromTo(
              el.querySelectorAll(".s1-ab"),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out" },
            );
          }
          if (el.classList.contains("s1-block-pillars")) {
            gsap.fromTo(
              el.querySelectorAll(".s1-pillar"),
              { y: 56, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.95, stagger: 0.12, ease: "power3.out" },
            );
          }
          if (el.classList.contains("s1-block-timeline")) {
            gsap.fromTo(
              el.querySelectorAll(".s1-tl"),
              { x: -24, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.75, stagger: 0.06, ease: "power2.out" },
            );
          }
          if (el.classList.contains("s1-block-manifesto")) {
            gsap.fromTo(
              el.querySelector(".s1-man-line"),
              { y: 32, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
            );
          }
          obs.unobserve(el);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px", root: scroller },
    );
    root.querySelectorAll(".s1-io").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const tape = [
    "Systems design",
    "Real-time interfaces",
    "Performance budgets",
    "API architecture",
    "Design systems",
    "WebGL & motion",
  ];

  return (
    <div ref={rootRef} className="relative bg-[#030303] text-[#e6e6e6]">
      {/* Background Styling */}
      <style>{`
        @keyframes breathe-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes breathe-grid {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.02); }
        }
        @keyframes float-data {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-15px); opacity: 0.6; }
        }
      `}</style>
      
      {/* Creamish radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 mix-blend-screen origin-center"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(245, 242, 228, 0.09) 0%, transparent 65%)",
          animation: "breathe-glow 10s ease-in-out infinite"
        }}
      />

      {/* Grid Design overlay */}
      <div
        className="pointer-events-none absolute inset-0 origin-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,242,228,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,242,228,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          animation: "breathe-grid 12s ease-in-out infinite"
        }}
      />




      <nav
        className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-[#030303]/[0.92] px-5 py-5 md:px-10"
        style={mono}
      >
        <style>{`
          @keyframes shimmer { 100% { transform: translateX(100%); } }
        `}</style>
        
        {/* Left: Typographic Brand Mark */}
        <div className="flex items-center group cursor-pointer select-none" data-cursor-expand>
          <div className="relative flex items-baseline leading-none">
            <span className="text-[18px] font-bold text-white tracking-tighter drop-shadow-md transition-transform duration-500 group-hover:-translate-y-0.5" style={luxury}>R</span>
            <span className="text-[18px] font-light text-white/70 tracking-tighter -ml-[1px] group-hover:text-white transition-all duration-500 group-hover:translate-y-0.5" style={luxury}>A</span>
            <span className="w-1.5 h-1.5 bg-white/90 rounded-full ml-1.5 mb-[2px] group-hover:bg-white group-hover:shadow-[0_0_12px_rgba(255,255,255,1)] transition-all duration-500" />
          </div>
        </div>

        {/* Center: Architectural Tabs */}
        <div className="flex items-center gap-8 md:gap-16 relative">
          {/* Subtle static connecting timeline behind the nodes */}
          <div className="absolute top-[40%] left-0 w-full h-[1px] bg-white/[0.05] pointer-events-none" />
          
          {["Work", "Profile", "Contact"].map((n, i) => (
            <button
              key={n}
              type="button"
              data-cursor-expand
              className="relative flex flex-col items-center gap-2 group/link bg-[#030303] px-3 z-10"
              onClick={() => {
                const idx = n === "Work" ? 1 : n === "Contact" ? 3 : 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((window as any).__goToScene) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).__goToScene(idx);
                }
              }}
            >
              <div className="flex items-center gap-2">
                {/* Static editorial numbering */}
                <span className="text-[8px] text-white/30 tracking-widest group-hover/link:text-white/70 transition-colors" style={mono}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 group-hover/link:text-white group-hover/link:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300">
                  {n}
                </span>
              </div>
              
              {/* Static structural node that ignites on hover */}
              <div className="relative flex items-center justify-center w-4 h-4">
                <span className="absolute w-[1px] h-full bg-white/[0.05] group-hover/link:bg-white/20 transition-colors duration-300" />
                <span className="absolute h-[1px] w-full bg-white/[0.05] group-hover/link:bg-white/20 transition-colors duration-300" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-white/10 group-hover/link:bg-white group-hover/link:shadow-[0_0_10px_white] transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>

        {/* Right: Telemetry Badge */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 border border-white/[0.05] bg-[#000000] relative overflow-hidden group cursor-default rounded-sm shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          <div className="relative flex items-center justify-center w-1.5 h-1.5">
            <span className="absolute inset-0 bg-green-500/50 rounded-full animate-ping" />
            <span className="relative w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[7px] uppercase tracking-[0.4em] text-white/50">System</span>
            <span className="text-[7px] uppercase tracking-[0.4em] text-white/90 mt-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Online</span>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[100dvh] overflow-hidden px-6 md:px-12 lg:px-24 flex items-center justify-between group/hero">
        
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left z-10 w-full max-w-3xl -mt-16 md:-mt-8 lg:-mt-12 xl:-mt-16">
          {/* Animated Geometric Element instead of text */}
          <div className="hero-sub mb-8 flex items-center gap-4 h-4">
            {/* Spinning geometric core */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <div className="absolute inset-0 border border-white/20 rounded-none animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-1 border border-white/40 rounded-none animate-[spin_3s_linear_infinite_reverse]" />
              <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
            </div>
            
            {/* Pulsing data bars */}
            <div className="flex items-center gap-1 h-3">
              <div className="w-[1.5px] h-[40%] bg-white/40 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.0s' }} />
              <div className="w-[1.5px] h-[80%] bg-white/60 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
              <div className="w-[1.5px] h-[100%] bg-white/90 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
              <div className="w-[1.5px] h-[60%] bg-white/60 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
              <div className="w-[1.5px] h-[30%] bg-white/40 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
            </div>
            
            {/* Trailing line */}
            <div className="w-16 h-[1px] bg-gradient-to-r from-white/30 to-transparent" />
          </div>
          
          <div className="relative">
            {/* Targeted intense glow behind the text */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[100px] rounded-[100%] pointer-events-none z-0" />
            <h1
              className="relative z-10 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] leading-[0.95] tracking-[0.04em] flex flex-col gap-2"
              style={{ 
                ...luxury, 
                fontSize: "clamp(2.5rem, min(8vw, 15vh), 9rem)",
                maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)"
              }}
            >
              <div className="flex">
                {"RUPESH".split("").map((char, i) => (
                  <span key={`f-${i}`} className="hero-char inline-block">{char}</span>
                ))}
              </div>
              <div className="flex">
                {"AGARWAL".split("").map((char, i) => (
                  <span key={`l-${i}`} className="hero-char inline-block text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.85)" }}>{char}</span>
                ))}
              </div>
            </h1>
          </div>

          <div
            className="hero-sub mt-6 mb-6 flex items-center h-4 text-[11px] uppercase tracking-[0.8em] text-white/50"
            style={mono}
          >
            <span>{roleText}</span>
            <span className="w-1.5 h-3 ml-2 bg-white/50 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>

          <p
            className="hero-sub w-[90vw] md:w-[45vw] max-w-[600px] text-[clamp(12px,min(1.2vw,2.5vh),18px)] font-light italic leading-relaxed text-white/60 drop-shadow-md"
            style={cormorant}
          >
            I architect scalable backend systems and craft cinematic front-end experiences where every millisecond is explicitly earned.
          </p>
          
          <div
            className="s1-hero-foot pointer-events-none mt-10 md:mt-14 flex flex-col items-start gap-4 z-10"
            style={mono}
          >
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/70 drop-shadow-md font-medium">Scroll to Explore</span>
            <div className="flex h-16 md:h-20 w-[1px] ml-6 overflow-hidden bg-white/[0.2]">
              <div className="animate-scroll-drop h-1/2 w-full bg-gradient-to-b from-white to-transparent" />
            </div>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="hero-sub absolute right-[5%] md:right-[20%] lg:right-[22%] bottom-0 md:bottom-8 lg:bottom-12 xl:bottom-16 z-20 h-[70vh] md:h-[85vh] w-[75vw] md:w-auto max-w-[650px] opacity-90 drop-shadow-[0_0_40px_rgba(255,255,255,0.05)] pointer-events-none origin-bottom flex justify-center">
          {/* High Radius Radial Glow */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[90%] aspect-square bg-white/[0.04] blur-[100px] rounded-full -z-10" />
          
          <img src="/Hero.png" alt="Rupesh Agarwal" className="w-auto h-full max-w-full object-bottom object-contain" />
        </div>

        {/* Far Right: Massive 3D Full-Stack Visualizer */}
        <div className="hidden lg:flex absolute -right-[2%] xl:right-0 top-[48%] xl:top-[50%] -translate-y-1/2 w-[500px] h-[600px] items-center justify-center z-10 pointer-events-none perspective-[1200px]">
          <style>{`
            .iso-stack { transform-style: preserve-3d; transform: rotateX(55deg) rotateZ(-45deg); }
            @keyframes float-top { 0%, 100% { transform: translateZ(140px); } 50% { transform: translateZ(160px); } }
            @keyframes float-mid { 0%, 100% { transform: translateZ(50px); } 50% { transform: translateZ(60px); } }
            @keyframes float-bot { 0%, 100% { transform: translateZ(-40px); } 50% { transform: translateZ(-30px); } }
            @keyframes scanline { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(200%); opacity: 0; } }
          `}</style>

          <div className="iso-stack relative w-72 h-72">
            {/* Connecting Vertical Core Line */}
            <div className="absolute left-1/2 top-1/2 w-[2px] h-[300px] bg-white/20 -translate-x-1/2 -translate-y-1/2 transform rotateX(90deg)">
              <div className="w-full h-[50px] bg-white shadow-[0_0_20px_white] animate-[scanline_3s_ease-in-out_infinite]" />
            </div>

            {/* Top Layer: Frontend Client */}
            <div className="absolute inset-0 border border-white/40 bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-[float-top_6s_ease-in-out_infinite] flex flex-col p-4 overflow-hidden">
              <div className="absolute top-2 right-2 text-[8px] uppercase tracking-[0.4em] text-white/80" style={mono}>Client / UI</div>
              {/* Fake UI Wireframe */}
              <div className="w-full flex justify-between items-center opacity-60 mt-4 border-b border-white/20 pb-2">
                 <div className="w-3 h-3 rounded-full border border-white/50" />
                 <div className="flex gap-2"><div className="w-12 h-1 bg-white/30 rounded-full"/><div className="w-6 h-1 bg-white/30 rounded-full"/></div>
              </div>
              <div className="w-full h-24 border border-white/20 mt-4 rounded-sm bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 w-[200%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-[scanline_2s_linear_infinite]" />
              </div>
              <div className="w-full flex gap-3 h-12 mt-4">
                 <div className="w-1/2 h-full border border-white/20 rounded-sm" />
                 <div className="w-1/2 h-full border border-white/20 rounded-sm" />
              </div>
            </div>

            {/* Middle Layer: Backend Services */}
            <div className="absolute inset-0 border border-white/20 bg-black/60 shadow-[0_0_40px_rgba(255,255,255,0.05)] animate-[float-mid_6s_ease-in-out_infinite_0.5s] flex items-center justify-center">
              <div className="absolute top-2 right-2 text-[8px] uppercase tracking-[0.4em] text-white/50" style={mono}>Backend / API</div>
              <div className="w-3/4 h-3/4 border border-white/10 grid grid-cols-3 grid-rows-3 gap-2 p-2 relative">
                 {[...Array(9)].map((_, i) => (
                   <div key={i} className={`border border-white/10 ${i % 2 === 0 ? 'bg-white/5' : ''} flex items-center justify-center`}>
                     {i === 4 && <div className="w-4 h-4 bg-white/80 rotate-45 animate-pulse shadow-[0_0_15px_white]" />}
                   </div>
                 ))}
              </div>
            </div>

            {/* Bottom Layer: Database */}
            <div className="absolute inset-0 border border-white/10 bg-black/80 animate-[float-bot_6s_ease-in-out_infinite_1s] flex items-center justify-center">
              <div className="absolute top-2 right-2 text-[8px] uppercase tracking-[0.4em] text-white/30" style={mono}>Database Layer</div>
              <div className="w-24 h-24 flex flex-col gap-2 relative">
                {[1,2,3].map(i => (
                  <div key={i} className="w-full h-8 border border-white/20 rounded-[50%] flex items-center justify-center relative bg-white/[0.02]">
                    <div className="absolute inset-x-0 top-1/2 bottom-0 border-b border-white/20 rounded-[50%]" />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>

        <div className="hero-sub pointer-events-none absolute bottom-20 right-6 md:bottom-24 md:right-10 flex items-center gap-4 border border-white/10 bg-white/[0.02] px-6 py-3 rounded-full backdrop-blur-md text-[9px] uppercase tracking-[0.3em] text-white/40 shadow-xl z-20">
          <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
          <span>Remote / India</span>
          <span className="text-white/20">|</span>
          <span>{clock || "—:—:—"} IST</span>
        </div>
      </section>

      {/* Marquee */}
      <div className="s1-block-marquee overflow-hidden border-y border-white/[0.06] bg-[#050505] py-4 flex flex-col gap-3 relative z-30 -mt-0 md:-mt-8 lg:-mt-12 xl:-mt-16">
        <div className="ticker-inner flex items-center gap-10">
          {[...tape, ...tape].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="shrink-0 text-[9px] uppercase tracking-[0.55em] text-white/30"
              style={mono}
            >
              {t}
              <span className="ml-10 text-white/12">✦</span>
            </span>
          ))}
        </div>
        <div className="ticker-inner flex items-center gap-10 opacity-40" style={{ animationDirection: "reverse" }}>
          {[...tape, ...tape].reverse().map((t, i) => (
            <span
              key={`${t}-rev-${i}`}
              className="shrink-0 text-[9px] uppercase tracking-[0.55em] text-white/30"
              style={mono}
            >
              {t}
              <span className="ml-10 text-white/12">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="s1-io s1-block-about relative border-b border-white/[0.05] px-5 py-24 md:px-10 lg:px-16 overflow-hidden">
        {/* NEW: Background Code Watermark in About Section */}
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 pointer-events-none opacity-[0.03] z-0 select-none rotate-12" style={mono}>
           <pre className="text-[12px] leading-[2] text-white">
{`interface SystemMetrics {
  latency: number;
  throughput: number;
  errorRate: number;
}
export class EdgeNode implements INode {
  private async reconcile() {
    await this.cluster.sync();
  }
}
// ARCHITECTURE //
// Highly available, multi-region routing`}
           </pre>
        </div>
        {/* Corner Crosshairs */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />

        <div className="relative z-10 mb-14 flex items-center gap-4">
          <div className="h-px w-10 bg-white/20" />
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/35" style={mono}>
            01 — Profile
          </p>
        </div>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <h2 className="s1-ab text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[0.02em]" style={luxury}>
            ENGINEERING AT
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.28)" }}>
              SCALE.
            </span>
          </h2>
          <div className="space-y-6">
            <p className="s1-ab text-[13px] leading-[1.85] text-white/45" style={mono}>
              I specialize in bridging the gap between highly complex backend architectures and flawless, motion-driven frontend interfaces. My stack is deeply rooted in modern TypeScript, React ecosystem, and robust systems languages.
            </p>
            <p className="s1-ab text-[13px] leading-[1.85] text-white/45" style={mono}>
              Whether it&apos;s designing highly concurrent microservices, orchestrating cloud-native deployments, or hand-crafting custom WebGL shaders, my core philosophy remains constant: ship software that is mathematically precise, incredibly fast, and unapologetically beautiful.
            </p>
            <blockquote
              className="s1-ab border-l border-white/20 py-1 pl-6 text-[17px] leading-relaxed text-white/55 italic"
              style={cormorant}
            >
              “Performance is not a feature; it is the fundamental baseline of user experience.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="s1-io s1-block-pillars px-5 py-24 md:px-10 lg:px-16">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px w-10 bg-white/20" />
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/35" style={mono}>
            02 — Capabilities
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Architecture",
              d: "Designing service boundaries, implementing edge caching, message queues, and bulletproof schema design for products built to outgrow their MVP.",
            },
            {
              t: "Interfaces",
              d: "Crafting motion-first UI, highly accessible tokenized component systems, and fluid layouts that maintain fidelity from mobile to ultrawide.",
            },
            {
              t: "Delivery",
              d: "Constructing zero-downtime CI/CD pipelines, deep telemetry observability, and pragmatic system tradeoffs for fearless deployments.",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="s1-pillar group relative overflow-hidden border border-white/[0.07] bg-white/[0.02] p-8 transition-colors hover:border-white/[0.2] hover:bg-white/[0.04]"
            >
              <div className="absolute -inset-full z-0 block translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
              <div className="relative z-10">
                <h3 className="mb-4 text-xl tracking-[0.08em] text-white/90" style={luxury}>
                  {x.t}
                </h3>
                <p className="text-[12px] leading-[1.75] text-white/40" style={mono}>
                  {x.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline strip */}
      <section className="s1-io s1-block-timeline relative border-y border-white/[0.06] bg-[#050505] px-5 py-16 md:px-10 lg:px-16 overflow-hidden">
        {/* NEW: Connecting Horizontal Data Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.03] -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-y-1/2 pointer-events-none animate-pulse" />
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-10 bg-white/20" />
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/35" style={mono}>
            03 — Selected moments
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { y: "2026", l: "Architected distributed event-streaming platform" },
            { y: "2025", l: "Led global headless commerce migration" },
            { y: "2024", l: "Shipped proprietary WebGL design engine" },
            { y: "2023", l: "Engineered ultra-low-latency data pipeline" },
          ].map((row) => (
            <div key={row.y} className="s1-tl">
              <p className="mb-2 text-3xl text-white/90" style={luxury}>
                {row.y}
              </p>
              <p className="text-[11px] leading-relaxed text-white/38" style={mono}>
                {row.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Manifesto exit */}
      <section className="s1-io s1-block-manifesto px-5 py-28 md:px-10 lg:px-16">
        <p
          className="s1-man-line mx-auto max-w-4xl text-center text-[clamp(1.75rem,3.8vw,3rem)] leading-[1.15] tracking-[0.03em] text-white/88"
          style={luxury}
        >
          PRECISION IS THE DEFAULT. MOTION IS THE REWARD.
        </p>
      </section>
    </div>
  );
}
