import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "../ui/AnimatedHeading";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value: "33",
    title: "Districts",
    description:
      "Every district of Chhattisgarh represented on the platform.",
  },
  {
    value: "25+",
    title: "Categories",
    description:
      "From education to entertainment — a category for every creator.",
  },
  {
    value: "✓",
    title: "Government Recognition",
    description:
      "Officially backed and recognised by the Government of Chhattisgarh.",
  },
  {
    value: "1",
    title: "Creator Community",
    description:
      "One unified home for Chhattisgarh's creator ecosystem.",
  },
];

export default function StatsSection() {
  const cardsRef = useRef([]);
  const cardsMobileRef = useRef([]);
  const pathRef = useRef(null);
  const mascotRef = useRef(null);
  const pathMobileRef = useRef(null);
  const mascotMobileRef = useRef(null);

  useEffect(() => {
    // -------------------------------------------------------------
    // 1. Desktop Timeline Animation (Horizontal -> Vertical -> Horizontal)
    // -------------------------------------------------------------
    const path = pathRef.current;
    const mascot = mascotRef.current;
    let drawAnim = null;

    if (path && mascot) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      const startPoint = path.getPointAtLength(0);
      const nextPoint = path.getPointAtLength(1);
      const initialAngle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x) * (180 / Math.PI);
      gsap.set(mascot, {
        x: startPoint.x,
        y: startPoint.y,
        rotate: initialAngle,
      });

      const progressObj = { value: 0 };
      
      drawAnim = gsap.to(progressObj, {
        value: 1,
        duration: 3.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 60%",
          toggleActions: "play none none none",
          onEnter: () => {
            cardsRef.current.forEach((card) => {
              if (card) delete card.dataset.revealed;
            });
          }
        },
        onUpdate: () => {
          const progress = progressObj.value;
          path.style.strokeDashoffset = length * (1 - progress);

          const point = path.getPointAtLength(length * progress);
          const pointBefore = path.getPointAtLength(Math.max(0, length * progress - 1));
          const angle = Math.atan2(point.y - pointBefore.y, point.x - pointBefore.x) * (180 / Math.PI);

          gsap.set(mascot, {
            x: point.x,
            y: point.y,
            rotate: angle,
          });

          cardsRef.current.forEach((card, idx) => {
            if (!card) return;
            const targetProgress = idx * 0.33;
            if (progress >= targetProgress && !card.dataset.revealed) {
              card.dataset.revealed = "true";
              gsap.fromTo(
                card,
                { opacity: 0, scale: 0.9, x: idx % 2 === 0 ? -60 : 60 },
                { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: "back.out(1.5)" }
              );
            }
          });
        }
      });
    }

    // -------------------------------------------------------------
    // 2. Mobile/Tablet Timeline Animation (Horizontal -> Vertical -> Horizontal)
    // -------------------------------------------------------------
    const mPath = pathMobileRef.current;
    const mMascot = mascotMobileRef.current;
    let mDrawAnim = null;

    if (mPath && mMascot) {
      const mLength = mPath.getTotalLength();
      mPath.style.strokeDasharray = mLength;
      mPath.style.strokeDashoffset = mLength;

      const mStartPoint = mPath.getPointAtLength(0);
      const mNextPoint = mPath.getPointAtLength(1);
      const mInitialAngle = Math.atan2(mNextPoint.y - mStartPoint.y, mNextPoint.x - mStartPoint.x) * (180 / Math.PI);
      gsap.set(mMascot, {
        x: mStartPoint.x,
        y: mStartPoint.y,
        rotate: mInitialAngle,
      });

      const mProgressObj = { value: 0 };

      mDrawAnim = gsap.to(mProgressObj, {
        value: 1,
        duration: 3.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 60%",
          toggleActions: "play none none none",
          onEnter: () => {
            cardsMobileRef.current.forEach((card) => {
              if (card) delete card.dataset.revealed;
            });
          }
        },
        onUpdate: () => {
          const progress = mProgressObj.value;
          mPath.style.strokeDashoffset = mLength * (1 - progress);

          const point = mPath.getPointAtLength(mLength * progress);
          const pointBefore = mPath.getPointAtLength(Math.max(0, mLength * progress - 1));
          const angle = Math.atan2(point.y - pointBefore.y, point.x - pointBefore.x) * (180 / Math.PI);

          gsap.set(mMascot, {
            x: point.x,
            y: point.y,
            rotate: angle,
          });

          cardsMobileRef.current.forEach((card, idx) => {
            if (!card) return;
            const targetProgress = idx * 0.33;
            if (progress >= targetProgress && !card.dataset.revealed) {
              card.dataset.revealed = "true";
              gsap.fromTo(
                card,
                { opacity: 0, scale: 0.9, x: 50 },
                { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: "back.out(1.5)" }
              );
            }
          });
        }
      });
    }

    return () => {
      if (drawAnim) {
        drawAnim.kill();
        if (drawAnim.scrollTrigger) drawAnim.scrollTrigger.kill();
      }
      if (mDrawAnim) {
        mDrawAnim.kill();
        if (mDrawAnim.scrollTrigger) mDrawAnim.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section className="stats-section my-16 lg:my-24 bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Animated Section Heading */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold tracking-wider mb-3">
            STATE IMPACT
          </span>
          <AnimatedHeading
            text="Key Statistics"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2937] tracking-tight uppercase"
          />
        </div>

        {/* Desktop Layout (Horizontal timeline with straight connections) - hidden under 1024px */}
        <div className="relative h-[600px] max-w-[1000px] w-full mx-auto hidden lg:block">
          
          {/* Animated SVG timeline connector path + Creator Mascot path traveler */}
          <svg className="absolute inset-0 w-full h-full z-0 overflow-visible pointer-events-none">
            <defs>
              {/* Path neon linear gradient mapping our brand colors */}
              <linearGradient id="neonPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2F6FEF" />
                <stop offset="50%" stopColor="#8B3FD9" />
                <stop offset="100%" stopColor="#FFA320" />
              </linearGradient>
              
              {/* Radial glow background around traveler */}
              <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFA320" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#FFA320" stopOpacity="0" />
              </radialGradient>

              {/* Checkpoint circular drop shadow */}
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0B1448" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Embedded style block to animate walk bobbing */}
            <style>
              {`
                @keyframes mascotWalk {
                  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
                  50% { transform: translateY(-3.5px) rotate(1.5deg); }
                }
                .mascot-body-group {
                  animation: mascotWalk 0.5s infinite ease-in-out;
                }
              `}
            </style>

            {/* Static horizontal connector lines for center cards (Card 1 & Card 2) */}
            <line x1="500" y1="220" x2="620" y2="220" stroke="#8B3FD9" strokeWidth="3" strokeLinecap="round" className="opacity-80" />
            <line x1="380" y1="380" x2="500" y2="380" stroke="#8B3FD9" strokeWidth="3" strokeLinecap="round" className="opacity-80" />

            {/* Combined Traveler Path (Horizontal Card 0 -> Center Node 0 -> Straight Down -> Center Node 3 -> Horizontal Card 3) */}
            <path
              ref={pathRef}
              id="travelerZigZagPath"
              d="M 380,60 L 500,60 L 500,540 L 620,540"
              fill="none"
              stroke="url(#neonPathGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-85"
            />

            {/* Traveler Mascot Group: moves dynamically matching line-drawing position */}
            <g ref={mascotRef}>
              {/* Radial orange glow helper */}
              <circle cx="0" cy="0" r="18" fill="url(#mascotGlow)" />
              
              {/* Mascot graphics */}
              <g className="mascot-body-group">
                {/* Yellow screen frame */}
                <rect x="-10" y="-12" width="20" height="18" rx="5" fill="#FFA320" stroke="#0B1448" strokeWidth="1.5" />
                {/* Deep navy camera lens display */}
                <rect x="-7" y="-9" width="14" height="11" rx="2.5" fill="#0B1448" />
                {/* Neon blinking eyes */}
                <circle cx="-3" cy="-3.5" r="1.2" fill="#4ADE80" />
                <circle cx="3" cy="-3.5" r="1.2" fill="#4ADE80" />
                {/* Antenna */}
                <line x1="0" y1="-12" x2="0" y2="-17" stroke="#0B1448" strokeWidth="1.5" />
                <circle cx="0" cy="-18" r="2" fill="#EF4444" />
                {/* Backpack device */}
                <rect x="-13" y="-6" width="3" height="9" rx="1" fill="#8B3FD9" />
                {/* Hands */}
                <circle cx="-12" cy="1" r="2" fill="#FFA320" />
                <circle cx="12" cy="1" r="2" fill="#FFA320" />
                {/* Tiny walking feet */}
                <rect x="-5" y="6" width="3" height="4" rx="0.5" fill="#0B1448" />
                <rect x="2" y="6" width="3" height="4" rx="0.5" fill="#0B1448" />
              </g>
            </g>

            {/* Checkpoint nodes (white circles with colored borders) at path bends */}
            <circle cx="500" cy="60" r="10" fill="white" stroke="#2F6FEF" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="500" cy="220" r="10" fill="white" stroke="#8B3FD9" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="500" cy="380" r="10" fill="white" stroke="#8B3FD9" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="500" cy="540" r="10" fill="white" stroke="#FFA320" strokeWidth="4" filter="url(#nodeShadow)" />
          </svg>

          {/* Cards Rendered at exact connection slots */}
          {STATS.map((stat, index) => {
            // Set coordinates corresponding to connection points
            let topPosition = "0px";
            let leftPosition = "0px";
            
            if (index === 0) {
              topPosition = "20px";
              leftPosition = "0px";
            } else if (index === 1) {
              topPosition = "180px";
              leftPosition = "620px";
            } else if (index === 2) {
              topPosition = "340px";
              leftPosition = "0px";
            } else if (index === 3) {
              topPosition = "500px";
              leftPosition = "620px";
            }

            return (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className="absolute w-[380px] bg-white rounded-2xl shadow-xl border border-slate-100/80 px-6 py-4.5 hover:shadow-2xl transition-all duration-300"
                style={{ top: topPosition, left: leftPosition, opacity: 0 }}
              >
                <div className="flex items-center gap-5">
                  <div className="text-[52px] font-black text-[#0B1448] leading-none font-display shrink-0">
                    {stat.value}
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] tracking-[0.3em] text-[#8B3FD9] font-black mb-1.5 uppercase">
                      {String(index + 1).padStart(2, "0")} / 04
                    </div>
                    <h3 className="text-[18px] font-black leading-tight text-[#0B1448] font-display">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 font-sans">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Layout (Responsive vertical replacement) - stacks neatly under 1024px */}
        <div className="relative h-[780px] max-w-[480px] w-full mx-auto lg:hidden">
          
          {/* Animated SVG straight vertical timeline line + traveling mascot */}
          <svg className="absolute inset-0 w-full h-full z-0 overflow-visible pointer-events-none">
            <defs>
              <linearGradient id="neonPathGradMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2F6FEF" />
                <stop offset="50%" stopColor="#8B3FD9" />
                <stop offset="100%" stopColor="#FFA320" />
              </linearGradient>
            </defs>

            {/* Embedded style block to animate walk bobbing */}
            <style>
              {`
                @keyframes mascotWalkMobile {
                  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
                  50% { transform: translateY(-3.5px) rotate(1.5deg); }
                }
                .mascot-body-group-mobile {
                  animation: mascotWalkMobile 0.5s infinite ease-in-out;
                }
              `}
            </style>

            {/* Static horizontal connector lines for center cards (Card 1 & Card 2) */}
            <line x1="35" y1="260" x2="75" y2="260" stroke="#8B3FD9" strokeWidth="3" strokeLinecap="round" className="opacity-80" />
            <line x1="35" y1="460" x2="75" y2="460" stroke="#8B3FD9" strokeWidth="3" strokeLinecap="round" className="opacity-80" />

            {/* Straight Vertical Path (starts drawing dynamically from Card 0 to Node 0, down center, then to Card 3) */}
            <path
              ref={pathMobileRef}
              id="travelerStraightPath"
              d="M 75,60 L 35,60 L 35,660 L 75,660"
              fill="none"
              stroke="url(#neonPathGradMobile)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-85"
            />

            {/* Traveler Mascot Group: moves dynamically matching line-drawing position */}
            <g ref={mascotMobileRef}>
              {/* Radial orange glow helper */}
              <circle cx="0" cy="0" r="18" fill="url(#mascotGlow)" />
              
              {/* Mascot graphics */}
              <g className="mascot-body-group-mobile">
                {/* Yellow screen frame */}
                <rect x="-10" y="-12" width="20" height="18" rx="5" fill="#FFA320" stroke="#0B1448" strokeWidth="1.5" />
                {/* Deep navy camera lens display */}
                <rect x="-7" y="-9" width="14" height="11" rx="2.5" fill="#0B1448" />
                {/* Neon blinking eyes */}
                <circle cx="-3" cy="-3.5" r="1.2" fill="#4ADE80" />
                <circle cx="3" cy="-3.5" r="1.2" fill="#4ADE80" />
                {/* Antenna */}
                <line x1="0" y1="-12" x2="0" y2="-17" stroke="#0B1448" strokeWidth="1.5" />
                <circle cx="0" cy="-18" r="2" fill="#EF4444" />
                {/* Backpack device */}
                <rect x="-13" y="-6" width="3" height="9" rx="1" fill="#8B3FD9" />
                {/* Hands */}
                <circle cx="-12" cy="1" r="2" fill="#FFA320" />
                <circle cx="12" cy="1" r="2" fill="#FFA320" />
                {/* Tiny walking feet */}
                <rect x="-5" y="6" width="3" height="4" rx="0.5" fill="#0B1448" />
                <rect x="2" y="6" width="3" height="4" rx="0.5" fill="#0B1448" />
              </g>
            </g>

            {/* Checkpoint nodes (white circles with colored borders) at path points */}
            <circle cx="35" cy="60" r="10" fill="white" stroke="#2F6FEF" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="35" cy="260" r="10" fill="white" stroke="#8B3FD9" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="35" cy="460" r="10" fill="white" stroke="#8B3FD9" strokeWidth="4" filter="url(#nodeShadow)" />
            <circle cx="35" cy="660" r="10" fill="white" stroke="#FFA320" strokeWidth="4" filter="url(#nodeShadow)" />
          </svg>

          {/* Cards Rendered at exact vertical connection slots */}
          {STATS.map((stat, index) => {
            const topPosition = `${index * 200 + 15}px`;

            return (
              <div
                key={index}
                ref={(el) => (cardsMobileRef.current[index] = el)}
                className="absolute left-[75px] w-[calc(100%-90px)] bg-white rounded-2xl shadow-xl border border-slate-100/80 px-4 py-3 hover:shadow-2xl transition-all duration-300"
                style={{ top: topPosition, opacity: 0 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-[36px] sm:text-[44px] font-black text-[#0B1448] leading-none font-display shrink-0">
                    {stat.value}
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] tracking-[0.3em] text-[#8B3FD9] font-black mb-1 uppercase">
                      {String(index + 1).padStart(2, "0")} / 04
                    </div>
                    <h3 className="text-[15px] sm:text-[17px] font-black leading-tight text-[#0B1448] font-display">
                      {stat.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed mt-0.5 font-sans">
                      {stat.description}
                    </p>
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