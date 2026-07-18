import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import heroBanner1 from '../../assets/home/herosectionBanner.jpg';
import heroBanner2 from '../../assets/home/herosectionBanner2.png';

export default function HeroSection({ data }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const fallbackImages = [heroBanner1, heroBanner2];
  const images = data.banners && data.banners.length > 0 ? data.banners : fallbackImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 5 seconds autoplay
    return () => clearInterval(timer);
  }, [images.length]);
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const editionRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const btnContainerRef = useRef(null);
  const titleWrapRef = useRef(null);

  useEffect(() => {
    // Scope everything to this component + auto-revert on cleanup.
    // This is what actually prevents the title letters from getting stuck
    // at opacity:0 / rotateX:-90 when React runs effects twice in dev
    // (StrictMode mount -> cleanup -> mount): ctx.revert() kills any
    // in-flight tweens and clears their inline styles before the second
    // pass starts, so the two mounts never fight over the same elements.
    const ctx = gsap.context((self) => {
      const chars = self.selector('.char-l1, .char-l2, .char-l3');

      // 1. Initial Load Animations using GSAP Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Hide elements before animating to prevent flicker
      gsap.set(
        [badgeRef.current, editionRef.current, taglineRef.current, descRef.current, btnContainerRef.current],
        { opacity: 0, y: 25 }
      );

      // Set character initial state for a 3D "flip up" reveal
      gsap.set(chars, {
        opacity: 0,
        y: 70,
        rotateX: -90,
        transformOrigin: '50% 100%',
        transformPerspective: 500
      });

      // Run staggered animation timeline
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(
          self.selector('.char-l1'),
          { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: { each: 0.028, from: 'start' }, ease: 'back.out(1.6)' },
          '-=0.25'
        )
        .to(
          self.selector('.char-l2'),
          { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: { each: 0.03, from: 'start' }, ease: 'back.out(1.6)' },
          '-=0.55'
        )
        .to(
          self.selector('.char-l3'),
          { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: { each: 0.03, from: 'start' }, ease: 'back.out(1.6)' },
          '-=0.55'
        )
        .to(editionRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(btnContainerRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

      // 2. Interactive hover "wave" on the title characters
      const titleEl = titleWrapRef.current;
      const handleEnter = () => {
        gsap.to(chars, {
          y: -10,
          duration: 0.35,
          ease: 'power2.out',
          stagger: { each: 0.012, from: 'start', yoyo: true, repeat: 1 }
        });
      };
      if (titleEl) titleEl.addEventListener('mouseenter', handleEnter);

      // 3. Subtle mouse-driven parallax for the background banner + glows
      const glow1 = self.selector('.parallax-bg-glow-1');
      const glow2 = self.selector('.parallax-bg-glow-2');
      const banner = self.selector('.parallax-banner');
      const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = clientX / innerWidth - 0.5;
        const y = clientY / innerHeight - 0.5;

        gsap.to(glow1, { x: x * -40, y: y * -40, duration: 1.5, ease: 'power2.out' });
        gsap.to(glow2, { x: x * 30, y: y * 30, duration: 1.5, ease: 'power2.out' });
        gsap.to(banner, { x: x * -18, y: y * -12, duration: 1.8, ease: 'power2.out' });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // gsap.context cleanup runs these automatically for tweens it created,
      // but manual DOM listeners still need manual teardown:
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (titleEl) titleEl.removeEventListener('mouseenter', handleEnter);
      };
    }, containerRef);

    return () => ctx.revert(); // kills all tweens + restores styles cleanly
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] bg-deep-navy text-white flex items-center overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 md:px-8 border-b border-white/10"
    >
      {/* Banner Illustration Background Carousel (full bleed behind copy) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`parallax-banner absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-right scale-110 transition-opacity duration-1000 ease-in-out ${
              idx === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Readability scrim: solid navy on the left where copy sits, fading out toward the artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-navy via-deep-navy/85 to-deep-navy/10 sm:via-deep-navy/75 sm:to-transparent z-[2]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1.5px,transparent_1.5px)] bg-[length:24px_24px] opacity-60 z-[2]"></div>
      </div>

      {/* Ambient color glows for extra depth */}
      <div className="parallax-bg-glow-1 absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-royal-blue/20 via-brand-purple/10 to-hot-pink/20 filter blur-[90px] pointer-events-none z-[1] animate-pulse"></div>
      <div className="parallax-bg-glow-2 absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-light-cyan/10 via-royal-blue/10 to-transparent filter blur-[90px] pointer-events-none z-[1]"></div>

      <div className="max-w-xl lg:max-w-3xl w-full relative z-10">

        {/* Copy and CTAs */}
        <div className="flex flex-col items-start text-left space-y-6">

          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-white/10 backdrop-blur-sm shadow-sm hover:shadow hover:bg-white/15 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-golden-orange animate-ping"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
              {data.badge}
            </span>
          </div>

          {/* Core Title with Unique 3D Flip + Shimmer Reveal */}
          <div ref={titleWrapRef} className="space-y-1.5 font-display select-none cursor-default" style={{ perspective: 800 }}>
            {/* Line 1: CHHATTISGARH */}
            <div className="overflow-hidden min-h-[1.1em] py-1">
              <h1 className="char-l1 text-4xl sm:text-5xl md:text-[80px] font-black tracking-wider uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] origin-bottom inline-block" style={{ color: '#ffffff', transformStyle: 'preserve-3d' }}>
                {data.titlePart1}
              </h1>
            </div>
            {/* Line 2 & 3: CREATOR AWARDS */}
            <div className="flex flex-wrap gap-x-4">
              <div className="overflow-hidden min-h-[1.1em] py-1">
                <h2 className="char-l2 text-4xl sm:text-5xl md:text-[80px] font-black tracking-wide uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] origin-bottom inline-block" style={{ color: '#ffffff', transformStyle: 'preserve-3d' }}>
                  {data.titlePart2}
                </h2>
              </div>
              <div className="overflow-hidden min-h-[1.1em] py-1">
                <h2 className="char-l3 text-4xl sm:text-6xl md:text-[80px] font-black tracking-wide uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] origin-bottom inline-block" style={{ color: '#ffffff', transformStyle: 'preserve-3d' }}>
                  {data.titlePart3}
                </h2>
              </div>
            </div>
          </div>

          {/* Edition sub-badge */}
          <p ref={editionRef} className="text-xs sm:text-sm font-mono font-extrabold tracking-[0.35em] text-white/45 uppercase">
            — {data.edition} —
          </p>

          {/* Tagline */}
          <p ref={taglineRef} className="text-lg md:text-xl font-display font-extrabold text-coral-orange tracking-wide">
            {data.tagline}
          </p>

          {/* Description */}
          <p ref={descRef} className="text-sm sm:text-base text-white/75 max-w-xl leading-relaxed font-normal">
            {data.description}
          </p>

          {/* Buttons */}
          <div ref={btnContainerRef} className="flex flex-wrap gap-4 pt-4">

            {/* Primary CTA: gradient shine-sweep reveal */}
            <Link to="/participate" className="group relative overflow-hidden bg-white text-deep-navy font-extrabold text-sm px-8 py-4.5 rounded-2xl shadow-lg shadow-black/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-hot-pink/25 active:scale-95 cursor-pointer flex items-center justify-center">
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-royal-blue via-brand-purple to-hot-pink transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                {data.ctaPrimary}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>

            {/* Secondary CTA: glass border glow */}
            <Link to="/categories" className="group relative bg-white/5 hover:bg-white/10 text-white border border-white/25 hover:border-white/50 font-extrabold text-sm px-8 py-4.5 rounded-2xl backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center">
              <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)]"></span>
              <span className="relative z-10 flex items-center gap-2">
                {data.ctaSecondary}
                <span className="inline-block transition-transform duration-300 group-hover:rotate-45">↗</span>
              </span>
            </Link>

          </div>

        </div>

      </div>

      {/* Carousel Slide Indicators */}
      <div className="absolute bottom-6 right-6 flex gap-2.5 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentImageIndex
                ? "bg-[#FFA320] w-6 shadow-[0_0_8px_rgba(255,163,32,0.5)]"
                : "bg-white/35 hover:bg-white/60"
            }`}
            aria-label={`Go to background slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}