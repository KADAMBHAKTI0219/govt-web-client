"use client";
import React from "react";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import pmImg from "../../assets/home/pm-ji.png";

const QUOTE =
  "\u201cI have been observing how your content impacts the people of our country. And we have an opportunity to make this impact even more effective\u201d";
const AUTHOR = "PM Narendra Modi";

const wordVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.035, duration: 0.5, ease: "easeOut" }
  })
};

export default function PMQuoteSection() {
  const words = QUOTE.split(" ");

  return (
    <section className="relative bg-white px-6 py-20 md:py-28 overflow-hidden">
      {/* Ambient gradient blobs, echoing the hero's palette */}
      <motion.div
        className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-gradient-to-br from-royal-blue/20 to-brand-purple/10 blur-3xl pointer-events-none"
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-gradient-to-br from-golden-orange/20 to-coral-orange/10 blur-3xl pointer-events-none"
        animate={{ y: [0, -25, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[30px] p-[3px]"
        >
          {/* Rotating gradient ring border */}
          <motion.div
            className="absolute inset-0 rounded-[30px] bg-gradient-to-r from-royal-blue via-brand-magenta to-golden-orange"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner card sits above the ring, with a dashed layer for texture */}
          <div className="relative rounded-[27px] bg-white border-2 border-dashed border-royal-blue/30 p-3 sm:p-4">
            {/* Quote mark badge, gently pulsing */}
            <motion.div
              className="absolute -top-6 left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-royal-blue to-brand-purple shadow-lg shadow-brand-purple/40"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Quote className="h-5 w-5 text-white" fill="currentColor" strokeWidth={0} />
            </motion.div>

            {/* Inner white content card */}
            <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_20px_50px_-15px_rgba(11,20,72,0.15)] sm:p-10">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">

                {/* Photo + animated gradient squiggle */}
                <div className="relative flex shrink-0 items-center">
                  <svg
                    className="absolute -left-9 hidden sm:block"
                    width="46"
                    height="14"
                    viewBox="0 0 44 14"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="squiggleGradient" x1="0" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="currentColor" className="text-hot-pink" />
                        <stop offset="100%" stopColor="currentColor" className="text-golden-orange" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M2 12c3-8 6-8 9 0s6 8 9 0 6-8 9 0 6 8 9 0"
                      stroke="url(#squiggleGradient)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    />
                  </svg>

                  <motion.div
                    className="relative h-28 w-24 shrink-0 sm:h-32 sm:w-28 md:h-36 md:w-32"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-royal-blue via-brand-magenta to-golden-orange" />
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      <img
                        src={pmImg}
                        alt={AUTHOR}
                        className="h-full w-full object-cover object-top"
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Quote text */}
                <div className="text-center sm:text-left">
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-base font-medium leading-relaxed text-deep-navy sm:text-lg md:text-xl"
                  >
                    {QUOTE}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4 text-sm font-bold sm:text-base bg-gradient-to-r from-coral-orange to-golden-orange bg-clip-text text-transparent"
                  >
                    {AUTHOR}
                  </motion.p>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}