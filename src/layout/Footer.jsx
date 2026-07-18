import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import logo from "../assets/logo.jpeg";
import qrCode from "../assets/qr.code.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#04081c] text-white/90 border-t border-white/5 py-16 px-6 relative select-none overflow-hidden">
      
      {/* Premium Gradient Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#248A4C] to-transparent opacity-80" aria-hidden="true" />

      {/* Subtle Radial Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.04),transparent_50%)] pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-12 relative z-10">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Section 1: Logo & Info (Col-span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-4 text-left">
              <div className="w-16 h-16 rounded-full bg-white border border-white/20 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <img src={logo} alt="Digital Chhattisgarh Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              <p className="text-[13px] sm:text-sm !text-white/70 leading-relaxed font-sans max-w-sm">
                Content owned, updated and maintained by the Creator Awards Cell. This platform belongs to Digital Chhattisgarh, Government of Chhattisgarh. Designed, developed and hosted by the State Informatics Centre.
              </p>
            </div>

            {/* Section 2: Sections Quick Links (Col-span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-3.5 text-left">
              <h4 className="text-sm font-black uppercase !text-white tracking-wider mb-1 font-display">
                Sections
              </h4>
              <Link to="/" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Home
              </Link>
              <Link to="/about" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                About
              </Link>
              <Link to="/#categories" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Categories
              </Link>
              <Link to="/#awards" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Awards
              </Link>
            </div>

            {/* Section 3: Pages Links (Col-span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-3.5 text-left">
              <h4 className="text-sm font-black uppercase !text-white tracking-wider mb-1 font-display">
                Pages
              </h4>
              <Link to="/guidelines" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Guidelines
              </Link>
              <Link to="/gallery" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Gallery
              </Link>
              <Link to="/contact" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Contact
              </Link>
              <Link to="/faq" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                FAQ
              </Link>
              <Link to="/#terms" className="text-[13px] sm:text-sm font-bold !text-white/85 hover:text-[#FFA320] hover:translate-x-1 transition-all duration-200 w-fit">
                Terms & Conditions
              </Link>
            </div>

            {/* Section 4: Downloads & Follow (Col-span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-5 text-left lg:items-end w-full">
              {/* Follow Us */}
              <div className="w-full flex flex-col gap-2.5 lg:items-end">
                <h4 className="text-sm font-black uppercase !text-white tracking-wider font-display lg:text-right">
                  Follow Us
                </h4>
                <div className="flex flex-wrap gap-2.5 lg:justify-end">
                  {/* Twitter/X */}
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 hover:bg-[#FFA320] hover:text-white hover:border-[#FFA320] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 hover:bg-[#FFA320] hover:text-white hover:border-[#FFA320] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.85z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 hover:bg-[#FFA320] hover:text-white hover:border-[#FFA320] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 hover:bg-[#FFA320] hover:text-white hover:border-[#FFA320] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm">
                    <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/10 hover:bg-[#FFA320] hover:text-white hover:border-[#FFA320] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* QR and Download Stack */}
              <div className="w-full flex items-center gap-4 lg:justify-end mt-2">
                {/* Image-based QR Code */}
                <div className="bg-white p-2 rounded-[16px] shrink-0 w-20 h-20 flex items-center justify-center shadow-sm border border-white/10 hover:scale-105 transition-transform duration-300">
                  <img src={qrCode} alt="CG Creator App QR Code" className="w-full h-full object-contain" />
                </div>

                {/* Download Buttons Stack */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* App Store Badge */}
                  <a href="#" className="flex items-center gap-2 bg-black hover:bg-slate-900 border border-white/10 hover:scale-[1.02] text-white px-3 py-1.5 rounded-[10px] cursor-pointer text-left w-[120px] transition-all duration-200 select-none">
                    <svg className="w-4.5 h-4.5 fill-white shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.41-2.73-7.24-7.42-11.49-14.06-9.06-14.22-13.6-28.79-13.6-43.72 0-16.52 4.88-29.62 14.65-39.31 9.77-9.7 21.05-14.62 33.84-14.75 6.02 0 12.35 1.7 19 5.1 6.64 3.4 11.23 5.1 13.78 5.1 2.55 0 7.37-1.85 14.45-5.55 7.08-3.7 13.11-5.4 18.1-5.1 14.65.6 25.86 6.01 33.64 16.23-13.7 8.35-20.45 19.82-20.25 34.42.2 11.49 4.3 21.1 12.3 28.85 8 7.75 17.5 11.95 28.5 12.65-2.2 6.53-4.8 12.63-7.8 18.3zm-32.6-96.2c0-8.66 3.1-16.35 9.3-23.05 6.2-6.7 13.7-10.45 22.5-11.25.13 9.06-2.9 16.73-9.1 23.05-6.2 6.32-13.8 9.87-22.7 10.65v.6z"/>
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span className="text-[6px] text-white/50 uppercase tracking-tighter">Download on the</span>
                      <span className="text-[10px] font-black text-white mt-0.5 font-display">App Store</span>
                    </div>
                  </a>
                  {/* Google Play Badge */}
                  <a href="#" className="flex items-center gap-2 bg-black hover:bg-slate-900 border border-white/10 hover:scale-[1.02] text-white px-3 py-1.5 rounded-[10px] cursor-pointer text-left w-[120px] transition-all duration-200 select-none">
                    <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M3.25 2.5a1.5 1.5 0 0 0-1.5 1.5v16a1.5 1.5 0 0 0 3.25 1.5l10.25-10.25L3.75 2.5z M15.75 9.75l-2.25 2.25 2.25 2.25 5-2.88a1.5 1.5 0 0 0 0-2.62z M13.5 14.25l-10.25 10.25h.5c.34 0 .67-.11.96-.32l11-6.38z M13.5 7.75l2.21-3.55-11-6.38a1.5 1.5 0 0 0-.96-.32h-.5z"/>
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span className="text-[6px] text-white/50 uppercase tracking-tighter">GET IT ON</span>
                      <span className="text-[10px] font-black text-white mt-0.5 font-display">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Separator Line */}
          <div className="w-full h-[1px] bg-white/10" aria-hidden="true" />

          {/* Bottom Row: Copyright and Scroll To Top */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/45 font-sans">
              Copyright © Digital Chhattisgarh 2026 · Creator Awards Portal
            </p>

            {/* Scroll To Top Button */}
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-[#248A4C] hover:bg-[#FFA320] text-white flex items-center justify-center cursor-pointer shadow-md transition-colors duration-200"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}