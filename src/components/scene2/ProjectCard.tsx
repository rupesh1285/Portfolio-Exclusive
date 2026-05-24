"use client";

import { memo } from "react";
import type { Project } from "./projectData";
import { ProjectVisual } from "./ProjectVisual";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i }: Props) {
  // Calculate dynamic sticky top position. Each card sticks slightly lower than the previous one.
  const stickyTop = `calc(12vh + ${i * 40}px)`;

  return (
    <article
      data-s2-project
      className="sticky w-full rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] md:p-10 lg:p-12 transform-gpu"
      style={{ top: stickyTop }}
    >
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 lg:block">
              <span className="text-[clamp(3.5rem,8vw,6rem)] leading-none text-black/10" style={bebas}>
                {p.index}
              </span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-black/40 lg:mt-4 block" style={mono}>
                {p.year} · {p.role}
              </span>
            </div>
            
            <h2 className="mt-6 text-[clamp(2rem,4.2vw,3.25rem)] leading-[0.95] tracking-[0.03em] text-black/90" style={bebas}>
              {p.title}
            </h2>
            
            <p className="mt-5 text-[14px] leading-[1.8] text-black/60" style={mono}>
              {p.blurb}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/60"
                  style={mono}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3 pt-6 border-t border-black/10">
            <a
              data-cursor-expand
              href="#"
              className="rounded-full border border-transparent bg-black px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-white transition-all hover:bg-gray-800"
              style={mono}
            >
              Live demo
            </a>
            <a
              data-cursor-expand
              href="#"
              className="rounded-full border border-black/20 px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-black/80 transition-colors hover:bg-black/5 hover:text-black"
              style={mono}
            >
              Case write-up
            </a>
          </div>
        </div>
        
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-black/10 shadow-lg relative group">
          {/* A sleek, minimal visual replacement for the project image */}
          <div className={`aspect-[16/10] w-full bg-gradient-to-br ${p.accent} relative`}>
            <div className="absolute inset-0 bg-white/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/40 bg-white/60 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/80" style={mono}>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {p.id}
            </div>
            <p
              className="absolute bottom-6 left-6 text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-[0.02em] text-black/20 transition-colors duration-500 group-hover:text-black/60"
              style={bebas}
            >
              Preview
            </p>
          </div>
        </div>
      </div>
    </article>
  );
});
