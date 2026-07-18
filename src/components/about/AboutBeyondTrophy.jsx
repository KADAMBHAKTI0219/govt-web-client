import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Volume2, Link2, Key } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutBeyondTrophy() {
  const containerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Reveal header block
    gsap.fromTo('.abt-header > *',
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

    // Reveal callout banner
    gsap.fromTo('.abt-callout',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.abt-callout',
          start: 'top 85%'
        }
      }
    );

    // Stagger slide up for connected cards
    gsap.fromTo('.abt-card',
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%'
        }
      }
    );
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Spot',
      desc: 'Identify creators who are already making meaningful impact within their communities, long before they enter the spotlight.',
      icon: Eye,
      color: 'border-amber-200 bg-amber-500/5 text-amber-500'
    },
    {
      num: '02',
      title: 'Amplify',
      desc: 'Increase visibility for creators across tribal, rural, women-led, and emerging communities to represent the true face of the state.',
      icon: Volume2,
      color: 'border-pink-200 bg-pink-500/5 text-pink-500'
    },
    {
      num: '03',
      title: 'Connect',
      desc: "Connect and collaborate with creators as genuine partners, not vendors — building the kind of grassroots social revolution that, carried forward through the Amrit Kaal of Prime Minister Narendra Modi's India, can rightfully scale into a national one.",
      icon: Link2,
      color: 'border-royal-blue bg-royal-blue/5 text-royal-blue'
    },
    {
      num: '04',
      title: 'Empower',
      desc: 'Provide recognition, mentorship, networking opportunities, and institutional support that outlasts the awards night itself.',
      icon: Key,
      color: 'border-emerald-200 bg-emerald-500/5 text-emerald-500'
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-slate-50 pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-left overflow-hidden font-sans"
    >
      
      {/* Background soft blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-hot-pink/5 to-transparent filter blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Section title & intro */}
        <div className="abt-header flex flex-col gap-4 max-w-3xl">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0B1448] leading-tight font-display">
              Beyond the Trophy
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed mt-1">
            The Chhattisgarh State Creator & Influencer Awards is not simply an awards ceremony. It is a long-term platform designed to identify, nurture, connect, and empower creators.
          </p>
        </div>

        {/* Core statement callout */}
        <div className="abt-callout opacity-0 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl max-w-3xl shadow-sm mt-1">
          <p className="text-slate-800 text-sm sm:text-base font-extrabold leading-relaxed uppercase font-display">
            "This is not an award show. It is a launch pad for Chhattisgarh's changemakers to power a positive revolution — for the state, and for the nation."
          </p>
        </div>

        {/* 4 Connected Cards Grid */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative w-full"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="abt-card opacity-0 bg-white border border-slate-200/60 p-6 sm:p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative group"
              >
                <div>
                  
                  {/* Sequence number */}
                  <span className="absolute top-4 right-4 text-xs font-black text-slate-300 tracking-wider">
                    {step.num}
                  </span>

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 shrink-0 ${step.color}`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>

                  <h3 className="text-lg font-black uppercase text-[#0B1448] font-display mb-3 group-hover:text-amber-500 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    {step.desc}
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