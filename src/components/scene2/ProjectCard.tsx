"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { Project } from "./projectData";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number; onClick: () => void };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i, onClick }: Props) {
  // 3-Column Exact Mockup Grid
  let spanClass = "md:col-span-2 md:row-span-1 order-1"; // Project 1: Top Left (Wide)
  if (i === 1) spanClass = "md:col-span-1 md:row-span-1 order-2"; // Project 2: Top Right (Square)
  else if (i === 2) spanClass = "md:col-span-1 md:row-span-2 order-5"; // Project 3: Right side tall card (Row 2 & 3)
  else if (i === 3) spanClass = "md:col-span-1 md:row-span-1 order-3"; // Project 4: Middle Left (Square)
  else if (i === 4) spanClass = "md:col-span-1 md:row-span-1 order-4"; // Project 5: Middle Center (Square)
  else if (i === 5) spanClass = "md:col-span-2 md:row-span-1 order-6"; // Project 6: Bottom Left (Wide)

  return (
    <motion.article
      layoutId={`project-${p.id}`}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-s2-project
      onClick={onClick}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: [0.2, 1, 0.2, 1] } }}
      className={`group/card relative flex flex-col overflow-hidden rounded-[32px] md:rounded-[40px] border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] z-10 hover:z-40 cursor-pointer ${spanClass}`}
    >
      {/* -----------------------------
          BASE CARD (Seen in Grid) 
          ----------------------------- */}
      <div className="relative flex-1 overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} transition-transform duration-1000 ease-out group-hover/card:scale-105`} />
        
        {/* Full Preview Image */}
        <img 
          src={p.image} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-105"
        />

        {/* Dynamic Test Hover Hints: Text Edition (CLICK TO EXPLORE) */}
        {i === 0 && (
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 bg-black/20">
            <div className="bg-white text-black py-4 px-2 w-[150%] -rotate-[10deg] transform -translate-x-full group-hover/card:translate-x-0 transition-transform duration-[1s] ease-[0.16,1,0.3,1] whitespace-nowrap flex justify-center gap-8 shadow-2xl">
              <span className="text-lg font-bold tracking-[0.3em] uppercase" style={mono}>Click To Explore</span>
              <span className="text-lg font-bold tracking-[0.3em] uppercase" style={mono}>Click To Explore</span>
              <span className="text-lg font-bold tracking-[0.3em] uppercase" style={mono}>Click To Explore</span>
            </div>
          </div>
        )}
        {i === 1 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none gap-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
            <div className="overflow-hidden">
              <span className="block text-white text-2xl font-bold tracking-[0.4em] uppercase translate-y-full group-hover/card:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] delay-100" style={mono}>Click</span>
            </div>
            <div className="overflow-hidden">
              <span className="block text-white text-2xl font-bold tracking-[0.4em] uppercase translate-y-full group-hover/card:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] delay-200" style={mono}>To</span>
            </div>
            <div className="overflow-hidden">
              <span className="block text-white text-2xl font-bold tracking-[0.4em] uppercase translate-y-full group-hover/card:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] delay-300" style={mono}>Explore</span>
            </div>
          </div>
        )}
        {i === 2 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
             <h3 className="text-5xl text-white tracking-[0.3em] text-center blur-xl group-hover/card:blur-0 transition-all duration-1000 ease-[0.16,1,0.3,1] scale-125 group-hover/card:scale-100" style={bebas}>
               CLICK TO<br/>EXPLORE
             </h3>
          </div>
        )}
        {i === 3 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
             <div className="text-white text-sm font-bold uppercase tracking-widest group-hover/card:tracking-[0.8em] transition-all duration-1000 ease-[0.16,1,0.3,1]" style={mono}>
               Click To Explore
             </div>
          </div>
        )}
        {i === 4 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 bg-black/30 backdrop-blur-md">
            <div className="relative w-40 h-40 rotate-[-90deg] group-hover/card:rotate-[90deg] transition-transform duration-[3s] ease-linear">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-white fill-current">
                <path id={`circlePath-${i}`} d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                <text className="text-[12px] font-bold tracking-[0.25em] uppercase" style={mono}>
                  <textPath href={`#circlePath-${i}`} startOffset="0%">CLICK TO EXPLORE • CLICK TO EXPLORE • </textPath>
                </text>
              </svg>
            </div>
            <div className="absolute w-2 h-2 bg-white rounded-full" />
          </div>
        )}
        {i === 5 && (
          <div className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none overflow-hidden">
            <div className="w-full bg-white/20 backdrop-blur-md border-y border-white/40 py-6 flex items-center justify-center translate-x-full group-hover/card:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
               <span className="text-white text-sm font-bold tracking-[0.6em] uppercase" style={mono}>Click To Explore</span>
            </div>
          </div>
        )}

        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm z-10" style={mono}>
          {p.year}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="relative z-10 flex flex-col gap-1 md:gap-1.5 bg-white p-3 md:px-5 md:py-4 shrink-0"
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
