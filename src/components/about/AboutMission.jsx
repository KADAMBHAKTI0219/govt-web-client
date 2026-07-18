import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Users, Handshake, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutMission() {
  const containerRef = useRef(null);
  const cardGridRef = useRef(null);

  useEffect(() => {
    // 1. Reveal header components on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });


    tl.fromTo('.am-title',
      { y: 30, opacity: 0, skewY: 2 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.8, ease: 'power4.out' },
      '-=0.4'
    );


    tl.fromTo('.am-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    // 2. Stagger slide up for the 4 commitment cards
    gsap.fromTo('.am-commitment-card',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cardGridRef.current,
          start: 'top 85%'
        }
      }
    );
  }, []);

  const commitments = [
    {
      num: '01',
      title: 'Translators of Trust',
      desc: 'Explaining government schemes in local dialects to build civic alignment.',
      icon: Target,
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      num: '02',
      title: 'Organic Tourism Boards',
      desc: 'Filming forgotten waterfalls and heritage sites, turning monuments into memories.',
      icon: Users,
      iconColor: 'text-pink-500 bg-pink-500/10'
    },
    {
      num: '03',
      title: 'Development Reporters',
      desc: 'Documenting self-help groups and grassroots progress into engaging narratives the public watches till the end.',
      icon: Handshake,
      iconColor: 'text-royal-blue bg-royal-blue/10'
    },
    {
      num: '04',
      title: '25 Categories of Excellence',
      desc: 'Celebrating digital creators across 25 dedicated award tiers representing cultural pride and creative impact.',
      icon: Heart,
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-slate-50 py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-150 text-left font-sans"
    >
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-12">
        
        {/* Header Column */}
        <div className="flex flex-col gap-4 max-w-3xl ml-auto text-right items-end">

          <h2 className="am-title opacity-0 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0B1448] leading-tight font-display text-right">
            Beyond the Trophy — <br />
            <span className="bg-gradient-to-r from-royal-blue to-[#8B3FD9] bg-clip-text text-transparent">Why This Award Exists</span>
          </h2>

          <p className="am-desc opacity-0 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mt-2 text-right">
            This is deliberately not designed as another award show that hands out a trophy and ends with a photograph. The Chhattisgarh State Creator & Influencer Awards is being built as a launch pad — a structured, credible platform that spots real change-makers early and gives them a bigger stage, better tools, and public trust to keep doing what they already do well: telling honest, local stories that move people.
          </p>
        </div>

        {/* 4 Commitments Grid */}
        <div 
          ref={cardGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4"
        >
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="am-commitment-card opacity-0 bg-white border border-slate-200/60 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative group"
              >
                <div>
                  {/* Number bubble */}
                  <span className="absolute top-4 right-4 text-xs font-black text-slate-350 tracking-wider">
                    {item.num}
                  </span>

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0 ${item.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4 className="text-sm sm:text-base font-black uppercase text-[#0B1448] font-display mb-2 group-hover:text-royal-blue transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
