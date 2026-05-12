export type Project = {
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

export const SCENE_TWO_PROJECTS: Project[] = [
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
