import { useState, useRef, useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileDropdownRef = useRef(null);
  const location = useLocation();
  const forceSolid = location.pathname === '/categories' || location.pathname === '/participate' || location.pathname === '/my-profile' || location.pathname === '/about';

  // State for logged in participant nomination session
  const [participantProfile, setParticipantProfile] = useState(null);

  const loadParticipantSession = () => {
    const savedJSON = localStorage.getItem('participant_profile');
    if (savedJSON) {
      try {
        setParticipantProfile(JSON.parse(savedJSON));
      } catch (e) {
        setParticipantProfile(null);
      }
    } else {
      setParticipantProfile(null);
    }
  };

  useEffect(() => {
    loadParticipantSession();
    window.addEventListener('participant-session-changed', loadParticipantSession);
    return () => window.removeEventListener('participant-session-changed', loadParticipantSession);
  }, []);

  // Scroll detection to toggle active transparency state
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '/#home' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CATEGORIES', href: '/categories' },
    { label: 'AWARDS', href: '/#awards' },
    { label: 'GUIDELINES', href: '/#guidelines' },
    { label: 'GALLERY', href: '/#gallery' },
    { label: 'CONTACT', href: '/#contact' },
    { label: 'FAQ', href: '/#faq' }
  ];

  // Dynamic styling variables based on scroll state
  const navBgClass = (isScrolled || forceSolid) 
    ? "bg-white border-b border-slate-100 shadow-sm" 
    : "bg-white/0 backdrop-blur-md my-2 border-b border-white/10 shadow-none";

  const dividerClass = (isScrolled || forceSolid) ? "bg-slate-200" : "bg-white/20";
  const titleClass = (isScrolled || forceSolid) ? "text-[#0B1448]" : "text-white";
  
  const linkClass = (isScrolled || forceSolid) 
    ? "text-deep-navy/80 hover:text-royal-blue after:bg-royal-blue" 
    : "text-white/80 hover:text-amber-400 after:bg-amber-400";

  const profileBtnClass = (isScrolled || forceSolid)
    ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-deep-navy"
    : "bg-white/10 hover:bg-white/20 border-white/20 text-white";

  const menuBtnClass = (isScrolled || forceSolid) 
    ? "bg-slate-50 hover:bg-slate-100 text-deep-navy/80" 
    : "bg-white/10 hover:bg-white/20 text-white/90";

  const drawerClass = (isScrolled || forceSolid)
    ? "bg-white/95 border-t border-slate-100 text-deep-navy shadow-lg"
    : "bg-deep-navy/95 border-t border-white/10 text-white shadow-lg";

  const drawerLinkClass = (isScrolled || forceSolid)
    ? "text-deep-navy/80 hover:text-royal-blue hover:bg-slate-50"
    : "text-white/80 hover:text-amber-400 hover:bg-white/5";

  return (
    <nav 
      className={`w-full fixed top-0 left-0 z-30 select-none transition-all duration-300 ease-in-out ${navBgClass}`}
      style={{
        transform: isScrolled ? 'translateY(0px)' : 'translateY(37px)',
        willChange: 'transform, background-color'
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        
        {/* Left Side: Logo & Titles */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="transition-all duration-300 shrink-0">
            <img 
              src={logoImg} 
              alt="Government Emblem" 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full bg-white p-0.5" 
            />
          </div>
          <div className={`h-10 w-[1px] transition-colors duration-350 ${dividerClass}`} aria-hidden="true"></div>
          <div className="flex flex-col text-left">
            <span className={`font-display font-extrabold text-[13px] sm:text-[14px] leading-tight tracking-wide transition-colors duration-350 ${titleClass}`}>
              STATE CREATOR <span className='block'> & INFLUENCER AWARDS</span>
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`font-sans font-extrabold text-xs tracking-wider transition-colors duration-350 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-all after:duration-200 hover:after:w-full ${linkClass}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-3">
          
          {/* Active Participant Profile Dropdown (Replaces PARTICIPATE NOW when registered) */}
          {participantProfile ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${profileBtnClass}`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0B1448] to-royal-blue flex items-center justify-center text-[10px] font-black uppercase text-amber-400 overflow-hidden shrink-0">
                  {participantProfile.fullName ? participantProfile.fullName.charAt(0) : 'P'}
                </div>
                <span className="max-w-[100px] truncate">{participantProfile.fullName || 'My Profile'}</span>
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 text-slate-700 font-sans">
                  <Link
                    to="/my-profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150 text-xs font-black block text-[#0B1448]"
                  >
                    👤 My Profile & Status
                  </Link>
                  <Link
                    to="/participate"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150 text-xs font-extrabold block text-slate-700"
                  >
                    ➕ Nominate Entry
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      localStorage.removeItem('participant_phone');
                      localStorage.removeItem('participant_profile');
                      setParticipantProfile(null);
                      window.dispatchEvent(new Event('participant-session-changed'));
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150 text-xs font-extrabold flex items-center gap-1.5 text-rose-600 cursor-pointer border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out Profile
                  </button>
                </div>
              )}
            </div>
          ) : user ? (
            /* System Admin/Auth User Dropdown */
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm ${profileBtnClass}`}
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-extrabold uppercase text-white overflow-hidden shrink-0">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <span className="max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                <svg className="w-3 h-3 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-white shadow-lg border border-slate-100 py-1 z-50 text-slate-700">
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors duration-150 text-xs font-semibold block text-slate-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setProfileDropdownOpen(false);
                      await logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors duration-150 text-xs font-semibold flex items-center gap-1.5 text-rose-500 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Public Unregistered Visitor PARTICIPATE NOW Button */
            <Link
              to="/categories"
              className="group relative overflow-hidden bg-white text-deep-navy border border-slate-200 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md hover:shadow-hot-pink/10 active:scale-95 cursor-pointer hidden sm:block"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-royal-blue via-brand-purple to-hot-pink transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-white">
                PARTICIPATE NOW
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${menuBtnClass}`}
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden backdrop-blur-md px-4 py-4 space-y-4 absolute top-full left-0 w-full transition-all duration-300 ${drawerClass}`}>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-sans font-bold text-sm tracking-wide py-2.5 px-3 rounded-lg transition-all duration-200 ${drawerLinkClass}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {!user && !participantProfile && (
            <div className="pt-2 border-t border-slate-100/10">
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-royal-blue via-brand-purple to-hot-pink text-white font-extrabold text-xs py-3 rounded-xl shadow-sm hover:shadow-md active:scale-98 transition-all duration-200 cursor-pointer"
              >
                PARTICIPATE NOW
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
