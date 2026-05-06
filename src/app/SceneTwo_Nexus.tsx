"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SceneTwo_Nexus({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Maintain the slow idle float initially
      gsap.to(".bubble-1", { x: "5vw", y: "8vh", rotation: 15, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".bubble-2", { x: "-8vw", y: "-5vh", rotation: -10, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".bubble-3", { x: "10vw", y: "-10vh", rotation: 5, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".bubble-4", { x: "-5vw", y: "10vh", rotation: -15, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      tl.fromTo(".glass-overlay", 
        { opacity: 0, backdropFilter: "blur(0px)" },
        { opacity: 1, backdropFilter: "blur(50px)", duration: 0.6, ease: "power2.out" }
      )
      // Very brief hold to register the glass
      .to({}, { duration: 0.3 })
      
      // ── NEW: THE SCATTER ANIMATION ──
      // Bubbles are forcefully pushed off the edges of the screen
      .add("scatter")
      .to(".bubble-1", { x: "-60vw", y: "-40vh", opacity: 0, filter: "blur(20px)", duration: 1.4, ease: "power3.inOut" }, "scatter")
      .to(".bubble-2", { x: "60vw", y: "-20vh", opacity: 0, filter: "blur(20px)", duration: 1.5, ease: "power3.inOut" }, "scatter+=0.1")
      .to(".bubble-3", { x: "-40vw", y: "60vh", opacity: 0, filter: "blur(20px)", duration: 1.3, ease: "power3.inOut" }, "scatter+=0.05")
      .to(".bubble-4", { x: "60vw", y: "60vh", opacity: 0, filter: "blur(20px)", duration: 1.4, ease: "power3.inOut" }, "scatter+=0.15")
      
      // Fade out the glass overlay to seamlessly reveal Scene Two underneath
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      }, "scatter+=0.4"); 

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#E5E5EB] overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="bubble-1 absolute top-[-5%] left-[5%] w-[45vw] h-[45vw] rounded-full border-[1.5px] border-white/60 bg-gradient-to-br from-white/30 to-transparent backdrop-blur-xl shadow-[inset_0_0_60px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.05)]">
          <div className="absolute top-[12%] left-[18%] w-[25%] h-[12%] bg-white/90 rounded-[100%] rotate-[-30deg] blur-[2px]" />
          <div className="absolute bottom-[10%] right-[15%] w-[30%] h-[8%] bg-white/50 rounded-[100%] rotate-[-20deg] blur-[4px]" />
        </div>
        <div className="bubble-2 absolute top-[25%] right-[5%] w-[35vw] h-[35vw] rounded-full border-[1.5px] border-white/70 bg-gradient-to-bl from-white/40 to-transparent backdrop-blur-lg shadow-[inset_0_0_50px_rgba(255,255,255,0.8),0_15px_30px_rgba(0,0,0,0.05)]">
          <div className="absolute top-[15%] right-[20%] w-[20%] h-[10%] bg-white/90 rounded-[100%] rotate-[25deg] blur-[2px]" />
          <div className="absolute bottom-[15%] left-[15%] w-[25%] h-[8%] bg-white/40 rounded-[100%] rotate-[20deg] blur-[4px]" />
        </div>
        <div className="bubble-3 absolute bottom-[10%] left-[25%] w-[30vw] h-[30vw] rounded-full border-[1px] border-white/40 bg-gradient-to-tr from-white/20 to-transparent backdrop-blur-md shadow-[inset_0_0_40px_rgba(255,255,255,0.7)] z-[-1]">
          <div className="absolute top-[10%] left-[25%] w-[20%] h-[8%] bg-white/80 rounded-[100%] rotate-[-15deg] blur-[2px]" />
        </div>
        <div className="bubble-4 absolute top-[10%] left-[45%] w-[15vw] h-[15vw] rounded-full border-[2px] border-white/80 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-2xl shadow-[inset_0_0_30px_rgba(255,255,255,1)]">
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[15%] bg-white/95 rounded-[100%] rotate-[-20deg] blur-[1px]" />
        </div>
      </div>

      <div className="glass-overlay absolute inset-0 w-full h-full bg-white/50 border border-white/50" />
    </div>
  );
}