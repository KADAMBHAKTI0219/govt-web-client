import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, LogOut, ChevronLeft, Shield, X } from 'lucide-react';
import logoImg from '../../../assets/logo.jpeg';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, adminLogout } = useAdmin();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Category Management', href: '/admin/categories', icon: FolderKanban },
    { label: 'Participants Management', href: '/admin/participants', icon: Users },
  ];

  const handleLogout = () => {
    adminLogout();
    if (setMobileOpen) setMobileOpen(false);
    navigate('/admin/login');
  };

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-[#0B1448]/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer Element */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-[#0B1448] text-white z-50 transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-white/10 shadow-2xl ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* Top Section: Logo & Brand */}
        <div>
          <div className="h-20 px-4 flex items-center justify-between border-b border-white/10">
            <Link 
              to="/admin/dashboard" 
              onClick={handleNavClick}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="relative shrink-0">
                <img 
                  src={logoImg} 
                  alt="Government Emblem" 
                  className="w-11 h-11 object-contain rounded-full bg-white p-0.5 ring-2 ring-amber-400/50 shadow-md"
                />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col text-left transition-opacity duration-300">
                  <span className="font-display font-black text-xs text-amber-400 tracking-wider uppercase leading-tight">
                    State Creator
                  </span>
                  <span className="font-sans font-extrabold text-[11px] text-slate-300 tracking-wider uppercase">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hidden md:flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 md:hidden flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-extrabold text-xs tracking-wide transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] shadow-lg shadow-amber-400/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0B1448]' : 'text-slate-400 group-hover:text-amber-400'}`} />
                  {(!collapsed || mobileOpen) && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {collapsed && !mobileOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin User & Logout */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {(!collapsed || mobileOpen) && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[#0B1448] font-black text-xs shrink-0 shadow-md">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden text-left">
                <span className="text-xs font-black text-white truncate">{adminUser?.name || "Admin"}</span>
                <span className="text-[10px] text-amber-400/90 font-bold uppercase truncate">{adminUser?.role || "Super Admin"}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-extrabold text-xs transition-colors cursor-pointer ${
              collapsed && !mobileOpen ? 'justify-center' : ''
            }`}
            title="Logout Admin"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
