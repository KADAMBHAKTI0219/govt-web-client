import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Camera, FileEdit, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutArchitectsTrust() {
  const containerRef = useRef(null);
  const cardRowRef = useRef(null);

  useEffect(() => {
    // Reveal header block
    gsap.fromTo('.aat-header > *',
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

    // Stagger slide up for the 3 feature cards
    gsap.fromTo('.aat-card',
      { y: 50, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRowRef.current,
          start: 'top 80%'
        }
      }
    );

    // Reveal closing callout banner at the bottom
    gsap.fromTo('.aat-callout',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.aat-callout',
          start: 'top 85%'
        }
      }
    );
  }, []);

  const cards = [
    {
      title: 'Translator of Trust',
      desc: 'Creators explain government schemes in local languages and make public information easier to understand, bridging the gap between state administration and citizens.',
      icon: ShieldCheck,
      iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Organic Tourism Board',
      desc: 'Creators showcase hidden waterfalls, heritage sites, local traditions, festivals, and destinations that inspire travel, turning local monuments into national memories.',
      icon: Camera,
      iconColor: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
    },
    {
      title: 'Development Reporter',
      desc: "Creators document grassroots development, self-help groups, local entrepreneurship, and community success stories in engaging digital formats that the public watches till the end.",
      icon: FileEdit,
      iconColor: 'text-royal-blue bg-royal-blue/10 border-royal-blue/20'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-slate-50 pt-16 pb-10 sm:pt-20 sm:pb-14 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-left overflow-hidden font-sans"
    >
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-500/5 filter blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-10">
        
        {/* Section title */}
        <div className="aat-header flex flex-col gap-3">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
              Digital Creators as Architects of Trust
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mt-1">
            Creators do not just share content—they shape civic trust, tourism, and community pride. Here is how they construct Chhattisgarh's organic growth.
          </p>
        </div>

        {/* 3 Columns Card Row */}
        <div 
          ref={cardRowRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="aat-card opacity-0 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative group"
              >
                <div>
                  
                  {/* Decorative tag */}
                  <div className="flex items-center gap-1.5 text-amber-600 text-[9px] font-black uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Civic Role
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 shrink-0 ${item.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-black uppercase text-[#0B1448] font-display mb-3 group-hover:text-[#FFA320] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>

                </div>
              </div>
            );
          })}
        </div>

        {/* Closing callout: confident, camera-native storytellers */}
        <div className="aat-callout opacity-0 bg-gradient-to-br from-[#0B1448] to-[#070A21] border border-white/10 p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden mt-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/10 to-transparent rounded-bl-full pointer-events-none" />
          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed relative z-10" style={{ color: '#ffffff' }}>
            They are confident, camera-native storytellers — and in the run-up to <span className="font-black text-[#FFA320]">Viksit Bharat @2047</span>, they are among our most cost-effective, most credible boosters: turning policy into a story, a monument into a memory, and a village into a destination, at the speed of a scroll and the reach of a satellite.
          </p>
        </div>

      </div>

    </section>
  );
}