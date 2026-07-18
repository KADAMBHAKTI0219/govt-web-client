import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutFinalMessage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal text block lines
    gsap.fromTo('.afm-line',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-slate-50 py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-center overflow-hidden font-sans"
    >
      
      {/* Background glowing light shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-hot-pink/10 to-transparent filter blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-8">
        
        {/* Section title */}
        <div className="afm-line opacity-0">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            The Trophy is Only the Beginning
          </h2>
        </div>

        {/* Dynamic message lines */}
        <div className="flex flex-col gap-5 text-slate-800 text-xl sm:text-2.5xl md:text-3.5xl font-black tracking-tight leading-relaxed uppercase max-w-3xl font-display mt-4">
          <p className="afm-line opacity-0">
            Recognition lasts for a moment.
          </p>
          <p className="afm-line opacity-0 bg-gradient-to-r from-royal-blue to-violet-600 bg-clip-text text-transparent">
            Opportunity lasts for years.
          </p>
        </div>

        {/* Description details paragraph */}
        <p className="afm-line opacity-0 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mt-6">
          The real award begins after the ceremony—with mentorship, visibility, partnerships, and continued support for every deserving creator.
        </p>

      </div>

    </section>
  );
}
