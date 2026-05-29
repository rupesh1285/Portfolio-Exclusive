"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const mono = { fontFamily: "'DM Mono', ui-monospace, monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const cormorant = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

export default function SceneOne({ clock }: { clock: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

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
      {/* Textured Noise Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.25] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 65%)"
        }}
      />

      {/* Floating Dynamic Data Nodes */}
      <div className="absolute top-[20%] left-[25%] text-[10px] text-white/40 pointer-events-none font-mono" style={{ animation: "float-data 8s ease-in-out infinite" }}>
        [SYS.MEM: 0x1A4]
      </div>
      <div className="absolute top-[65%] right-[15%] text-[10px] text-white/20 pointer-events-none font-mono" style={{ animation: "float-data 11s ease-in-out infinite 2s" }}>
        [NET.LAT: 12ms]
      </div>
      <div className="absolute top-[80%] left-[10%] text-[10px] text-white/20 pointer-events-none font-mono hidden md:block" style={{ animation: "float-data 9s ease-in-out infinite 4s" }}>
        [WGL.FPS: 60]
      </div>


      <nav
        className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-[#030303]/[0.92] px-5 py-5 md:px-10"
        style={mono}
      >
        <span data-cursor-expand className="text-[11px] tracking-[0.35em] text-white/90" style={bebas}>
          RA.
        </span>
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.42em] text-white/35">
          {["Work", "Profile", "Contact"].map((n) => (
            <button
              key={n}
              type="button"
              data-cursor-expand
              className="transition-colors hover:text-white/80"
              onClick={() => {
                const idx = n === "Work" ? 1 : n === "Contact" ? 3 : 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((window as any).__goToScene) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).__goToScene(idx);
                }
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-white/30 sm:flex relative">
          <span className="h-1.5 w-1.5 animate-ping absolute left-0 rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/90 relative z-10" />
          SYSTEM ONLINE
        </div>
      </nav>

      <section className="relative min-h-[100dvh] overflow-hidden px-4 flex flex-col items-center justify-center group/hero">
        <div className="flex flex-col items-center text-center z-10 w-full max-w-5xl mt-12 md:mt-0">
          <p
            className="hero-sub mb-4 text-[11px] uppercase tracking-[0.8em] text-white/50"
            style={mono}
          >
            Full-Stack Architect
          </p>
          
          <h1
            className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] leading-[0.9] tracking-[0.02em] flex flex-wrap justify-center gap-x-4 md:gap-x-8"
            style={{ ...bebas, fontSize: "clamp(4.5rem, 15vw, 12rem)" }}
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

          <p
            className="hero-sub mt-8 max-w-2xl text-[clamp(15px,1.5vw,22px)] font-light italic leading-relaxed text-white/60 drop-shadow-md"
            style={cormorant}
          >
            I architect scalable backend systems and craft cinematic front-end experiences where every millisecond is explicitly earned.
          </p>

          <div className="hero-sub mt-12 flex items-center justify-center gap-4 border border-white/10 bg-white/[0.02] px-6 py-3 rounded-full backdrop-blur-md text-[10px] uppercase tracking-[0.3em] text-white/40 shadow-xl">
            <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
            <span>Remote / India</span>
            <span className="text-white/20">|</span>
            <span>{clock || "—:—:—"} IST</span>
          </div>
        </div>

        <div
          className="s1-hero-foot pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10 z-10"
          style={mono}
        >
          <span className="text-[8px] uppercase tracking-[0.5em] text-white/30">Scroll to Explore</span>
          <div className="flex h-12 w-[1px] overflow-hidden bg-white/[0.15]">
            <div className="animate-scroll-drop h-1/2 w-full bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="s1-block-marquee overflow-hidden border-y border-white/[0.06] bg-[#050505] py-4 flex flex-col gap-3">
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
          <h2 className="s1-ab text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-[0.02em]" style={bebas}>
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
                <h3 className="mb-4 text-xl tracking-[0.08em] text-white/90" style={bebas}>
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
              <p className="mb-2 text-3xl text-white/90" style={bebas}>
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
          style={bebas}
        >
          PRECISION IS THE DEFAULT. MOTION IS THE REWARD.
        </p>
      </section>
    </div>
  );
}
