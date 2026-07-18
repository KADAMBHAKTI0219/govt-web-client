"use client";

import React from "react";
import { StickyScroll } from "../ui/StickyScrollReveal";
import AnimatedHeading from "../ui/AnimatedHeading";

// Directly import only the 3 required compressed milestone images
import about1 from "../../assets/about/about-1.jpg";
import about2 from "../../assets/about/about-2.jpg";
import about3 from "../../assets/about/about-3.jpg";

const CARDS = [
  {
    eyebrow: "Milestone #1",
    heading: "Bastar Tribal Art & Creative Digital Expression",
    desc: "Celebrating the woodcraft, metal casting, and folk art of Bastar. Empowering local youth creators to preserve Chhattisgarh's rich tribal heritage through viral digital storytelling.",
    image: about1,
  },
  {
    eyebrow: "Milestone #2",
    heading: "Mahanadi Cleanliness Drive & Ecological Action",
    desc: "Inspiring youth creators to document cleanliness drives, river restoration work, and water conservation efforts along the sacred Mahanadi river to mobilize community action.",
    image: about2,
  },
  {
    eyebrow: "Milestone #3",
    heading: "Chhattisgarh State Youth Creator Festival",
    desc: "Bringing together thousands of digital storytellers, writers, and cultural creators under the official Chhattisgarh Youth Leadership Forum to exchange ideas and co-create digital content.",
    image: about3,
  },
];

const content = CARDS.map((card) => ({
  title: card.heading,
  description: card.desc,
  content: (
    <div className="relative h-[280px] w-[220px] sm:h-[450px] sm:w-[350px] md:h-[550px] md:w-[420px] lg:h-[600px] lg:w-[450px] max-w-full overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
      <img
        src={card.image}
        alt={card.heading}
        className="h-full w-full object-cover"
        draggable={false}
        loading="lazy"
      />
    </div>
  ),
}));

export default function Initiatives() {
  return (
    <section id="about" className="relative w-full bg-white py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Animated About Us Heading */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold tracking-wider mb-3">
            OUR STORY
          </span>
          <AnimatedHeading
            text="About Us"
            className="text-4xl sm:text-5xl font-black text-[#1F2937] tracking-tight uppercase"
          />
        </div>
        
        <StickyScroll content={content} />
      </div>
    </section>
  );
}