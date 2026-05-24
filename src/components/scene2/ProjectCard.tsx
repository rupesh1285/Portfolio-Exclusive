"use client";

import { memo } from "react";
import type { Project } from "./projectData";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i }: Props) {
  // Bento Grid Sizing Logic (6 Cards)
  let spanClass = "md:col-span-1 md:row-span-1";
  if (i === 0) spanClass = "md:col-span-2 md:row-span-2";      // Massive featured
  else if (i === 1) spanClass = "md:col-span-1 md:row-span-2"; // Tall
  else if (i === 2) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 3) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 4) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 5) spanClass = "md:col-span-3 md:row-span-1"; // Full-width footer

  return (
    <article
      data-s2-project
      className={`group/card relative flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] 
        hover:shadow-[0_40px_100px_rgba(0,0,0,0.15)] hover:-translate-y-4 hover:scale-[1.03] hover:z-50 
        group-hover/grid:[&:not(:hover)]:opacity-40 group-hover/grid:[&:not(:hover)]:scale-[0.97] group-hover/grid:[&:not(:hover)]:blur-[2px] group-hover/grid:[&:not(:hover)]:grayscale-[30%]
        ${spanClass}`}
    >
      {/* Visual Area */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} transition-transform duration-1000 ease-out group-hover/card:scale-110`} />
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-50 transition-opacity duration-700 group-hover/card:opacity-0" />
        
        {/* Floating badge */}
        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm transition-transform duration-700 group-hover/card:-translate-y-2" style={mono}>
          {p.year}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col gap-4 bg-white p-6 md:p-8 shrink-0 transition-transform duration-700 group-hover/card:-translate-y-1">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-[clamp(1.5rem,3vw,3rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
            {p.title}
          </h2>
          <span className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-black/40" style={mono}>
            {p.role}
          </span>
        </div>
        
        <p className="text-[13px] leading-[1.6] text-black/60 line-clamp-2 max-w-xl transition-opacity duration-700 group-hover/card:opacity-100" style={mono}>
          {p.blurb}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/5 bg-black/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/50 transition-colors duration-500 group-hover/card:bg-black/5 group-hover/card:text-black/70"
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
