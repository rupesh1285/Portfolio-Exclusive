"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SceneTwo() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const deckRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null); 

  const [sysY, setSysY] = useState(0);

  // ── THE GRAND DISPERSAL & SCENE ENTRANCE ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. PHASE ONE: The Idle (0s to 1.4s)
      // While the Portal is flying through, the bubbles sit bunched up in the center behind the text
      tl.fromTo(".bubble-1", { top: "25%", left: "30%", width: "25vw", height: "25vw" }, { top: "22%", left: "28%", duration: 1.4, ease: "sine.inOut" }, 0)
        .fromTo(".bubble-2", { top: "35%", right: "30%", width: "20vw", height: "20vw" }, { top: "38%", right: "28%", duration: 1.4, ease: "sine.inOut" }, 0)
        .fromTo(".bubble-3", { bottom: "35%", left: "45%", width: "15vw", height: "15vw" }, { bottom: "32%", left: "43%", duration: 1.4, ease: "sine.inOut" }, 0);

      // 2. PHASE TWO: The Dispersal (Starts at 1.4s, exactly as the portal zooms past)
      // The bubbles aggressively fly out to act as permanent background accents
      tl.to(".bubble-1", { top: "-5%", left: "5%", width: "40vw", height: "40vw", duration: 1.8, ease: "expo.out" }, 1.4)
        .to(".bubble-2", { top: "25%", right: "-5%", width: "35vw", height: "35vw", duration: 1.8, ease: "expo.out" }, 1.4)
        .to(".bubble-3", { bottom: "10%", left: "15%", width: "25vw", height: "25vw", duration: 1.8, ease: "expo.out" }, 1.4);

      // 3. PHASE THREE: The Content Entrance
      // The UI elements cascade into place while the bubbles settle
      tl.fromTo(".s2-ticker", 
        { y: -60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }, 
        1.6 
      )
      .fromTo(".s2-honeycomb", 
        { scale: 0.5, opacity: 0, rotation: -45, x: 100 }, 
        { scale: 1, opacity: 1, rotation: 0, x: 0, duration: 2.0, ease: "expo.out" }, 
        1.6
      )
      .fromTo(".s2-header-elem", 
        { y: 80, opacity: 0, filter: "blur(15px)" }, 
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.15, ease: "power3.out" }, 
        1.8
      )
      .fromTo(".s2-project-card", 
        { opacity: 0, y: 150, scale: 0.95, filter: "blur(10px)" }, 
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.15, ease: "power3.out" }, 
        2.0
      );

    }, wrapperRef);
    return () => ctx.revert();
  }, []);


  // OBSERVER FOR SCROLL ANIMATIONS
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("in-view"); }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    refs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // CATERPILLAR MATH ENGINE
  useEffect(() => {
    const scrollParent = deckRef.current?.closest('.overflow-y-auto') || window;
    const onScroll = () => {
      if (!deckRef.current) return;
      const vh = window.innerHeight;
      const rect = deckRef.current.getBoundingClientRect();
      const TICKER_H = 44; const GAP = 32; const TITLE_OFFSET = 100; 
      const BASE_TOP = TICKER_H + GAP; 
      const CARD_H = vh - TICKER_H - (GAP * 2); 
      const SAFE_BOTTOM = vh - 16; 
      const scrolledPast = Math.max(0, BASE_TOP - rect.top);
      const SPACING = CARD_H + (vh * 0.10); 
      const t = scrolledPast / SPACING; 
      const N = projects.length;
      const maxShift = (idx: number) => Math.max(0, BASE_TOP + idx * TITLE_OFFSET + CARD_H - SAFE_BOTTOM);

      let shift = 0;
      for (let i = 0; i < N; i++) {
        if (t >= i) { shift = maxShift(i); } 
        else if (t > i - 1) {
          const prevShift = i === 0 ? 0 : maxShift(i - 1);
          shift = prevShift + (maxShift(i) - prevShift) * (t - (i - 1));
          break; 
        }
      }
      deckRef.current.style.setProperty('--stack-shift', `${Math.max(0, shift)}px`);
    };
    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll(); 
    return () => {
      scrollParent.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // PARALLAX ENGINE
  useEffect(() => {
    const scrollParent = deckRef.current?.closest('.overflow-y-auto') || window;
    const onScrollBg = () => {
      if (!bgRef.current) return;
      const st = scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
      bgRef.current.style.setProperty('--py', `${st}px`);
      setSysY(st);
    };
    scrollParent.addEventListener("scroll", onScrollBg, { passive: true });
    onScrollBg(); 
    return () => scrollParent.removeEventListener("scroll", onScrollBg);
  }, []);

  const projects = [
    { num: "01", title: "Finalist", tags: ["React", "MongoDB", "Algorithms"], desc: "Advanced workspace for software engineers to practice coding algorithms and track performance with a high-fidelity UI.", link: "#" },
    { num: "02", title: "Formatter.AI", tags: ["Python", "React", "Automation"], desc: "Intelligent code management engine handling deduplication, syntax formatting, and automated structural indentation.", link: "#" },
    { num: "03", title: "MyCampus", tags: ["Express", "Node.js", "PostgreSQL"], desc: "Full-stack academic management system developed for comprehensive institutional oversight and deployment.", link: "#" },
    { num: "04", title: "NeuralCommerce", tags: ["Node.js", "ML", "Redis"], desc: "AI-driven e-commerce engine with real-time personalisation at scale.", link: "#" },
    { num: "05", title: "ArchitectOS", tags: ["Three.js", "React", "WebGL"], desc: "3D building visualisation platform rendering spatial architectural layouts.", link: "#" },
  ];

  const ticker = ["Full-Stack Engineering", "Interactive Interfaces", "Real-Time Systems", "3D Web Experiences", "Performance Architecture"];

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-h-screen overflow-x-clip"
      style={{
        backgroundColor: "#F7F7F7",
        contentVisibility: "auto",
        containIntrinsicSize: "1200px 900px",
      } as React.CSSProperties}
    >
      
      {/* ── 3D GLASS BUBBLES BACKGROUND ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[2]">
        <div className="bubble-1 absolute rounded-full border-[1.5px] border-white/60 bg-gradient-to-br from-white/30 to-transparent backdrop-blur-xl shadow-[inset_0_0_60px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.05)] will-change-transform">
          <div className="absolute top-[12%] left-[18%] w-[25%] h-[12%] bg-white/90 rounded-[100%] rotate-[-30deg] blur-[2px]" />
          <div className="absolute bottom-[10%] right-[15%] w-[30%] h-[8%] bg-white/50 rounded-[100%] rotate-[-20deg] blur-[4px]" />
        </div>
        <div className="bubble-2 absolute rounded-full border-[1.5px] border-white/70 bg-gradient-to-bl from-white/40 to-transparent backdrop-blur-lg shadow-[inset_0_0_50px_rgba(255,255,255,0.8),0_15px_30px_rgba(0,0,0,0.05)] will-change-transform">
          <div className="absolute top-[15%] right-[20%] w-[20%] h-[10%] bg-white/90 rounded-[100%] rotate-[25deg] blur-[2px]" />
          <div className="absolute bottom-[15%] left-[15%] w-[25%] h-[8%] bg-white/40 rounded-[100%] rotate-[20deg] blur-[4px]" />
        </div>
        <div className="bubble-3 absolute rounded-full border-[1px] border-white/40 bg-gradient-to-tr from-white/20 to-transparent backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.7)] z-[-1] will-change-transform">
          <div className="absolute top-[10%] left-[25%] w-[20%] h-[8%] bg-white/80 rounded-[100%] rotate-[-15deg] blur-[2px]" />
        </div>
      </div>

      {/* ── PREMIUM SWISS BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div ref={bgRef} className="sticky top-0 left-0 w-full h-screen overflow-hidden" style={{ "--py": "0px" } as React.CSSProperties}>
          <div className="absolute inset-0 opacity-[0.035]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}/>
          <div className="absolute inset-0 opacity-[0.4]" style={{ 
            backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', 
            backgroundSize: '48px 48px',
            backgroundPosition: 'calc(var(--py) * 0.05) calc(var(--py) * 0.05)'
          }}/>
          <div className="absolute rounded-full bg-[#E8E8E8]" style={{ width: "80vh", height: "80vh", top: "-10vh", left: "-10vw", transform: "translateY(calc(var(--py) * 0.12))" }} />
          <div className="absolute rounded-full border-[15px] border-[#E0E0E0]" style={{ width: "60vh", height: "60vh", top: "50vh", left: "-15vw", transform: "translateY(calc(var(--py) * -0.08))" }} />

          <div className="s2-honeycomb absolute right-0 pointer-events-none z-[5]" style={{ top: "0px", width: "560px", height: "560px" }}>
            <svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMaxYMin meet" style={{ filter: "drop-shadow(-12px 20px 32px rgba(0,0,0,0.22))" }}>
              <defs><polygon id="hex" points="150,0 75,129.9 -75,129.9 -150,0 -75,-129.9 75,-129.9" /></defs>
              <g stroke="#FFFFFF" strokeWidth="28" strokeLinejoin="round" fill="#FFFFFF">
                <use href="#hex" x="265" y="257.9" /><use href="#hex" x="265" y="517.7" /><use href="#hex" x="490" y="128" /><use href="#hex" x="490" y="387.8" /><use href="#hex" x="490" y="647.6" /><use href="#hex" x="715" y="257.9" /><use href="#hex" x="715" y="517.7" />
              </g>
              <g strokeWidth="24" strokeLinejoin="round">
                <use href="#hex" x="265" y="257.9" fill="#18181B" stroke="#18181B" /><use href="#hex" x="265" y="517.7" fill="#27272A" stroke="#27272A" /><use href="#hex" x="490" y="128" fill="#27272A" stroke="#27272A" /><use href="#hex" x="490" y="387.8" fill="#0A0A0C" stroke="#0A0A0C" /><use href="#hex" x="490" y="647.6" fill="#1C1C1F" stroke="#1C1C1F" /><use href="#hex" x="715" y="257.9" fill="#080808" stroke="#080808" /><use href="#hex" x="715" y="517.7" fill="#18181B" stroke="#18181B" />
              </g>
              <circle cx="490" cy="387.8" r="45" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" strokeDasharray="5 5"/><circle cx="490" cy="387.8" r="28" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.2" /><rect x="487" y="384.8" width="6" height="6" fill="#FFFFFF" opacity="0.6"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="s2-ticker sticky top-0 left-0 w-full z-[100] bg-[#F7F7F7]/80 backdrop-blur-md" 
           style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", height: 44, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="ticker-inner flex whitespace-nowrap">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.48em", textTransform: "uppercase", color: "#22222291", padding: "0 44px" }}>
              {item}<span style={{ marginLeft: 44, color: "#22222291", fontSize: 6.5 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[20] max-w-[1440px] mx-auto px-6 md:px-12 pt-28">
        
        <div className="mb-10">
          <div className="s2-header-elem flex items-center gap-4 mb-7">
            <div style={{ width: 32, height: 1, background: "rgba(0,0,0,0.4)" }}/>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.6em", textTransform: "uppercase", color: "#000000" }}>Selected Work</p>
          </div>
          
          <div className="s2-header-elem flex items-end justify-between gap-8 flex-wrap relative">
            <h2 className="pl-[24px] md:pl-[48px]" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(60px,8vw,120px)", lineHeight: 0.85, color: "#080808", letterSpacing: "0.015em", zIndex: 10 }}>
              WHAT I<br/><span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(0,0,0,0.25)" }}>BUILD.</span>
            </h2>
          </div>
        </div>

        <div ref={deckRef} className="relative w-full flex flex-col" 
             style={{ gap: "10vh", paddingBottom: "30vh", "--stack-shift": "0px" } as React.CSSProperties}>
          
          {projects.map((p, i) => (
            <div key={p.num}
              className="s2-project-card sticky w-full flex flex-col"
              style={{
                top: `calc(76px + ${i * 100}px - var(--stack-shift, 0px))`,
                height: "calc(100vh - 108px)", 
                minHeight: "600px", 
                background: "#0A0A0C", 
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "0 0 0 10px #080808, 0 -20px 50px rgba(0,0,0,0.8)", 
                padding: "32px", 
                zIndex: i + 1, 
              }}>
              
              <div className="flex flex-col shrink-0 mb-6">
                <div className="flex justify-between items-center h-[58px] mb-2">
                  <div className="flex items-center gap-6">
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: "rgba(255,255,255,0.9)", lineHeight: 0.8 }}>{p.num}</span>
                    <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,3vw,48px)", letterSpacing: "0.04em", color: "#FFFFFF", lineHeight: 0.9 }}>{p.title}</h3>
                  </div>
                  <div className="flex gap-4">
                    <button data-cursor-expand style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid rgba(255,255,255,0.2)", color: "#FFF", borderRadius: "100px", background: "transparent", transition: "background 0.3s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>GITHUB</button>
                    <button data-cursor-expand style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid transparent", color: "#0A0A0C", borderRadius: "100px", background: "#FFF", transition: "transform 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>LIVE</button>
                  </div>
                </div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em", maxWidth: "60%", marginLeft: "78px" }}>{p.desc}</p>
              </div>

              <div className="flex gap-6 w-full flex-1 min-h-0">
                <div className="relative w-[70%] h-full rounded-[12px] overflow-hidden bg-[#121214] border border-[rgba(255,255,255,0.04)] flex items-center justify-center group" data-cursor-dark>
                  <img src={`/project${i + 1}.png`} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                     <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>{"// project" + (i + 1) + ".png"}</span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-[12px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] z-20" />
                </div>

                <div className="w-[30%] h-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-[12px] p-6 flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Tech Architecture</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: "0.1em", padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", borderRadius: "6px" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.05)" }}/>
                  <div className="flex-1">
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Core Functionality</p>
                    <ul className="flex flex-col gap-3">
                      {["Real-time data synchronization", "JWT Authentication Flow", "Optimized WebGL Rendering", "Responsive Fluid Layouts"].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="shrink-0" style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.4)", marginTop: 6 }} />
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}