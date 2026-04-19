"use client";

import { useEffect, useRef, useState } from "react";
import BackgroundStage from "@/components/canvas/BackgroundStage";

/* ════════════════════════════════════════════════════════════
   PRECISION CURSOR — dot + lagging ring + ghost
════════════════════════════════════════════════════════════ */
function PrecisionCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const state    = useRef({ mx:-200,my:-200,rx:-200,ry:-200,gx:-200,gy:-200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      state.current.mx = e.clientX; state.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };
    let raf = 0;
    const tick = () => {
      const s = state.current;
      s.rx += (s.mx - s.rx) * 0.1;  s.ry += (s.my - s.ry) * 0.1;
      s.gx += (s.mx - s.gx) * 0.05; s.gy += (s.my - s.gy) * 0.05;
      if (ringRef.current)  { ringRef.current.style.left  = s.rx+"px"; ringRef.current.style.top  = s.ry+"px"; }
      if (ghostRef.current) { ghostRef.current.style.left = s.gx+"px"; ghostRef.current.style.top = s.gy+"px"; }
      raf = requestAnimationFrame(tick);
    };
    const xl = () => { if(!ringRef.current)return; ringRef.current.style.cssText += ";width:62px;height:62px;border-color:rgba(200,200,200,0.7);background:rgba(200,200,200,0.04)"; };
    const xd = () => { if(!ringRef.current)return; ringRef.current.style.cssText += ";width:62px;height:62px;border-color:rgba(18,18,18,0.55);background:rgba(18,18,18,0.042)"; };
    const ct = () => { if(!ringRef.current)return; ringRef.current.style.cssText += ";width:30px;height:30px;border-color:rgba(180,180,180,0.42);background:transparent"; };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    document.querySelectorAll("[data-cursor-expand]").forEach(el => { el.addEventListener("mouseenter",xl); el.addEventListener("mouseleave",ct); });
    document.querySelectorAll("[data-cursor-dark]").forEach(el => { el.addEventListener("mouseenter",xd); el.addEventListener("mouseleave",ct); });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ghostRef} className="fixed pointer-events-none z-[9990]" style={{ width:52,height:52,borderRadius:"50%",border:"1px solid rgba(165,165,165,0.09)",transform:"translate(-50%,-50%)" }} />
      <div ref={ringRef}  className="fixed pointer-events-none z-[9995]" style={{ width:30,height:30,borderRadius:"50%",border:"1px solid rgba(180,180,180,0.42)",transform:"translate(-50%,-50%)",transition:"width 0.45s cubic-bezier(0.16,1,0.3,1),height 0.45s cubic-bezier(0.16,1,0.3,1),border-color 0.3s,background 0.3s" }} />
      <div ref={dotRef}   className="fixed pointer-events-none z-[9999]" style={{ width:4,height:4,borderRadius:"50%",background:"#FFFFFF",transform:"translate(-50%,-50%)",mixBlendMode:"difference" }} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   CHROME WIREFRAME SPHERE — silver depth shading
   Performance: pre-compute lat/lon points, batch strokes per alpha bucket
════════════════════════════════════════════════════════════ */
function ChromeSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef    = useRef({ rx:0.38, ry:0, vx:0.00016, vy:0.00052 });
  const mouseRef  = useRef({ x:0, y:0 });
  const tRef      = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    const canvas = el as HTMLCanvasElement;
    const ctx    = canvas.getContext("2d", { alpha:true }) as CanvasRenderingContext2D;
    const parent = canvas.parentElement!;
    const SIZE   = Math.min(parent.offsetWidth, parent.offsetHeight);
    canvas.width = SIZE; canvas.height = SIZE;
    const CX=SIZE/2, CY=SIZE/2, R=SIZE*0.405, LATS=16, LONS=22;
    let raf=0;

    function project(x:number,y:number,z:number,rX:number,rY:number){
      const x1=x*Math.cos(rY)-z*Math.sin(rY), z1=x*Math.sin(rY)+z*Math.cos(rY);
      const y2=y*Math.cos(rX)-z1*Math.sin(rX), z2=y*Math.sin(rX)+z1*Math.cos(rX);
      const fov=SIZE*1.9, sc=fov/(fov+z2);
      return {px:CX+x1*sc, py:CY+y2*sc, z:z2, sc};
    }
    const mg = (d:number) => Math.round(52 + d * 182);

    function frame(){
      ctx.clearRect(0,0,SIZE,SIZE);
      tRef.current += 0.007; const t = tRef.current;
      const ox=(mouseRef.current.x-window.innerWidth/2)/window.innerWidth;
      const oy=(mouseRef.current.y-window.innerHeight/2)/window.innerHeight;
      rotRef.current.rx+=rotRef.current.vx; rotRef.current.ry+=rotRef.current.vy;
      const rX=rotRef.current.rx+oy*0.18, rY=rotRef.current.ry+ox*0.38;

      /* Latitude rings */
      for(let lat=0;lat<=LATS;lat++){
        const phi=(lat/LATS)*Math.PI;
        const pts:ReturnType<typeof project>[]=[];
        for(let lon=0;lon<=LONS*2;lon++)
          pts.push(project(R*Math.sin(phi)*Math.cos((lon/(LONS*2))*Math.PI*2),R*Math.cos(phi),R*Math.sin(phi)*Math.sin((lon/(LONS*2))*Math.PI*2),rX,rY));
        for(let i=0;i<pts.length-1;i++){
          const a=pts[i],b=pts[i+1];
          const depth=Math.max(0,Math.min(1,(a.z+b.z)/(2*R)*0.5+0.5));
          ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);
          ctx.strokeStyle=`rgba(${mg(depth)},${mg(depth)},${mg(depth)},${0.030+0.265*depth})`;
          ctx.lineWidth=0.4+depth*0.28; ctx.stroke();
        }
      }
      /* Longitude rings */
      for(let lon=0;lon<LONS;lon++){
        const theta=(lon/LONS)*Math.PI*2;
        const pts:ReturnType<typeof project>[]=[];
        for(let lat=0;lat<=LATS*2;lat++)
          pts.push(project(R*Math.sin((lat/(LATS*2))*Math.PI)*Math.cos(theta),R*Math.cos((lat/(LATS*2))*Math.PI),R*Math.sin((lat/(LATS*2))*Math.PI)*Math.sin(theta),rX,rY));
        for(let i=0;i<pts.length-1;i++){
          const a=pts[i],b=pts[i+1];
          const depth=Math.max(0,Math.min(1,(a.z+b.z)/(2*R)*0.5+0.5));
          ctx.beginPath();ctx.moveTo(a.px,a.py);ctx.lineTo(b.px,b.py);
          ctx.strokeStyle=`rgba(${mg(depth)},${mg(depth)},${mg(depth)},${0.020+0.17*depth})`;
          ctx.lineWidth=0.34+depth*0.18; ctx.stroke();
        }
      }
      /* Equator node ring */
      for(let i=0;i<=LONS*3;i++){
        const theta=(i/(LONS*3))*Math.PI*2+t*0.16;
        const{px,py,sc,z:pz}=project(R*Math.cos(theta),0,R*Math.sin(theta),rX,rY);
        const depth=Math.max(0,Math.min(1,pz/R*0.5+0.5));
        const pulse=0.35+0.65*Math.abs(Math.sin(t*2.2+i*0.38));
        ctx.beginPath();ctx.arc(px,py,sc,0,Math.PI*2);
        ctx.fillStyle=`rgba(210,210,210,${depth*pulse*0.68})`;ctx.fill();
      }
      /* Poles */
      ([-R,R] as number[]).forEach((yp,idx)=>{
        const{px,py,sc}=project(0,yp,0,rX,rY);
        const p=0.5+0.5*Math.sin(t*1.8+idx*Math.PI);
        ctx.beginPath();ctx.arc(px,py,8*sc,0,Math.PI*2);ctx.fillStyle=`rgba(155,155,155,${sc*0.062*p})`;ctx.fill();
        ctx.beginPath();ctx.arc(px,py,2.0*sc,0,Math.PI*2);ctx.fillStyle=`rgba(238,238,238,${sc*0.86})`;ctx.fill();
      });
      /* Outer halo */
      const hR=R*1.11;
      for(let i=0;i<160;i++){
        const t1=(i/160)*Math.PI*2+t*0.04, t2=((i+1)/160)*Math.PI*2+t*0.04;
        const p1=project(hR*Math.cos(t1),0,hR*Math.sin(t1),rX,rY);
        const p2=project(hR*Math.cos(t2),0,hR*Math.sin(t2),rX,rY);
        const wave=0.18+0.82*Math.abs(Math.sin(t*0.9+i*0.1));
        const depth=Math.max(0,Math.min(1,(p1.z+p2.z)/(2*R)*0.5+0.5));
        ctx.beginPath();ctx.moveTo(p1.px,p1.py);ctx.lineTo(p2.px,p2.py);
        ctx.strokeStyle=`rgba(150,150,152,${depth*wave*0.2})`;ctx.lineWidth=1.0*p1.sc;ctx.stroke();
      }
      raf=requestAnimationFrame(frame);
    }
    frame();
    return ()=>cancelAnimationFrame(raf);
  },[]);

  return <canvas ref={canvasRef} style={{ width:"100%",height:"100%" }} />;
}

/* ════════════════════════════════════════════════════════════
   NODE GRID (WHITE SLIDE) — heavily optimized
   Key: single path per alpha level, 60px grid, no O(n²) inner loop
════════════════════════════════════════════════════════════ */
function NodeGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x:-9999, y:-9999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const el = canvasRef.current; if(!el) return;
    const canvas = el as HTMLCanvasElement;
    const ctx    = canvas.getContext("2d", { alpha:true }) as CanvasRenderingContext2D;
    let W=0, H=0, raf=0;

    const GAP = 60;
    interface Node { x:number; y:number; baseR:number; phase:number; }
    let nodes: Node[] = [];

    function resize(){
      W = canvas.width  = canvas.parentElement!.offsetWidth;
      H = canvas.height = canvas.parentElement!.offsetHeight;
      const COLS = Math.ceil(W/GAP)+1, ROWS = Math.ceil(H/GAP)+1;
      nodes = [];
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
        nodes.push({ x:c*GAP, y:r*GAP, baseR:1.1+Math.random()*0.7, phase:Math.random()*Math.PI*2 });
    }
    resize();
    window.addEventListener("resize", resize);

    /* Draw grid lines ONCE into an offscreen canvas */
    let gridCache: HTMLCanvasElement | null = null;
    function buildGridCache(){
      gridCache = document.createElement("canvas");
      gridCache.width = W; gridCache.height = H;
      const gc = gridCache.getContext("2d")!;
      gc.strokeStyle = "rgba(0,0,0,0.038)";
      gc.lineWidth = 0.45;
      for(let x=0;x<W;x+=GAP){ gc.beginPath();gc.moveTo(x,0);gc.lineTo(x,H);gc.stroke(); }
      for(let y=0;y<H;y+=GAP){ gc.beginPath();gc.moveTo(0,y);gc.lineTo(W,y);gc.stroke(); }
    }
    buildGridCache();

    let t=0;
    function draw(){
      ctx.clearRect(0,0,W,H);
      t += 0.018;
      const{x:mx,y:my}=mouseRef.current;

      if(gridCache) ctx.drawImage(gridCache,0,0);

      /* Nodes */
      for(const n of nodes){
        const dm   = Math.hypot(n.x-mx, n.y-my);
        const prox = Math.max(0,(200-dm)/200);
        const pulse= 0.4+0.6*Math.abs(Math.sin(t+n.phase));
        const alpha= 0.09+prox*0.5+pulse*0.04;
        const r    = n.baseR*(1+prox*2.8);

        /* Glow halo near cursor */
        if(prox>0.05){
          const gr=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*5);
          gr.addColorStop(0,`rgba(0,0,0,${prox*0.10})`);
          gr.addColorStop(1,`rgba(0,0,0,0)`);
          ctx.beginPath();ctx.arc(n.x,n.y,r*5,0,Math.PI*2);
          ctx.fillStyle=gr;ctx.fill();
        }
        ctx.beginPath();ctx.arc(n.x,n.y,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,0,0,${alpha})`;ctx.fill();
      }

      /* Connections — only within a fixed radius of cursor, batched */
      const ACTIVE_DIST = 200;
      const CONN_DIST   = GAP * 1.5;
      ctx.lineWidth=0.45;
      for(let i=0;i<nodes.length;i++){
        const a=nodes[i];
        if(Math.hypot(a.x-mx,a.y-my)>ACTIVE_DIST) continue;
        for(let j=i+1;j<nodes.length;j++){
          const b=nodes[j];
          if(Math.abs(a.x-b.x)>CONN_DIST||Math.abs(a.y-b.y)>CONN_DIST) continue;
          const d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d>CONN_DIST) continue;
          const near=Math.max(0,(ACTIVE_DIST-Math.min(Math.hypot(a.x-mx,a.y-my),Math.hypot(b.x-mx,b.y-my)))/ACTIVE_DIST);
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(0,0,0,${near*0.13})`;ctx.stroke();
        }
      }
      raf=requestAnimationFrame(draw);
    }
    draw();
    return ()=>{ window.removeEventListener("resize",resize); cancelAnimationFrame(raf); };
  },[]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
}

/* ════════════════════════════════════════════════════════════
   HUD SCROLLBAR — CSS var driven, zero React re-renders
════════════════════════════════════════════════════════════ */
function HudScrollbar() {
  return (
    <div className="fixed right-7 top-1/2 -translate-y-1/2 z-[9000] pointer-events-none"
      style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, height:280 }}>

      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, letterSpacing:"0.4em", textTransform:"uppercase",
        color:"rgba(160,160,160,0.45)", marginBottom:4 }}>01</span>

      {/* Track */}
      <div style={{ width:1, flex:1, background:"rgba(150,150,150,0.18)", position:"relative", overflow:"hidden" }}>
        {/* Fill — driven by CSS variable set on document root */}
        <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%",
          background:"linear-gradient(to bottom, rgba(190,190,190,0.5), rgba(255,255,255,0.85))",
          transformOrigin:"top", transform:"scaleY(var(--scroll-total,0))",
          transition:"transform 0.05s linear" }} />
      </div>

      {/* Dot indicator */}
      <div className="hud-dot" style={{ width:3, height:3, borderRadius:"50%", background:"rgba(200,200,200,0.6)" }} />

      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, letterSpacing:"0.4em", textTransform:"uppercase",
        color:"rgba(160,160,160,0.45)", marginTop:4 }}>02</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SLIDE 2 — WHITE EDITORIAL with staggered reveal animations
════════════════════════════════════════════════════════════ */
function SlideTwo() {
  const refs = useRef<(HTMLElement|null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if(e.isIntersecting) (e.target as HTMLElement).classList.add("in-view");
      }),
      { threshold:0.08, rootMargin:"0px 0px -40px 0px" }
    );
    refs.current.forEach(el => { if(el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const ref = (i:number) => (el:HTMLElement|null) => { refs.current[i]=el; };

  const projects = [
    { num:"01", title:"NeuralCommerce", tags:["Next.js","Node.js","ML"],     desc:"AI-driven e-commerce engine with real-time personalisation at scale.", year:"2024" },
    { num:"02", title:"ArchitectOS",    tags:["React","WebGL","Three.js"],   desc:"3D building visualisation platform used by 40+ architectural firms.",  year:"2024" },
    { num:"03", title:"PulseFinance",   tags:["MERN","WebSockets","Redis"],  desc:"Live trading dashboard processing 50k+ events per second.",            year:"2023" },
  ];
  const skills = [
    { cat:"Frontend",  items:["React / Next.js","TypeScript","Three.js","WebGL","Framer Motion"] },
    { cat:"Backend",   items:["Node.js","PostgreSQL","Redis","GraphQL","REST APIs"] },
    { cat:"Toolchain", items:["Figma","Canvas API","GSAP","Docker","Vercel"] },
  ];
  const ticker = ["Full-Stack Engineering","Interactive Interfaces","Real-Time Systems","3D Web Experiences","Performance Architecture"];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#F6F6F6]">
      <NodeGrid />

      {/* Top inner shadow */}
      <div className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-[10]"
        style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, transparent 100%)" }} />

      {/* Corner vignette */}
      <div className="absolute inset-0 pointer-events-none z-[5]"
        style={{ background:"radial-gradient(ellipse 92% 92% at 50% 50%, transparent 62%, rgba(175,175,175,0.26) 100%)" }} />

      {/* ── Ticker ───────────────────────────────────── */}
      <div className="relative z-[20] overflow-hidden" style={{ borderBottom:"1px solid rgba(0,0,0,0.07)", padding:"13px 0" }}>
        <div className="ticker-inner">
          {[...ticker,...ticker].map((item,i)=>(
            <span key={i} style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.52em",
              textTransform:"uppercase", color:"rgba(0,0,0,0.22)", padding:"0 44px" }}>
              {item}<span style={{ marginLeft:44, color:"rgba(0,0,0,0.1)" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[20] max-w-[1180px] mx-auto px-12 pt-20 pb-28">

        {/* ── Header: left slides in, right slides in from opposite ── */}
        <div className="mb-20">
          <div ref={ref(0) as (el:HTMLDivElement|null)=>void} className="s2-left flex items-center gap-4 mb-7" style={{ transitionDelay:"0ms" }}>
            <div style={{ width:32, height:1, background:"rgba(0,0,0,0.18)" }} />
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.6em",
              textTransform:"uppercase", color:"rgba(0,0,0,0.32)" }}>Selected Work</p>
          </div>

          <div className="flex items-end justify-between gap-8 flex-wrap">
            <h2 ref={ref(1) as (el:HTMLDivElement|null)=>void} className="s2-reveal"
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(64px,7.5vw,112px)",
                lineHeight:0.88, color:"#0A0A0A", letterSpacing:"0.015em", transitionDelay:"80ms" }}>
              WHAT I<br />
              <span style={{ color:"transparent", WebkitTextStroke:"1.5px rgba(0,0,0,0.2)" }}>BUILD.</span>
            </h2>
            <p ref={ref(2) as (el:HTMLDivElement|null)=>void} className="s2-right"
              style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(14px,1.3vw,18px)",
                fontStyle:"italic", fontWeight:300, lineHeight:1.9, color:"rgba(0,0,0,0.45)",
                maxWidth:310, borderLeft:"1px solid rgba(0,0,0,0.1)", paddingLeft:22, transitionDelay:"120ms" }}>
              Full-stack engineering across MERN, real-time systems, and cinematic web experiences.
            </p>
          </div>
        </div>

        {/* ── Project rows — alternate left/right slide-in ── */}
        <div className="flex flex-col">
          {projects.map((p,i)=>(
            <div key={p.num} ref={ref(i+3) as (el:HTMLDivElement|null)=>void}
              data-cursor-dark
              className={`${i%2===0?"s2-left":"s2-right"} proj-row`}
              style={{ transitionDelay:`${i*110}ms`, borderTop:"1px solid rgba(0,0,0,0.08)",
                padding:"34px 0", display:"grid", gridTemplateColumns:"64px 1fr 220px 52px",
                alignItems:"center", gap:"28px" }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9.5, letterSpacing:"0.35em", color:"rgba(0,0,0,0.18)" }}>{p.num}</span>
              <div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(32px,3.8vw,56px)",
                  letterSpacing:"0.02em", color:"#080808", lineHeight:1, marginBottom:7 }}>{p.title}</h3>
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"rgba(0,0,0,0.38)", letterSpacing:"0.03em" }}>{p.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map(tag=>(<span key={tag} style={{ fontFamily:"'DM Mono',monospace", fontSize:8,
                  letterSpacing:"0.3em", textTransform:"uppercase", padding:"5px 11px",
                  border:"1px solid rgba(0,0,0,0.13)", color:"rgba(0,0,0,0.4)" }}>{tag}</span>))}
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.18em",
                color:"rgba(0,0,0,0.16)", textAlign:"right" }}>{p.year}</span>
            </div>
          ))}
          <div style={{ borderTop:"1px solid rgba(0,0,0,0.08)" }} />
        </div>

        {/* ── Skills — scale-in with stagger ── */}
        <div ref={ref(6) as (el:HTMLDivElement|null)=>void} className="s2-scale mt-24 mb-24" style={{ transitionDelay:"60ms" }}>
          <div className="flex items-center gap-4 mb-12">
            <div style={{ width:32, height:1, background:"rgba(0,0,0,0.18)" }} />
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.6em",
              textTransform:"uppercase", color:"rgba(0,0,0,0.32)" }}>Skills &amp; Stack</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
            {skills.map((s,si)=>(
              <div key={s.cat} ref={ref(7+si) as (el:HTMLDivElement|null)=>void}
                data-cursor-dark
                className="s2-reveal"
                style={{ transitionDelay:`${si*120}ms`, borderLeft:si>0?"1px solid rgba(0,0,0,0.08)":"none",
                  paddingLeft:si>0?34:0, paddingRight:34 }}>
                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.46em",
                  textTransform:"uppercase", color:"rgba(0,0,0,0.26)", marginBottom:16 }}>{s.cat}</p>
                <div className="flex flex-col gap-[5px]">
                  {s.items.map(item=>(<span key={item} style={{ fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:24, letterSpacing:"0.025em", color:"#080808", lineHeight:1.18 }}>{item}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA — reveal up ── */}
        <div ref={ref(10) as (el:HTMLDivElement|null)=>void} className="s2-reveal"
          style={{ transitionDelay:"0ms", borderTop:"1px solid rgba(0,0,0,0.08)", paddingTop:48 }}>
          <div className="flex items-end justify-between flex-wrap gap-8">
            <div>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(13px,1.1vw,16px)",
                fontStyle:"italic", fontWeight:300, color:"rgba(0,0,0,0.35)", marginBottom:18, letterSpacing:"0.04em" }}>
                "The best interface is no interface."
              </p>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.52em",
                textTransform:"uppercase", color:"rgba(0,0,0,0.26)", marginBottom:14 }}>Currently available</p>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(22px,2.8vw,40px)",
                color:"#080808", letterSpacing:"0.03em" }}>LET&apos;S BUILD SOMETHING EXTRAORDINARY.</p>
            </div>
            <div className="flex gap-4">
              {[
                { label:"Get in Touch", fill:"#080808", color:"#F6F6F6", hf:"#1e1e1e" },
                { label:"Download CV",  fill:"transparent", color:"#080808", hf:"rgba(0,0,0,0.05)" },
              ].map(btn=>(
                <button key={btn.label} data-cursor-dark style={{
                  fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.32em",
                  textTransform:"uppercase", padding:"15px 30px", background:btn.fill, color:btn.color,
                  border:btn.fill==="transparent"?"1px solid rgba(0,0,0,0.18)":"none", transition:"background 0.3s, transform 0.2s",
                }}
                  onMouseEnter={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.background=btn.hf; b.style.transform="translateY(-1px)"; }}
                  onMouseLeave={e=>{ const b=e.currentTarget as HTMLButtonElement; b.style.background=btn.fill; b.style.transform="translateY(0)"; }}
                >{btn.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div ref={ref(11) as (el:HTMLDivElement|null)=>void} className="s2-reveal mt-20 flex justify-between items-center"
          style={{ transitionDelay:"100ms", borderTop:"1px solid rgba(0,0,0,0.06)", paddingTop:22 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.38em",
            textTransform:"uppercase", color:"rgba(0,0,0,0.18)" }}>Rupesh Agarwal © 2025</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.38em",
            textTransform:"uppercase", color:"rgba(0,0,0,0.18)" }}>Full-Stack Engineer — India</span>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   IST CLOCK — hydration safe (empty initial state)
════════════════════════════════════════════════════════════ */
function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date(new Date().toLocaleString("en-US",{ timeZone:"Asia/Kolkata" }));
      setT(`${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ════════════════════════════════════════════════════════════
   ROOT PAGE
   Architecture:
   • Slide 1 is `sticky top-0` — it pins behind Slide 2 as you scroll.
   • Slide 2 glides over it naturally with native scroll (no React state updates).
   • CSS custom properties (--scroll-vh, --scroll-total) are set on <html>
     by a passive scroll listener — ZERO React re-renders on scroll.
   • The hero content fades & lifts using CSS calc() on those vars.
════════════════════════════════════════════════════════════ */
export default function Home() {
  const clock = useClock();

  /* ── Zero-render scroll driver ─────────────────────── */
  useEffect(() => {
    const update = () => {
      const sy  = window.scrollY;
      const vh  = window.innerHeight;
      const dh  = document.documentElement.scrollHeight - vh;
      document.documentElement.style.setProperty("--scroll-vh",    String(Math.min(sy / vh, 1)));
      document.documentElement.style.setProperty("--scroll-total", String(dh > 0 ? sy / dh : 0));
    };
    window.addEventListener("scroll", update, { passive:true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <PrecisionCursor />
      <HudScrollbar />

      <div className="relative w-full bg-[#040404]">

        {/* ══ SLIDE 1 — pinned hero ══════════════════════════ */}
        <div className="sticky top-0 h-screen w-full overflow-hidden z-0">

          {/* Fade + lift using CSS vars — NO React state */}
          <div className="absolute inset-0"
            style={{ opacity:"calc(1 - var(--scroll-vh,0) * 2.2)",
                     transform:"translateY(calc(var(--scroll-vh,0) * -55px))",
                     willChange:"transform,opacity" }}>

            <BackgroundStage />

            {/* NAV */}
            <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-9"
              style={{ borderBottom:"1px solid rgba(175,175,175,0.05)" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:21, letterSpacing:"0.18em", color:"#DEDEDE" }}>
                RA.
              </div>
              <div className="flex gap-10" style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.48em", textTransform:"uppercase" }}>
                {["Architecture","Projects","Contact"].map(n=>(
                  <span key={n} data-cursor-expand
                    style={{ color:"rgba(195,195,195,0.36)", transition:"color 0.25s" }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="rgba(225,225,225,0.88)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="rgba(195,195,195,0.36)"; }}
                  >{n}</span>
                ))}
              </div>
              <div className="flex items-center gap-2"
                style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.3em",
                  textTransform:"uppercase", color:"rgba(195,195,195,0.28)" }}>
                <div className="animate-status" style={{ width:5, height:5, borderRadius:"50%", background:"#8A8A8A" }} />
                Open to work
              </div>
            </nav>

            {/* HERO GRID */}
            <div className="flex h-full w-full items-center px-10 md:px-24 pt-16">

              {/* LEFT */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="animate-fade-rise flex items-center gap-4 mb-7">
                  <div style={{ width:35, height:1, background:"rgba(195,195,195,0.2)" }} />
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, letterSpacing:"0.56em",
                    textTransform:"uppercase", color:"rgba(195,195,195,0.36)" }}>Full-Stack Engineer</p>
                </div>

                {/* Name — overflow-hidden clip for the slam effect */}
                <div style={{ overflow:"hidden", lineHeight:0.86, marginBottom:3 }}>
                  <h1 className="animate-name-1"
                    style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(88px,10.5vw,158px)",
                      letterSpacing:"0.025em", color:"#FFFFFF", display:"block" }}>RUPESH</h1>
                </div>
                <div style={{ overflow:"hidden", lineHeight:0.86 }}>
                  <h1 className="animate-name-2"
                    style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(88px,10.5vw,158px)",
                      letterSpacing:"0.025em", color:"transparent",
                      WebkitTextStroke:"1.5px rgba(215,215,215,0.3)", display:"block" }}>AGARWAL</h1>
                </div>

                {/* Cormorant italic tagline */}
                <p className="animate-fade-rise-2"
                  style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(13px,1.1vw,17px)",
                    fontStyle:"italic", fontWeight:300, color:"rgba(185,185,185,0.38)",
                    lineHeight:1.85, marginTop:22, letterSpacing:"0.04em" }}>
                  Decoding the future of interactive interfaces — specialised in high-performance web architecture.
                </p>

                {/* Mono annotation */}
                <p className="animate-fade-rise-2"
                  style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(8px,0.82vw,10.5px)",
                    color:"rgba(185,185,185,0.2)", lineHeight:2.3, marginTop:10, letterSpacing:"0.09em" }}>
                  <span style={{ color:"rgba(185,185,185,0.09)" }}>{"// "}</span>
                  NEXT.JS · NODE · WEBGL · REAL-TIME SYSTEMS
                </p>

                {/* Scroll cue */}
                <div className="animate-fade-rise-3 flex items-center gap-3 mt-11"
                  style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:"0.48em",
                    textTransform:"uppercase", color:"rgba(185,185,185,0.18)" }}>
                  <div style={{ display:"flex", flexDirection:"column" as const, alignItems:"center", gap:3 }}>
                    {[0,1,2].map(i=>(
                      <div key={i} className="animate-scroll-drop"
                        style={{ width:1, height:10, background:"rgba(175,175,175,0.42)", animationDelay:`${i*0.28}s` }} />
                    ))}
                  </div>
                  Scroll to explore
                </div>
              </div>

              {/* RIGHT — sphere */}
              <div className="w-full md:w-1/2 h-full flex items-center justify-center">
                <div className="animate-sphere-float relative"
                  style={{ width:"clamp(310px,38vw,520px)", height:"clamp(310px,38vw,520px)" }}>
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border:"1px solid rgba(150,150,150,0.07)",
                      boxShadow:"0 0 70px rgba(125,125,125,0.04), inset 0 0 70px rgba(125,125,125,0.03)" }} />
                  <div className="absolute inset-0"><ChromeSphere /></div>
                  {/* Ground reflection */}
                  <div className="absolute pointer-events-none"
                    style={{ bottom:"-7%", left:"14%", right:"14%", height:46,
                      background:"radial-gradient(ellipse, rgba(130,130,130,0.09) 0%, transparent 70%)",
                      filter:"blur(9px)" }} />
                </div>
              </div>
            </div>

            {/* STATS BAR — numbers animate in on load */}
            <div className="animate-fade-rise-4 absolute bottom-0 left-0 right-0 flex items-center justify-between px-12 py-5"
              style={{ borderTop:"1px solid rgba(175,175,175,0.05)" }}>
              {[
                { n:"24+", l:"Projects Shipped", cls:"stat-num stat-num-1" },
                { n:"18+", l:"Technologies",     cls:"stat-num stat-num-2" },
                { n:"3+",  l:"Years Experience", cls:"stat-num stat-num-3" },
              ].map((s,i)=>(
                <div key={i} className="flex flex-col gap-[3px]" style={{ overflow:"hidden" }}>
                  <span className={s.cls} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, lineHeight:1, color:"#D5D5D5", display:"block" }}>{s.n}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:"0.46em",
                    textTransform:"uppercase", color:"rgba(190,190,190,0.26)" }}>{s.l}</span>
                </div>
              ))}
              <div style={{ textAlign:"right" as const }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.1em",
                  color:"rgba(190,190,190,0.58)", display:"block" }}>{clock || "00:00:00"}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:"0.3em",
                  textTransform:"uppercase", color:"rgba(190,190,190,0.2)" }}>India Standard Time</span>
              </div>
            </div>

          </div>
        </div>

        {/* ══ SLIDE 2 — glides naturally over pinned hero ═══ */}
        <div className="relative z-10 w-full"
          style={{ boxShadow:"0 -28px 70px rgba(0,0,0,0.65), 0 -2px 0 rgba(255,255,255,0.08)" }}>
          <SlideTwo />
        </div>

      </div>
    </>
  );
}