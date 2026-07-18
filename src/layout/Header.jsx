import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'hne', label: 'Chhattisgarhi (छत्तीसगढ़ी)' }
  ];

  const getLanguageLabel = (code) => {
    switch (code) {
      case 'hi': return 'हिन्दी';
      case 'hne': return 'छत्तीसगढ़ी';
      default: return 'English';
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-deep-navy via-brand-indigo to-brand-purple text-white/90 border-t-[5px] border-[#6b4c2b] shadow-sm select-none">
      <div className="px-8 py-2 flex items-center justify-between text-[11px] font-sans font-bold">
        
        {/* Left Side: Indian Flag + Government of Chhattisgarh */}
        <div className="flex items-center gap-2.5">
          {/* Indian Flag */}
          <div className="w-6 h-4 flex flex-col border border-white/20 shadow-sm" aria-hidden="true">
            <div className="bg-[#FF9933] flex-1"></div>
            <div className="bg-[#FFFFFF] flex-1 flex items-center justify-center relative">
              <svg className="w-1.5 h-1.5 text-[#000080] absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            </div>
            <div className="bg-[#138808] flex-1"></div>
          </div>
          
          {/* <span className="font-display font-extrabold tracking-widest uppercase text-white md:text-xs">
            Government of Chhattisgarh
          </span> */}
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-3.5">
          {/* Skip to Main Content */}
          <button className="hover:text-light-cyan transition-colors duration-150 cursor-pointer hidden sm:block">
            Skip to main content
          </button>
          
          <span className="text-white/20 hidden sm:inline" aria-hidden="true">|</span>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold transition-all duration-150 cursor-pointer text-[10px]"
            >
              <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" />
              </svg>
              <span>{getLanguageLabel(currentLanguage)}</span>
              <svg className={`w-3 h-3 text-white/80 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-white shadow-lg border border-slate-100 py-1 z-50 text-slate-700">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors duration-150 text-xs font-semibold block ${
                      currentLanguage === lang.code ? 'text-royal-blue bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-white/20" aria-hidden="true">|</span>

          {/* Accessibility Icon */}
          <button className="text-white/80 hover:text-light-cyan transition-colors duration-150 cursor-pointer p-0.5" title="Accessibility options">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="4" r="2" />
              <path d="M12 6c-1.1 0-2 .9-2 2v5h2v7h2v-7h2V8c0-1.1-.9-2-2-2zM9 8c-1.1 0-2 .9-2 2v2h2v-2zM15 8c1.1 0 2 .9 2 2v2h-2v-2z" />
            </svg>
          </button>

          <span className="text-white/20" aria-hidden="true">|</span>

          {/* Sign In Icon Link / User Profile */}
          {user ? (
            <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-light-cyan transition-colors duration-150 cursor-pointer" title="Dashboard">
              <div className="w-4.5 h-4.5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-extrabold uppercase text-white overflow-hidden shrink-0 border border-white/10">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <span className="hidden md:inline uppercase text-[9px] font-black tracking-wider text-white/95">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-light-cyan transition-colors duration-150 cursor-pointer p-0.5" title="Sign In">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </Link>
          )}
        </div>
        </div>

      </div>
  );
}
