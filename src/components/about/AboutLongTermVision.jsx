import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Compass, Landmark, Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutLongTermVision() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal text elements on scroll
    gsap.fromTo('.altv-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%'
        }
      }
    );
  }, []);

  const items = [
    {
      label: 'Dignity to Art',
      desc: 'Where tribal art, craft, and heritage receive national dignity and direct economic backing.',
      icon: Landmark,
      iconStyle: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Local Languages',
      desc: 'Where local dialects (Chhattisgarhi, Halbi, Gondi) reach national timelines and global audiences.',
      icon: Compass,
      iconStyle: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
    },
    {
      label: 'Sustained Growth',
      desc: 'Where digital influence feeds directly into local tourism, rural entrepreneurship, and civic trust.',
      icon: Flame,
      iconStyle: 'text-royal-blue bg-royal-blue/10 border-royal-blue/20'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-white py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-center overflow-hidden font-sans"
    >
      
      {/* Background blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-[#0A84FF]/5 filter blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-10">
        
        {/* Section title */}
        <div className="altv-item opacity-0">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            A Future Built by Creators
          </h2>
        </div>

        {/* Core Vision Statement Callout */}
        <div className="altv-item opacity-0 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/80 p-8 sm:p-10 rounded-3xl max-w-3xl text-center shadow-md relative">
          <span className="absolute top-2 left-6 text-slate-200 font-serif text-7xl select-none leading-none pointer-events-none">“</span>
          <p className="text-[#0B1448] text-sm sm:text-base font-extrabold leading-relaxed uppercase font-display relative z-10 px-4">
            We envision a Chhattisgarh where a young creator doesn't have to leave home to be heard nationally, where a tribal storyteller's dignity and craft are celebrated rather than exoticised, and where digital influence is treated as a genuine form of public service — one that builds culture, tourism, and civic trust in equal measure.
          </p>
          <span className="absolute bottom-2 right-6 text-slate-200 font-serif text-7xl select-none leading-none pointer-events-none">”</span>
        </div>

        {/* 3 Core pillars listed below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-4 w-full">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="altv-item opacity-0 flex flex-col items-center gap-4 text-center p-6 sm:p-8 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-1 shrink-0 ${item.iconStyle}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-base font-black uppercase text-[#0B1448] tracking-wider font-display group-hover:text-amber-500 transition-colors">
                  {item.label}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}