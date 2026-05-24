import { bebas, mono } from "./fonts";
import { SCENE_TWO_PROJECTS } from "./projectData";
import { ProjectCard } from "./ProjectCard";

export default function SceneTwo() {
  return (
    <div
      id="work-region"
      className="relative w-full text-[#0c0c0c] bg-[#fcfaf6]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03)_0%,transparent_50%)]" />

      <header className="relative z-10 mx-auto max-w-[1400px] px-5 pb-8 pt-20 md:px-10 md:pb-12 md:pt-28 lg:px-14">
        <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.55em] text-black/40" style={mono}>
          <span className="h-px w-12 bg-black/20" />
          Selected work
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            className="max-w-[14ch] text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.9] tracking-[0.02em] text-black/90"
            style={bebas}
          >
            Digital <br /> Experiences
          </h2>
          <p className="max-w-xs text-[13px] leading-[1.85] text-black/60 md:text-right" style={mono}>
            A curated selection of recent projects exploring the intersection of design, motion, and creative engineering.
          </p>
        </div>
      </header>

      {/* Bento Grid Container */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-32 pt-8 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[350px] md:auto-rows-[400px] lg:auto-rows-[450px]">
          {SCENE_TWO_PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-32 text-center md:px-10 lg:px-14">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-black/40" style={mono}>
          End of showcase
        </p>
        <a
          data-cursor-expand
          href="#"
          className="inline-flex items-center gap-4 rounded-full border border-black/10 bg-black/5 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-black/80 transition-all hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] group"
          style={mono}
        >
          View full archive
          <span className="text-black/30 group-hover:text-white/60">→</span>
        </a>
      </div>
    </div>
  );
}
