"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bebas, mono } from "./fonts";
import { SCENE_TWO_PROJECTS } from "./projectData";
import { ProjectCard } from "./ProjectCard";

export default function SceneTwo() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedProject = SCENE_TWO_PROJECTS.find(p => p.id === expandedId);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (expandedId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [expandedId]);

  return (
    <div id="work-region" className="relative w-full text-[#0c0c0c] bg-[#fcfaf6]">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[300px] lg:auto-rows-[350px]">
          {SCENE_TWO_PROJECTS.map((p, i) => (
            <ProjectCard 
              key={p.id} 
              project={p} 
              index={i} 
              onClick={() => setExpandedId(p.id)} 
            />
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

      {/* Framer Motion Shared Layout Modal */}
      <AnimatePresence>
        {expandedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0.1 } }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setExpandedId(null)}
            />

            {/* The Expanded Window (morphs from the clicked card) */}
            <motion.div
              layoutId={`project-${expandedProject.id}`}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[95vw] md:w-[85vw] lg:w-[75vw] max-w-6xl h-[85vh] max-h-[900px] rounded-[40px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row z-10"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="absolute inset-0 pointer-events-none z-0 bg-white"
              />

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                onClick={() => setExpandedId(null)}
                className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 bg-black/5 hover:bg-black/10 text-black rounded-full w-12 h-12 flex items-center justify-center transition-colors text-[14px]"
              >
                ✕
              </motion.button>

              {/* Visual Side */}
              <div className={`relative w-full lg:w-[60%] h-[45%] lg:h-full bg-gradient-to-br ${expandedProject.accent}`}>
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-50" />
                
                {/* 16:9 Inner Mockup Container (Optional, to enforce ratio) */}
                <div className="absolute inset-8 lg:inset-16 bg-black/5 rounded-xl border border-black/10 shadow-2xl flex items-center justify-center overflow-hidden">
                   <p className="text-black/40 text-[10px] uppercase tracking-[0.4em]" style={mono}>16:9 Desktop Preview</p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="absolute left-8 top-8 lg:left-12 lg:top-12 flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-black/90 shadow-lg" style={mono}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  Interactive Preview
                </motion.div>
              </div>

              {/* Content Side */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                className="relative z-10 w-full lg:w-[40%] h-[55%] lg:h-full p-8 lg:p-12 flex flex-col overflow-hidden"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <span className="text-[clamp(3.5rem,6vw,6rem)] leading-none text-black/10" style={bebas}>
                      {expandedProject.index}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-black/40" style={mono}>
                      {expandedProject.year} · {expandedProject.role}
                    </span>
                  </div>

                  <h2 className="mt-4 lg:mt-8 text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
                    {expandedProject.title}
                  </h2>

                  <p className="mt-4 lg:mt-6 text-[13px] leading-[1.7] text-black/60 line-clamp-4 lg:line-clamp-none" style={mono}>
                    {expandedProject.blurb}
                  </p>

                  <div className="mt-6 lg:mt-8 flex flex-wrap gap-2">
                    {expandedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/60 shadow-sm"
                        style={mono}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row items-center gap-3 pt-6 lg:pt-8 mt-auto border-t border-black/10 shrink-0">
                  <a
                    data-cursor-expand
                    href="#"
                    className="flex-1 text-center rounded-full border border-transparent bg-black px-2 py-4 text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:bg-gray-800 shadow-md whitespace-nowrap"
                    style={mono}
                  >
                    Launch
                  </a>
                  <a
                    data-cursor-expand
                    href="#"
                    className="flex-1 text-center rounded-full border border-black/20 bg-white px-2 py-4 text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-black/80 transition-colors hover:bg-black/5 whitespace-nowrap"
                    style={mono}
                  >
                    Case study
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
