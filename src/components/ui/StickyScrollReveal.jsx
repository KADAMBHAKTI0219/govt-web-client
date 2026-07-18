"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div ref={ref} className="mx-auto w-full max-w-7xl px-4 md:px-8">
      {/* Desktop Layout (lg screens and up) */}
      <div className="relative hidden lg:flex w-full">
        {/* Left side text column */}
        <div className="flex w-1/2 items-start px-4">
          <div className="w-full max-w-xl">
            {content.map((item, index) => (
              <div
                key={item.title + index}
                className="flex min-h-[80vh] flex-col justify-center py-12"
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="text-2xl font-bold text-slate-850 md:text-3xl"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                  }}
                  className="mt-6 max-w-md text-base text-slate-500 leading-relaxed font-light"
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side sticky card column */}
        <div className="flex w-1/2 items-start justify-center px-4">
          <div className="sticky top-[10%] h-[80vh] flex items-center justify-center">
            <div
              className={cn(
                "relative flex items-center justify-center",
                contentClassName
              )}
            >
              {content[activeCard].content ?? null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout (Stacked scroll list) */}
      <div className="flex flex-col gap-10 lg:hidden w-full px-2 py-4">
        {content.map((item, index) => (
          <div 
            key={item.title + index} 
            className="flex flex-col bg-white border border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#2563EB] mb-2 uppercase">
              Milestone 0{index + 1}
            </span>
            <h3 className="text-xl font-bold text-slate-800 font-display mb-3">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed mb-6">
              {item.description}
            </p>
            
            {/* Responsive image frame wrapper */}
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden shadow-inner bg-slate-50 relative flex items-center justify-center">
              {React.isValidElement(item.content) ? (
                React.cloneElement(item.content, { 
                  className: "relative w-full h-full object-cover rounded-2xl overflow-hidden" 
                })
              ) : (
                item.content
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};