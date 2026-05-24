"use client";

import { useRef } from "react";

import { BelowFoldSentinel } from "@/components/ui/BelowFoldSentinel";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { bebas, mono } from "./fonts";
import { SCENE_TWO_PROJECTS } from "./projectData";
import { ProjectCard } from "./ProjectCard";
import { SceneTwoBackdrop } from "./SceneTwoBackdrop";

export type SceneTwoProps = {
  /** Prefetch / mount Scene 3 when the user nears the end of the work section. */
  onApproachSceneThree?: () => void;
};

export default function SceneTwo({ onApproachSceneThree }: SceneTwoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div
      id="work-region"
      ref={rootRef}
      className="relative overflow-x-clip text-[#0c0c0c]"
    >
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
        {SCENE_TWO_PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {onApproachSceneThree ? <BelowFoldSentinel onReveal={onApproachSceneThree} prefetchPx={600} /> : null}

      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-black/14 to-transparent" />
    </div>
  );
}
