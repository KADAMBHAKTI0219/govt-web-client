import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Rocket, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutVisionStatement() {
  const containerRef = useRef(null);
  const boxesRef = useRef(null);

  useEffect(() => {
    // Reveal header block
    gsap.fromTo('.avs-header-item',
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

    // Reveal side-by-side boxes
    gsap.fromTo('.avs-box',
      { y: 50, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: boxesRef.current,
          start: 'top 75%'
        }
      }
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#070A21] py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-b border-slate-900 overflow-hidden font-sans"
    >
      
      {/* Background radial backlights */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/10 filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0A84FF]/10 filter blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-16">
        
        {/* Section title */}
        <div className="avs-header-item opacity-0 text-center max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display" style={{ color: '#ffffff' }}>
            Vision & Mission
          </h2>
        </div>

        {/* Two Boxes Grid */}
        <div 
          ref={boxesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          
          {/* Box 1: Our Vision */}
          <div className="avs-box opacity-0 bg-white/5 border border-white/10 p-8 sm:p-10 rounded-[24px] shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div>
              {/* Box Title */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-white font-display" style={{ color: '#ffffff' }}>
                  Our Vision
                </h3>
              </div>

              {/* Detailed Vision Content */}
              <p 
                className="text-white text-sm font-semibold leading-relaxed mb-4 !text-white"
                style={{ color: '#ffffff' }}
              >
                Empowered youth power a thriving state creator economy, and that economy fuels India's larger digital landscape with unmistakably Chhattisgarhi voices.
              </p>
              <p 
                className="text-white text-xs sm:text-sm leading-relaxed !text-white opacity-90"
                style={{ color: '#ffffff' }}
              >
                We envision a Chhattisgarh where creators don't have to leave home to be heard nationally, where tribal heritage and local culture are celebrated with dignity, and where digital influence is recognized as a powerful force for culture, tourism, innovation, and public service. We are no longer a state asking to be noticed—we are a state that is impossible to scroll past.
              </p>
            </div>
          </div>

          {/* Box 2: Our Mission */}
          <div className="avs-box opacity-0 bg-white/5 border border-white/10 p-8 sm:p-10 rounded-[24px] shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div>
              {/* Box Title */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider text-white font-display" style={{ color: '#ffffff' }}>
                  Our Mission
                </h3>
              </div>

              {/* Detailed Mission Content */}
              <p 
                className="text-white text-sm font-semibold leading-relaxed mb-4 !text-white"
                style={{ color: '#ffffff' }}
              >
                The Chhattisgarh State Creator & Influencer Awards exists to identify, recognize, and empower creators across the state by transforming individual talent into a celebrated creator ecosystem.
              </p>
              <p 
                className="text-white text-xs sm:text-sm leading-relaxed !text-white opacity-90"
                style={{ color: '#ffffff' }}
              >
                Through our four core commitments—Spot, Amplify, Connect, and Empower—we provide visibility, mentorship, collaboration, and long-term institutional support, ensuring that creators become trusted storytellers who strengthen civic engagement, promote tourism, preserve culture, and contribute to the vision of Viksit Bharat @2047.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
