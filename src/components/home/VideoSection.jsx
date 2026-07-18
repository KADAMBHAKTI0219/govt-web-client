import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoSection({ data }) {
  const [playing, setPlaying] = useState({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Section Header
      gsap.fromTo('.video-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.video-header',
            start: 'top 85%',
            once: true,
            toggleActions: 'play none none none'
          }
        }
      );

      // Smooth vertical slide-up fade-in transition on scroll
      gsap.fromTo('.video-card',
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.video-card',
            start: 'top 85%',
            once: true,
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="awards"
      className="relative w-full py-16 md:py-24 px-4 md:px-8 bg-[#F8FAFC] border-b border-slate-100 overflow-hidden"
      style={{
        backgroundSize: '24px 24px',
        backgroundImage: `radial-gradient(rgba(11, 20, 72, 0.015) 1.5px, transparent 1.5px)`
      }}
    >
      {/* Background soft color blob (static blur for GPU texture caching to prevent paint lag) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[350px] rounded-full bg-gradient-to-r from-royal-blue/5 via-brand-purple/5 to-transparent filter blur-[80px] sm:blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Section Header */}
        <div className="video-header text-center max-w-2xl mb-12 sm:mb-16 space-y-3 px-2" style={{ willChange: 'transform, opacity' }}>
          <span className="text-xs font-mono font-black tracking-widest text-brand-purple uppercase">
            LIVE BROADCASTS
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-deep-navy font-display leading-tight">
            {data.sectionTitle}
          </h2>
          <p className="text-xs sm:text-base text-deep-navy/70 leading-relaxed">
            {data.sectionSubtitle}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full px-2 sm:px-0">
          {data.videos.map((v) => {
            const accentBorder = v.side === 'left' ? 'group-hover:border-royal-blue/35' : 'group-hover:border-brand-purple/35';
            const shadowHover = v.side === 'left' ? 'hover:shadow-royal-blue/10' : 'hover:shadow-brand-purple/10';
            const isPlaying = playing[v.id];

            return (
              <div
                key={v.id}
                className="group video-card flex flex-col overflow-hidden rounded-[24px] bg-white border border-slate-100/80 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Responsive Video Container / Lazy Playback Thumbnail */}
                <div className="relative w-full aspect-video bg-slate-900 overflow-hidden rounded-t-[23px] group/vid">
                  {isPlaying ? (
                    <iframe
                      className="absolute inset-0 w-full h-full border-0 z-10"
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 w-full h-full cursor-pointer z-10"
                      onClick={() => setPlaying(prev => ({ ...prev, [v.id]: true }))}
                    >
                      {/* High-quality YouTube Video Thumbnail */}
                      <img
                        src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                        alt={v.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/vid:scale-105"
                        loading="lazy"
                      />
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-black/25 group-hover/vid:bg-black/40 transition-colors duration-300" />
                      
                      {/* Pulsing Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/95 group-hover/vid:bg-royal-blue group-hover/vid:scale-110 flex items-center justify-center shadow-2xl transition-all duration-300 relative z-20">
                          {/* Pulsing ring helper */}
                          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping group-hover/vid:bg-royal-blue/30" />
                          <svg className="w-5 h-5 sm:w-7 sm:h-7 text-deep-navy group-hover/vid:text-white translate-x-0.5 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Card Footer */}
                <div className={`p-5 sm:p-6 flex-grow flex flex-col justify-between border-t-4 border-transparent ${accentBorder} transition-all duration-300`}>
                  <div className="space-y-2">
                    {/* Badge */}
                    <span className="inline-block text-[9px] font-mono font-black text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-500/15 uppercase tracking-wide">
                      Live Recorded
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-black font-display text-deep-navy group-hover:text-royal-blue transition-colors duration-200 leading-tight">
                      {v.title}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-deep-navy/70 leading-relaxed font-sans">
                      {v.description}
                    </p>
                  </div>
                  
                  {/* Outer Link / Watch on YT CTA */}
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-royal-blue">
                    <a 
                      href={`https://www.youtube.com/watch?v=${v.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      Watch on YouTube
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
