"use client";

import { memo } from "react";
import type { Project } from "./projectData";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i }: Props) {
  // Bento Grid Sizing Logic
  // Project 0: Large (2 cols, 2 rows)
  // Project 1: Tall (1 col, 2 rows)
  // Project 2: Wide (2 cols, 1 row)
  // Project 3: Normal (1 col, 1 row)
  // Project 4: Full Width footer (3 cols, 1 row)
  let spanClass = "md:col-span-1 md:row-span-1";
  if (i === 0) spanClass = "md:col-span-2 md:row-span-2";
  else if (i === 1) spanClass = "md:col-span-1 md:row-span-2";
  else if (i === 2) spanClass = "md:col-span-2 md:row-span-1";
  else if (i === 3) spanClass = "md:col-span-1 md:row-span-1";
  else if (i === 4) spanClass = "md:col-span-3 md:row-span-1";

  return (
    <article
      data-s2-project
      className={`group relative flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${spanClass}`}
    >
      {/* Visual Area */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} transition-transform duration-1000 ease-out group-hover:scale-105`} />
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-50 transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Floating badge */}
        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm transition-transform duration-500 group-hover:-translate-y-1" style={mono}>
          {p.year}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col gap-4 bg-white p-6 md:p-8 shrink-0">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-[clamp(1.5rem,3vw,3rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
            {p.title}
          </h2>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-black/40" style={mono}>
            {p.role}
          </span>
        </div>
        
        <p className="text-[13px] leading-[1.6] text-black/60 line-clamp-2 max-w-xl" style={mono}>
          {p.blurb}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/5 bg-black/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/50"
              style={mono}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});
