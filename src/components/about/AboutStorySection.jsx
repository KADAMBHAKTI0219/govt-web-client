import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import about1 from '../../assets/about/about-1.jpg';
import about2 from '../../assets/about/about-2.jpg';
import about3 from '../../assets/about/about-3.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function AboutStorySection() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    // 1. Draw/Grow vertical timeline center connector on scroll
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true
        }
      }
    );

    // 2. Animate elements on ScrollTrigger
    const blocks = gsap.utils.toArray('.ass-block');
    blocks.forEach((block) => {
      const img = block.querySelector('.ass-img');
      const text = block.querySelector('.ass-text-wrap');
      const dot = block.querySelector('.ass-dot');

      // Image slide in
      gsap.fromTo(img,
        { scale: 0.93, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%'
          }
        }
      );

      // Text slide in
      gsap.fromTo(text,
        { opacity: 0, x: block.classList.contains('ass-reverse') ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 80%'
          }
        }
      );

      // Timeline marker highlight
      gsap.fromTo(dot,
        { scale: 0.5, backgroundColor: '#E2E8F0', borderColor: '#CBD5E1' },
        {
          scale: 1.2,
          backgroundColor: '#FFA320',
          borderColor: '#B90022',
          duration: 0.5,
          scrollTrigger: {
            trigger: block,
            start: 'top 50%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });
  }, []);

  return (
    <section 
      id="story-section"
      ref={containerRef}
      className="relative w-full bg-white py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-b border-slate-100 text-left overflow-hidden font-sans"
    >
      {/* Background soft lighting blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#EA1B81]/5 to-transparent filter blur-[100px]" />
        <div className="absolute bottom-1/3 left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#0A84FF]/5 to-transparent filter blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            A Journey of Empowerment
          </h2>
        </div>

        {/* Story Grid Stack */}
        <div className="relative flex flex-col gap-20 sm:gap-28 mt-8">
          
          {/* Vertical central timeline line */}
          <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-[3px] bg-slate-100 -translate-x-1/2 hidden md:block">
            <div 
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-[#FFA320] via-hot-pink to-royal-blue origin-top scale-y-0"
            />
          </div>

          {/* Block 1: Image Left, Content Right */}
          <div className="ass-block grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative">
            {/* Left Image column */}
            <div className="order-1 md:order-1 flex items-center justify-center md:justify-end">
              <img 
                src={about1} 
                alt="A New Creator Economy" 
                className="ass-img opacity-0 w-full max-w-[460px] aspect-[4/3] object-cover rounded-2xl border border-slate-200/80 shadow-md select-none"
                draggable={false}
              />
            </div>
            
            {/* Timeline center marker */}
            <div className="ass-dot absolute left-[20px] md:left-1/2 w-4.5 h-4.5 rounded-full bg-slate-200 border-4 border-slate-300 -translate-x-1/2 hidden md:block z-20" />

            {/* Right text column */}
            <div className="ass-text-wrap opacity-0 order-2 md:order-2 flex flex-col gap-4 max-w-[460px] md:pl-8 text-center md:text-left items-center md:items-start mx-auto md:mx-0">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0B1448] font-display">
                A New Creator Economy
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                The Chhattisgarh State Creator & Influencer Awards exists to identify, recognize, and support the state's growing creator movement.
              </p>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                What began as scattered individual efforts is becoming a recognized creator economy that belongs to every district, village, and community.
              </p>
            </div>
          </div>

          {/* Block 2: Image Right, Content Left (ass-reverse) */}
          <div className="ass-block ass-reverse grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative">
            {/* Left text column */}
            <div className="ass-text-wrap opacity-0 order-2 md:order-1 flex flex-col gap-4 max-w-[460px] md:pr-8 text-center md:text-right items-center md:items-end mx-auto md:mr-0 md:ml-auto">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0B1448] font-display">
                Creators Are Building From Home
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                Rather than waiting for opportunities in metropolitan cities, young creators are choosing to build their future from Chhattisgarh.
              </p>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                Every local story contributes to a stronger digital identity for the state.
              </p>
            </div>

            {/* Timeline center marker */}
            <div className="ass-dot absolute left-[20px] md:left-1/2 w-4.5 h-4.5 rounded-full bg-slate-200 border-4 border-slate-300 -translate-x-1/2 hidden md:block z-20" />

            {/* Right Image column */}
            <div className="order-1 md:order-2 flex items-center justify-center md:justify-start">
              <img 
                src={about2} 
                alt="Creators Are Building From Home" 
                className="ass-img opacity-0 w-full max-w-[460px] aspect-[4/3] object-cover rounded-2xl border border-slate-200/80 shadow-md select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Block 3: Image Left, Content Right */}
          <div className="ass-block grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative">
            {/* Left Image column */}
            <div className="order-1 md:order-1 flex items-center justify-center md:justify-end">
              <img 
                src={about3} 
                alt="Every Story Matters" 
                className="ass-img opacity-0 w-full max-w-[460px] aspect-[4/3] object-cover rounded-2xl border border-slate-200/80 shadow-md select-none"
                draggable={false}
              />
            </div>

            {/* Timeline center marker */}
            <div className="ass-dot absolute left-[20px] md:left-1/2 w-4.5 h-4.5 rounded-full bg-slate-200 border-4 border-slate-300 -translate-x-1/2 hidden md:block z-20" />

            {/* Right text column */}
            <div className="ass-text-wrap opacity-0 order-2 md:order-2 flex flex-col gap-4 max-w-[460px] md:pl-8 text-center md:text-left items-center md:items-start mx-auto md:mx-0">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0B1448] font-display">
                Every Story Matters
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                Whether it's a village reel, a cultural performance, a college vlog, or an educational video, every creator contributes to Chhattisgarh's growing digital ecosystem.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
