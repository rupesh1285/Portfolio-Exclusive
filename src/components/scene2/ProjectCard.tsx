"use client";

/* eslint-disable @next/next/no-img-element */
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

  // Number assignment based on visual layout
  let displayNumber = i + 1;
  if (i === 2) displayNumber = 5; // Long vertical card
  else if (i === 3) displayNumber = 3; // Small adjacent
  else if (i === 4) displayNumber = 4; // Small adjacent

  return (
    <motion.article
      layoutId={`project-${p.id}`}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      data-s2-project
      onClick={onClick}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: [0.2, 1, 0.2, 1] } }}
      className={`group/card relative flex flex-col overflow-hidden rounded-xl md:rounded-2xl border-[1.5px] border-black/20 bg-[#0d0d0d] shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-10 hover:z-40 hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] hover:border-black/60 cursor-pointer transition-colors duration-500 ${spanClass}`}
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

        {/* Floating Number Badge (Top Right) */}
        <div className="absolute right-6 top-6 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[14px] font-bold text-black shadow-lg z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100" style={mono}>
          {String(displayNumber).padStart(2, '0')}
        </div>

        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-black/80 shadow-sm z-10" style={mono}>
          {p.year}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.4 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="relative z-10 flex flex-row justify-between items-center bg-[#0d0d0d] p-4 md:px-6 md:py-5 shrink-0 border-t border-white/10 overflow-hidden"
      >
        {/* Technical Diagonal Pinstripes on Dark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 10px)`
          }}
        />

        <div className="relative z-10 flex flex-row items-center gap-4 md:gap-5">
          {/* Circular Number Badge */}
          <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 overflow-hidden group-hover/card:border-white/50 transition-colors duration-500 shrink-0 shadow-sm">
            <div className="absolute inset-0 bg-white/10 scale-y-0 group-hover/card:scale-y-100 transition-transform duration-500 origin-bottom" />
            <span className="relative z-10 text-[22px] md:text-[26px] leading-none text-white font-bold tracking-tighter" style={bebas}>
              {String(displayNumber).padStart(2, '0')}
            </span>
          </div>
          
          <div className="flex flex-col justify-center gap-1">
            <h2 className="text-[clamp(1.4rem,2.2vw,2.5rem)] leading-none tracking-[0.02em] text-white group-hover/card:translate-x-1 transition-transform duration-300" style={bebas}>
              {p.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover/card:bg-white transition-colors duration-300" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/50" style={mono}>
                {p.role}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Arrow */}
        <div className="relative z-10 hidden sm:flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white text-black -translate-x-4 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-500 ease-out shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </motion.div>
    </motion.article>
  );
});
