import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';
import bgVdo from '../../assets/vdo/login.mp4';

export default function AboutHeroSection() {
  const heroRef = useRef(null);

  useEffect(() => {
    // Reveal animation for hero contents
    const tl = gsap.timeline();
    
    tl.fromTo('.ahs-heading',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );

    tl.fromTo('.ahs-text',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.2 },
      '-=0.4'
    );

    tl.fromTo('.ahs-btn',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' },
      '-=0.3'
    );
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('story-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden text-center text-white px-4 sm:px-6 select-none"
    >
      {/* Background Video Looping */}
      <div className="absolute inset-0 z-0">
        <video
          src={bgVdo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.05] filter blur-[4px] brightness-[0.35]"
        />
        {/* Dark mask overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-[#0B1448]/50 to-[#070A21]" />
      </div>

      {/* Floating Y2K mesh backlights */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-hot-pink/40 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-royal-blue/40 blur-[120px]" />
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto relative z-20 flex flex-col items-center gap-6 sm:gap-8">
        
        <div className="ahs-heading opacity-0">
          <h1 
            className="text-3xl sm:text-5xl md:text-6.5xl font-black uppercase tracking-tight leading-[1.1] font-display !text-white"
            style={{ color: '#ffffff' }}
          >
            From Chhattisgarh's Streets <br />
            To India's Screens
          </h1>
        </div>

        <div className="ahs-text opacity-0 flex flex-col gap-4 max-w-2xl text-slate-200 text-xs sm:text-base font-semibold leading-relaxed">
          <p>
            Every reel shot in a Bastar village, every folk song remixed by a Raipur teenager, and every college vlog filmed in Bilaspur is the raw material of Chhattisgarh's booming creator economy.
          </p>
          <p>
            Our youth are not waiting for opportunities from metropolitan cities—they are creating them from home, in their own language and culture.
          </p>
        </div>

        {/* Scroll CTA Trigger */}
        <button
          onClick={handleScrollDown}
          className="ahs-btn opacity-0 group inline-flex items-center gap-2 bg-[#FFA320] hover:bg-amber-500 text-[#0B1448] font-black text-xs uppercase tracking-wider px-8 py-4.5 rounded-2xl shadow-xl hover:shadow-amber-400/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          Explore Our Vision
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-150" />
        </button>

      </div>

    </section>
  );
}
