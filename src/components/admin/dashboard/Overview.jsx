import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Clock, FileCheck, CheckCircle2, Award, ArrowUpRight, ShieldCheck, Eye, ChevronRight, Sparkles, Filter, Activity } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function Overview() {
  const navigate = useNavigate();
  const { participants, categories, updateParticipantStatus } = useAdmin();

  // Metrics calculations
  const totalParticipants = participants.length;
  const pendingCount = participants.filter(p => p.status?.toUpperCase() === 'PENDING').length;
  const submittedCount = participants.filter(p => p.status?.toUpperCase() === 'SUBMITTED').length;
  const approvedCount = participants.filter(p => p.status?.toUpperCase() === 'APPROVED' || p.status?.toUpperCase() === 'APPROVE').length;
  const rejectedCount = participants.filter(p => p.status?.toUpperCase() === 'REJECTED').length;
  const totalCategories = categories.length;

  // Pie Chart Conic Gradient Calculation
  const pendingDeg = totalParticipants ? (pendingCount / totalParticipants) * 360 : 0;
  const submittedDeg = totalParticipants ? (submittedCount / totalParticipants) * 360 : 0;
  const approvedDeg = totalParticipants ? (approvedCount / totalParticipants) * 360 : 0;

  const pEnd = pendingDeg;
  const sEnd = pEnd + submittedDeg;
  const aEnd = sEnd + approvedDeg;

  const conicPieBg = totalParticipants > 0 ? `conic-gradient(
    #EF4444 0deg ${pEnd}deg,
    #F59E0B ${pEnd}deg ${sEnd}deg,
    #10B981 ${sEnd}deg ${aEnd}deg,
    #64748B ${aEnd}deg 360deg
  )` : 'conic-gradient(#E2E8F0 0deg 360deg)';

  // Recent 5 participants
  const recentParticipants = [...participants].slice(0, 5);

  return (
    <div className="space-y-8 font-sans pb-10">
      
      {/* Executive Administrative Banner */}
      <div className="bg-gradient-to-r from-[#070D2B] via-[#0B1448] to-[#1E2B7B] text-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/10 filter blur-[80px]"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-royal-blue/20 filter blur-[80px]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Directorate Command Center
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                State Level Portal
              </span>
            </div>

            {/* Explicit !text-white override to ensure maximum contrast */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display uppercase tracking-tight leading-tight !text-white drop-shadow-sm">
              State Creator & Influencer Awards
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed font-medium">
              Official Directorate Management Dashboard for reviewing applications, monitoring jury approvals, and managing creator tiers across all 33 districts of Chhattisgarh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => navigate('/admin/participants')}
              className="bg-gradient-to-r from-amber-400 to-[#FFA320] hover:from-amber-300 hover:to-amber-400 text-[#0B1448] font-extrabold text-xs px-6 py-4 rounded-2xl shadow-lg shadow-amber-400/20 active:scale-98 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review Applications</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-5 py-4 rounded-2xl border border-white/20 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        {/* Quick Status Snapshot Footer in Banner */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Total Applicants</div>
            <div className="text-lg font-black !text-white font-display mt-0.5">{totalParticipants} Creators</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-red-300">Needs Action</div>
            <div className="text-lg font-black text-red-400 font-display mt-0.5">{pendingCount} Pending</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">Under Jury</div>
            <div className="text-lg font-black text-amber-300 font-display mt-0.5">{submittedCount} Submitted</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300">Shortlisted</div>
            <div className="text-lg font-black text-emerald-400 font-display mt-0.5">{approvedCount} Approved</div>
          </div>
        </div>

      </div>

      {/* 5 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Total Participants */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Total Registrations</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-royal-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black !text-[#0B1448] font-display">
            {totalParticipants}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold mt-2 pt-2 border-t border-slate-100">
            <Activity className="w-3.5 h-3.5 text-royal-blue" />
            <span>Active Creator Profiles</span>
          </div>
        </div>

        {/* Card 2: Pending Applications (RED COLOR ACCENT) */}
        <div className="bg-white border-2 border-red-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-red-700 text-[11px] font-black uppercase tracking-wider">Pending</span>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600 font-display flex items-baseline gap-2">
            {pendingCount}
            <span className="text-[10px] bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full font-black border border-red-200">
              Needs Review
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-red-600 font-bold mt-2 pt-2 border-t border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>🔴 Action Required</span>
          </div>
        </div>

        {/* Card 3: Submitted Applications (YELLOW / AMBER ACCENT) */}
        <div className="bg-white border-2 border-amber-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-amber-800 text-[11px] font-black uppercase tracking-wider">Submitted</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 font-display flex items-baseline gap-2">
            {submittedCount}
            <span className="text-[10px] bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full font-black border border-amber-200">
              Under Jury
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold mt-2 pt-2 border-t border-amber-100">
            <span>🟡 In Evaluation</span>
          </div>
        </div>

        {/* Card 4: Approved Applications (GREEN ACCENT) */}
        <div className="bg-white border-2 border-emerald-200 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-800 text-[11px] font-black uppercase tracking-wider">Approved</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 font-display flex items-baseline gap-2">
            {approvedCount}
            <span className="text-[10px] bg-emerald-500/10 text-emerald-800 px-2 py-0.5 rounded-full font-black border border-emerald-200">
              Shortlisted
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-100">
            <span>🟢 Verified Winners</span>
          </div>
        </div>

        {/* Card 5: Award Categories */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider">Categories</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black !text-[#0B1448] font-display">
            {totalCategories}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold mt-2 pt-2 border-t border-slate-100">
            <span>Active Award Tiers</span>
          </div>
        </div>

      </div>

      {/* Split Section: Left = Review Status Ratio Pie Chart | Right = Executive Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Review Status Ratio Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#0B1448]" />
                  <h2 className="text-base font-black !text-[#0B1448] uppercase tracking-wider font-display">
                    Review Status Ratio
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Live status distribution across all districts
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#0B1448] bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Submissions: <strong className="text-royal-blue">{totalParticipants}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-2">
              {/* Pure Pie Chart Circle */}
              <div 
                className="relative w-44 h-44 rounded-full shadow-lg border-4 border-white shrink-0 transition-all duration-500"
                style={{ background: conicPieBg }}
              >
                <div className="absolute inset-0 rounded-full border border-black/10 pointer-events-none"></div>
              </div>

              {/* Pie Chart Legend List */}
              <div className="space-y-2.5 w-full sm:w-auto min-w-[210px]">
                
                <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-red-50/80 border border-red-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-xs"></span>
                    <span className="text-xs font-black text-red-900 uppercase tracking-wider">Pending</span>
                  </div>
                  <span className="text-xs font-extrabold text-red-700">
                    {pendingCount} ({totalParticipants ? Math.round((pendingCount / totalParticipants) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0 shadow-xs"></span>
                    <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Submitted</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800">
                    {submittedCount} ({totalParticipants ? Math.round((submittedCount / totalParticipants) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 shadow-xs"></span>
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">Approved</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {approvedCount} ({totalParticipants ? Math.round((approvedCount / totalParticipants) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-500 shrink-0 shadow-xs"></span>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Rejected</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">
                    {rejectedCount} ({totalParticipants ? Math.round((rejectedCount / totalParticipants) * 100) : 0}%)
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions Card (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-black !text-[#0B1448] uppercase tracking-wider font-display">
                  Quick Actions
                </h2>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Command Panel
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Quick Action 1: Participants Management */}
              <div 
                onClick={() => navigate('/admin/participants')}
                className="group bg-gradient-to-r from-slate-50 to-blue-50/40 hover:from-[#0B1448] hover:to-[#1E2B7B] p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-[#0B1448] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-amber-400 text-royal-blue group-hover:text-[#0B1448] flex items-center justify-center transition-colors shadow-xs shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B1448] group-hover:!text-white uppercase transition-colors">
                      Participants Management
                    </h3>
                    <p className="text-xs text-slate-500 group-hover:text-slate-300 font-semibold transition-colors mt-0.5">
                      Review dossiers & update status
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-amber-400 text-[#0B1448] flex items-center justify-center group-hover:translate-x-1 transition-all shadow-xs shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Action 2: Category Management */}
              <div 
                onClick={() => navigate('/admin/categories')}
                className="group bg-gradient-to-r from-slate-50 to-amber-50/40 hover:from-[#0B1448] hover:to-[#1E2B7B] p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-[#0B1448] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 group-hover:bg-amber-400 text-amber-700 group-hover:text-[#0B1448] flex items-center justify-center transition-colors shadow-xs shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B1448] group-hover:!text-white uppercase transition-colors">
                      Category Management
                    </h3>
                    <p className="text-xs text-slate-500 group-hover:text-slate-300 font-semibold transition-colors mt-0.5">
                      Manage award tiers & hashtags
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white group-hover:bg-amber-400 text-[#0B1448] flex items-center justify-center group-hover:translate-x-1 transition-all shadow-xs shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black !text-[#0B1448] uppercase tracking-wider font-display">
              Recent Application Registrations
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Latest creator submissions awaiting administrative status updates
            </p>
          </div>
          <Link
            to="/admin/participants"
            className="text-xs font-black text-royal-blue hover:text-brand-indigo transition-colors flex items-center gap-1 uppercase tracking-wider shrink-0"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-black text-[11px]">
                <th className="py-4 px-6">Creator Dossier</th>
                <th className="py-4 px-6">District</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Review Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentParticipants.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/80 transition-colors font-bold text-slate-700">
                  {/* Name & Email */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B1448] to-[#2F6FEF] text-amber-400 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {part.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-[#0B1448] text-xs">{part.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{part.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* District */}
                  <td className="py-4 px-6">
                    <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-xl text-[11px] font-bold">
                      {part.district}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-800 text-xs">
                      {part.categoryTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                      {part.stream}
                    </div>
                  </td>

                  {/* Status with Color Coding */}
                  <td className="py-4 px-6">
                    {(part.status?.toUpperCase() === 'PENDING') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-200 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                        🔴 Pending
                      </span>
                    )}
                    {(part.status?.toUpperCase() === 'SUBMITTED') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-200 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        🟡 Submitted
                      </span>
                    )}
                    {(part.status?.toUpperCase() === 'APPROVED' || part.status?.toUpperCase() === 'APPROVE') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        🟢 Approved
                      </span>
                    )}
                    {(part.status?.toUpperCase() === 'REJECTED') && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 text-slate-700 border border-slate-200 text-[11px] font-black uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                        ⚪ Rejected
                      </span>
                    )}
                  </td>

                  {/* Quick Action */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => navigate('/admin/participants')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
