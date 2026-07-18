import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutImg1 from '../../assets/about/about-1.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function AboutHero() {
  const containerRef = useRef(null);
  const textColRef = useRef(null);
  const visualColRef = useRef(null);

  useEffect(() => {
    // 1. Staggered reveal for heading lines and description
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    tl.fromTo('.ah-title',
      { y: 40, opacity: 0, skewY: 3 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.8, ease: 'power4.out' }
    );

    tl.fromTo('.ah-desc',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
      '-=0.5'
    );

    // 2. Trigger reveal for the image on scroll
    gsap.fromTo('.ah-about-img',
      { scale: 0.95, opacity: 0, y: 40 },
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
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-left font-sans"
    >
      {/* Background glowing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#EA1B81]/5 to-transparent filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#0A84FF]/5 to-transparent filter blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Text */}
        <div ref={textColRef} className="lg:col-span-7 flex flex-col gap-6">
          
          <h2 className="ah-title opacity-0 text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0B1448] leading-tight font-display">
            From Chhattisgarh's Streets <br />
            <span className="bg-gradient-to-r from-amber-500 via-hot-pink to-royal-blue bg-clip-text text-transparent">To India's Screens</span>
          </h2>

          {/* Description paragraphs */}
          <div className="flex flex-col gap-5 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            <p className="ah-desc opacity-0">
              Every reel shot in a Bastar village, every folk song remixed by a Raipur teenager, every college vlog filmed in Bilaspur is already part of something bigger than a phone screen — it is the raw material of Chhattisgarh's creator economy. Our youth are not waiting for opportunity to arrive from Mumbai or Delhi; they are building it from home, in their own dialect, in their own rhythm.
            </p>
            <p className="ah-desc opacity-0">
              The Chhattisgarh State Creator & Influencer Awards exists to notice this, name it, and back it — turning scattered individual hustle into a recognised, organised, and celebrated state creator economy. And a strong state creator economy is how Chhattisgarh writes itself into the national one.
            </p>
            <p className="ah-desc opacity-0">
              When a Chhattisgarhi storyteller's video crosses a few lakh views, it isn't just a personal win — it's Bastar's art, Hareli's colours, and Chhattisgarhi's sound reaching a national timeline that rarely paused here before. This is the real chain we are building: empowered youth power a state creator economy, and a thriving state creator economy powers India's larger creator economy — with unmistakably Chhattisgarhi voices inside it. Not a state asking to be noticed, but a state that is impossible to scroll past.
            </p>
          </div>

        </div>

        {/* Right Column: about-1.jpg image rendering */}
        <div 
          ref={visualColRef} 
          className="lg:col-span-5 flex items-center justify-center relative w-full"
        >
          <img 
            src={aboutImg1} 
            alt="Chhattisgarh Creator Streets"
            className="ah-about-img opacity-0 w-full max-w-[450px] aspect-[4/3] sm:aspect-square lg:aspect-[4/3] object-cover rounded-2xl border border-slate-200/80 shadow-lg select-none"
            draggable={false}
          />
        </div>

      </div>
    </section>
  );
}
