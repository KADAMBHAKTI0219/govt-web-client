import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import local assets for boy and girl
import girlImg from '../../assets/home/girl.png';
import boyImg from '../../assets/home/boy.png';

gsap.registerPlugin(ScrollTrigger);

export default function CreatorMovement() {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Continuous rotation for Y2K pinwheels
    gsap.to('.gsap-c-pinwheel', {
      rotation: 360,
      repeat: -1,
      duration: 20,
      ease: 'none'
    });

    // 2. Reverse continuous rotation for clovers
    gsap.to('.gsap-c-clover', {
      rotation: -360,
      repeat: -1,
      duration: 30,
      ease: 'none'
    });

    // 3. Gentle float and scale pulse for orbital hoops
    gsap.to('.gsap-c-hoop', {
      y: '-=12',
      rotation: '+=20',
      scale: 1.05,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 4. Subtle shimmer & vertical drift for sparkle stars
    gsap.to('.gsap-c-star', {
      y: '+=15',
      opacity: 0.8,
      scale: 1.1,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.4,
        from: 'random'
      }
    });

    // 5. Scroll-Triggered Timeline for Text and Characters
    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%', // Starts animation when the section enters 75% of viewport height
        toggleActions: 'play none none none'
      }
    });

    // Animate characters sliding up to match text height
    textTimeline.fromTo(['.cm-character-girl', '.cm-character-boy'],
      { y: 150, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.15 }
    );

    // Animate Heading Line 1 ("JOIN THE") in white
    textTimeline.fromTo('.cm-heading-line-1',
      { y: 40, opacity: 0, skewY: 4 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.8, ease: 'power4.out' },
      '-=0.9' // overlap
    );

    // Animate Heading Line 2 ("CREATOR MOVEMENT") in neon gradient below it
    textTimeline.fromTo('.cm-heading-line-2',
      { y: 50, opacity: 0, skewY: 6 },
      { y: 0, opacity: 1, skewY: 0, duration: 0.9, ease: 'power4.out' },
      '-=0.6' 
    );

    // Animate Subtitle (fade-in, slide-up, de-blur)
    textTimeline.fromTo('.cm-subtitle',
      { y: 30, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    // Bounce scale bottom movement badge
    textTimeline.fromTo('.cm-badge-container',
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      id="movement" 
      className="relative w-full overflow-hidden bg-gradient-to-tr from-[#EA1B81]/70 via-[#6E00E5]/70 to-[#0A84FF]/70 py-16 sm:py-20 px-6 border-t border-b border-white/10 flex flex-col items-center justify-center"
    >
      {/* Dark overlay sheet to ensure readability of foreground text */}
      <div className="absolute inset-0 bg-[#020512]/65 backdrop-blur-[2px] z-0" />

      {/* GSAP Animated Background Layout Shapes (Floating Y2K SVGs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-50">
        
        {/* Top Left Sparkle Star */}
        <div className="gsap-c-star absolute top-12 left-[12%] text-white/50">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
          </svg>
        </div>

        {/* Lower Left Sparkle Star */}
        <div className="gsap-c-star absolute bottom-20 left-[20%] text-white/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
          </svg>
        </div>

        {/* Center Top Orbital Hoops */}
        <div className="gsap-c-hoop absolute top-8 left-1/2 -translate-x-1/2 text-white/20">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-24 h-24 md:w-28 md:h-28">
            <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-15 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(15 50 50)" />
          </svg>
        </div>

        {/* Left Side Clover/Flower shape */}
        <div className="gsap-c-clover absolute top-1/4 left-[8%] text-white/30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 md:w-20 md:h-20">
            <path d="M12 8.5c1.38 0 2.5-1.12 2.5-2.5S13.38 3.5 12 3.5 9.5 4.62 9.5 6s1.12 2.5 2.5 2.5zm0 7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5.5-5c0-1.38-1.12-2.5-2.5-2.5S12.5 9.12 12.5 10.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5zm-11 0c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z" />
          </svg>
        </div>

        {/* Right Side Pinwheel Starburst */}
        <div className="gsap-c-pinwheel absolute top-[28%] right-[8%] text-white/35">
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-20 h-20 md:w-28 md:h-28">
            <path d="M50 50 L50 10 A40 40 0 0 1 78 22 Z M50 50 L90 50 A40 40 0 0 1 78 78 Z M50 50 L50 90 A40 40 0 0 1 22 78 Z M50 50 L10 50 A40 40 0 0 1 22 22 Z" />
          </svg>
        </div>

        {/* Lower Right Clover */}
        <div className="gsap-c-clover absolute bottom-12 right-[18%] text-white/30">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 md:w-16 md:h-16">
            <path d="M12 8.5c1.38 0 2.5-1.12 2.5-2.5S13.38 3.5 12 3.5 9.5 4.62 9.5 6s1.12 2.5 2.5 2.5zm0 7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5.5-5c0-1.38-1.12-2.5-2.5-2.5S12.5 9.12 12.5 10.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5zm-11 0c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z" />
          </svg>
        </div>

        {/* Bottom Sparkle Star */}
        <div className="gsap-c-star absolute bottom-8 left-[48%] text-white/50">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
          </svg>
        </div>

      </div>

      {/* Main Alignment Row: Girl (Left), Text Content (Center), Boy (Right) */}
      <div className="max-w-6xl w-full mx-auto relative z-20 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Girl Character - Left Side (Visible on Desktop only) */}
        <img 
          src={girlImg} 
          alt="Girl Character" 
          className="cm-character-girl hidden md:block w-auto h-[200px] lg:h-[240px] xl:h-[270px] object-contain opacity-0 shrink-0 select-none"
        />

        {/* Central Content Column */}
        <div className="flex-1 text-center flex flex-col items-center max-w-2xl mx-auto py-2">
          
          {/* Split Heading: JOIN THE (Line 1) and CREATOR MOVEMENT (Line 2) */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase mb-5 font-display overflow-hidden">
            <span className="cm-heading-line-1 block text-white opacity-0">JOIN THE</span>
            <span className="cm-heading-line-2 block bg-gradient-to-r from-amber-400 via-hot-pink to-royal-blue bg-clip-text text-transparent filter drop-shadow-[0_2px_20px_rgba(234,27,129,0.35)] opacity-0 pb-1">
              CREATOR MOVEMENT
            </span>
          </h2>

          {/* Subtitle Text */}
          <p className="cm-subtitle text-slate-300 text-xs sm:text-base leading-relaxed font-medium mb-8 opacity-0">
            Showcase your creativity. Inspire the nation. Be recognized for your digital impact.
          </p>

          {/* Glowing Bottom Badge */}
          <div className="cm-badge-container relative inline-flex opacity-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-[#8B3FD9] to-royal-blue blur-md opacity-45 animate-pulse" />
            <div className="relative bg-[#0B1448]/90 border border-white/10 px-7 py-2.5 rounded-full backdrop-blur-md">
              <span className="font-display font-black text-[10px] sm:text-xs tracking-[0.4em] text-amber-400 uppercase">
                CREATE • INSPIRE • LEAD
              </span>
            </div>
          </div>

        </div>

        {/* Boy Character - Right Side (Visible on Desktop only) */}
        <img 
          src={boyImg} 
          alt="Boy Character" 
          className="cm-character-boy hidden md:block w-auto h-[200px] lg:h-[240px] xl:h-[270px] object-contain opacity-0 shrink-0 select-none"
        />

        {/* Mobile/Tablet Characters Row (Visible on screens smaller than md) */}
        <div className="flex md:hidden flex-row justify-center items-center gap-8 mt-6 w-full relative z-30">
          <img 
            src={girlImg} 
            alt="Girl Character" 
            className="cm-character-girl w-auto h-[170px] sm:h-[210px] object-contain opacity-0 select-none"
            draggable={false}
          />
          <img 
            src={boyImg} 
            alt="Boy Character" 
            className="cm-character-boy w-auto h-[170px] sm:h-[210px] object-contain opacity-0 select-none"
            draggable={false}
          />
        </div>

      </div>
    </section>
  );
}
