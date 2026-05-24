"use client";

import { memo, useState, useEffect } from "react";
import type { Project } from "./projectData";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      onClick={() => setIsExpanded(true)}
      className={`group/card relative flex flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] 
        group-hover/grid:[&:not(:hover)]:opacity-30 group-hover/grid:[&:not(:hover)]:scale-[0.97] group-hover/grid:[&:not(:hover)]:blur-[4px] group-hover/grid:[&:not(:hover)]:grayscale-[50%]
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

      {/* -----------------------------
          EXPANDED MODAL (Center Screen) 
          ----------------------------- */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 backdrop-blur-md bg-black/40 ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(false);
        }}
      >
        {/* The Massive Window */}
        <div 
          className={`relative w-[95vw] md:w-[85vw] lg:w-[75vw] max-w-6xl h-[85vh] max-h-[900px] rounded-[40px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row transform transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] ${isExpanded ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
        >
           {/* Close Button */}
           <button 
             onClick={() => setIsExpanded(false)}
             className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 bg-black/5 hover:bg-black/10 text-black rounded-full w-12 h-12 flex items-center justify-center transition-colors text-[14px]"
           >
             ✕
           </button>
           
           {/* Visual Side */}
           <div className={`relative w-full lg:w-[55%] h-[40%] lg:h-full bg-gradient-to-br ${p.accent}`}>
             <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-50" />
             <div className="absolute left-8 top-8 lg:left-12 lg:top-12 flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-black/90 shadow-lg" style={mono}>
               <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
               Interactive Preview
             </div>
           </div>

           {/* Content Side */}
           <div className="relative w-full lg:w-[45%] h-[60%] lg:h-full p-8 lg:p-16 flex flex-col justify-between bg-white overflow-y-auto">
             <div>
               <div className="flex items-center gap-4">
                 <span className="text-[clamp(4rem,8vw,8rem)] leading-none text-black/10" style={bebas}>
                   {p.index}
                 </span>
                 <span className="text-[11px] uppercase tracking-[0.35em] text-black/40" style={mono}>
                   {p.year} · {p.role}
                 </span>
               </div>
               
               <h2 className="mt-6 lg:mt-10 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
                 {p.title}
               </h2>
               
               <p className="mt-6 text-[14px] leading-[1.8] text-black/60" style={mono}>
                 {p.blurb}
               </p>
               
               <div className="mt-10 flex flex-wrap gap-2">
                 {p.tags.map((t) => (
                   <span
                     key={t}
                     className="rounded-full border border-black/10 bg-black/5 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/60 shadow-sm"
                     style={mono}
                   >
                     {t}
                   </span>
                 ))}
               </div>
             </div>

             <div className="flex flex-wrap gap-4 pt-10 mt-10 border-t border-black/10 shrink-0">
               <a
                 data-cursor-expand
                 href="#"
                 className="rounded-full border border-transparent bg-black px-8 py-5 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-white transition-all hover:bg-gray-800 shadow-md"
                 style={mono}
               >
                 Launch demo
               </a>
               <a
                 data-cursor-expand
                 href="#"
                 className="rounded-full border border-black/20 bg-white px-8 py-5 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-black/80 transition-colors hover:bg-black/5"
                 style={mono}
               >
                 Read case study
               </a>
             </div>
           </div>
        </div>
      </div>
    </article>
  );
});
