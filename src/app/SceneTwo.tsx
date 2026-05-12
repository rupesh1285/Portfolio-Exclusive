"use client";

import { useEffect, useRef } from "react";

const mono = { fontFamily: "'DM Mono', ui-monospace, monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

type Project = {
  id: string;
  index: string;
  title: string;
  role: string;
  year: string;
  blurb: string;
  detail: string;
  tags: string[];
  metrics: { k: string; v: string }[];
  accent: string;
};

const projects: Project[] = [
  {
    id: "aurora",
    index: "01",
    title: "Aurora Console",
    role: "Lead frontend · sample",
    year: "2025",
    blurb:
      "Unified operations dashboard with sub-50ms updates across 12 chart surfaces. Sample copy — replace with your problem statement and outcome metrics.",
    detail:
      "Shipped incremental static regeneration paths, edge caching, and a tokenized design system so PMs could assemble new views without engineering every time.",
    tags: ["Next.js", "TypeScript", "Redis", "WebSockets"],
    metrics: [
      { k: "Latency p95", v: "38ms" },
      { k: "Uptime", v: "99.98%" },
    ],
    accent: "from-zinc-200 via-neutral-100 to-stone-300",
  },
  {
    id: "lattice",
    index: "02",
    title: "Lattice Commerce",
    role: "Full-stack · sample",
    year: "2025",
    blurb:
      "Headless storefront experiment with optimistic carts and inventory reconciliation. Replace with your stack and constraints.",
    detail:
      "Built checkout resilience with idempotency keys, saga-style rollbacks, and a storybook-driven component library shared with native clients.",
    tags: ["Node.js", "PostgreSQL", "GraphQL", "Stripe"],
    metrics: [
      { k: "Conv. lift", v: "+4.2%" },
      { k: "API errors", v: "-62%" },
    ],
    accent: "from-neutral-100 via-zinc-100 to-stone-200",
  },
  {
    id: "signal",
    index: "03",
    title: "Signal Desk",
    role: "Realtime systems · sample",
    year: "2024",
    blurb:
      "Live incident workspace for distributed teams — presence, timelines, and annotated traces in one surface.",
    detail:
      "WebSocket fan-out with Redis streams, backpressure tuning, and accessibility pass on every interactive control.",
    tags: ["React", "Go", "Kafka", "OpenTelemetry"],
    metrics: [
      { k: "Concurrent rooms", v: "3k+" },
      { k: "MTTR delta", v: "-18%" },
    ],
    accent: "from-stone-200 via-neutral-50 to-zinc-200",
  },
  {
    id: "meridian",
    index: "04",
    title: "Meridian Atlas",
    role: "WebGL + app shell · sample",
    year: "2024",
    blurb:
      "Geospatial explorer layering vector tiles with GPU-filtered overlays — sample narrative for your maps or 3D work.",
    detail:
      "Custom shaders for elevation shading, LOD streaming, and graceful CPU fallback when WebGL2 is unavailable.",
    tags: ["Three.js", "MapLibre", "Web Workers", "Vite"],
    metrics: [
      { k: "Draw calls", v: "-40%" },
      { k: "Session length", v: "2.4×" },
    ],
    accent: "from-zinc-100 via-stone-100 to-neutral-200",
  },
  {
    id: "forge",
    index: "05",
    title: "Forge CI",
    role: "Platform · sample",
    year: "2023",
    blurb:
      "Pipeline analytics product — flaky test detection, queue heatmaps, and owner routing. Placeholder until you paste the real story.",
    detail:
      "Ingested build metadata into ClickHouse, exposed SQL-backed charts, and shipped Slack actions for one-click retries.",
    tags: ["Docker", "ClickHouse", "Temporal", "AWS"],
    metrics: [
      { k: "CI minutes saved", v: "820k/mo" },
      { k: "MTTD flake", v: "-31%" },
    ],
    accent: "from-neutral-100 via-zinc-50 to-stone-200",
  },
  {
    id: "vault",
    index: "06",
    title: "Vault Notes",
    role: "Product engineer · sample",
    year: "2023",
    blurb:
      "Offline-first notes client with conflict-free sync and encrypted attachments — sample positioning for productivity work.",
    detail:
      "CRDT-backed document model, WASM crypto hooks, and progressive web install flows tuned for emerging markets.",
    tags: ["CRDT", "SQLite", "WASM", "PWA"],
    metrics: [
      { k: "Sync roundtrip", v: "120ms" },
      { k: "NPS", v: "54" },
    ],
    accent: "from-stone-100 via-neutral-100 to-zinc-200",
  },
];

/** One paint-friendly stack: merged gradients + pattern (no animation). */
function SceneTwoBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ contain: "strict" }}
    >
      {/* Base + washes in a single layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(168deg, #ddd5c8 0%, #ebe6de 22%, #f5f2ec 48%, #faf8f4 72%, #d8d0c6 100%),
            radial-gradient(ellipse 90% 55% at 8% 12%, rgba(255,252,248,0.95) 0%, transparent 52%),
            radial-gradient(ellipse 70% 50% at 92% 8%, rgba(140,130,118,0.14) 0%, transparent 48%),
            radial-gradient(ellipse 60% 45% at 70% 88%, rgba(120,110,100,0.1) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 62%)
          `,
        }}
      />

      {/* Isometric hatch — one repeating layer */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -32deg,
            transparent,
            transparent 11px,
            rgba(0,0,0,0.055) 11px,
            rgba(0,0,0,0.055) 12px
          ),
          repeating-linear-gradient(
            32deg,
            transparent,
            transparent 11px,
            rgba(0,0,0,0.04) 11px,
            rgba(0,0,0,0.04) 12px
          )`,
          maskImage: "radial-gradient(ellipse 95% 80% at 50% 40%, black 0%, transparent 78%)",
        }}
      />

      {/* Registration cross + rings (SVG, flat) */}
      <svg
        className="absolute left-1/2 top-[12%] h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-x-1/2 opacity-[0.11]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="198" stroke="currentColor" strokeWidth="0.5" className="text-black" />
        <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.35" strokeDasharray="4 6" className="text-black" />
        <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.35" className="text-black" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="currentColor" strokeWidth="0.35" className="text-black" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="0.35" className="text-black" />
        <line x1="40" y1="40" x2="360" y2="360" stroke="currentColor" strokeWidth="0.25" opacity="0.5" className="text-black" />
        <line x1="360" y1="40" x2="40" y2="360" stroke="currentColor" strokeWidth="0.25" opacity="0.5" className="text-black" />
      </svg>

      {/* Giant typographic watermark */}
      <div
        className="absolute left-1/2 top-[28%] w-[200%] -translate-x-1/2 -rotate-[9deg] select-none text-center"
        style={bebas}
      >
        <span className="block text-[clamp(5rem,22vw,14rem)] leading-none tracking-[0.04em] text-black/[0.045]">
          SELECTED
        </span>
        <span className="-mt-2 block text-[clamp(4rem,18vw,11rem)] leading-none tracking-[0.32em] text-transparent" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.07)" }}>
          WORK
        </span>
      </div>

      {/* Inset architectural frame */}
      <div
        className="absolute inset-3 rounded-sm border border-black/[0.07] md:inset-5"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.06) 0, transparent 80px, transparent calc(100% - 80px), rgba(0,0,0,0.06) 100%)",
        }}
      />
      <div className="absolute inset-3 rounded-sm border border-white/40 md:inset-5" />

      {/* Corner brackets */}
      {(
        [
          "left-5 top-5 md:left-8 md:top-8",
          "right-5 top-5 md:right-8 md:top-8 rotate-90",
          "left-5 bottom-5 md:left-8 md:bottom-8 -rotate-90",
          "right-5 bottom-5 md:right-8 md:bottom-8 rotate-180",
        ] as const
      ).map((pos) => (
        <div
          key={pos}
          className={`pointer-events-none absolute h-7 w-7 border-black/[0.12] ${pos}`}
          style={{ borderTopWidth: 1, borderLeftWidth: 1, borderStyle: "solid" }}
        />
      ))}

      {/* Module numbers strip (decorative) */}
      <div
        className="absolute bottom-24 left-0 right-0 flex justify-between px-6 opacity-[0.07] md:px-12"
        style={mono}
      >
        {["A1", "A2", "B1", "B2", "C1", "C2", "D1"].map((m) => (
          <span key={m} className="text-[10px] tracking-[0.4em]">
            {m}
          </span>
        ))}
      </div>

      {/* Bottom handoff */}
      <div
        className="absolute inset-x-0 bottom-0 h-[min(38%,300px)]"
        style={{
          background: "linear-gradient(to top, rgba(17,19,24,0.09), transparent)",
        }}
      />
    </div>
  );
}

function ProjectVisual({ id, accent }: { id: string; accent: string }) {
  return (
    <div
      data-cursor-dark
      className={`group relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-gradient-to-br shadow-[0_16px_40px_rgba(0,0,0,0.055)] ${accent}`}
      style={{ contain: "layout paint" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent 0, transparent 16px, rgba(0,0,0,0.04) 16px, rgba(0,0,0,0.04) 17px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_72%_28%,rgba(255,255,255,0.5),transparent_58%)]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-black/[0.1] bg-white/92 px-3 py-1.5 text-[9px] uppercase tracking-[0.35em] text-black/52" style={mono}>
        <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-600/90" />
        {id}
      </div>
      <p
        className="pointer-events-none absolute bottom-5 left-5 max-w-[55%] text-[clamp(1.65rem,4vw,2.75rem)] leading-none tracking-[0.02em] text-black/[0.09] transition-colors duration-200 group-hover:text-black/14"
        style={bebas}
      >
        Preview
      </p>
    </div>
  );
}

export default function SceneTwo() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scroller = document.querySelector(".main-scroll");
    if (!root || !(scroller instanceof HTMLElement)) return;

    const nodes = root.querySelectorAll<HTMLElement>(".s2-reveal");
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("s2-inview");
          io.unobserve(entry.target);
        }
      },
      { root: scroller, threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div id="work-region" ref={rootRef} className="relative overflow-x-clip text-[#0c0c0c]">
      <SceneTwoBackdrop />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />

      <header className="s2-reveal relative z-10 mx-auto max-w-[1400px] px-5 pb-8 pt-20 md:px-10 md:pb-12 md:pt-28 lg:px-14">
        <p className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.55em] text-black/48" style={mono}>
          <span className="h-px w-12 bg-black/25" />
          Selected work
        </p>
        <h1 className="max-w-[14ch] text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.88] tracking-[0.02em]" style={bebas}>
          PROJECTS
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(0,0,0,0.2)" }}>
            THAT SHIP.
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-[14px] leading-[1.8] text-black/54" style={mono}>
          Sample deck intro — replace with how you frame case studies: constraints, your role, and the delta you
          created. The rows below are structured so swapping copy stays effortless.
        </p>
      </header>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-28 md:px-10 lg:px-14">
        {projects.map((p, i) => (
          <article
            key={p.id}
            data-s2-project
            className="s2-reveal relative mb-6 rounded-3xl border border-black/[0.1] bg-[#fcfaf6] p-6 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_14px_32px_rgba(0,0,0,0.045)] last:mb-0 md:mb-8 md:p-10 lg:p-12"
            style={{
              contain: "layout paint",
              transitionDelay: `${Math.min(i, 8) * 45}ms`,
            }}
          >
            <div
              className={`absolute left-0 top-8 bottom-8 w-[3px] rounded-full md:top-10 md:bottom-10 ${
                i % 3 === 0 ? "bg-black/18" : i % 3 === 1 ? "bg-black/12" : "bg-black/[0.09]"
              }`}
              aria-hidden
            />
            <div className="grid items-start gap-10 pl-1 lg:grid-cols-12 lg:gap-12 lg:pl-2">
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-end justify-between gap-4 lg:block">
                  <span className="text-[clamp(3.5rem,8vw,6rem)] leading-none text-black/[0.16]" style={bebas}>
                    {p.index}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-black/40 lg:mt-4" style={mono}>
                    {p.year} · {p.role}
                  </span>
                </div>
                <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.25rem)] leading-[0.95] tracking-[0.03em]" style={bebas}>
                  {p.title}
                </h2>
                <p className="mt-5 text-[13px] leading-[1.85] text-black/54" style={mono}>
                  {p.blurb}
                </p>
                <p className="mt-4 text-[12px] leading-[1.75] text-black/42" style={mono}>
                  {p.detail}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/[0.1] bg-black/[0.03] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/60"
                      style={mono}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    data-cursor-expand
                    href="#"
                    className="rounded-full border border-black/18 bg-black px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-white transition-shadow hover:shadow-md"
                    style={mono}
                  >
                    Live demo
                  </a>
                  <a
                    data-cursor-expand
                    href="#"
                    className="rounded-full border border-black/14 px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-black/74 transition-colors hover:border-black/26 hover:text-black"
                    style={mono}
                  >
                    Case write-up
                  </a>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-black/[0.08] pt-8 sm:max-w-sm">
                  {p.metrics.map((m) => (
                    <div key={m.k}>
                      <p className="text-[8px] uppercase tracking-[0.35em] text-black/40" style={mono}>
                        {m.k}
                      </p>
                      <p className="mt-1 text-2xl tracking-wide text-black/88" style={bebas}>
                        {m.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-7">
                <ProjectVisual id={p.id} accent={p.accent} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-black/14 to-transparent" />
    </div>
  );
}
