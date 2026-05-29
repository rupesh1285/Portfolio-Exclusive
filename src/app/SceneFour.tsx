"use client";

import { useEffect, useState } from "react";

const mono = { fontFamily: "'DM Mono', ui-monospace, monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const cormorant = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

export default function SceneFour() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#e8e4dc] text-[#0c0c0c] flex flex-col justify-between"
    >
      <style>{`
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        @keyframes pan-bg {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
      
      {/* Background aesthetics */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden" style={{ contain: "strict" }}>
        <div className="absolute inset-[-50%]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          animation: "pan-bg 120s linear infinite"
        }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`repeating-linear-gradient(-45deg,transparent 0,transparent 38px,rgba(0,0,0,0.015) 38px,rgba(0,0,0,0.015) 39px)`,
      }}/>
      <div className="absolute inset-x-0 top-0 h-[150px] bg-gradient-to-b from-[#e8e4dc] to-transparent pointer-events-none z-10" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pt-28 pb-10 md:px-10 lg:px-14 flex-1 flex flex-col w-full">
        
        {/* NEW: Premium Rotating Badge in top right corner */}
        <div className="absolute top-28 right-10 md:right-20 lg:right-32 w-32 h-32 hidden md:flex items-center justify-center opacity-40 mix-blend-multiply pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin-slow_20s_linear_infinite]">
            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
            <text className="text-[10px] uppercase tracking-[0.2em] fill-black" style={mono}>
              <textPath href="#circlePath" startOffset="0%">
                AVAILABLE FOR NEW OPPORTUNITIES • 2026 • 
              </textPath>
            </text>
          </svg>
          <div className="absolute w-2 h-2 bg-black rounded-full" />
        </div>

        <header className="mb-20">
          <p className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.55em] text-black/50" style={mono}>
            <span className="h-px w-12 bg-black/25" />
            04 — Handshake
          </p>
          <div className="overflow-hidden">
            <h1 className="text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-[0.02em] uppercase origin-bottom" style={bebas}>
              LET&apos;S <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(0,0,0,0.3)" }}>BUILD</span>
              <br />
              SOMETHING.
            </h1>
          </div>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.8] text-black/60 italic" style={cormorant}>
            We&apos;ve reached the end of the scroll. If you&apos;re looking for an architect who treats backend resilience as a feature and frontend motion as a prerequisite, let&apos;s start a conversation.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-end mt-auto gap-12 pb-10">
          {/* Socials / Links */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2" style={mono}>Connect</p>
            {[
              { name: "Twitter / X", url: "https://twitter.com/rupesh" },
              { name: "LinkedIn", url: "https://linkedin.com/in/rupesh" },
              { name: "GitHub", url: "https://github.com/rupesh1285" },
            ].map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" data-cursor-dark className="text-[13px] tracking-[0.1em] text-black/70 hover:text-black transition-colors relative group w-fit" style={mono}>
                {link.name} ↗
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Large Email Callout */}
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-4" style={mono}>Initiate</p>
            <a href="mailto:rupesh@example.com" data-cursor-dark className="group relative inline-block">
              <span className="text-[clamp(1.5rem,4vw,3rem)] tracking-[0.02em] transition-colors group-hover:text-black/70" style={bebas}>
                RUPESH@EXAMPLE.COM
              </span>
              <div className="absolute -bottom-2 left-0 h-[2px] w-full origin-right scale-x-100 bg-black/20 transition-transform duration-500 ease-in-out group-hover:scale-x-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Tape */}
      <div className="relative z-10 overflow-hidden border-t border-black/[0.08] bg-[#e2ded5] py-4 mt-auto">
        <div className="flex justify-between items-center px-5 md:px-10 lg:px-14">
          <div className="ticker-inner flex items-center gap-10 opacity-70" style={{ width: "calc(100% - 150px)" }}>
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="shrink-0 text-[9px] uppercase tracking-[0.55em] text-black/50 font-bold"
                style={mono}
              >
                OPEN FOR COLLABORATION
                <span className="ml-10 text-black/20">✦</span>
              </span>
            ))}
          </div>
          {/* NEW: Live Local Time Clock */}
          <div className="shrink-0 text-[9px] uppercase tracking-[0.3em] text-black/60 font-bold hidden sm:block" style={mono}>
            {time || "LOADING..."}
          </div>
        </div>
      </div>
    </div>
  );
}
