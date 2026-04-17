"use client";

import BackgroundStage from "@/components/canvas/BackgroundStage";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden">
      <BackgroundStage />

      {/* Glassmorphic Navigation Header */}
      <nav className="absolute top-0 left-0 w-full z-[100] flex justify-between items-center px-12 py-8">
        <div className="text-white font-bold tracking-widest text-xl">RA.</div>
        <div className="flex gap-8 text-silverWhite/60 font-mono text-xs uppercase tracking-[0.3em]">
          <span className="hover:text-white cursor-pointer transition-colors">Architecture</span>
          <span className="hover:text-white cursor-pointer transition-colors">Projects</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
      </nav>

      <div className="relative z-[60] flex h-screen w-full flex-col md:flex-row items-center px-10 md:px-24">
        
        {/* LEFT SIDE: The Identity */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-white/30" />
              <p className="text-white font-mono text-[10px] tracking-[0.5em] uppercase opacity-60">
                Full-Stack Engineer
              </p>
            </div>
            
            <h1 className="text-8xl md:text-[10rem] font-bold tracking-tighter text-white leading-[0.8] mb-4">
              RUPESH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                AGARWAL
              </span>
            </h1>

            <p className="mt-8 text-silverWhite/50 text-lg md:text-xl font-light max-w-lg leading-relaxed font-mono">
              // DECODING THE FUTURE OF INTERACTIVE INTERFACES.
              <br />
              // SPECIALIZED IN HIGH-PERFORMANCE WEB ARCHITECTURE.
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE: The World-Class "Doodle" Upgrade */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-80 h-80 flex items-center justify-center"
          >
            {/* The "Neural Core" - A complex, rotating, glowing ring system */}
            <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border border-white/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-10 border-2 border-white/40 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
            
            {/* The Centerpiece */}
            <div className="text-white text-6xl font-thin tracking-tighter z-10">
              01
            </div>
            
            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-[moveUp_3s_linear_infinite]" />
          </motion.div>
        </div>
      </div>

      {/* Custom Styles for Keyframes */}
      <style jsx global>{`
        @keyframes moveUp {
          from { transform: translateY(320px); }
          to { transform: translateY(-40px); }
        }
      `}</style>
    </main>
  );
}