"use client";

import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════
   PRECISION CURSOR
════════════════════════════════════════════════════════════ */
function PrecisionCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const st = useRef({ mx:-200,my:-200,rx:-200,ry:-200,gx:-200,gy:-200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      st.current.mx = e.clientX; st.current.my = e.clientY;
      if (dotRef.current) { dotRef.current.style.left=e.clientX+"px"; dotRef.current.style.top=e.clientY+"px"; }
    };
    let raf = 0;
    const tick = () => {
      const s = st.current;
      s.rx += (s.mx-s.rx)*0.1;  s.ry += (s.my-s.ry)*0.1;
      s.gx += (s.mx-s.gx)*0.05; s.gy += (s.my-s.gy)*0.05;
      if (ringRef.current)  { ringRef.current.style.left=s.rx+"px";  ringRef.current.style.top=s.ry+"px";  }
      if (ghostRef.current) { ghostRef.current.style.left=s.gx+"px"; ghostRef.current.style.top=s.gy+"px"; }
      raf = requestAnimationFrame(tick);
    };
    const xl = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"60px",height:"60px",borderColor:"rgba(200,200,200,0.7)",background:"rgba(200,200,200,0.04)"}); };
    const xd = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"60px",height:"60px",borderColor:"rgba(18,18,18,0.55)",background:"rgba(18,18,18,0.04)"}); };
    const ct = () => { if(!ringRef.current)return; Object.assign(ringRef.current.style,{width:"30px",height:"30px",borderColor:"rgba(180,180,180,0.42)",background:"transparent"}); };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.querySelectorAll("[data-cursor-expand]").forEach(el=>{el.addEventListener("mouseenter",xl);el.addEventListener("mouseleave",ct);});
    document.querySelectorAll("[data-cursor-dark]").forEach(el=>{el.addEventListener("mouseenter",xd);el.addEventListener("mouseleave",ct);});
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ghostRef} className="fixed pointer-events-none z-[9990]" style={{width:52,height:52,borderRadius:"50%",border:"1px solid rgba(165,165,165,0.09)",transform:"translate(-50%,-50%)"}}/>
      <div ref={ringRef}  className="fixed pointer-events-none z-[9995]" style={{width:30,height:30,borderRadius:"50%",border:"1px solid rgba(180,180,180,0.42)",transform:"translate(-50%,-50%)",transition:"width 0.45s cubic-bezier(0.16,1,0.3,1),height 0.45s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,background 0.3s"}}/>
      <div ref={dotRef}   className="fixed pointer-events-none z-[9999]" style={{width:4,height:4,borderRadius:"50%",background:"#FFF",transform:"translate(-50%,-50%)",mixBlendMode:"difference"}}/>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   NODE GRID — (For White Scene)
════════════════════════════════════════════════════════════ */
function NodeGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x:-9999, y:-9999 });

  useEffect(()=>{
    const onMove=(e:MouseEvent)=>{mouseRef.current={x:e.clientX,y:e.clientY};};
    window.addEventListener("mousemove",onMove);
    return()=>window.removeEventListener("mousemove",onMove);
  },[]);

  useEffect(()=>{
    const el=canvasRef.current; if(!el)return;
    const canvas=el as HTMLCanvasElement;
    const ctx=canvas.getContext("2d",{alpha:true}) as CanvasRenderingContext2D;
    let W=0,H=0,raf=0;
    const GAP=62;
    interface Node{x:number;y:number;baseR:number;phase:number;}
    let nodes:Node[]=[]; let gridCache:HTMLCanvasElement|null=null;
    function resize(){
      W=canvas.width=canvas.parentElement!.offsetWidth;
      H=canvas.height=canvas.parentElement!.offsetHeight;
      const COLS=Math.ceil(W/GAP)+1,ROWS=Math.ceil(H/GAP)+1;
      nodes=[];
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)
        nodes.push({x:c*GAP,y:r*GAP,baseR:1.0+Math.random()*0.7,phase:Math.random()*Math.PI*2});
      gridCache=document.createElement("canvas"); gridCache.width=W; gridCache.height=H;
      const gc=gridCache.getContext("2d")!;
      gc.strokeStyle="rgba(0,0,0,0.036)"; gc.lineWidth=0.4;
      for(let x=0;x<W;x+=GAP){gc.beginPath();gc.moveTo(x,0);gc.lineTo(x,H);gc.stroke();}
      for(let y=0;y<H;y+=GAP){gc.beginPath();gc.moveTo(0,y);gc.lineTo(W,y);gc.stroke();}
    }
    resize(); window.addEventListener("resize",resize);
    let t=0;
    function draw(){
      ctx.clearRect(0,0,W,H); t+=0.018;
      const{x:mx,y:my}=mouseRef.current;
      if(gridCache)ctx.drawImage(gridCache,0,0);
      for(const n of nodes){
        const dm=Math.hypot(n.x-mx,n.y-my);
        const prox=Math.max(0,(190-dm)/190);
        const pulse=0.4+0.6*Math.abs(Math.sin(t+n.phase));
        const r=n.baseR*(1+prox*2.6);
        if(prox>0.05){
          const gr=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*5);
          gr.addColorStop(0,`rgba(0,0,0,${prox*0.09})`);gr.addColorStop(1,"rgba(0,0,0,0)");
          ctx.beginPath();ctx.arc(n.x,n.y,r*5,0,Math.PI*2);ctx.fillStyle=gr;ctx.fill();
        }
        ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,0,0,${0.09+prox*0.48+pulse*0.04})`;ctx.fill();
      }
      const AD=195,CD=GAP*1.5; ctx.lineWidth=0.4;
      for(let i=0;i<nodes.length;i++){
        const a=nodes[i]; if(Math.hypot(a.x-mx,a.y-my)>AD)continue;
        for(let j=i+1;j<nodes.length;j++){
          const b=nodes[j];
          if(Math.abs(a.x-b.x)>CD||Math.abs(a.y-b.y)>CD)continue;
          const d=Math.hypot(a.x-b.x,a.y-b.y); if(d>CD)continue;
          const near=Math.max(0,(AD-Math.min(Math.hypot(a.x-mx,a.y-my),Math.hypot(b.x-mx,b.y-my)))/AD);
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,0,0,${near*0.12})`;ctx.stroke();
        }
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return()=>{window.removeEventListener("resize",resize);cancelAnimationFrame(raf);};
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"/>;
}

/* ════════════════════════════════════════════════════════════
   HUD SCROLLBAR
════════════════════════════════════════════════════════════ */
function HudScrollbar() {
  return (
    <div className="fixed right-7 top-1/2 -translate-y-1/2 z-[9000] pointer-events-none"
      style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10,height:300}}>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(160,160,160,0.45)",marginBottom:4}}>01</span>
      <div style={{width:1,flex:1,background:"rgba(150,150,150,0.16)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",
          background:"linear-gradient(to bottom,rgba(180,180,180,0.45),rgba(255,255,255,0.8))",
          transformOrigin:"top",transform:"scaleY(var(--scroll-total,0))",transition:"transform 0.06s linear"}}/>
      </div>
      <div className="hud-dot" style={{width:3,height:3,borderRadius:"50%",background:"rgba(200,200,200,0.55)"}}/>
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:"0.4em",textTransform:"uppercase",color:"rgba(160,160,160,0.45)",marginTop:4}}>03</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SCENE 2 — WHITE (Honeycomb Crest + Slashed Architecture)
════════════════════════════════════════════════════════════ */
function SceneTwo() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const deckRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // 1. OBSERVER FOR ANIMATIONS
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("in-view"); }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    refs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  const ref = (i: number) => (el: HTMLElement | null) => { refs.current[i] = el; };

  /* 🛑🛑🛑 CRITICAL LOCK: CATERPILLAR MATH ENGINE 🛑🛑🛑 */
  useEffect(() => {
    const scrollParent = deckRef.current?.closest('.overflow-y-auto') || window;

    const onScroll = () => {
      if (!deckRef.current) return;
      
      const vh = window.innerHeight;
      const rect = deckRef.current.getBoundingClientRect();
      
      const TICKER_H = 44;
      const TITLE_OFFSET = 90; 
      const CARD_H = Math.max(vh * 0.70, 550); 
      const SAFE_BOTTOM = vh * 0.95; 

      const scrolledPast = Math.max(0, TICKER_H - rect.top);
      const SPACING = CARD_H + (vh * 0.10); 
      const t = scrolledPast / SPACING; 
      const N = projects.length;

      const maxShift = (idx: number) => Math.max(0, TICKER_H + idx * TITLE_OFFSET + CARD_H - SAFE_BOTTOM);

      let shift = 0;
      
      for (let i = 0; i < N; i++) {
        if (t >= i) {
          shift = maxShift(i);
        } else if (t > i - 1) {
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
  /* 🛑🛑🛑 END CRITICAL LOCK 🛑🛑🛑 */

  // 2. THE SWISS PARALLAX ENGINE
  useEffect(() => {
    const scrollParent = deckRef.current?.closest('.overflow-y-auto') || window;
    const onScrollBg = () => {
      if (!bgRef.current) return;
      const st = scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
      bgRef.current.style.setProperty('--py', `${st}px`);
    };
    
    scrollParent.addEventListener("scroll", onScrollBg, { passive: true });
    onScrollBg(); 
    return () => scrollParent.removeEventListener("scroll", onScrollBg);
  }, []);

  const projects = [
    { num: "01", title: "Finalist", tags: ["Next.js", "WebGL", "Algorithms"], desc: "Advanced workspace for software engineers to practice coding algorithms with a high-performance UI.", link: "#" },
    { num: "02", title: "Imagination", tags: ["React", "E-Commerce", "Animations"], desc: "An experiential gifting platform curating bespoke, premium presents through seamless cinematic interactions.", link: "#" },
    { num: "03", title: "Formatter.AI", tags: ["Python", "React", "Automation"], desc: "Intelligent code management engine handling indentation, deduplication, and syntax formatting.", link: "#" },
    { num: "04", title: "NeuralCommerce", tags: ["Node.js", "ML", "PostgreSQL"], desc: "AI-driven e-commerce engine with real-time personalisation at scale.", link: "#" },
    { num: "05", title: "ArchitectOS", tags: ["Three.js", "React", "WebGL"], desc: "3D building visualisation platform used by 40+ architectural firms worldwide.", link: "#" },
  ];

  const ticker = ["Full-Stack Engineering", "Interactive Interfaces", "Real-Time Systems", "3D Web Experiences", "Performance Architecture"];

  // Helper component to render perfect Hexagons inline
  const Hex = ({ cx, cy, type }: { cx: number, cy: number, type: string }) => {
    const pts = "50,5 93,25 93,75 50,95 7,75 7,25"; // Mathematically precise hexagon coordinates
    const isFilled = type.includes('fill');
    const isBlack = type.includes('black');
    return (
      <svg className="absolute" style={{ left: cx, top: cy, width: 22, height: 22 }} viewBox="0 0 100 100">
        <polygon points={pts}
                 fill={isFilled ? (isBlack ? '#080808' : '#B0B0B0') : 'none'}
                 stroke={!isFilled ? (isBlack ? '#080808' : '#B0B0B0') : 'none'}
                 strokeWidth={!isFilled ? 8 : 0} />
      </svg>
    );
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-clip" style={{ backgroundColor: "#F7F7F7" }}>
      
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

          {/* Left Side Giant Geometry */}
          <div className="absolute rounded-full bg-[#E8E8E8]" 
               style={{ width: "80vh", height: "80vh", top: "-10vh", left: "-10vw", transform: "translateY(calc(var(--py) * 0.12))" }} />
          
          <div className="absolute rounded-full border-[15px] border-[#E0E0E0]" 
               style={{ width: "60vh", height: "60vh", top: "50vh", left: "-15vw", transform: "translateY(calc(var(--py) * -0.08))" }} />

        </div>
      </div>

      {/* ── STICKY TICKER STRIP ── */}
      <div className="sticky top-0 left-0 w-full z-[100] bg-[#F7F7F7]/80 backdrop-blur-md" 
           style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", height: 44, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="ticker-inner flex whitespace-nowrap">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.48em", textTransform: "uppercase", color: "#22222291", padding: "0 44px" }}>
              {item}<span style={{ marginLeft: 44, color: "#22222291", fontSize: 6.5 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-[20] max-w-[1440px] mx-auto px-6 md:px-12 pt-16">
        
        {/* Header Section */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-7">
            <div style={{ width: 32, height: 1, background: "rgba(0,0,0,0.4)" }}/>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.6em", textTransform: "uppercase", color: "#000000" }}>Selected Work</p>
          </div>
          
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(60px,8vw,120px)", lineHeight: 0.85, color: "#080808", letterSpacing: "0.015em" }}>
              WHAT I<br/><span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(0,0,0,0.25)" }}>BUILD.</span>
            </h2>
            
            {/* ── THE RIGHT-SIDE ARCHITECTURAL CLUSTER ── */}
            <div className="flex flex-col items-end w-full max-w-[420px]">
              
              {/* 1. The Hexagon Honeycomb (Hanging in a tight lattice) */}
              <div className="relative w-[122px] h-[60px] mb-3 mr-4 pointer-events-none">
                 <Hex cx={40} cy={0} type="fill-black" />
                 <Hex cx={80} cy={0} type="outline-grey" />
                 <Hex cx={20} cy={16} type="outline-black" />
                 <Hex cx={60} cy={16} type="fill-grey" />
                 <Hex cx={100} cy={16} type="fill-black" />
                 <Hex cx={40} cy={32} type="fill-grey" />
                 <Hex cx={80} cy={32} type="outline-black" />
              </div>

              {/* 2. Slashed Thick Lines & Shadows (Touching right edge) */}
              <div className="flex flex-col items-end w-full mb-6 pointer-events-none">
                  
                  {/* Upper Line: Thick, Pointy Edge ( <==== ) */}
                  <div className="relative w-[340px] h-[34px] mb-2 right-[-24px] md:right-[-48px]"> 
                      {/* Grey Shadow (offset bottom right) */}
                      <div className="absolute top-[8px] right-0 w-full h-[26px] bg-[#B0B0B0]" 
                           style={{ clipPath: "polygon(24px 50%, 48px 0, 100% 0, 100% 100%, 48px 100%)" }} />
                      {/* Deep Black Main Line */}
                      <div className="absolute top-0 right-[6px] w-full h-[26px] bg-[#080808]" 
                           style={{ clipPath: "polygon(0 50%, 24px 0, 100% 0, 100% 100%, 24px 100%)" }} />
                  </div>
                  
                  {/* Lower Line: Thinner, Slanted Edge ( \==== ) */}
                  <div className="relative w-[260px] h-[24px] right-[-24px] md:right-[-48px]">
                      {/* Grey Shadow */}
                      <div className="absolute top-[6px] right-0 w-full h-[18px] bg-[#B0B0B0]" 
                           style={{ clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%)" }} />
                      {/* Deep Black Main Line */}
                      <div className="absolute top-0 right-[6px] w-full h-[18px] bg-[#080808]" 
                           style={{ clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%)" }} />
                  </div>

              </div>

              {/* 3. The Grey Aesthetic Text Box (SVG Powered) */}
              <div className="relative w-full max-w-[380px] p-[20px_36px_20px_24px]">
                {/* SVG generates the exact angled grey box + custom black borders */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                   
                   {/* Solid Grey Background with Slashed Right Edge */}
                   <polygon points="0,0 100,0 88,100 0,100" fill="#E2E2E2" />
                   
                   {/* Full Black Bottom Border + Slashed Right Border */}
                   <polyline points="0,100 88,100 100,0" fill="none" stroke="#080808" strokeWidth="4" vectorEffect="non-scaling-stroke" />
                   
                   {/* The "Semi" border - small accent cuts on the bottom left edge */}
                   <line x1="0" y1="85" x2="0" y2="100" stroke="#080808" strokeWidth="6" vectorEffect="non-scaling-stroke" />
                   <line x1="0" y1="100" x2="15" y2="100" stroke="#080808" strokeWidth="6" vectorEffect="non-scaling-stroke" />
                   
                </svg>

                <p className="relative z-10 text-right" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(15px,1.4vw,19px)", fontStyle: "italic", fontWeight: 500, lineHeight: 1.6, color: "#111111" }}>
                  Engineering robust platforms and cinematic web experiences.
                </p>
              </div>

            </div>
            {/* ── END RIGHT ARCHITECTURAL CLUSTER ── */}

          </div>
        </div>

        {/* 🛑🛑🛑 CRITICAL LOCK: PROJECT CATERPILLAR JSX 🛑🛑🛑 */}
        <div ref={deckRef} className="relative w-full flex flex-col" 
             style={{ gap: "10vh", paddingBottom: "30vh", "--stack-shift": "0px" } as React.CSSProperties}>
          
          {projects.map((p, i) => (
            <div key={p.num}
              className="sticky w-full flex flex-col"
              style={{
                top: `calc(44px + ${i * 90}px - var(--stack-shift, 0px))`,
                height: "70vh", 
                minHeight: "550px", 
                background: "#0A0A0C", 
                borderRadius: "32px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 -20px 50px rgba(0,0,0,0.8)", 
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

                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", letterSpacing: "0.03em", maxWidth: "60%", marginLeft: "78px" }}>
                  {p.desc}
                </p>
              </div>

              <div className="flex gap-6 w-full flex-1 min-h-0">
                
                <div className="relative w-[70%] h-full rounded-[20px] overflow-hidden bg-[#121214] border border-[rgba(255,255,255,0.04)] flex items-center justify-center group" data-cursor-dark>
                  <img src={`/project${i + 1}.png`} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                     <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                       {"// project" + (i + 1) + ".png"}
                     </span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none rounded-[20px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] z-20" />
                </div>

                <div className="w-[30%] h-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-[20px] p-6 flex flex-col gap-6 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
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

/* ════════════════════════════════════════════════════════════
   SCENE 3 — DEEP CHARCOAL (Skills + Certifications)
════════════════════════════════════════════════════════════ */
function SceneThree() {
  const refs = useRef<(HTMLElement|null)[]>([]);
  useEffect(()=>{
    const obs=new IntersectionObserver(
      entries=>entries.forEach(e=>{if(e.isIntersecting)(e.target as HTMLElement).classList.add("in-view");}),
      {threshold:0.07,rootMargin:"0px 0px -40px 0px"}
    );
    refs.current.forEach(el=>{if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);
  const ref=(i:number)=>(el:HTMLElement|null)=>{refs.current[i]=el;};

  const skills=[
    {cat:"Frontend",  pct:92, items:["React / Next.js","TypeScript","Three.js","WebGL","GSAP"]},
    {cat:"Backend",   pct:85, items:["Node.js","PostgreSQL","Redis","GraphQL","REST"]},
    {cat:"Toolchain", pct:78, items:["Docker","Vercel","AWS","Figma","CI/CD"]},
    {cat:"Creative",  pct:80, items:["Canvas API","WebGL Shaders","Framer Motion","GSAP"]},
  ];
  const certs=[
    {name:"Meta Front-End Developer",  issuer:"Meta / Coursera",     year:"2024",badge:"MF"},
    {name:"AWS Cloud Practitioner",    issuer:"Amazon Web Services",  year:"2023",badge:"AW"},
    {name:"Google UX Design",          issuer:"Google / Coursera",    year:"2023",badge:"GU"},
    {name:"MongoDB Developer Path",    issuer:"MongoDB University",   year:"2022",badge:"MG"},
  ];
  const tickerItems=["React","Next.js","TypeScript","Node.js","PostgreSQL","Redis","WebGL","Three.js","Docker","GraphQL","AWS","Figma"];

  return (
    <div className="relative w-full overflow-hidden min-h-screen" style={{background:"#111318"}}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`repeating-linear-gradient(-45deg,transparent 0,transparent 38px,rgba(255,255,255,0.007) 38px,rgba(255,255,255,0.007) 39px)`,
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 55% at 50% 0%,rgba(255,255,255,0.018) 0%,transparent 65%)",
      }}/>

      <div className="relative overflow-hidden" style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"13px 0"}}>
        <div className="ticker-rev">
          {[...tickerItems,...tickerItems,...tickerItems,...tickerItems].map((item,i)=>(
            <span key={i} style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.52em",textTransform:"uppercase",color:"rgba(255,255,255,0.16)",padding:"0 36px"}}>
              {item}<span style={{marginLeft:36,color:"rgba(255,255,255,0.07)"}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-[1180px] mx-auto px-12 pt-20 pb-24">
        <div ref={ref(0) as (el:HTMLDivElement|null)=>void} className="s3-left mb-20">
          <div className="flex items-center gap-4 mb-12">
            <div style={{width:32,height:1,background:"rgba(255,255,255,0.15)"}}/>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.6em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Skills &amp; Stack</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"40px 60px"}}>
            {skills.map((s,si)=>(
              <div key={s.cat} ref={ref(si+1) as (el:HTMLDivElement|null)=>void} className="s3-reveal" style={{transitionDelay:`${si*90}ms`}}>
                <div className="flex items-center justify-between mb-3">
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:"0.04em",color:"rgba(228,228,234,0.85)"}}>{s.cat}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.25em",color:"rgba(175,175,185,0.5)"}}>{s.pct}%</span>
                </div>
                <div style={{height:1,background:"rgba(255,255,255,0.08)",marginBottom:12,position:"relative"}}>
                  <div className="skill-bar" style={{position:"absolute",top:0,left:0,height:"100%",width:`${s.pct}%`,background:"linear-gradient(to right,rgba(175,175,185,0.5),rgba(228,228,238,0.9))",animationDelay:`${0.5+si*0.15}s`}}/>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map(item=>(
                    <span key={item} data-cursor-expand
                      style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.25em",padding:"4px 10px",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(195,195,208,0.65)",transition:"border-color 0.25s,color 0.25s"}}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(200,200,210,0.38)";el.style.color="rgba(228,228,238,0.9)";}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,0.1)";el.style.color="rgba(195,195,208,0.65)";}}
                    >{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{height:1,background:"linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent)",marginBottom:52}}/>

        <div ref={ref(5) as (el:HTMLDivElement|null)=>void} className="s3-left">
          <div className="flex items-center gap-4 mb-12">
            <div style={{width:32,height:1,background:"rgba(255,255,255,0.15)"}}/>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.6em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Certifications</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {certs.map((c,ci)=>(
              <div key={c.name} ref={ref(ci+6) as (el:HTMLDivElement|null)=>void}
                data-cursor-expand className="s3-reveal cert-card"
                style={{transitionDelay:`${ci*80}ms`,display:"flex",alignItems:"center",gap:18,padding:"20px 22px",border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.018)"}}>
                <div style={{width:44,height:44,flexShrink:0,border:"1px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:15,letterSpacing:"0.06em",color:"rgba(198,198,210,0.7)"}}>
                  {c.badge}
                </div>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:"rgba(218,218,228,0.82)",letterSpacing:"0.03em",marginBottom:4}}>{c.name}</p>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:"rgba(155,155,168,0.5)",letterSpacing:"0.25em",textTransform:"uppercase"}}>{c.issuer} · {c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref(10) as (el:HTMLDivElement|null)=>void} className="s3-reveal mt-20 flex justify-between items-center"
          style={{transitionDelay:"80ms",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:22}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Rupesh Agarwal © 2025</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Full-Stack Engineer — India</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IST CLOCK
════════════════════════════════════════════════════════════ */
function useClock() {
  const [t, setT] = useState("");
  useEffect(()=>{
    const tick=()=>{
      const now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Kolkata"}));
      setT(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
    };
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  },[]);
  return t;
}

/* ════════════════════════════════════════════════════════════
   ROOT PAGE — STICKY CURTAIN SNAP ARCHITECTURE
════════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════
   ROOT PAGE — CUSTOM JS SCROLL ENGINE
════════════════════════════════════════════════════════════ */
export default function Home() {
  const clock = useClock();

  // 0 = Black Scene, 1 = White Scene, 2 = Charcoal Scene
  const [activeScene, setActiveScene] = useState(0); 
  const isAnimating = useRef(false);
  const s1Ref = useRef<HTMLDivElement>(null); // White scroll container
  const s2Ref = useRef<HTMLDivElement>(null); // Charcoal scroll container

  // The Custom Wheel Engine
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 1. If an animation is currently happening, block all scrolling
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      // 2. We are on the Black Scene
      if (activeScene === 0) {
        if (e.deltaY > 15) { // Scroll Down
          e.preventDefault();
          transitionTo(1);
        }
      } 
      // 3. We are on the White Scene
      else if (activeScene === 1) {
        const el = s1Ref.current;
        if (!el) return;
        
        const atTop = el.scrollTop <= 0;
        const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 5;

        // If at the top and scrolling up -> Go to Black Scene
        if (e.deltaY < -15 && atTop) {
          e.preventDefault();
          transitionTo(0);
        } 
        // If at the bottom and scrolling down -> Go to Charcoal Scene
        else if (e.deltaY > 15 && atBottom) {
          e.preventDefault();
          transitionTo(2);
        }
        // Otherwise, allow normal scrolling inside the white scene
      } 
      // 4. We are on the Charcoal Scene
      else if (activeScene === 2) {
        const el = s2Ref.current;
        if (!el) return;
        
        const atTop = el.scrollTop <= 0;
        // If at the top and scrolling up -> Go back to White Scene
        if (e.deltaY < -15 && atTop) {
          e.preventDefault();
          transitionTo(1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeScene]);

  // Handle the single-flow lock
  const transitionTo = (sceneIndex: number) => {
    isAnimating.current = true;
    setActiveScene(sceneIndex);
    // Lock the screen for exactly 1 second while the CSS transition plays out
    setTimeout(() => {
      isAnimating.current = false;
    }, 1000); 
  };

  return (
    <>
      <PrecisionCursor/>
      <HudScrollbar/>

      <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">

        {/* ══ SCENE 0: BLACK HERO (Always at the back) ═══════════════ */}
        <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-center">
          {/* NAV */}
          <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-9"
            style={{borderBottom:"1px solid rgba(175,175,175,0.05)"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:21,letterSpacing:"0.18em",color:"#DEDEDE"}}>RA.</div>
            <div className="flex gap-10" style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.48em",textTransform:"uppercase"}}>
              {["Architecture","Projects","Contact"].map(n=>(
                <span key={n} data-cursor-expand style={{color:"rgba(195,195,195,0.36)",transition:"color 0.25s"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(225,225,225,0.88)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(195,195,195,0.36)";}}>{n}</span>
              ))}
            </div>
            <div className="flex items-center gap-2"
              style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(195,195,195,0.28)"}}>
              <div className="animate-status" style={{width:5,height:5,borderRadius:"50%",background:"#8A8A8A"}}/>
              Open to work
            </div>
          </nav>

          {/* HERO CONTENT */}
          <div className="relative z-10 flex h-full w-full items-center px-10 md:px-24 pt-16">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="animate-fade-rise flex items-center gap-4 mb-7">
                <div style={{width:35,height:1,background:"rgba(195,195,195,0.2)"}}/>
                <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.56em",textTransform:"uppercase",color:"rgba(195,195,195,0.36)"}}>Full-Stack Engineer</p>
              </div>
              <div style={{overflow:"hidden",lineHeight:0.86,marginBottom:3}}>
                <h1 className="animate-name-1" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(88px,10.5vw,158px)",letterSpacing:"0.025em",color:"#FFFFFF",display:"block"}}>RUPESH</h1>
              </div>
              <div style={{overflow:"hidden",lineHeight:0.86}}>
                <h1 className="animate-name-2" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(88px,10.5vw,158px)",letterSpacing:"0.025em",color:"transparent",WebkitTextStroke:"1.5px rgba(215,215,215,0.3)",display:"block"}}>AGARWAL</h1>
              </div>
              <p className="animate-fade-rise-2" style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(13px,1.1vw,17px)",fontStyle:"italic",fontWeight:300,color:"rgba(185,185,185,0.38)",lineHeight:1.85,marginTop:22,letterSpacing:"0.04em"}}>
                Decoding the future of interactive interfaces — specialised in high-performance web architecture.
              </p>
              <div className="animate-fade-rise-3 flex items-center gap-3 mt-11"
                style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.48em",textTransform:"uppercase",color:"rgba(185,185,185,0.18)"}}>
                <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",gap:3}}>
                  {[0,1,2].map(i=>(<div key={i} className="animate-scroll-drop" style={{width:1,height:10,background:"rgba(175,175,175,0.4)",animationDelay:`${i*0.28}s`}}/>))}
                </div>
                Scroll to explore
              </div>
            </div>

            {/* MINIMALIST ZERO-LAG COMPASS ASSET */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center">
              <div className="relative flex items-center justify-center pointer-events-none"
                style={{ width: "clamp(260px, 35vw, 480px)", height: "clamp(260px, 35vw, 480px)" }}>
                <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.03)] border-t-[rgba(255,255,255,0.25)] animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-[rgba(255,255,255,0.04)] border-l-[rgba(255,255,255,0.35)] animate-[spin_8s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-[rgba(255,255,255,0.05)] border-b-[rgba(255,255,255,0.5)] animate-[spin_16s_linear_infinite]" />
                <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_20px_4px_rgba(255,255,255,0.8)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="animate-fade-rise-4 absolute bottom-0 left-0 right-0 flex items-center justify-between px-12 py-5"
            style={{borderTop:"1px solid rgba(175,175,175,0.05)"}}>
            {[{n:"24+",l:"Projects Shipped",cls:"stat-num stat-num-1"},{n:"18+",l:"Technologies",cls:"stat-num stat-num-2"},{n:"3+",l:"Years Experience",cls:"stat-num stat-num-3"}].map((s,i)=>(
              <div key={i} className="flex flex-col gap-[3px]" style={{overflow:"hidden"}}>
                <span className={s.cls} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,lineHeight:1,color:"#D5D5D5",display:"block"}}>{s.n}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.46em",textTransform:"uppercase",color:"rgba(190,190,190,0.26)"}}>{s.l}</span>
              </div>
            ))}
            <div style={{textAlign:"right" as const}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:"0.1em",color:"rgba(190,190,190,0.58)",display:"block"}}>{clock||"00:00:00"}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(190,190,190,0.2)"}}>India Standard Time</span>
            </div>
          </div>
        </div>

        {/* ══ SCENE 1: WHITE WORLD (Bottom Left Corner Reveal) ═══════ */}
        <div 
          ref={s1Ref}
          className="absolute inset-0 w-full h-full z-10 overflow-y-auto"
          style={{ 
            clipPath: activeScene >= 1 ? "circle(150% at 0% 100%)" : "circle(0% at 0% 100%)",
            transition: "clip-path 1s cubic-bezier(0.65, 0, 0.05, 1)",
            pointerEvents: activeScene >= 1 ? "auto" : "none",
            scrollbarWidth: "none",
          }}>
          {/* THE FIX: Pass the scrollRef here! */}
          <SceneTwo scrollRef={s1Ref} /> 
        </div>

        {/* ══ SCENE 2: CHARCOAL ENGINE ROOM (Slides Up) ══════════════ */}
        <div 
          ref={s2Ref}
          className="absolute inset-0 w-full h-full z-20 overflow-y-auto"
          style={{ 
            transform: activeScene === 2 ? "translateY(0%)" : "translateY(100%)",
            transition: "transform 1s cubic-bezier(0.65, 0, 0.05, 1)",
            pointerEvents: activeScene === 2 ? "auto" : "none",
            boxShadow: "0 -30px 80px rgba(0,0,0,0.9)",
            scrollbarWidth: "none",
          }}>
          <SceneThree/>
        </div>

      </div>
    </>
  );
}