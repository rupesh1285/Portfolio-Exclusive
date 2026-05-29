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
      tl.from(".s1-hero-mask-inner", {
        yPercent: 110,
        rotate: 2,
        opacity: 0,
        duration: 1.25,
        stagger: 0.11,
      })
        .from(
          ".s1-hero-float",
          { y: 28, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.85",
        )
        .from(
          ".s1-hero-rail",
          { opacity: 0, x: -12, duration: 0.8, ease: "power2.out" },
          "-=0.9",
        )
        .from(
          ".s1-hero-orbit",
          { scale: 0.92, opacity: 0, duration: 1.1, ease: "power3.out" },
          "-=1",
        )
        .from(".s1-hero-foot", { y: 16, opacity: 0, duration: 0.7 }, "-=0.55");
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
      {/* Depth - Now with slow dynamic breathing */}
      <style>{`
        @keyframes breathe-grid {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.02); }
        }
        @keyframes float-data {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-15px); opacity: 0.6; }
        }
      `}</style>
      <div
        className="pointer-events-none absolute inset-0 origin-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 100%)",
          animation: "breathe-grid 12s ease-in-out infinite"
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

      {/* ── Hero: baseline mega-type + floating thesis + orbit ring (not 50/50) ── */}
      <section className="relative min-h-[100dvh] overflow-hidden px-4 pb-10 pt-6 md:px-8 lg:px-12 group/hero">
        <div className="s1-hero-rail pointer-events-none absolute left-3 top-28 hidden flex-col gap-6 text-[9px] uppercase tracking-[0.5em] text-white/25 lg:flex">
          <span className="max-w-[10em] leading-relaxed">Systems & UI Engineering</span>
          <div className="h-24 w-px bg-gradient-to-b from-white/25 to-transparent" />
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Scroll</span>
        </div>

        {/* Orbit decoration — behind float card — NOW ROTATING DYNAMICALLY */}
        <div className="s1-hero-orbit pointer-events-none absolute right-[-18%] top-[8%] h-[min(72vw,520px)] w-[min(72vw,520px)] md:right-[-8%]">
          {/* Static base ring */}
          <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
          {/* Inner ring rotating forward */}
          <div className="absolute inset-[10%] rounded-full border border-white/[0.05] border-t-white/20 animate-[spin_20s_linear_infinite]" />
          {/* Outer dashed ring rotating reverse */}
          <div className="absolute inset-[22%] rounded-full border border-dashed border-white/[0.08] animate-[spin_30s_linear_infinite_reverse]" />
          <div
            className="absolute left-1/2 top-1/2 h-[1px] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            style={{ transform: "translate(-50%, -50%) rotate(-18deg)" }}
          />
        </div>

        {/* Floating thesis cluster — offset, overlaps void */}
        <div
          className="s1-hero-float relative z-10 mx-auto mt-8 w-full max-w-md border border-white/[0.09] bg-[#080808]/[0.95] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:ml-auto md:mr-6 md:mt-14 lg:mr-16 lg:mt-20 backdrop-blur-md"
          style={mono}
        >
          <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-white/40">Full-Stack Architect</p>
          <p className="text-[13px] leading-[1.75] text-white/55">
            Engineering highly performant web applications with a focus on systems design, fluid cinematic interfaces, and deep backend resilience. I optimize for latency, maintainability, and absolute craft.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-[0.28em] text-white/35">
            <span>Remote / India</span>
            <span className="text-white/15">·</span>
            <span>{clock || "—:—:—"} IST</span>
          </div>
        </div>

        {/* NEW: Left Side Telemetry Widget (Fills empty mid-left space) */}
        <div className="s1-hero-rail absolute left-8 top-[40%] hidden flex-col gap-10 md:flex pointer-events-none z-10" style={mono}>
          <div className="flex flex-col gap-2">
             <span className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Edge Latency</span>
             <span className="text-2xl text-white/80 font-light tracking-wider" style={bebas}>12<span className="text-sm">MS</span></span>
          </div>
          <div className="flex flex-col gap-2">
             <span className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Sys.Load</span>
             <div className="flex items-end gap-1.5 h-8 mt-1">
                {[4, 8, 5, 9, 3, 6, 10, 4].map((h, i) => (
                  <div key={i} className="w-1 bg-white/20" style={{ height: `${h * 10}%`, animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.15}s` }} />
                ))}
             </div>
          </div>
        </div>

        {/* Baseline-anchored typography */}
        <div className="relative z-[5] mt-[min(22vh,180px)] flex flex-col justify-end md:mt-[min(18vh,200px)]">
          <p
            className="s1-hero-mask-inner mb-2 text-[10px] uppercase tracking-[0.65em] text-white/30 md:pl-1"
            style={mono}
          >
            Rupesh Agarwal
          </p>
          <div className="overflow-hidden">
            <h1
              className="s1-hero-mask-inner leading-[0.82] tracking-[0.02em] text-white"
              style={{
                ...bebas,
                fontSize: "clamp(4.2rem, 14vw, 11rem)",
              }}
            >
              RUPESH
            </h1>
          </div>
          <div className="-mt-1 overflow-hidden md:-mt-2">
            <h1
              className="s1-hero-mask-inner leading-[0.82] tracking-[0.28em] text-transparent"
              style={{
                ...bebas,
                fontSize: "clamp(2.4rem, 7.5vw, 5.5rem)",
                WebkitTextStroke: "1.2px rgba(255,255,255,0.35)",
              }}
            >
              AGARWAL
            </h1>
          </div>
          <p
            className="s1-hero-mask-inner mt-6 max-w-xl text-[clamp(15px,1.35vw,19px)] font-light italic leading-relaxed text-white/40 md:pl-1"
            style={cormorant}
          >
            I architect scalable backend systems and craft cinematic front-end experiences where every millisecond is explicitly earned.
          </p>
        </div>

        <div
          className="s1-hero-foot pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-10"
          style={mono}
        >
          <span className="text-[8px] uppercase tracking-[0.5em] text-white/25">Continue</span>
          <div className="flex h-10 w-px overflow-hidden bg-white/[0.12]">
            <div className="animate-scroll-drop h-1/2 w-full bg-gradient-to-b from-white/50 to-transparent" />
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
