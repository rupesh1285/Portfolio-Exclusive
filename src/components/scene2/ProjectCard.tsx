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

  // Custom Interlocking Aerodynamic Shapes
  let radiusClass = "rounded-[40px]";
  if (i === 0) radiusClass = "rounded-tl-[48px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[48px]"; // Project 1
  else if (i === 1) radiusClass = "rounded-tl-[12px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[12px]"; // Project 2
  else if (i === 2) radiusClass = "rounded-tl-[48px] rounded-tr-[12px] rounded-bl-[48px] rounded-br-[48px]"; // Project 3 (Tall)
  else if (i === 3) radiusClass = "rounded-tl-[12px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[12px]"; // Project 4
  else if (i === 4) radiusClass = "rounded-tl-[48px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[48px]"; // Project 5
  else if (i === 5) radiusClass = "rounded-tl-[12px] rounded-tr-[48px] rounded-bl-[48px] rounded-br-[48px]"; // Project 6

  return (
    <motion.article
      layoutId={`project-${p.id}`}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-s2-project
      onClick={onClick}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: [0.2, 1, 0.2, 1] } }}
      className={`group/card relative flex flex-col overflow-hidden border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] z-10 hover:z-40 cursor-pointer ${spanClass} ${radiusClass}`}
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

        {/* Dynamic Test Hover Hints: Text Edition Round 2 */}
        {i === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
             <h3 className="text-[12vw] leading-none text-transparent bg-clip-text bg-gradient-to-t from-white via-white to-transparent bg-[length:100%_200%] bg-[position:0_100%] group-hover/card:bg-[position:0_0] transition-all duration-[1.2s] ease-[0.16,1,0.3,1] tracking-widest" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)", ...bebas }}>
               EXPLORE
             </h3>
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
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
             {/* Technical Mask Drop */}
             <div className="absolute top-0 left-0 right-0 h-[50%] bg-black/80 backdrop-blur-md -translate-y-full group-hover/card:translate-y-0 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]" />
             <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-black/80 backdrop-blur-md translate-y-full group-hover/card:translate-y-0 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]" />
             <div className="absolute inset-0 flex items-center justify-center z-10">
               <span className="text-white text-5xl font-bold tracking-[0.4em] uppercase scale-x-0 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-x-100 transition-all duration-[1s] delay-100 ease-[0.16,1,0.3,1]" style={bebas}>
                 EXPLORE
               </span>
             </div>
          </div>
        )}
        {i === 3 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" style={{ perspective: "1000px" }}>
             <div className="text-white text-5xl font-bold uppercase tracking-[0.2em] transition-transform duration-[0.8s] ease-[0.16,1,0.3,1] origin-bottom [transform:rotateX(-90deg)] group-hover/card:[transform:rotateX(0deg)]" style={bebas}>
               CLICK TO EXPLORE
             </div>
          </div>
        )}
        {i === 4 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
             <div className="relative flex items-center justify-center">
               <h3 className="absolute text-[11px] md:text-sm font-bold uppercase tracking-[0.4em] text-transparent stroke-white stroke-1 translate-y-0 group-hover/card:-translate-y-8 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)", ...mono }}>
                 Click To Explore
               </h3>
               <h3 className="relative z-10 text-[11px] md:text-sm font-bold uppercase tracking-[0.4em] text-white" style={mono}>
                 Click To Explore
               </h3>
               <h3 className="absolute text-[11px] md:text-sm font-bold uppercase tracking-[0.4em] text-transparent stroke-white stroke-1 translate-y-0 group-hover/card:translate-y-8 transition-transform duration-[0.8s] ease-[0.16,1,0.3,1]" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)", ...mono }}>
                 Click To Explore
               </h3>
             </div>
          </div>
        )}
        {i === 5 && (
          <div className="absolute inset-0 z-20 pointer-events-none bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
             <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-24 bg-white/10 backdrop-blur-md border-r border-white/20 -translate-x-full group-hover/card:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
               <span className="text-white text-sm font-bold tracking-[0.5em] uppercase -rotate-90 whitespace-nowrap" style={mono}>
                 — Click To Explore
               </span>
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
