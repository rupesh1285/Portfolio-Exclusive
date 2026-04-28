"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SceneOne({ clock, onReachBottom }: { clock: string, onReachBottom: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);
  const [isInitiating, setIsInitiating] = useState(false);

  // ── 1. THE CINEMATIC ENTRY ANIMATIONS ──
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Threshold 0.35 means 35% of the section MUST be visible before animating
      // This prevents the "too early" off-screen triggering
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // 1. Hero Reveal (Slow, majestic upward slide)
            if (el.classList.contains("anim-hero")) {
              gsap.to(el.querySelectorAll(".hero-line"), { 
                y: 0, opacity: 1, duration: 1.8, ease: "expo.out", stagger: 0.15 
              });
            }
            
            // 2. About Reveal (Graphic slides right, text cascades up)
            if (el.classList.contains("anim-about")) {
              // The 2D Core
              gsap.to(el.querySelector(".about-left"), { 
                x: 0, opacity: 1, duration: 1.8, ease: "expo.out", delay: 0.1 
              });
              // The Text cascading smoothly
              gsap.to(el.querySelectorAll(".about-right-line"), { 
                y: 0, opacity: 1, duration: 1.6, ease: "power3.out", stagger: 0.15, delay: 0.3 
              });
            }

            // 3. Philosophy Reveal (Deep, slow zoom and fade)
            if (el.classList.contains("anim-philosophy")) {
              gsap.to(el.querySelectorAll(".phil-line"), { 
                scale: 1, opacity: 1, duration: 2.2, ease: "power2.out", stagger: 0.25 
              });
            }

            observer.unobserve(el); // Only animate once
          }
        });
      }, { threshold: 0.35 }); 

      // Attach observer to our section wrappers
      document.querySelectorAll(".anim-section").forEach(sec => observer.observe(sec));

      return () => observer.disconnect();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── 2. THE AUTO-LOCK TRANSITION TRIGGER ──
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (hasTriggered.current) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // When the user hits the absolute bottom (Philosophy is perfectly centered)
    if (scrollTop > 100 && Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5) {
      hasTriggered.current = true;
      setIsInitiating(true); 
      
      // Physically lock the scrollbar so the user is trapped for the cinematic
      e.currentTarget.style.overflow = "hidden";

      // The 1.5 Second Dramatic Pause before the doors slam
      setTimeout(() => {
        onReachBottom();
      }, 1500);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden">
      
      {/* ── FIXED NAVBAR ── */}
      <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-9 pointer-events-none"
        style={{borderBottom:"1px solid rgba(175,175,175,0.05)"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:21,letterSpacing:"0.18em",color:"#DEDEDE"}} className="pointer-events-auto">RA.</div>
        <div className="flex gap-10 pointer-events-auto" style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.48em",textTransform:"uppercase"}}>
          {["Architecture","Projects","Contact"].map(n=>(
            <span key={n} data-cursor-expand style={{color:"rgba(195,195,195,0.36)",transition:"color 0.25s"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(225,225,225,0.88)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(195,195,195,0.36)";}}>{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 pointer-events-auto" style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(195,195,195,0.28)"}}>
          <div className="animate-status" style={{width:5,height:5,borderRadius:"50%",background:"#8A8A8A"}}/>
          Open to work
        </div>
      </nav>

      {/* ── FIXED STATS FOOTER ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 pointer-events-none" 
        style={{borderTop:"1px solid rgba(175,175,175,0.05)"}}>
        {[{n:"24+",l:"Projects Shipped"},{n:"18+",l:"Technologies"},{n:"3+",l:"Years Experience"}].map((s,i)=>(
          <div key={i} className="flex flex-col gap-[3px]">
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,lineHeight:1,color:"#D5D5D5"}}>{s.n}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.46em",textTransform:"uppercase",color:"rgba(190,190,190,0.26)"}}>{s.l}</span>
          </div>
        ))}
        <div style={{textAlign:"right" as const}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:"0.1em",color:"rgba(190,190,190,0.58)",display:"block"}}>{clock||"00:00:00"}</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(190,190,190,0.2)"}}>India Standard Time</span>
        </div>
      </div>

      {/* ── THE SCROLLABLE WINDOW ── */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll} 
        className="absolute inset-0 w-full h-full overflow-y-auto z-10" 
        style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
      >
        <div className="relative w-full flex flex-col pt-[100px]">
          
          {/* ════ SECTION 1: THE INTRO HERO ════ */}
          <div className="anim-section anim-hero relative w-full h-[85vh] flex items-center px-10 md:px-24 shrink-0">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              
              <div className="hero-line opacity-0 translate-y-16 flex items-center gap-4 mb-7">
                <div style={{width:35,height:1,background:"rgba(195,195,195,0.2)"}}/>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.56em",textTransform:"uppercase",color:"rgba(195,195,195,0.36)"}}>Full-Stack Engineer</p>
              </div>
              
              <div style={{overflow:"hidden",lineHeight:0.86,marginBottom:3}}>
                <h1 className="hero-line opacity-0 translate-y-[80px]" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(88px,10.5vw,158px)",letterSpacing:"0.025em",color:"#FFFFFF",display:"block"}}>RUPESH</h1>
              </div>
              <div style={{overflow:"hidden",lineHeight:0.86}}>
                <h1 className="hero-line opacity-0 translate-y-[80px]" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(88px,10.5vw,158px)",letterSpacing:"0.025em",color:"transparent",WebkitTextStroke:"1.5px rgba(215,215,215,0.3)",display:"block"}}>AGARWAL</h1>
              </div>
              
              <p className="hero-line opacity-0 translate-y-12" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(13px,1.1vw,17px)",fontStyle:"italic",fontWeight:300,color:"rgba(185,185,185,0.38)",lineHeight:1.85,marginTop:22,letterSpacing:"0.04em"}}>
                Decoding the future of interactive interfaces — specialised in high-performance web architecture.
              </p>
              
              <div className="hero-line opacity-0 translate-y-8 flex items-center gap-3 mt-11" style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.48em",textTransform:"uppercase",color:"rgba(185,185,185,0.18)"}}>
                <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",gap:3}}>
                  {[0,1,2].map(i=>(<div key={i} className="animate-scroll-drop" style={{width:1,height:10,background:"rgba(175,175,175,0.4)",animationDelay:`${i*0.28}s`}}/>))}
                </div>
                Scroll to initiate
              </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex items-center justify-center">
              <div className="hero-line opacity-0 translate-y-16 relative flex items-center justify-center pointer-events-none" style={{ width: "clamp(260px, 35vw, 480px)", height: "clamp(260px, 35vw, 480px)" }}>
                <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.03)] border-t-[rgba(255,255,255,0.25)] animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-[rgba(255,255,255,0.04)] border-l-[rgba(255,255,255,0.35)] animate-[spin_8s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-[rgba(255,255,255,0.05)] border-b-[rgba(255,255,255,0.5)] animate-[spin_16s_linear_infinite]" />
                <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_20px_4px_rgba(255,255,255,0.8)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
              </div>
            </div>
          </div>

          {/* ════ SECTION 2: THE ABOUT ════ */}
          <div className="anim-section anim-about relative w-full min-h-screen px-10 md:px-24 py-32 border-t border-[rgba(255,255,255,0.03)] flex flex-col justify-center">
            
            <div className="about-right-line opacity-0 translate-y-12 flex items-center gap-4 mb-20">
              <div style={{width:32,height:1,background:"rgba(195,195,195,0.2)"}}/>
              <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.56em",textTransform:"uppercase",color:"rgba(195,195,195,0.36)"}}>01. Identification</p>
            </div>

            <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
              
              {/* LEFT: 2D Component */}
              <div className="about-left opacity-0 -translate-x-[100px] w-full md:w-1/2 flex items-center justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                  <div className="absolute inset-0 border-[1px] border-dashed border-[rgba(255,255,255,0.15)] rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="absolute inset-8 border-[1px] border-[rgba(255,255,255,0.08)] animate-[spin_20s_linear_infinite_reverse]" />
                  <div className="absolute inset-16 border-[1px] border-[rgba(255,255,255,0.2)] rounded-full border-t-transparent border-b-transparent animate-[spin_10s_linear_infinite]" />
                  <div className="absolute w-12 h-12 bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.3)] shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-pulse" style={{ transform: "rotate(45deg)" }} />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-[rgba(255,255,255,0.2)]" />
                  <span className="absolute -bottom-8 font-mono text-[9px] tracking-[0.3em] text-[rgba(255,255,255,0.2)]">SYS.CORE // V2.0.4</span>
                </div>
              </div>

              {/* RIGHT: Cascading Text Bio */}
              <div className="w-full md:w-1/2 flex flex-col">
                <h2 className="about-right-line opacity-0 translate-y-12" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,5vw,80px)",lineHeight:0.9,color:"#FFFFFF",letterSpacing:"0.02em", marginBottom: 24}}>
                   ENGINEERING <br/>
                   <span style={{color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.4)"}}>THE UNSEEN.</span>
                </h2>
                <p className="about-right-line opacity-0 translate-y-12" style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.8, marginBottom: 24}}>
                  I am a Full-Stack Software Engineer focused on building robust, scalable architectures and merging them with highly interactive, cinematic frontend experiences. 
                </p>
                <p className="about-right-line opacity-0 translate-y-12" style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.8}}>
                  Currently pursuing a B.Tech in Computer Science at IIIT Sonepat. My work heavily involves the MERN stack, WebGL, and complex system automation.
                </p>

                <div className="about-right-line opacity-0 translate-y-12 grid grid-cols-2 gap-6 mt-16 pt-12 border-t border-[rgba(255,255,255,0.05)]">
                  <div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"#FFF",display:"block",marginBottom:8}}>System Architecture</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.5}}>Designing resilient backends with Node.js and PostgreSQL.</span>
                  </div>
                  <div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"#FFF",display:"block",marginBottom:8}}>Fluid Interfaces</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.3)",lineHeight:1.5}}>Crafting zero-lag UI with React, Next.js, and GSAP.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ════ SECTION 3: THE PHILOSOPHY (Auto-Trigger) ════ */}
          {/* Removed the extra padding. This is exactly 100vh tall and sits at the dead bottom. */}
          <div className="anim-section anim-philosophy relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center px-10 overflow-hidden">
             
             <div className="max-w-4xl mx-auto text-center relative z-10">
               
               <div className="phil-line opacity-0 scale-95 flex items-center justify-center gap-4 mb-10">
                 <div style={{width:20,height:1,background:"rgba(195,195,195,0.2)"}}/>
                 <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.5em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>The Philosophy</p>
                 <div style={{width:20,height:1,background:"rgba(195,195,195,0.2)"}}/>
               </div>
               
               <h2 className="phil-line opacity-0 scale-95" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(50px,7vw,100px)",lineHeight:0.9,color:"#FFFFFF",letterSpacing:"0.02em"}}>
                  CODE IS <span style={{color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.4)"}}>POETRY.</span><br/>
                  SYSTEMS ARE <span style={{color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.4)"}}>ART.</span>
               </h2>
               
               <p className="phil-line opacity-0 scale-95" style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:40,lineHeight:1.8,maxWidth:"600px",marginLeft:"auto",marginRight:"auto"}}>
                 I bridge the gap between heavy backend architecture and fluid, cinematic frontend experiences. Every pixel is calculated. Every millisecond is optimized.
               </p>
               
               {/* The Sequence Initiator UI: Appears exactly when the section hits the center and locks */}
               <div className={`mt-16 mx-auto flex flex-col items-center transition-opacity duration-700 ${isInitiating ? "opacity-100" : "opacity-0"}`}>
                 <p style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.4em",color:"#FFF",marginBottom:12}}>INITIATING SEQUENCE</p>
                 <div className="w-[1px] h-16 bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full bg-white origin-top" 
                        style={{ 
                          height: "100%", 
                          transform: isInitiating ? "scaleY(1)" : "scaleY(0)", 
                          transition: "transform 1.4s linear" 
                        }} 
                   />
                 </div>
               </div>
             
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}