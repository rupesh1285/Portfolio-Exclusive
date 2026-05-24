"use client";

import { useEffect, useRef } from "react";


export default function SceneThree() {
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLElement|null)[]>([]);
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
        containIntrinsicSize: "1200px 900px",
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`repeating-linear-gradient(-45deg,transparent 0,transparent 38px,rgba(255,255,255,0.007) 38px,rgba(255,255,255,0.007) 39px)`,
      }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        background:"radial-gradient(ellipse 80% 55% at 50% 0%,rgba(255,255,255,0.018) 0%,transparent 65%)",
      }}/>

      <div className="relative overflow-hidden" style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"13px 0"}}>
        <div className="ticker-rev">
          {[...tickerItems,...tickerItems].map((item,i)=>(
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
                      className="transition-colors duration-250 border border-white/10 hover:border-[#c8c8d2]/38 text-[#c3c3d0]/65 hover:text-[#e4e4ee]/90"
                      style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.25em",padding:"4px 10px"}}
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
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Rupesh Agarwal © 2026</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:"0.38em",textTransform:"uppercase",color:"rgba(255,255,255,0.14)"}}>Full-Stack Engineer — India</span>
        </div>
      </div>
    </div>
  );
}