import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
export default function CreatorMascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [posX, setPosX] = useState(0);
  const [direction, setDirection] = useState('right'); // 'left' or 'right'
  const [isWalking, setIsWalking] = useState(false);
  const [bubbleText, setBubbleText] = useState("Let's participate! 🏆");
  
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);
  const bubbleTimeout = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const scrollPercent = scrollY / maxScroll;
      // 1. Determine direction based on scroll delta
      if (scrollY > lastScrollY.current) {
        setDirection('right');
      } else if (scrollY < lastScrollY.current) {
        setDirection('left');
      }
      // 2. Set walking status to active
      setIsWalking(true);
      // Clear existing scroll idle timeout
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      // Stop walking if scroll stops for 120ms
      scrollTimeout.current = setTimeout(() => {
        setIsWalking(false);
      }, 120);
      // 3. Move character horizontally relative to scroll percent
      // Calculate the exact right boundary of the footer content container (max 1280px, padded)
      const footerRight = Math.min(window.innerWidth - 24, (window.innerWidth + 1280) / 2 - 24);
      // Stop the mascot exactly 125px before this boundary, aligning it next to the scroll-to-top button
      const maxTravel = Math.max(0, footerRight - 125);
      const newX = scrollPercent * maxTravel;
      setPosX(newX);
      // 4. Update bubble text contextually
      let newMsg = "Let's participate! 🏆";
      if (scrollPercent < 0.2) {
        newMsg = "Keep scrolling to participate! 🚀";
      } else if (scrollPercent >= 0.2 && scrollPercent < 0.6) {
        newMsg = "Look at these amazing categories! 🌟";
      } else if (scrollPercent >= 0.6 && scrollPercent < 0.85) {
        newMsg = "33 districts represent! 📈";
      } else {
        newMsg = "Don't wait, click Participate! 🧡";
      }
      if (newMsg !== bubbleText) {
        setBubbleText(newMsg);
      }
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [bubbleText]);
  // Hover triggers a cute hop/jump animation
  const handleHover = () => {
    gsap.fromTo('.mascot-svg-wrapper',
      { y: 0 },
      { y: -25, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
    setBubbleText("BEEP BOOP! Ready to record! 🎥✨");
  };
  if (!isVisible) return null;
  return (
    <div 
      className="fixed bottom-3 left-0 z-50 flex flex-col items-center select-none pointer-events-none transition-transform duration-100 ease-out"
      style={{
        transform: `translateX(${posX}px)`,
      }}
    >
      {/* Dynamic Bubble */}
      <div className="bg-[#0B1448] text-white border border-amber-500/20 text-[10px] font-bold px-3 py-1.5 rounded-[14px] shadow-lg mb-2 relative pointer-events-auto transition-all duration-200 animate-bounce max-w-[180px] sm:max-w-xs text-center leading-tight">
        {bubbleText}
        {/* Pointer Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[2px] border-4 border-transparent border-t-[#0B1448]" aria-hidden="true" />
      </div>
      {/* Mascot Container */}
      <div className="relative pointer-events-auto flex items-center justify-center">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors duration-150 shadow cursor-pointer text-[8px] font-bold z-30"
          title="Dismiss guide"
        >
          ✕
        </button>
        {/* Mascot Wrapper */}
        <div 
          onMouseEnter={handleHover}
          className="mascot-svg-wrapper w-[75px] h-[90px] cursor-pointer"
          style={{
            transform: `scaleX(${direction === 'right' ? 1 : -1})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease-out'
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 120" fill="none">
            {/* Inline CSS Animations for Leg & Arm Walking Cycle */}
            <style>{`
              @keyframes swingLegFront {
                0% { transform: rotate(-25deg); }
                50% { transform: rotate(20deg); }
                100% { transform: rotate(-25deg); }
              }
              @keyframes swingLegBack {
                0% { transform: rotate(20deg); }
                50% { transform: rotate(-25deg); }
                100% { transform: rotate(20deg); }
              }
              @keyframes swingArmFront {
                0% { transform: rotate(15deg); }
                50% { transform: rotate(-15deg); }
                100% { transform: rotate(15deg); }
              }
              @keyframes swingArmBack {
                0% { transform: rotate(-15deg); }
                50% { transform: rotate(15deg); }
                100% { transform: rotate(-15deg); }
              }
              @keyframes bobBody {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
                100% { transform: translateY(0px); }
              }
              
              .mascot-leg-front {
                transform-origin: 50px 72px;
                ${isWalking ? 'animation: swingLegFront 0.6s infinite linear;' : ''}
              }
              .mascot-leg-back {
                transform-origin: 50px 72px;
                ${isWalking ? 'animation: swingLegBack 0.6s infinite linear;' : ''}
              }
              .mascot-arm-front {
                transform-origin: 44px 44px;
                ${isWalking ? 'animation: swingArmFront 0.6s infinite linear;' : ''}
              }
              .mascot-arm-back {
                transform-origin: 56px 44px;
                ${isWalking ? 'animation: swingArmBack 0.6s infinite linear;' : ''}
              }
              .mascot-torso-group {
                ${isWalking ? 'animation: bobBody 0.3s infinite ease-in-out;' : ''}
              }
            `}</style>
            {/* Back Arm (Behind) */}
            <g className="mascot-arm-back">
              <path d="M56 44 L64 62" stroke="#2F6FEF" strokeWidth="6" strokeLinecap="round" />
              <circle cx="64" cy="62" r="3.5" fill="#FFA320" />
            </g>
            {/* Back Leg (Behind) */}
            <g className="mascot-leg-back">
              <path d="M50 72 L50 92 L58 106" stroke="#0B1448" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              {/* Back Shoe (Yellow highlight) */}
              <path d="M58 106 L68 106" stroke="#FFA320" strokeWidth="8" strokeLinecap="round" />
            </g>
            {/* Torso & Head Group (to allow bobbing) */}
            <g className="mascot-torso-group">
              {/* Hoodie Body (Royal Blue) */}
              <path d="M38 44 L62 44 L58 74 L42 74 Z" fill="#2F6FEF" rx="5" />
              {/* Hoodie Pocket (Light Cyan) */}
              <path d="M44 60 H56 V68 H44 Z" fill="#1DB9E8" rx="2" />
              
              {/* Neck */}
              <rect x="47" y="38" width="6" height="6" fill="#FBC193" />
              {/* Head (Peach skin) */}
              <circle cx="50" cy="28" r="11" fill="#FBC193" />
              
              {/* Cap (Facing right) */}
              <path d="M39 22 Q50 14 61 22 Z" fill="#FFA320" />
              <path d="M60 21 L71 23" stroke="#FFA320" strokeWidth="4.5" strokeLinecap="round" />
              {/* Cool Headphones (Dark Navy over Head) */}
              <path d="M39 28 A11 11 0 0 1 61 28" fill="none" stroke="#0B1448" strokeWidth="3" />
              <rect x="36" y="25" width="4" height="7" rx="2" fill="#0B1448" />
              <rect x="60" y="25" width="4" height="7" rx="2" fill="#0B1448" />
              {/* Face Details (Smiling Eye) */}
              <circle cx="54" cy="27" r="1.5" fill="#0B1448" />
              <path d="M53 32 Q56 34 58 32" stroke="#0B1448" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            {/* Front Leg (In Front) */}
            <g className="mascot-leg-front">
              <path d="M50 72 L46 92 L38 106" stroke="#2F6FEF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              {/* Front Shoe (Cyan highlights) */}
              <path d="M38 106 L28 106" stroke="#1DB9E8" strokeWidth="8" strokeLinecap="round" />
            </g>
            {/* Front Arm - Carrying Vlog Camera (In Front) */}
            <g className="mascot-arm-front">
              {/* Arm */}
              <path d="M44 44 L32 58 L46 68" stroke="#2F6FEF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Selfie Stick (Metal rod) */}
              <line x1="46" y1="68" x2="38" y2="78" stroke="#64748B" strokeWidth="2.5" />
              
              {/* Camera (Orange details) */}
              <rect x="32" y="78" width="12" height="9" rx="1.5" fill="#FFA320" />
              <circle cx="38" cy="82.5" r="2.5" fill="#0B1448" />
              {/* Red Record Dot */}
              <circle cx="34" cy="80.5" r="1" fill="#EF4444" className="animate-pulse" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}