"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

/** Static decorative field — no JS, no blur, GPU-friendly */
function SceneTwoBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ contain: "strict" }}
    >
      {/* Warm paper base + cool edge */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(165deg, #e8e4dc 0%, #f2f0eb 38%, #faf8f5 62%, #e6e3dd 100%)
          `,
        }}
      />
      {/* Large wash orbs (static) */}
      <div
        className="absolute -left-[20%] top-[-15%] h-[55vmin] w-[55vmin] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.85), transparent 68%)",
        }}
      />
      <div
        className="absolute -right-[12%] top-[30%] h-[45vmin] w-[45vmin] rounded-full opacity-35"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(180,175,168,0.35), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[25%] h-[50vmin] w-[50vmin] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(200,195,188,0.25), transparent 72%)",
        }}
      />
      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 35%, black 12%, transparent 100%)",
        }}
      />
      {/* Micro-dot texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 92%)",
        }}
      />
      {/* Diagonal hairlines */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -28deg,
            transparent 0,
            transparent 80px,
            rgba(0,0,0,0.06) 80px,
            rgba(0,0,0,0.06) 81px
          )`,
        }}
      />
      {/* Bottom vignette into Scene 3 */}
      <div
        className="absolute inset-x-0 bottom-0 h-[min(40%,320px)]"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.06), transparent)",
        }}
      />
    </div>
  );
}

function ProjectVisual({ id, accent }: { id: string; accent: string }) {
  return (
    <div
      data-cursor-dark
      className={`group relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-black/[0.07] bg-gradient-to-br shadow-[0_20px_50px_rgba(0,0,0,0.06)] ${accent}`}
      style={{ contain: "layout paint" }}
    >
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent 0, transparent 14px, rgba(0,0,0,0.035) 14px, rgba(0,0,0,0.035) 15px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-black/[0.05] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full border border-black/[0.06] transition-transform duration-700 ease-out group-hover:-translate-y-1" />
      <div
        className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.35em] text-black/50"
        style={mono}
      >
        <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-600/90" />
        {id}
      </div>
      <p
        className="pointer-events-none absolute bottom-6 left-6 max-w-[58%] text-[clamp(1.75rem,4.5vw,3rem)] leading-none tracking-[0.02em] text-black/[0.08] transition-colors duration-300 group-hover:text-black/14"
        style={bebas}
      >
        Preview
      </p>
    </div>
  );
}

export default function SceneTwo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const scroller = document.querySelector(".main-scroll") as HTMLElement | null;
    if (!root || !scroller) return;

    const stCommon = {
      scroller,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    } as const;

    const ctx = gsap.context(() => {
      if (introRef.current) {
        gsap.from(introRef.current, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            ...stCommon,
            trigger: introRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      root.querySelectorAll("[data-s2-project]").forEach((section) => {
        gsap.from(section, {
          y: 32,
          opacity: 0,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            ...stCommon,
            trigger: section as HTMLElement,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }, root);

    let resizeT: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    window.addEventListener("resize", onResize, { passive: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div id="work-region" ref={rootRef} className="relative overflow-x-clip text-[#0c0c0c]">
      <SceneTwoBackdrop />

      {/* Edge frame */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />

      <header
        ref={introRef}
        className="relative z-10 mx-auto max-w-[1400px] px-5 pb-8 pt-20 md:px-10 md:pb-12 md:pt-28 lg:px-14"
      >
        <p className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.55em] text-black/45" style={mono}>
          <span className="h-px w-12 bg-black/22" />
          Selected work
        </p>
        <h1 className="max-w-[14ch] text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.88] tracking-[0.02em]" style={bebas}>
          PROJECTS
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(0,0,0,0.2)" }}>
            THAT SHIP.
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-[14px] leading-[1.8] text-black/52" style={mono}>
          Sample deck intro — replace with how you frame case studies: constraints, your role, and the delta you
          created. The rows below are structured so swapping copy stays effortless.
        </p>
      </header>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-28 md:px-10 lg:px-14">
        {projects.map((p) => (
          <article
            key={p.id}
            data-s2-project
            className="mb-6 rounded-3xl border border-black/[0.08] bg-[#fdfcf9] p-6 shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_rgba(0,0,0,0.04)] last:mb-0 md:mb-8 md:p-10 lg:p-12"
            style={{ contain: "layout paint" }}
          >
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-end justify-between gap-4 lg:block">
                  <span className="text-[clamp(3.5rem,8vw,6rem)] leading-none text-black/[0.14]" style={bebas}>
                    {p.index}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-black/38 lg:mt-4" style={mono}>
                    {p.year} · {p.role}
                  </span>
                </div>
                <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.25rem)] leading-[0.95] tracking-[0.03em]" style={bebas}>
                  {p.title}
                </h2>
                <p className="mt-5 text-[13px] leading-[1.85] text-black/52" style={mono}>
                  {p.blurb}
                </p>
                <p className="mt-4 text-[12px] leading-[1.75] text-black/40" style={mono}>
                  {p.detail}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-black/[0.08] bg-black/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/58"
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
                    className="rounded-full border border-black/18 bg-black px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-white transition-[transform,box-shadow] hover:shadow-md active:scale-[0.98]"
                    style={mono}
                  >
                    Live demo
                  </a>
                  <a
                    data-cursor-expand
                    href="#"
                    className="rounded-full border border-black/15 px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-black/72 transition-colors hover:border-black/28 hover:text-black"
                    style={mono}
                  >
                    Case write-up
                  </a>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-4 border-t border-black/[0.07] pt-8 sm:max-w-sm">
                  {p.metrics.map((m) => (
                    <div key={m.k}>
                      <p className="text-[8px] uppercase tracking-[0.35em] text-black/38" style={mono}>
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

      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent" />
    </div>
  );
}
