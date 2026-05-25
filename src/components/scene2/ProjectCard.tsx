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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-s2-project
      onClick={onClick}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: [0.2, 1, 0.2, 1] } }}
      className={`group/card relative flex flex-col overflow-hidden rounded-[32px] md:rounded-[40px] border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow duration-700 hover:z-40 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] cursor-pointer ${spanClass}`}
    >
      {/* -----------------------------
          BASE CARD (Seen in Grid) 
          ----------------------------- */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} transition-transform duration-1000 ease-out group-hover/card:scale-105`} />
        
        {/* Peeking Project Image */}
        <div className="absolute top-12 left-6 md:top-16 md:left-10 right-0 bottom-0 rounded-tl-2xl overflow-hidden shadow-[-10px_-10px_30px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-out group-hover/card:-translate-y-2 group-hover/card:-translate-x-2 bg-white">
           <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-200/80 backdrop-blur-sm border-b border-white/20 flex items-center px-3 gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-red-400/80"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
              <span className="w-2 h-2 rounded-full bg-green-400/80"></span>
           </div>
           <img 
             src={p.image} 
             alt="" 
             className="absolute inset-0 w-full h-full object-cover object-top pt-6"
           />
        </div>

        {/* Corner Iris Hover Indicator */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-black/90 backdrop-blur-md rounded-bl-[100%] opacity-0 group-hover/card:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] transform origin-top-right scale-0 group-hover/card:scale-100 z-20 flex items-center justify-center">
           <svg 
             className="w-5 h-5 text-white translate-x-2 -translate-y-2 transform transition-transform duration-500 group-hover/card:translate-x-3 group-hover/card:-translate-y-3" 
             fill="none" 
             stroke="currentColor" 
             viewBox="0 0 24 24"
           >
             <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
           </svg>
        </div>

        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm z-10" style={mono}>
          {p.year}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="relative z-10 flex flex-col gap-2 bg-white p-6 md:p-8 shrink-0"
      >
        <h2 className="text-[clamp(1.5rem,3vw,3rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
          {p.title}
        </h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-black/40" style={mono}>
          {p.role}
        </span>
      </motion.div>
    </motion.article>
  );
});
