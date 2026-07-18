import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import chhattisgarhImg from '../../assets/about/chattisgarh.png';

gsap.registerPlugin(ScrollTrigger);

export default function AboutCulturalPause() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Reveal text block lines
    gsap.fromTo('.acp-line',
      { y: 40, opacity: 0 },
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

    // Reveal illustration image
    gsap.fromTo('.acp-image',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.4,
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
      className="relative w-full overflow-hidden bg-[#070A21] py-24 sm:py-32 px-4 sm:px-6 md:px-8 text-center text-white flex flex-col items-center justify-center"
    >
      
      {/* Immersive mesh glows */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-500/10 filter blur-[100px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-600/10 filter blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Culture & People Illustration Image */}
        <div className="acp-image opacity-0 lg:col-span-5 flex justify-center lg:justify-start">
          <img 
            src={chhattisgarhImg} 
            alt="Chhattisgarh Culture and People" 
            className="w-full max-w-[420px] h-auto object-contain select-none filter drop-shadow-[0_10px_25px_rgba(255,255,255,0.06)]"
            draggable={false}
          />
        </div>

        {/* Right Column: Quote box and translation */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start gap-8 w-full">
          
          {/* Border Box framing the emotional statement */}
          <div className="relative w-full max-w-xl border-[3px] border-white p-8 sm:p-12 flex flex-col items-center justify-center bg-[#070A21]">
            
            {/* Top Left Quote Mask */}
            <span 
              className="absolute -top-7 -left-3 sm:-top-10 sm:-left-4 bg-[#070A21] px-2 text-white font-serif text-6xl sm:text-8xl leading-none select-none font-black"
              style={{ color: '#ffffff' }}
            >
              “
            </span>

            {/* Hindi Statement */}
            <h3 
              className="acp-line opacity-0 text-3xl sm:text-4xl md:text-4.5xl font-black tracking-wide leading-normal text-center select-none font-serif !text-white"
              style={{ color: '#ffffff' }}
            >
              अपनी आवाज़ <br />
              अपना छत्तीसगढ़ <br />
              नया भारत
            </h3>

            {/* Bottom Right Quote Mask */}
            <span 
              className="absolute -bottom-10 -right-3 sm:-bottom-14 sm:-right-4 bg-[#070A21] px-2 text-white font-serif text-6xl sm:text-8xl leading-none select-none font-black"
              style={{ color: '#ffffff' }}
            >
              ”
            </span>

          </div>

          {/* English Translation */}
          <p 
            className="acp-line opacity-0 text-xs sm:text-sm font-sans font-black tracking-[0.3em] !text-white uppercase text-center lg:text-left w-full pl-2"
            style={{ color: '#ffffff' }}
          >
            Our Voice. Our Chhattisgarh. India's Tomorrow.
          </p>

        </div>

      </div>

    </section>
  );
}
