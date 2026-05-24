"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Project } from "./projectData";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number; onClick: () => void };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i, onClick }: Props) {
  // Bento Grid Sizing Logic (6 Cards)
  let spanClass = "md:col-span-1 md:row-span-1";
  if (i === 0) spanClass = "md:col-span-2 md:row-span-2";      // Massive featured
  else if (i === 1) spanClass = "md:col-span-1 md:row-span-2"; // Tall
  else if (i === 2) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 3) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 4) spanClass = "md:col-span-1 md:row-span-1"; // Normal
  else if (i === 5) spanClass = "md:col-span-3 md:row-span-1"; // Full-width footer

  return (
    <motion.article
      layoutId={`project-${p.id}`}
      data-s2-project
      onClick={onClick}
      className={`group/card relative flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] 
        group-hover/grid:[&:not(:hover)]:opacity-30 group-hover/grid:[&:not(:hover)]:scale-[0.97] group-hover/grid:[&:not(:hover)]:grayscale-[50%]
        hover:z-40 hover:-translate-y-3 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] cursor-pointer
        ${spanClass}`}
    >
      {/* -----------------------------
          BASE CARD (Seen in Grid) 
          ----------------------------- */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} transition-transform duration-1000 ease-out group-hover/card:scale-105`} />
        
        {/* Hover "Click to expand" overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-black/10 backdrop-blur-[2px] z-20">
           <span className="bg-white text-black px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-xl transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500" style={mono}>
              Click to expand
           </span>
        </div>

        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm z-10" style={mono}>
          {p.year}
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-2 bg-white p-6 md:p-8 shrink-0">
        <h2 className="text-[clamp(1.5rem,3vw,3rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
          {p.title}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-black/40" style={mono}>
          {p.role}
        </span>
      </div>
    </motion.article>
  );
});
