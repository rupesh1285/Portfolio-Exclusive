"use client";

import { memo } from "react";
import { bebas, mono } from "./fonts";

export const SceneTwoBackdrop = memo(function SceneTwoBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ contain: "strict" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(168deg, #ddd5c8 0%, #ebe6de 22%, #f5f2ec 48%, #faf8f4 72%, #d8d0c6 100%),
            radial-gradient(ellipse 90% 55% at 8% 12%, rgba(255,252,248,0.95) 0%, transparent 52%),
            radial-gradient(ellipse 70% 50% at 92% 8%, rgba(140,130,118,0.14) 0%, transparent 48%),
            radial-gradient(ellipse 60% 45% at 70% 88%, rgba(120,110,100,0.1) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 62%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.5) 10px,
            rgba(0,0,0,0.5) 11px
          )`,
        }}
      />


      <div
        className="absolute left-1/2 top-[28%] w-[200%] -translate-x-1/2 -rotate-[9deg] select-none text-center"
        style={bebas}
      >
        <span className="block text-[clamp(5rem,22vw,14rem)] leading-none tracking-[0.04em] text-black/[0.045]">
          SELECTED
        </span>
        <span
          className="-mt-2 block text-[clamp(4rem,18vw,11rem)] leading-none tracking-[0.32em] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(0,0,0,0.07)" }}
        >
          WORK
        </span>
      </div>

      <div
        className="absolute inset-3 rounded-sm border border-black/[0.07] md:inset-5"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.06) 0, transparent 80px, transparent calc(100% - 80px), rgba(0,0,0,0.06) 100%)",
        }}
      />
      <div className="absolute inset-3 rounded-sm border border-white/40 md:inset-5" />

      {(
        [
          "left-5 top-5 md:left-8 md:top-8",
          "right-5 top-5 md:right-8 md:top-8 rotate-90",
          "left-5 bottom-5 md:left-8 md:bottom-8 -rotate-90",
          "right-5 bottom-5 md:right-8 md:bottom-8 rotate-180",
        ] as const
      ).map((pos) => (
        <div
          key={pos}
          className={`pointer-events-none absolute h-7 w-7 border-black/[0.12] ${pos}`}
          style={{ borderTopWidth: 1, borderLeftWidth: 1, borderStyle: "solid" }}
        />
      ))}

      <div
        className="absolute bottom-24 left-0 right-0 flex justify-between px-6 opacity-[0.07] md:px-12"
        style={mono}
      >
        {["A1", "A2", "B1", "B2", "C1", "C2", "D1"].map((m) => (
          <span key={m} className="text-[10px] tracking-[0.4em]">
            {m}
          </span>
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[min(38%,300px)]"
        style={{
          background: "linear-gradient(to top, rgba(17,19,24,0.09), transparent)",
        }}
      />
    </div>
  );
});
