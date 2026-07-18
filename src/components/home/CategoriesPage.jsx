import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, X, Award, CheckCircle, BarChart3, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { categoriesData, categoryIconsMap, slugToMetadataMap } from './categoriesData';
import { fetchCategoriesAPI, fetchCategoryBySlugAPI } from '../../services/categories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('All');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

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
    async function loadCategories() {
      setIsLoading(true);
      const res = await fetchCategoriesAPI();
      
      const itemsToMap = (res && res.success && res.data && res.data.length > 0) 
        ? res.data 
        : categoriesData.map(c => ({
            slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: c.title,
            shortDescription: c.description,
            tier: c.stream === "Creative Arts" ? "A_CULTURE_IDENTITY" : c.stream === "Social Impact" ? "B_NATION_STATE_BUILDING" : "C_CRAFT_PLATFORM",
            cashPrizeMin: 51000,
            cashPrizeMax: 75000,
            taskBrief: "Showcase your impact in Chhattisgarh",
            hashtag: "cgcreatorawards",
            image: null
          }));

      const enriched = itemsToMap.map((item) => {
        let streamTag = "Craft & Platform";
        if (item.tier === "A_CULTURE_IDENTITY") streamTag = "Culture & Identity";
        else if (item.tier === "B_NATION_STATE_BUILDING") streamTag = "Nation & State Building";
        
        // Find matching metadata from local map using slug
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
          eligibility: meta.eligibility || "Open to all digital creators from Chhattisgarh.",
          metrics: `Task Brief: ${item.taskBrief} | Campaign Hashtag: #${item.hashtag} | Prize: ₹${item.cashPrizeMin?.toLocaleString() || "51,000"} - ₹${item.cashPrizeMax?.toLocaleString() || "75,000"}`,
          cashPrizeMin: item.cashPrizeMin,
          cashPrizeMax: item.cashPrizeMax,
          taskBrief: item.taskBrief,
          hashtag: item.hashtag,
          image: item.image
        };
      });

      setCategories(enriched);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  // Handle open details (fetches single category details dynamically by slug)
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

  // Dynamically extract unique streams based on loaded categories
  const streams = useMemo(() => {
    if (categories.length === 0) return ['All'];
    return ['All', ...new Set(categories.map((c) => c.stream))];
  }, [categories]);

  // Filter categories dynamically based on stream tag and search query
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const matchesStream = selectedStream === 'All' || item.stream === selectedStream;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.stream.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStream && matchesSearch;
    });
  }, [categories, searchQuery, selectedStream]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pt-28 pb-20 px-4 sm:px-6 md:px-8 relative overflow-hidden font-sans">
      
      {/* Background soft color blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#2F6FEF]/5 filter blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#8B3FD9]/5 filter blur-[100px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider mb-6">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-600">Categories</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-black tracking-[0.25em] text-amber-600 uppercase mb-3 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20"
          >
            Official Categories
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-[#0B1448] font-display"
          >
            Award Categories
          </motion.h1>
        </div>

        {/* Search and Filters Hub */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 mb-12 shadow-sm flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Stream Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full lg:w-auto">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-4.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedStream === stream
                    ? 'bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] shadow-md shadow-amber-400/20 border border-amber-400/10'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/80'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 text-xs font-bold pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-royal-blue/30 transition-all outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Loading Spinner */}
        {isLoading && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-royal-blue mb-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Loading Categories...</span>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((item, idx) => {
              const Icon = categoryIconsMap[item.iconName] || Award;
              
              // Pick color stream accents
              let accentColor = 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-600';
              let accentGradient = 'from-amber-400 to-orange-500';
              if (item.stream === 'Creative Arts') {
                accentColor = 'from-hot-pink/10 to-transparent border-hot-pink/20 text-hot-pink';
                accentGradient = 'from-pink-400 to-rose-500';
              } else if (item.stream === 'Tech & Growth') {
                accentColor = 'from-royal-blue/10 to-transparent border-royal-blue/20 text-royal-blue';
                accentGradient = 'from-blue-400 to-indigo-600';
              } else if (item.stream === 'Social Impact') {
                accentColor = 'from-emerald-600/10 to-transparent border-emerald-600/20 text-emerald-600';
                accentGradient = 'from-emerald-400 to-teal-600';
              } else if (item.stream === 'Entertainment') {
                accentColor = 'from-brand-purple/10 to-transparent border-brand-purple/20 text-brand-purple';
                accentGradient = 'from-purple-400 to-violet-600';
              }

              // Resolve category image
              const cardImageUrl = resolveImageUrl(item.image);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.title}
                  className="group relative bg-white border border-slate-100/85 hover:border-slate-200 rounded-2xl transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/60 overflow-hidden"
                >
                  <div>
                    {/* Category Cover Image Header */}
                    <div className="relative h-44 w-full bg-slate-50 overflow-hidden flex items-center justify-center border-b border-slate-100">
                      {cardImageUrl ? (
                        <img 
                          src={cardImageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${accentGradient} flex items-center justify-center relative`}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
                          <div className="relative w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-700 transition-transform duration-300 group-hover:scale-110">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                      
                      {/* Stream Badge overlay */}
                      <span className={`absolute top-4 right-4 text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border bg-gradient-to-br ${accentColor}`}>
                        {item.stream}
                      </span>
                    </div>

                    {/* Card Content body */}
                    <div className="p-6">
                      <h3 className="text-lg font-black font-display text-[#0B1448] mb-2 leading-tight uppercase group-hover:text-royal-blue transition-colors duration-200 min-h-[3.5rem] flex items-center">
                        {item.title}
                      </h3>

                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* View Details CTA */}
                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={() => handleOpenDetails(item)}
                      className="w-full bg-slate-50 hover:bg-gradient-to-r hover:from-royal-blue hover:to-brand-purple border border-slate-100 hover:border-royal-blue/10 hover:text-white text-[#0B1448] font-extrabold text-xs py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-black uppercase text-slate-700 mb-1">No Categories Found</h3>
            <p className="text-slate-500 text-sm">We couldn't find anything matching your search terms. Try another query.</p>
          </div>
        )}

      </div>

      {/* Details Popup Modal Overlay */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl max-w-lg md:max-w-3xl w-full relative shadow-2xl overflow-hidden flex flex-col md:flex-row"
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
                  <div className="relative h-48 md:h-auto md:w-[40%] bg-slate-50 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 shrink-0 min-h-[12rem]">
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
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase mb-1.5 block">
                    Category Details
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#0B1448] uppercase leading-tight pr-6">
                    {activeCategory.title}
                  </h2>
                  <div className="inline-block text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 mt-2">
                    {activeCategory.stream}
                  </div>
                </div>

                {/* Loading state indicator when fetching details */}
                {isModalLoading ? (
                  <div className="flex items-center gap-3 py-6 justify-center text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <Loader2 className="w-4 h-4 animate-spin text-royal-blue" />
                    Fetching latest details...
                  </div>
                ) : (
                  <div className="flex flex-col gap-5 text-xs text-left max-h-[220px] overflow-y-auto pr-1">
                    
                    {/* 1. Description */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-royal-blue/10 flex items-center justify-center text-royal-blue shrink-0 mt-0.5">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700">About the Award</span>
                        <p className="text-slate-500 leading-relaxed font-medium">{activeCategory.description}</p>
                      </div>
                    </div>

                    {/* 2. Eligibility */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700">Eligibility Criteria</span>
                        <p className="text-slate-500 leading-relaxed font-medium">{activeCategory.eligibility}</p>
                      </div>
                    </div>

                    {/* 3. Evaluation Metrics */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700">Evaluation & Details</span>
                        <p className="text-slate-500 leading-relaxed font-medium">{activeCategory.metrics}</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
                  <Link
                    to={`/participate?category=${activeCategory.slug}`}
                    className="w-full sm:flex-1 text-center bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber-400/10 active:scale-98 transition-all duration-200 uppercase tracking-wider block"
                  >
                    Participate Now
                  </Link>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer text-center"
                  >
                    Close
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
