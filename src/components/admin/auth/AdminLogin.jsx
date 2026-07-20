import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import logoImg from '../../../assets/logo.jpeg';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated } = useAdmin();

  const [email, setEmail] = useState('admin@stateawards.gov.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAdminAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(email, password);
      if (result && result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result?.message || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Connection error to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail('admin@stateawards.gov.in');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B1448] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-royal-blue/30 filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/15 filter blur-[150px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-block relative mb-4">
            <img 
              src={logoImg} 
              alt="State Emblem" 
              className="w-24 h-24 object-contain rounded-full bg-white p-1.5 ring-4 ring-amber-400/40 shadow-2xl mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-[#FFA320] flex items-center justify-center text-[#0B1448] shadow-md border border-[#0B1448]">
              <Shield className="w-4.5 h-4.5" />
            </div>
          </div>

          <span className="inline-block text-[10px] font-black tracking-[0.25em] text-amber-400 uppercase mb-3 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
            Directorate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight" style={{ color: '#ffffff' }}>
            Admin Authentication
          </h1>
          <p className="text-slate-300/80 text-xs mt-1.5 font-bold uppercase tracking-wider">
            State Creator & Influencer Awards Directorate
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-3 animate-shake animate-duration-300">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              <span className="text-rose-100">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div className="text-left">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stateawards.gov.in"
                  className="w-full bg-white/5 focus:bg-white/10 border border-white/15 focus:border-amber-400 text-white text-xs font-bold pl-11 pr-4 py-3.5 rounded-2xl outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="text-left">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 focus:bg-white/10 border border-white/15 focus:border-amber-400 text-white text-xs font-bold pl-11 pr-4 py-3.5 rounded-2xl outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Login CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30 active:scale-98 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-6 animate-duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0B1448] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In To Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillDemoCreds}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Admin Credentials</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
