import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AboutHeroSection from './AboutHeroSection';
import AboutStorySection from './AboutStorySection';
import AboutVisionStatement from './AboutVisionStatement';
import AboutNationalNarrative from './AboutNationalNarrative';
import AboutArchitectsTrust from './AboutArchitectsTrust';
import AboutCulturalPause from './AboutCulturalPause';
import AboutBeyondTrophy from './AboutBeyondTrophy';
import AboutLongTermVision from './AboutLongTermVision';
import AboutFinalMessage from './AboutFinalMessage';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  useEffect(() => {
    // Stagger block reveal transitions smoothly using lightweight, hardware-accelerated style rules
    const sections = gsap.utils.toArray('.about-section-block');
    sections.forEach((section, idx) => {
      // Skip the Hero section to ensure immediate visual interaction above the fold
      if (idx === 0) return;

      gsap.fromTo(section,
        { 
          opacity: 0, 
          y: 24
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'sine.out', // Smooth, lightweight transition ease
          scrollTrigger: {
            trigger: section,
            start: 'top 88%', // Trigger slightly earlier to ensure smooth visual entry
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pt-16 pb-4 relative overflow-hidden font-sans">
      
      {/* 1. Hero Banner */}
      <div className="about-section-block">
        <AboutHeroSection />
      </div>

      {/* 2. The Story Begins */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutStorySection />
      </div>

      {/* 3. Vision Statement */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutVisionStatement />
      </div>

      {/* 4. Driving the National Narrative */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutNationalNarrative />
      </div>

      {/* 5. Digital Creators as Architects of Trust */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutArchitectsTrust />
      </div>

      {/* 7. Cultural Statement Pause */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutCulturalPause />
      </div>

      {/* 8. Beyond the Trophy Sequence */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutBeyondTrophy />
      </div>

      {/* 9. Long-Term Vision */}
      <div className="about-section-block will-change-[transform,opacity]">
        <AboutLongTermVision />
      </div>

      {/* 10. Final Message */}
      {/* <div className="about-section-block will-change-[transform,opacity]">
        <AboutFinalMessage />
      </div> */}

    </div>
  );
}
