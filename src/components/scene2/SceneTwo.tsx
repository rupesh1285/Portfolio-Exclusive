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
    <div id="work-region" className="relative w-full text-[#0c0c0c] bg-[#fcfaf6] overflow-hidden">
      {/* Premium Engineered Background (High Performance) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 1. Fast CSS Mesh Gradient for different shades */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-70"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(220, 235, 255, 0.8) 0%, transparent 35%),
              radial-gradient(circle at 90% 80%, rgba(255, 225, 220, 0.8) 0%, transparent 40%),
              radial-gradient(circle at 50% 100%, rgba(220, 255, 235, 0.6) 0%, transparent 50%)
            `
          }}
        />

        {/* 2. Structured Engineering Grid Texture */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />

        {/* 3. Geometric & Typographic Accents */}
        <div className="absolute top-[15%] left-[5%] text-black/20 font-mono text-xs tracking-widest hidden md:block">+ 45.092_N</div>
        <div className="absolute top-[50%] right-[4%] text-black/20 font-mono text-xs tracking-widest hidden md:block rotate-90 origin-right">SYSTEM_REQ // 02</div>
        <div className="absolute bottom-[15%] left-[10%] w-24 h-[1px] bg-black/10 hidden md:block" />
        <div className="absolute top-[25%] right-[12%] w-[1px] h-24 bg-black/10 hidden md:block" />
        <div className="absolute bottom-[20%] right-[20%] w-2 h-2 border border-black/20 rounded-full hidden md:block" />
      </div>

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
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 auto-rows-[280px] lg:auto-rows-[320px]">
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
              className="relative w-[95vw] max-w-[1500px] rounded-[32px] md:rounded-[40px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row z-10"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="absolute inset-0 pointer-events-none z-0 bg-white"
              />

              {/* Visual Side - STRICTLY 16:9, NO GAPS */}
              <div className="relative w-full lg:w-[60%] xl:w-[65%] aspect-video bg-gray-100 shrink-0 overflow-hidden group/preview">
                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                  <img 
                    src={expandedProject.image} 
                    alt={expandedProject.title} 
                    className="w-full min-h-full object-cover object-top"
                  />
                </div>
                {/* Scroll Indicator (only visible if user hovers) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[9px] uppercase tracking-widest opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none" style={mono}>
                  <span className="animate-bounce">↓</span> Scroll to explore
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="absolute left-6 top-6 lg:left-8 lg:top-8 flex items-center gap-3 rounded-full bg-white/80 backdrop-blur-md px-5 py-2.5 text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-black/90 shadow-lg z-10" style={mono}
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
                className="relative z-10 w-full lg:w-[40%] xl:w-[35%] p-6 lg:p-8 xl:p-10 flex flex-col bg-white overflow-y-auto"
              >
                {/* Close Button - Moved to the Info Section top-right */}
                <button
                  onClick={() => setExpandedId(null)}
                  className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 bg-black/5 hover:bg-black/10 text-black rounded-full w-10 h-10 flex items-center justify-center transition-colors text-[14px]"
                >
                  ✕
                </button>

                <div className="flex-1 flex flex-col">
                  {/* Top Layout: Name & Number */}
                  <div className="flex justify-between items-start pr-12">
                    <div>
                      <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.35em] text-black/40" style={mono}>
                        {expandedProject.year} · {expandedProject.role}
                      </span>
                      <h2 className="mt-2 text-[clamp(1.8rem,2.5vw,2.8rem)] leading-[0.95] tracking-[0.02em] text-black/90" style={bebas}>
                        {expandedProject.title}
                      </h2>
                    </div>
                    <span className="text-[clamp(2.5rem,4vw,4.5rem)] leading-none text-black/10" style={bebas}>
                      {expandedProject.index}
                    </span>
                  </div>

                  {/* Body Content: Blurb vs Highlights Toggle */}
                  <div className="mt-6 flex flex-col gap-6">
                    <p className="text-[12px] lg:text-[13px] leading-[1.6] text-black/60" style={mono}>
                      {expandedProject.blurb}
                    </p>

                    {/* Highlights Section */}
                    <div className="bg-black/5 rounded-2xl p-6 border border-black/5">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-black/80 mb-4 font-bold" style={mono}>
                        Project Highlights
                      </h3>
                      <p className="text-[12px] leading-[1.6] text-black/60 mb-6" style={mono}>
                        {expandedProject.detail}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {expandedProject.metrics.map((m) => (
                          <div key={m.k} className="flex flex-col gap-1">
                            <span className="text-[16px] text-black/90 tracking-[0.02em]" style={bebas}>{m.v}</span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-black/40" style={mono}>{m.k}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 lg:mt-8 flex flex-wrap gap-2">
                    {expandedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-black/60 shadow-sm"
                        style={mono}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-row items-center gap-3 pt-4 lg:pt-6 mt-6 border-t border-black/10 shrink-0">
                  <a
                    data-cursor-expand
                    href="#"
                    className="flex-[1.5] text-center rounded-full border border-transparent bg-black px-4 py-4 text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:bg-gray-800 shadow-md whitespace-nowrap"
                    style={mono}
                  >
                    Launch demo
                  </a>
                  <a
                    data-cursor-expand
                    href="#"
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white px-4 py-4 text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-black/80 transition-colors hover:bg-black/5 whitespace-nowrap"
                    style={mono}
                  >
                    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
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
