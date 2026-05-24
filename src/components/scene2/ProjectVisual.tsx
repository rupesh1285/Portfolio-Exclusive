"use client";

import { memo } from "react";
import { bebas, mono } from "./fonts";

type Props = { id: string; accent: string };

export const ProjectVisual = memo(function ProjectVisual({ id, accent }: Props) {
  return (
    <div
      data-cursor-dark
      className={`group relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-gradient-to-br shadow-md ${accent}`}
      style={{ contain: "layout paint" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(-12deg, transparent 0, transparent 16px, rgba(0,0,0,0.04) 16px, rgba(0,0,0,0.04) 17px)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_72%_28%,rgba(255,255,255,0.5),transparent_58%)]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-black/[0.1] bg-white/92 px-3 py-1.5 text-[9px] uppercase tracking-[0.35em] text-black/52" style={mono}>
        <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-600/90" />
        {id}
      </div>
      <p
        className="pointer-events-none absolute bottom-5 left-5 max-w-[55%] text-[clamp(1.65rem,4vw,2.75rem)] leading-none tracking-[0.02em] text-black/[0.09] transition-colors duration-200 group-hover:text-black/14"
        style={bebas}
      >
        Preview
      </p>
    </div>
  );
});
