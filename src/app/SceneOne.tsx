"use client";

export default function SceneOne({ clock }: { clock: string }) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-center bg-[#050505]">
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
  );
}