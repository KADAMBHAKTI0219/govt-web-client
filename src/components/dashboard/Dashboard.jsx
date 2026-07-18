import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, LayoutDashboard, Send, Award, Compass, LogOut, ArrowRight, User } from "lucide-react";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#FFA320] border-slate-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Background radial glow - soft pastels on light background */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#FFA320]/5 blur-[120px]" />
      </div>

      {/* Header bar of Dashboard (Light background) */}
      <header className="w-full bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <span className="font-extrabold text-sm tracking-wide font-display text-slate-800">
            {user.name} ({user.role})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 transition-colors duration-150 cursor-pointer"
          >
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-black text-rose-500 hover:text-rose-600 cursor-pointer transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-8 lg:p-12 z-10 relative flex flex-col gap-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#FFA320]">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Creator Account Panel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-slate-900 !text-slate-900 font-display">
            Welcome Back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Keep creating and represent your district at the Chhattisgarh Creator Awards 2026!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Submissions</span>
              <span className="text-3xl font-black font-display text-slate-800">0</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
              <Send className="w-6 h-6" />
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Participations</span>
              <span className="text-3xl font-black font-display text-slate-800">0</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Creator Points</span>
              <span className="text-3xl font-black font-display text-slate-800">120</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">State Rank</span>
              <span className="text-3xl font-black font-display text-slate-800">#42</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Actions panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workspace (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 flex flex-col gap-6 shadow-sm">
            <h3 className="text-lg font-black uppercase text-slate-800 !text-slate-800 font-display flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-[#FFA320]" />
              Creative Submissions Worktree
            </h3>
            
            <div className="w-full h-44 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3.5 p-6 bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                You haven't submitted any content modules yet. 
              </p>
              <button className="flex items-center gap-1.5 text-xs font-black bg-[#FFA320] text-white hover:bg-[#e08f1b] px-5 py-3 rounded-full hover:scale-102 transition-transform cursor-pointer shadow-md">
                Submit Your First Post
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guidelines Sidebar (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-8 flex flex-col gap-5 shadow-sm">
            <h3 className="text-sm font-black uppercase text-slate-800 !text-slate-800 tracking-wider font-display">
              Quick Creator Rules
            </h3>
            
            <div className="flex flex-col gap-4 text-xs text-slate-600 font-medium">
              <div className="flex gap-3 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#248A4C] mt-1 shrink-0" />
                <span>Submit only original videos, photos, or blogs about Chhattisgarh.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#248A4C] mt-1 shrink-0" />
                <span>Do not violate general safety policies. Content must be suitable for all audiences.</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="w-2.5 h-2.5 rounded-full bg-[#248A4C] mt-1 shrink-0" />
                <span>Gain Creator Points by driving engagement and positive social impacts in your district.</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
