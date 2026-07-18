import React from 'react';

export default function AboutQuote() {
  return (
    <section className="relative w-full bg-[#0B1448] py-6 sm:py-28 px-4 sm:px-8 md:px-16 text-center text-white select-none">
      
      {/* Background soft color blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-[#EA1B81]/10 filter blur-[80px]" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-[#0A84FF]/10 filter blur-[80px]" />
      </div>

      {/* Container framing the quote box */}
      <div className="max-w-4xl mx-auto relative p-8 sm:p-12 md:p-16 border-[3px] border-white rounded-none z-10">
        
        {/* Top-Left quotation marks overlapping the corners */}
        <div className="absolute -top-7 -left-7 bg-[#0B1448] w-14 h-14 flex items-center justify-center">
          <span className="text-7xl font-serif leading-none text-white select-none">“</span>
        </div>

        {/* Bottom-Right quotation marks overlapping the corners */}
        <div className="absolute -bottom-9 -right-7 bg-[#0B1448] w-14 h-14 flex items-center justify-center">
          <span className="text-7xl font-serif leading-none text-white select-none">”</span>
        </div>

        {/* Quote text styled with serif typography */}
        <p className="text-lg sm:text-2xl md:text-3.5xl tracking-wide leading-relaxed font-serif text-white uppercase text-center">
          Chhattisgarh's youth aren't just <br className="hidden sm:inline" />
          consuming culture — they are <br className="hidden sm:inline" />
          exporting it, <span className="font-black text-[#FFA320]">one reel, one voice, <br className="hidden sm:inline" />
          one story at a time.</span>
        </p>

      </div>

      {/* Attribution footer outside the border box */}
      <div className="mt-8 text-xs sm:text-sm font-sans font-extrabold tracking-[0.2em] text-[#FFA320] uppercase text-center z-10 relative">
        Chhattisgarh State Creator Platform
      </div>

    </section>
  );
}
