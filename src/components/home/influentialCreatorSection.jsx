"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Play, Share2, Clock } from "lucide-react";
import AnimatedHeading from "../ui/AnimatedHeading";

const videos = [
  {
    id: "ANWHrsUMqYE",
    title: "PM Narendra Modi's YouTube Journey: 15 Years of Global Impact | YouTube Fanfest India 2023",
  },
  {
    id: "Cf2kdQ-lxGU",
    title: "Swachhata Se Swasthya: PM Modi & Ankit Baiyanpuria Lead Way to a Cleaner and Healthier Bharat",
  },
];

function VideoCard({ video, index }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ 
        type: "spring",
        stiffness: 90,
        damping: 14,
        delay: index * 0.18
      }}
      style={{ transformOrigin: "bottom center", perspective: 1000 }}
      className="flex flex-col group/card cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-100 bg-slate-950 shadow-md group-hover/card:shadow-2xl group-hover/card:shadow-royal-blue/10 transition-shadow duration-300">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label="Play video"
            className="group relative h-full w-full"
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
              draggable={false}
            />
            {/* dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover/card:opacity-90" />

            {/* top channel bar */}
            <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-golden-orange text-[10px] font-bold text-white ring-2 ring-white/80">
                NM
              </span>
              <span className="truncate text-xs font-semibold text-white drop-shadow">
                Narendra Modi
              </span>
            </div>

            {/* play button with scaling hover effect */}
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-royal-blue group-hover/card:text-white">
              <Play className="h-6 w-6 translate-x-0.5 text-deep-navy transition-colors duration-300 group-hover/card:text-white" fill="currentColor" strokeWidth={0} />
            </span>

            {/* bottom bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
              <div className="flex items-center gap-3 text-white/90">
                <Share2 className="h-4 w-4 hover:text-light-cyan transition-colors" strokeWidth={2} />
                <Clock className="h-4 w-4 hover:text-light-cyan transition-colors" strokeWidth={2} />
              </div>
              <span className="flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                Watch on YouTube
              </span>
            </div>
          </button>
        )}
      </div>

      <p className="mt-4 text-sm sm:text-base font-bold leading-snug text-deep-navy group-hover/card:text-royal-blue transition-colors duration-200 text-left">
        {video.title}
      </p>
    </motion.div>
  );
}

export default function InfluentialCreatorSection() {
  return (
    <section className="bg-background px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <AnimatedHeading
          text="PM Modi - India's Influential Creator"
          className="mb-12 text-center text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#1F2937] uppercase"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}