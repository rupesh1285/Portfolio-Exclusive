"use client";

import { useEffect, useRef } from "react";

export default function BackgroundStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canvas = el as HTMLCanvasElement;
    const ctx    = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;
    let W = 0, H = 0, raf = 0;

    /* ─── PERFORMANCE: pre-baked static texture canvas ──────
       Grid + cracks are drawn ONCE onto an offscreen canvas.
       We blit it each frame instead of redrawing every line. */
    let staticCanvas: HTMLCanvasElement | null = null;

    function buildStaticTexture() {
      staticCanvas = document.createElement("canvas");
      staticCanvas.width  = W;
      staticCanvas.height = H;
      const sc = staticCanvas.getContext("2d")!;

      /* Architectural grid */
      const gap = 72;
      sc.strokeStyle = "rgba(168,168,172,0.022)";
      sc.lineWidth = 0.3;
      for (let x = gap; x < W; x += gap) {
        sc.beginPath(); sc.moveTo(x, 0); sc.lineTo(x, H); sc.stroke();
      }
      for (let y = gap; y < H; y += gap) {
        sc.beginPath(); sc.moveTo(0, y); sc.lineTo(W, y); sc.stroke();
      }

      /* Voronoi crack network — 32 nodes, 2-3 neighbours each */
      const nodeCount = 32;
      const nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * W, y: Math.random() * H,
      }));
      sc.lineWidth = 0.28;
      for (let i = 0; i < nodes.length; i++) {
        const sorted = nodes
          .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
          .filter(r => r.j !== i)
          .sort((a, b) => a.d - b.d)
          .slice(0, 2 + Math.floor(Math.random() * 2));
        for (const nb of sorted) {
          sc.beginPath();
          sc.moveTo(nodes[i].x, nodes[i].y);
          sc.lineTo(nodes[nb.j].x, nodes[nb.j].y);
          sc.strokeStyle = `rgba(155,155,160,${0.016 + Math.random() * 0.02})`;
          sc.stroke();
        }
      }
    }

    /* ─── MERCURY DROPS ──────────────────────────────────── */
    interface Drop {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number; shimmer: number;
      trail: Array<{ x: number; y: number }>;
      life: number; maxLife: number; phase: number;
    }

    const POOL_SIZE = 75; // reduced from 92 for perf
    let drops: Drop[] = [];

    function mkDrop(edge = false): Drop {
      let x = 0, y = 0, angle = 0;
      if (edge || Math.random() < 0.45) {
        const e = Math.floor(Math.random() * 4);
        if      (e === 0) { x = Math.random() * W; y = -12;   angle = Math.PI * 0.5 + (Math.random() - 0.5) * 1.3; }
        else if (e === 1) { x = W + 12; y = Math.random() * H; angle = Math.PI + (Math.random() - 0.5) * 1.3; }
        else if (e === 2) { x = Math.random() * W; y = H + 12; angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.3; }
        else              { x = -12; y = Math.random() * H;    angle = (Math.random() - 0.5) * 1.3; }
      } else {
        x = Math.random() * W; y = Math.random() * H; angle = Math.random() * Math.PI * 2;
      }
      const spd = 0.14 + Math.random() * 0.22;
      return {
        x, y,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.2 + 0.06,
        shimmer: Math.random(),
        trail: [],
        life: 0, maxLife: 380 + Math.random() * 400,
        phase: Math.random() * Math.PI * 2,
      };
    }

    /* ─── SPATIAL BUCKET for O(n) connections ─────────────── */
    const BUCKET_SIZE = 130;
    const buckets = new Map<string, Drop[]>();

    function bucketKey(x: number, y: number) {
      return `${Math.floor(x / BUCKET_SIZE)},${Math.floor(y / BUCKET_SIZE)}`;
    }

    function rebucket() {
      buckets.clear();
      for (const d of drops) {
        const k = bucketKey(d.x, d.y);
        if (!buckets.has(k)) buckets.set(k, []);
        buckets.get(k)!.push(d);
      }
    }

    function neighbourDrops(d: Drop): Drop[] {
      const bx = Math.floor(d.x / BUCKET_SIZE);
      const by = Math.floor(d.y / BUCKET_SIZE);
      const result: Drop[] = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const k = `${bx + dx},${by + dy}`;
          const cell = buckets.get(k);
          if (cell) for (const nb of cell) result.push(nb);
        }
      }
      return result;
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      drops = Array.from({ length: POOL_SIZE }, () => {
        const d = mkDrop(); d.life = Math.random() * d.maxLife; return d;
      });
      buildStaticTexture();
    }
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let frame = 0; // frame counter for throttled ops

    function draw() {
      ctx.clearRect(0, 0, W, H);
      time += 0.009;
      frame++;
      const { x: mx, y: my } = mouseRef.current;

      /* ── Blit pre-baked static texture ── */
      if (staticCanvas) ctx.drawImage(staticCanvas, 0, 0);

      /* ── Cursor-proximity grid brightening (lightweight) ── */
      if (mx > 0 && mx < W) {
        const gapPx = 72;
        const nearX = Math.round(mx / gapPx) * gapPx;
        const nearY = Math.round(my / gapPx) * gapPx;
        ctx.strokeStyle = "rgba(185,185,190,0.09)";
        ctx.lineWidth = 0.55;
        // Only redraw the 5 nearest lines
        for (let dx = -2; dx <= 2; dx++) {
          const x = nearX + dx * gapPx;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let dy = -2; dy <= 2; dy++) {
          const y = nearY + dy * gapPx;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      }

      /* ── Update & draw drops ── */
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life++;

        const dmx = d.x - mx, dmy = d.y - my;
        const dm2 = dmx * dmx + dmy * dmy;
        const dm  = Math.sqrt(dm2);

        /* Magnetic pull */
        if (dm < 420 && dm > 1) {
          const f = ((420 - dm) / 420) * 0.0055;
          d.vx += (mx - d.x) * f;
          d.vy += (my - d.y) * f;
        }

        /* Sinusoidal undulation */
        const u = Math.sin(time * 1.85 + d.phase) * 0.0038;
        d.vx += -d.vy * u;
        d.vy +=  d.vx * u;

        const spd = Math.hypot(d.vx, d.vy);
        if (spd > 2.0) { d.vx *= 2.0 / spd; d.vy *= 2.0 / spd; }
        d.vx *= 0.998; d.vy *= 0.998;

        d.x += d.vx; d.y += d.vy;

        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 30) d.trail.shift();

        const oob = d.x < -90 || d.x > W + 90 || d.y < -90 || d.y > H + 90;
        if (d.life > d.maxLife || oob) { drops[i] = mkDrop(true); continue; }

        const lf = d.life / d.maxLife;
        const lifeA = lf < 0.08 ? lf / 0.08 : lf > 0.88 ? (1 - lf) / 0.12 : 1;
        const prox  = dm < 250 ? Math.max(0, (250 - dm) / 250) : 0;

        /* Trail ribbon — batched path per brightness tier */
        if (d.trail.length > 2) {
          const v = d.shimmer > 0.65
            ? Math.round(180 + d.shimmer * 60)
            : Math.round(105 + d.shimmer * 95);
          ctx.lineCap = "round";
          for (let t = 1; t < d.trail.length; t++) {
            const tf = t / d.trail.length;
            const ta = tf * d.alpha * lifeA * (1 + prox * 1.8);
            ctx.beginPath();
            ctx.moveTo(d.trail[t - 1].x, d.trail[t - 1].y);
            ctx.lineTo(d.trail[t].x, d.trail[t].y);
            ctx.strokeStyle = `rgba(${v},${v},${v},${ta})`;
            ctx.lineWidth   = d.r * (0.22 + tf * 0.78) + prox * 1.0;
            ctx.stroke();
          }
        }

        /* Corona glow near cursor */
        if (prox > 0.08) {
          const gr = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, (d.r + 3) * (1 + prox * 2.4));
          gr.addColorStop(0, `rgba(255,255,255,${prox * 0.26 * lifeA})`);
          gr.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.beginPath();
          ctx.arc(d.x, d.y, (d.r + 3) * (1 + prox * 2.4), 0, Math.PI * 2);
          ctx.fillStyle = gr; ctx.fill();
        }

        /* Core dot */
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 + prox * 0.5), 0, Math.PI * 2);
        const cv = d.shimmer > 0.68 ? 244 : 172;
        ctx.fillStyle = `rgba(${cv},${cv},${cv},${(d.alpha + prox * 0.36) * lifeA})`;
        ctx.fill();
      }

      /* ── Inter-drop connections: spatial buckets — O(n) ── */
      if (frame % 2 === 0) rebucket(); // only rebuild every other frame
      const CONN_DIST = 115;
      const seen = new Set<string>();
      for (const d of drops) {
        for (const nb of neighbourDrops(d)) {
          if (nb === d) continue;
          const key = d < nb ? `${drops.indexOf(d)}-${drops.indexOf(nb)}` : `${drops.indexOf(nb)}-${drops.indexOf(d)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const dist = Math.hypot(d.x - nb.x, d.y - nb.y);
          if (dist > CONN_DIST) continue;
          const dma  = Math.hypot(d.x - mx, d.y - my);
          const dmb  = Math.hypot(nb.x - mx, nb.y - my);
          const near = Math.max(0, (260 - Math.min(dma, dmb)) / 260);
          const alpha = (1 - dist / CONN_DIST) * 0.046 + near * 0.2;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y); ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = `rgba(165,165,170,${alpha})`;
          ctx.lineWidth   = 0.3 + near * 0.5;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: "#040404" }}>

      {/* Hex tile texture — CSS only, no canvas cost */}
      <div className="absolute inset-0 z-[1] pointer-events-none animate-noise" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='rgba(120,120,125,0.04)' stroke-width='0.6'/%3E%3Cpolygon points='30,42 58,57 58,87 30,102 2,87 2,57' fill='none' stroke='rgba(120,120,125,0.028)' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "60px 104px",
      }} />

      {/* Diagonal slash */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(-45deg, transparent 0px, transparent 38px, rgba(100,100,104,0.02) 38px, rgba(100,100,104,0.02) 39px)`,
      }} />

      {/* Depth radial */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{
        background: "radial-gradient(ellipse 110% 110% at 50% 50%, rgba(22,22,22,0.4) 0%, rgba(4,4,4,0.86) 100%)",
      }} />

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[3]" style={{ willChange: "transform" }} />

      {/* Vignette */}
      <div className="absolute inset-0 z-[4] pointer-events-none" style={{
        background: "radial-gradient(ellipse 74% 74% at 50% 50%, transparent 16%, rgba(4,4,4,0.94) 100%)",
      }} />

      {/* Film grain */}
      <div className="absolute inset-0 z-[5] pointer-events-none animate-grain" style={{
        opacity: 0.026,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />
    </div>
  );
}