import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import aboutImg12 from '../../assets/about/about-12.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function AboutNationalNarrative() {
  const containerRef = useRef(null);
  const visualColRef = useRef(null);

  useEffect(() => {
    // Reveal image column
    gsap.fromTo('.ann-img-container',
      { scale: 0.95, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: visualColRef.current,
          start: 'top 85%'
        }
      }
    );

    // Reveal text block
    gsap.fromTo('.ann-text-col > *',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
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
      className="relative w-full overflow-hidden bg-white py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-left font-sans"
    >
      
      {/* Background soft glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-hot-pink/5 to-transparent filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-royal-blue/5 to-transparent filter blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: about-12.jpg image frame */}
        <div 
          ref={visualColRef}
          className="ann-img-container opacity-0 lg:col-span-5 flex items-center justify-center relative w-full"
        >
          <img 
            src={aboutImg12} 
            alt="Driving the National Narrative"
            className="w-full max-w-[450px] aspect-[4/3] sm:aspect-square lg:aspect-[4/3] object-cover rounded-2xl border border-slate-200/80 shadow-lg select-none"
            draggable={false}
          />
        </div>

        {/* Right Column: Narrative Content */}
        <div className="ann-text-col lg:col-span-7 flex flex-col gap-6">
          
          <div className="opacity-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0B1448] leading-tight font-display">
              Driving the <br />
              <span className="bg-gradient-to-r from-royal-blue via-brand-purple to-hot-pink bg-clip-text text-transparent">National Narrative</span>
            </h2>
          </div>

          <div className="opacity-0 flex flex-col gap-4 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            <p>
              A strong creator economy helps Chhattisgarh become part of India's cultural conversation.
            </p>
            <p>
              When a creator from Bastar reaches millions of viewers, the audience doesn't only discover a creator—they discover Bastar's heritage, Hareli's celebrations, tribal traditions, local tourism, and Chhattisgarhi culture.
            </p>
          </div>

          {/* Core Goal callout box with glow */}
          <div className="opacity-0 bg-gradient-to-br from-[#0B1448] to-[#070A21] border border-white/10 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              Our Core Goal
            </div>
            <p className="text-sm sm:text-base font-extrabold leading-relaxed uppercase font-display text-white">
              Chhattisgarh should no longer wait to be noticed. <br />
              <span className="text-[#FFA320]">It should become impossible to scroll past.</span>
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
