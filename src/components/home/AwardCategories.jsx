"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Award, CheckCircle, BarChart3, Loader2 } from "lucide-react";
import { categoriesData as localCategories, categoryIconsMap, slugToMetadataMap } from "./categoriesData";
import { fetchCategoriesAPI, fetchCategoryBySlugAPI } from "../../services/categories";

const palette = [
  { base: "#C93B4E", light: "#E37684" }, // soft red
  { base: "#B38C26", light: "#DCAE4E" }, // soft gold/brass
  { base: "#C93B4E", light: "#E37684" }, // soft red
  { base: "#248A4C", light: "#57B87E" }, // soft forest green
  { base: "#1B7E9F", light: "#4EACCC" }, // soft teal
  { base: "#248A4C", light: "#57B87E" }, // soft forest green
  { base: "#B38C26", light: "#DCAE4E" }, // soft gold/brass
  { base: "#9B2E4F", light: "#CE6282" }, // soft maroon
  { base: "#D03F80", light: "#EF75AA" }, // soft magenta
  { base: "#B38C26", light: "#DCAE4E" }, // soft gold/brass
  { base: "#248A4C", light: "#57B87E" }, // soft forest green
  { base: "#1B7E9F", light: "#4EACCC" }, // soft teal
  { base: "#248A4C", light: "#57B87E" }, // soft forest green
  { base: "#1B7E9F", light: "#4EACCC" }, // soft teal
  { base: "#264E94", light: "#6188CD" }, // soft navy
  { base: "#9B2E4F", light: "#CE6282" }, // soft maroon
  { base: "#C93B4E", light: "#E37684" }, // soft red
  { base: "#B38C26", light: "#DCAE4E" }, // soft gold/brass
  { base: "#1B7E9F", light: "#4EACCC" }, // soft teal
  { base: "#C93B4E", light: "#E37684" }, // soft red
  { base: "#264E94", light: "#6188CD" }, // soft navy
  { base: "#B38C26", light: "#DCAE4E" }, // soft gold/brass
  { base: "#9B2E4F", light: "#CE6282" }, // soft maroon
  { base: "#248A4C", light: "#57B87E" }, // soft forest green
  { base: "#C93B4E", light: "#E37684" }, // soft red
];

export default function AwardCategories() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState(localCategories);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Helper to resolve host URL
  const getHostUrl = () => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return apiBase.replace(/\/api$/, "");
  };

  // Robust helper to resolve image URL from backend data
  const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const host = apiBase.replace(/\/api$/, "");
    return imagePath.startsWith('/') ? `${host}${imagePath}` : `${host}/${imagePath}`;
  };

  // Fetch dynamic categories on mount
  useEffect(() => {
    async function loadHomeCategories() {
      const res = await fetchCategoriesAPI();
      if (res && res.success && res.data && res.data.length > 0) {
        const enriched = res.data.map((item) => {
          let streamTag = "Craft & Platform";
          if (item.tier === "A_CULTURE_IDENTITY") streamTag = "Culture & Identity";
          else if (item.tier === "B_NATION_STATE_BUILDING") streamTag = "Nation & State Building";
          
          const meta = slugToMetadataMap[item.slug] || {
            iconName: "Award",
            eligibility: "Open to all digital creators from Chhattisgarh."
          };
          
          return {
            slug: item.slug,
            title: item.title,
            iconName: meta.iconName || "Award",
            stream: streamTag,
            description: item.shortDescription || item.description,
            eligibility: meta.eligibility,
            metrics: `Task Brief: ${item.taskBrief} | Campaign Hashtag: #${item.hashtag} | Prize: ₹${item.cashPrizeMin?.toLocaleString()} - ₹${item.cashPrizeMax?.toLocaleString()}`,
            cashPrizeMin: item.cashPrizeMin,
            cashPrizeMax: item.cashPrizeMax,
            taskBrief: item.taskBrief,
            hashtag: item.hashtag,
            image: item.image
          };
        });
        setCategories(enriched);
      }
    }
    loadHomeCategories();
  }, []);

  // Handle open details
  const handleOpenDetails = async (category) => {
    setActiveCategory(category);
    setIsModalLoading(true);
    
    const res = await fetchCategoryBySlugAPI(category.slug);
    if (res && res.success && res.data) {
      setActiveCategory((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          title: res.data.title || prev.title,
          description: res.data.shortDescription || prev.description,
          taskBrief: res.data.taskBrief || prev.taskBrief,
          hashtag: res.data.hashtag || prev.hashtag,
          cashPrizeMin: res.data.cashPrizeMin || prev.cashPrizeMin,
          cashPrizeMax: res.data.cashPrizeMax || prev.cashPrizeMax,
          image: res.data.image !== undefined ? res.data.image : prev.image,
          metrics: `Task Brief: ${res.data.taskBrief || prev.taskBrief} | Campaign Hashtag: #${res.data.hashtag || prev.hashtag} | Prize: ₹${(res.data.cashPrizeMin || prev.cashPrizeMin)?.toLocaleString()} - ₹${(res.data.cashPrizeMax || prev.cashPrizeMax)?.toLocaleString()}`
        };
      });
    }
    setIsModalLoading(false);
  };
  
  // Breakpoint Row Slices - Total 25 items
  const mobileRows = [
    categories.slice(0, 2),
    categories.slice(2, 3),
    categories.slice(3, 5),
    categories.slice(5, 6),
    categories.slice(6, 8),
    categories.slice(8, 9),
    categories.slice(9, 11),
    categories.slice(11, 12),
    categories.slice(12, 14),
    categories.slice(14, 15),
    categories.slice(15, 17),
    categories.slice(17, 18),
    categories.slice(18, 20),
    categories.slice(20, 21),
    categories.slice(21, 23),
    categories.slice(23, 24),
    categories.slice(24, 25),
  ];

  const tabletRows = [
    categories.slice(0, 3),
    categories.slice(3, 5),
    categories.slice(5, 8),
    categories.slice(8, 10),
    categories.slice(10, 13),
    categories.slice(13, 15),
    categories.slice(15, 18),
    categories.slice(18, 20),
    categories.slice(20, 23),
    categories.slice(23, 25), // Row 10: 2 cards
  ];

  const desktopLgRows = [
    categories.slice(0, 4),
    categories.slice(4, 7),
    categories.slice(7, 11),
    categories.slice(11, 14),
    categories.slice(14, 18),
    categories.slice(18, 21),
    categories.slice(21, 25), // Row 7: 4 cards (perfect pattern: 4-3-4-3-4-3-4)
  ];

  const desktopXlRows = [
    categories.slice(0, 5),
    categories.slice(5, 9),
    categories.slice(9, 14),
    categories.slice(14, 18),
    categories.slice(18, 23), // Row 5: 5 cards
    categories.slice(23, 25), // Row 6: 2 cards
  ];

  const renderCard = (item, globalIndex) => {
    const Icon = categoryIconsMap[item.iconName] || Award;
    const { base, light } = palette[globalIndex % palette.length];

    return (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, scale: 0.9, rotate: 45 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.03, 
          rotate: 45,
          zIndex: 30,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)"
        }}
        onClick={() => handleOpenDetails(item)}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 aspect-square rounded-[18px] md:rounded-[24px] lg:rounded-[28px] xl:rounded-[32px] overflow-hidden shadow-md cursor-pointer border border-white/10 relative flex items-center justify-center shrink-0"
        style={{ backgroundColor: base }}
      >
        {/* Glow sheen background sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-0" />

        {/* Inner container to reverse rotation for upright content */}
        <div className="-rotate-45 flex flex-col items-center justify-center text-center p-2.5 sm:p-4 w-full h-full relative z-10">
          <Icon
            className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-white mb-1.5 md:mb-2 xl:mb-2.5 drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
            strokeWidth={1.5}
          />
          <h3 className="!text-white font-extrabold text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs leading-tight tracking-tight uppercase line-clamp-3 max-w-[75px] md:max-w-[85px] lg:max-w-[100px] xl:max-w-[120px] font-display">
            {item.title}
          </h3>
          
          {/* View Details indicator appearing on hover */}
          <span className="mt-1 text-[7px] md:text-[8px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transform translate-y-1.5 group-hover:translate-y-0 transition-all duration-300">
            View Details
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="categories" className="bg-background py-24 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <span className="block text-center text-xs font-bold tracking-widest text-accent uppercase mb-3">
          Chhattisgarh Creator Awards 2026
        </span>
        <h2 className="text-textPrimary text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-24 tracking-tight uppercase">
          Award Categories
        </h2>

        {/* 1. Mobile Honeycomb Layout (2-1) - screens < 768px */}
        <div className="flex flex-col items-center w-full md:hidden pb-12">
          {mobileRows.map((row, rowIndex) => (
            <div
              key={`m-${rowIndex}`}
              className={`flex justify-center gap-x-16 w-full ${
                rowIndex > 0 ? "mt-[-36px]" : ""
              } relative ${rowIndex % 2 === 0 ? "z-10" : "z-20"}`}
            >
              {row.map((item, itemIndex) => {
                const globalIndex = mobileRows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + itemIndex;
                return (
                  <React.Fragment key={`m-item-${globalIndex}`}>
                    {renderCard(item, globalIndex)}
                    {/* If this is the last card (globalIndex === 24), add an invisible spacer on the right to align it to the left */}
                    {globalIndex === 24 && (
                      <div className="w-28 h-28 aspect-square rotate-45 shrink-0 opacity-0 pointer-events-none" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        {/* 2. Tablet Honeycomb Layout (3-2) - screens >= 768px and < 1024px */}
        <div className="hidden md:flex lg:hidden flex-col items-center w-full pb-12">
          {/* Rows 1-9 (Alternating 3 and 2 cards) */}
          {tabletRows.slice(0, 9).map((row, rowIndex) => (
            <div
              key={`t-${rowIndex}`}
              className={`flex justify-center gap-x-20 w-full ${
                rowIndex > 0 ? "mt-[-42px]" : ""
              } relative ${rowIndex % 2 === 0 ? "z-10" : "z-20"}`}
            >
              {row.map((item, itemIndex) => {
                const globalIndex = tabletRows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + itemIndex;
                return renderCard(item, globalIndex);
              })}
            </div>
          ))}
          {/* Row 10: 2 cards centered inside a 3-slot layout so they align in the first two gaps of Row 9 */}
          <div className="flex justify-center gap-x-20 w-full mt-[-42px] relative z-10">
            {renderCard(tabletRows[9][0], 23)}
            {renderCard(tabletRows[9][1], 24)}
            {/* Invisible placeholder matching the tablet dimensions of renderCard */}
            <div className="w-32 h-32 aspect-square rotate-45 shrink-0 opacity-0 pointer-events-none" />
          </div>
        </div>

        {/* 3. Desktop LG Honeycomb Layout (4-3) - screens >= 1024px and < 1280px */}
        <div className="hidden lg:flex xl:hidden flex-col items-center w-full pb-12">
          {/* Rows 1-7 (Alternating 4 and 3 cards - ends perfectly in a 4-card row) */}
          {desktopLgRows.map((row, rowIndex) => (
            <div
              key={`dlg-${rowIndex}`}
              className={`flex justify-center gap-x-28 w-full ${
                rowIndex > 0 ? "mt-[-52px]" : ""
              } relative ${rowIndex % 2 === 0 ? "z-10" : "z-20"}`}
            >
              {row.map((item, itemIndex) => {
                const globalIndex = desktopLgRows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + itemIndex;
                return renderCard(item, globalIndex);
              })}
            </div>
          ))}
        </div>

        {/* 4. Desktop XL Honeycomb Layout (5-4) - screens >= 1280px */}
        <div className="hidden xl:flex flex-col items-center w-full pb-12">
          {/* Rows 1-5 (Alternating 5 and 4 cards) */}
          {desktopXlRows.slice(0, 5).map((row, rowIndex) => (
            <div
              key={`dxl-${rowIndex}`}
              className={`flex justify-center gap-x-32 w-full ${
                rowIndex > 0 ? "mt-[-60px]" : ""
              } relative ${rowIndex % 2 === 0 ? "z-10" : "z-20"}`}
            >
              {row.map((item, itemIndex) => {
                const globalIndex = desktopXlRows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + itemIndex;
                return renderCard(item, globalIndex);
              })}
            </div>
          ))}
          {/* Row 6: 2 cards centered inside a 4-gap staggered layout of Row 5 (slots 1 and 2, with spacers on left and right) */}
          <div className="flex justify-center gap-x-32 w-full mt-[-60px] relative z-10">
            {/* Invisible placeholder for gap 1 */}
            <div className="w-44 h-44 aspect-square rotate-45 shrink-0 opacity-0 pointer-events-none" />
            {/* Actual cards in gap 2 and 3 */}
            {renderCard(desktopXlRows[5][0], 23)}
            {renderCard(desktopXlRows[5][1], 24)}
            {/* Invisible placeholder for gap 4 */}
            <div className="w-44 h-44 aspect-square rotate-45 shrink-0 opacity-0 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Details Popup Modal Overlay */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#0b1236]/95 border border-white/10 rounded-2xl sm:rounded-3xl max-w-lg md:max-w-3xl w-full relative shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Dynamic Modal Image Banner - Left side on desktop, top on mobile */}
              {(() => {
                const modalIcon = categoryIconsMap[activeCategory.iconName] || Award;
                const modalImageUrl = resolveImageUrl(activeCategory.image);

                let modalGradient = 'from-amber-400 to-orange-500';
                if (activeCategory.stream === 'Creative Arts') modalGradient = 'from-pink-400 to-rose-500';
                else if (activeCategory.stream === 'Tech & Growth') modalGradient = 'from-blue-400 to-indigo-600';
                else if (activeCategory.stream === 'Social Impact') modalGradient = 'from-emerald-400 to-teal-600';
                else if (activeCategory.stream === 'Entertainment') modalGradient = 'from-purple-400 to-violet-600';

                return (
                  <div className="relative h-48 md:h-auto md:w-[40%] bg-slate-900/50 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 shrink-0 min-h-[12rem]">
                    {modalImageUrl ? (
                      <img 
                        src={modalImageUrl} 
                        alt={activeCategory.title} 
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${modalGradient} flex items-center justify-center absolute inset-0`}>
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-700">
                          {React.createElement(modalIcon, { className: "w-8 h-8" })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Modal Body Container - Right side on desktop */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-6 relative">
                {/* Corner Close Icon */}
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase mb-2 block">
                    CATEGORY DETAILS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-white uppercase leading-tight pr-6">
                    {activeCategory.title}
                  </h2>
                  <div className="inline-block text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 mt-2">
                    {activeCategory.stream}
                  </div>
                </div>

                {/* Loading state indicator when fetching details */}
                {isModalLoading ? (
                  <div className="flex items-center gap-3 py-6 justify-center text-slate-300 font-bold text-xs uppercase tracking-wider">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    Fetching latest details...
                  </div>
                ) : (
                  <div className="flex flex-col gap-4.5 text-xs text-left max-h-[220px] overflow-y-auto pr-1">
                    
                    {/* 1. Description */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-royal-blue/10 flex items-center justify-center text-royal-blue shrink-0 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-200">About the Award</span>
                        <p className="text-slate-400 leading-relaxed font-medium">{activeCategory.description}</p>
                      </div>
                    </div>

                    {/* 2. Eligibility */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-200">Eligibility Criteria</span>
                        <p className="text-slate-400 leading-relaxed font-medium">{activeCategory.eligibility}</p>
                      </div>
                    </div>

                    {/* 3. Evaluation Metrics */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-200">Evaluation & Details</span>
                        <p className="text-slate-400 leading-relaxed font-medium">{activeCategory.metrics}</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5">
                  <Link
                    to={`/participate?category=${activeCategory.slug}`}
                    className="w-full sm:flex-1 text-center bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber-400/10 active:scale-98 transition-all duration-200 uppercase tracking-wider block"
                  >
                    Participate Now
                  </Link>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs rounded-xl active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer text-center"
                  >
                    Close
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}