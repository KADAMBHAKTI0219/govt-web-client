import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ExternalLink, Bell, User } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminNavbar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { adminUser, participants } = useAdmin();

  // Determine current page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard Overview';
      case '/admin/categories':
        return 'Category Management';
      case '/admin/participants':
        return 'Participants Management';
      default:
        return 'Admin Portal';
    }
  };

  const pendingCount = participants.filter(p => p.status?.toUpperCase() === 'PENDING').length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1448] flex items-center justify-center transition-colors cursor-pointer md:hidden shadow-xs"
          aria-label="Toggle Mobile Navigation"
          title="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
        </button>
        <div>
          <h1 className="text-base sm:text-xl font-black font-display text-[#0B1448] tracking-tight uppercase">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-500 font-bold hidden sm:block">
            State Creator & Influencer Awards Directorate
          </p>
        </div>
      </div>

      {/* Right: Quick Tools */}
      <div className="flex items-center gap-3">
        
        {/* Public Site Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Pending Notification Badge */}
        <div className="relative">
          <Link 
            to="/admin/participants" 
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative"
            title={`${pendingCount} Pending Applications`}
          >
            <Bell className="w-4.5 h-4.5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-black text-[10px] flex items-center justify-center animate-pulse shadow-md">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>

        {/* Admin Avatar Indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-[#0B1448] text-amber-400 font-black flex items-center justify-center text-xs shadow-sm">
            <User className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-black text-[#0B1448] leading-none">{adminUser?.name || "Admin"}</span>
            <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Online
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
