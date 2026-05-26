"use client";

import { useEffect, useRef, useState } from "react";

export default function SceneThree() {
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLElement|null)[]>([]);
  const [terminalText, setTerminalText] = useState("");

  useEffect(()=>{
    const obs=new IntersectionObserver(
      entries=>entries.forEach(e=>{if(e.isIntersecting)(e.target as HTMLElement).classList.add("in-view");}),
      {
        threshold: 0.07, 
        rootMargin: "0px 0px -40px 0px",
        root: rootRef.current?.closest(".scene-scroll-container") || null 
      }
    );
    refs.current.forEach(el=>{if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);

  // Terminal Typing Effect
  useEffect(() => {
    const text = "> Initializing core systems...\n> Loading runtime environment [Node.js v20+]\n> Mounting framework [React / Next.js]\n> Establishing secure connections [PostgreSQL / Redis]\n> Connecting to edge network [AWS / Vercel]\n> ALL SYSTEMS OPERATIONAL. SECURE LINK ESTABLISHED.";
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

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
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden min-h-screen"
      style={{
        background: "#111318",
        contentVisibility: "auto",
        containIntrinsicSize: "1200px 1800px",
      } as React.CSSProperties}
    >
      <style>{`
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      
      {/* Background Depth & Glowing Matrix */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`repeating-linear-gradient(-45deg,transparent 0,transparent 38px,rgba(255,255,255,0.007) 38px,rgba(255,255,255,0.007) 39px)`,
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 55% at 50% 0%,rgba(255,255,255,0.018) 0%,transparent 65%)",
      }}/>

      {/* Ticker */}
      <div className="relative overflow-hidden" style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"13px 0"}}>
        <div className="ticker-rev">
          {[...tickerItems,...tickerItems].map((item,i)=>(
            <span key={i} style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.52em",textTransform:"uppercase",color:"rgba(255,255,255,0.16)",padding:"0 36px"}}>
              {item}<span style={{marginLeft:36,color:"rgba(255,255,255,0.07)"}}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-[1180px] mx-auto px-12 pt-20 pb-32">
        
        {/* NEW: Terminal Component */}
        <div ref={ref(0) as (el:HTMLDivElement|null)=>void} className="s3-reveal mb-24 max-w-3xl">
          <div className="rounded-xl border border-white/[0.08] bg-black/40 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-[10px] text-white/30 uppercase tracking-widest font-mono">Terminal // sys.init</span>
            </div>
            <div className="p-6 text-[12px] text-emerald-400/80 font-mono leading-relaxed whitespace-pre-wrap h-[140px] shadow-inner">
              {terminalText}
              <span className="inline-block w-2 h-3 bg-emerald-400 ml-1 align-middle" style={{animation: "blink 1s step-end infinite"}} />
            </div>
          </div>
        </div>

        {/* Skills & Stack */}
        <div ref={ref(1) as (el:HTMLDivElement|null)=>void} className="s3-left mb-32">
          <div className="flex items-center gap-4 mb-16">
            <div style={{width:32,height:1,background:"rgba(255,255,255,0.15)"}}/>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.6em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Technical Stack</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"40px 60px"}}>
            {skills.map((s,si)=>(
              <div key={s.cat} ref={ref(si+2) as (el:HTMLDivElement|null)=>void} className="s3-reveal group" style={{transitionDelay:`${si*90}ms`}}>
                <div className="flex items-center justify-between mb-3">
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:"0.04em",color:"rgba(228,228,234,0.85)"}}>{s.cat}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.25em",color:"rgba(175,175,185,0.5)"}}>{s.pct}%</span>
                </div>
                <div style={{height:2,background:"rgba(255,255,255,0.06)",marginBottom:14,position:"relative", overflow:"hidden"}}>
                  <div className="skill-bar" style={{position:"absolute",top:0,left:0,height:"100%",width:`${s.pct}%`,background:"linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.9) 100%)",animationDelay:`${0.5+si*0.15}s`}}/>
                  {/* Glowing tip */}
                  <div className="absolute top-0 h-full w-4 bg-white/80 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{left: `calc(${s.pct}% - 8px)`}} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map(item=>(
                    <span key={item} data-cursor-expand
                      className="transition-all duration-300 border border-white/[0.05] bg-white/[0.01] hover:border-emerald-500/40 hover:bg-emerald-500/10 text-[#c3c3d0]/65 hover:text-emerald-400"
                      style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.25em",padding:"6px 12px", borderRadius: "4px"}}
                    >{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW: System Architecture Flow */}
        <div ref={ref(6) as (el:HTMLDivElement|null)=>void} className="s3-reveal mb-32 border border-white/[0.06] rounded-2xl bg-[#090a0f]/50 p-12 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-4">
             <div className="w-16 h-16 border border-white/[0.03] rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-1 h-1 bg-emerald-500 rounded-full absolute top-0" />
             </div>
          </div>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.6em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Data Flow Architecture</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
            {/* Frontend Node */}
            <div className="w-full md:w-1/3 border border-white/[0.08] bg-white/[0.02] p-6 rounded-xl relative group hover:border-emerald-500/30 transition-colors">
              <p className="text-white/80 font-bold mb-2 tracking-widest text-sm" style={{fontFamily:"'Bebas Neue',sans-serif"}}>Client Edge</p>
              <p className="text-white/40 text-[10px] font-mono leading-relaxed">Next.js App Router<br/>React Server Components<br/>Framer Motion</p>
            </div>
            
            {/* SVG Connector */}
            <svg className="hidden md:block w-16 h-8 text-white/20" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16H64" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" style={{animation: "dash-flow 1s linear infinite"}} />
              <circle cx="32" cy="16" r="3" fill="#10B981" />
            </svg>

            {/* API Node */}
            <div className="w-full md:w-1/3 border border-emerald-500/20 bg-emerald-500/[0.02] p-6 rounded-xl relative group hover:border-emerald-500/50 transition-colors" style={{animation: "float-badge 6s ease-in-out infinite"}}>
              <p className="text-emerald-400 font-bold mb-2 tracking-widest text-sm" style={{fontFamily:"'Bebas Neue',sans-serif"}}>API Gateway</p>
              <p className="text-white/40 text-[10px] font-mono leading-relaxed">GraphQL Federation<br/>RESTful Microservices<br/>Redis Cache Layer</p>
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-ping" />
            </div>

            {/* SVG Connector */}
            <svg className="hidden md:block w-16 h-8 text-white/20" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 16H64" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" style={{animation: "dash-flow 1s linear infinite"}} />
              <circle cx="32" cy="16" r="3" fill="#10B981" />
            </svg>

            {/* Data Node */}
            <div className="w-full md:w-1/3 border border-white/[0.08] bg-white/[0.02] p-6 rounded-xl relative group hover:border-emerald-500/30 transition-colors">
              <p className="text-white/80 font-bold mb-2 tracking-widest text-sm" style={{fontFamily:"'Bebas Neue',sans-serif"}}>Data Core</p>
              <p className="text-white/40 text-[10px] font-mono leading-relaxed">PostgreSQL Cluster<br/>Prisma ORM<br/>S3 Blob Storage</p>
            </div>
          </div>
        </div>

        <div style={{height:1,background:"linear-gradient(to right,transparent,rgba(255,255,255,0.1),transparent)",marginBottom:52}}/>

        {/* Certifications */}
        <div ref={ref(7) as (el:HTMLDivElement|null)=>void} className="s3-left">
          <div className="flex items-center gap-4 mb-12">
            <div style={{width:32,height:1,background:"rgba(255,255,255,0.15)"}}/>
            <p style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.6em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)"}}>Certifications & Credentials</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
            {certs.map((c,ci)=>(
              <div key={c.name} ref={ref(ci+8) as (el:HTMLDivElement|null)=>void}
                data-cursor-expand className="s3-reveal group"
                style={{transitionDelay:`${ci*80}ms`,display:"flex",alignItems:"center",gap:24,padding:"24px 28px",border:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.015)", borderRadius: "12px", transition: "transform 0.4s ease, background 0.4s ease"}}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
              >
                <div style={{width:54,height:54,flexShrink:0,border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:"0.06em",color:"rgba(198,198,210,0.8)", borderRadius: "8px", background: "rgba(255,255,255,0.02)"}} className="group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                  {c.badge}
                </div>
                <div>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:11.5,color:"rgba(218,218,228,0.9)",letterSpacing:"0.03em",marginBottom:6}}>{c.name}</p>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"rgba(155,155,168,0.5)",letterSpacing:"0.25em",textTransform:"uppercase"}}>{c.issuer} · {c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref(12) as (el:HTMLDivElement|null)=>void} className="s3-reveal mt-32 flex justify-between items-center"
          style={{transitionDelay:"80ms",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:24}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Rupesh Agarwal © 2026</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Full-Stack Engineer — India</span>
        </div>
      </div>
    </div>
  );
}