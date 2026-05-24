"use client";

import { memo } from "react";
import type { Project } from "./projectData";
import { ProjectVisual } from "./ProjectVisual";
import { bebas, mono } from "./fonts";

type Props = { project: Project; index: number };

export const ProjectCard = memo(function ProjectCard({ project: p, index: i }: Props) {
  return (
    <article
      data-s2-project
      className="relative mb-6 rounded-3xl border border-black/[0.1] bg-[#fcfaf6] p-6 shadow-sm last:mb-0 md:mb-8 md:p-10 lg:p-12"
    >
      <div
        className={`absolute left-0 top-8 bottom-8 w-[3px] rounded-full md:top-10 md:bottom-10 ${
          i % 3 === 0 ? "bg-black/18" : i % 3 === 1 ? "bg-black/12" : "bg-black/[0.09]"
        }`}
        aria-hidden
      />
      <div className="grid items-start gap-10 pl-1 lg:grid-cols-12 lg:gap-12 lg:pl-2">
        <div className="lg:col-span-5">
          <div className="flex flex-wrap items-end justify-between gap-4 lg:block">
            <span className="text-[clamp(3.5rem,8vw,6rem)] leading-none text-black/[0.16]" style={bebas}>
              {p.index}
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-black/40 lg:mt-4" style={mono}>
              {p.year} · {p.role}
            </span>
          </div>
          <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.25rem)] leading-[0.95] tracking-[0.03em]" style={bebas}>
            {p.title}
          </h2>
          <p className="mt-5 text-[13px] leading-[1.85] text-black/54" style={mono}>
            {p.blurb}
          </p>
          <p className="mt-4 text-[12px] leading-[1.75] text-black/42" style={mono}>
            {p.detail}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/[0.1] bg-black/[0.03] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-black/60"
                style={mono}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              data-cursor-expand
              href="#"
              className="rounded-full border border-black/18 bg-black px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-white transition-shadow hover:shadow-md"
              style={mono}
            >
              Live demo
            </a>
            <a
              data-cursor-expand
              href="#"
              className="rounded-full border border-black/14 px-6 py-3 text-[9px] uppercase tracking-[0.28em] text-black/74 transition-colors hover:border-black/26 hover:text-black"
              style={mono}
            >
              Case write-up
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-black/[0.08] pt-8 sm:max-w-sm">
            {p.metrics.map((m) => (
              <div key={m.k}>
                <p className="text-[8px] uppercase tracking-[0.35em] text-black/40" style={mono}>
                  {m.k}
                </p>
                <p className="mt-1 text-2xl tracking-wide text-black/88" style={bebas}>
                  {m.v}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <ProjectVisual id={p.id} accent={p.accent} />
        </div>
      </div>
    </article>
  );
});
