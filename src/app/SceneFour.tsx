"use client";



const mono = { fontFamily: "'DM Mono', ui-monospace, monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;
const cormorant = { fontFamily: "'Cormorant Garamond', Georgia, serif" } as const;

export default function SceneFour() {
  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#e8e4dc] text-[#0c0c0c] flex flex-col justify-between"
    >
      {/* Background aesthetics */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden" style={{ contain: "strict" }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`repeating-linear-gradient(-45deg,transparent 0,transparent 38px,rgba(0,0,0,0.015) 38px,rgba(0,0,0,0.015) 39px)`,
      }}/>
      <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-[#e8e4dc] to-transparent pointer-events-none z-10" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pt-28 pb-10 md:px-10 lg:px-14 flex-1 flex flex-col w-full">
        <header className="mb-20">
          <p className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.55em] text-black/50" style={mono}>
            <span className="h-px w-12 bg-black/25" />
            04 — Handshake
          </p>
          <h1 className="text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-[0.02em] uppercase" style={bebas}>
            LET'S <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(0,0,0,0.3)" }}>BUILD</span>
            <br />
            SOMETHING.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.8] text-black/60 italic" style={cormorant}>
            We've reached the end of the scroll. If you're looking for an engineer who treats performance as a feature and design as a prerequisite, let's start a conversation.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-end mt-auto gap-12 pb-10">
          {/* Socials / Links */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2" style={mono}>Connect</p>
            {["Twitter / X", "LinkedIn", "GitHub", "Read.cv"].map((link) => (
              <a key={link} href="#" data-cursor-dark className="text-[13px] tracking-[0.1em] text-black/80 hover:text-black transition-colors" style={mono}>
                {link} ↗
              </a>
            ))}
          </div>

          {/* Large Email Callout */}
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-4" style={mono}>Initiate</p>
            <a href="mailto:hello@example.com" data-cursor-dark className="group relative inline-block">
              <span className="text-[clamp(1.5rem,4vw,3rem)] tracking-[0.02em] transition-colors group-hover:text-black/70" style={bebas}>
                HELLO@EXAMPLE.COM
              </span>
              <div className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-100 bg-black/20 transition-transform duration-500 ease-out group-hover:scale-x-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Tape */}
      <div className="relative z-10 overflow-hidden border-t border-black/[0.06] bg-[#e2ded5] py-3.5 mt-auto">
        <div className="ticker-inner flex items-center gap-10">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="shrink-0 text-[9px] uppercase tracking-[0.55em] text-black/40"
              style={mono}
            >
              AVAILABLE FOR HIRE
              <span className="ml-10 text-black/15">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
