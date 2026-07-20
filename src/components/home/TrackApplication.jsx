import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, CheckCircle2, Clock, FileCheck, XCircle, ExternalLink, Link2, User, Phone, Mail, MapPin, Award, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchParticipantProfileAPI } from '../../services/participate';

export default function TrackApplication() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('phone') || searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [participant, setParticipant] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (queryToSearch) => {
    const q = queryToSearch || searchQuery;
    if (!q || !q.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setSearched(true);

    const res = await fetchParticipantProfileAPI(q);
    setLoading(false);

    if (res && res.success && res.participant) {
      setParticipant(res.participant);
    } else {
      setParticipant(null);
      setErrorMessage(res?.message || 'No participant nomination profile found matching your query.');
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pt-28 pb-20 px-4 sm:px-6 md:px-8 relative overflow-hidden font-sans">
      
      {/* Background Soft Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#2F6FEF]/5 filter blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-500/5 filter blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer mb-6 transition-colors duration-150 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Page Title & Search Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.25em] text-amber-600 uppercase mb-3 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Live Status Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            Track Nomination Dossier
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 max-w-xl mx-auto">
            Enter your registered 10-digit mobile number, email address, or participant ID to view your live evaluation status and submitted links.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={onSearchSubmit} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Mobile (e.g. 9876543210) or Email"
                className="w-full bg-white border border-slate-200 focus:border-royal-blue rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0B1448] hover:bg-royal-blue text-white font-extrabold text-xs px-7 py-3.5 rounded-2xl shadow-md active:scale-98 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Container */}
        {loading && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
            <Loader2 className="w-8 h-8 text-royal-blue animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Fetching participant dossier and links...</p>
          </div>
        )}

        {!loading && searched && !participant && (
          <div className="bg-white border border-red-200 rounded-3xl p-8 sm:p-12 text-center shadow-xs">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight font-display">
              Nomination Not Found
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-md mx-auto">
              {errorMessage || 'No record matched your mobile number or email address. Please ensure you have completed the nomination form.'}
            </p>
            <button
              onClick={() => navigate('/participate')}
              className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <span>Submit New Entry</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!loading && participant && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            
            {/* Header Banner with Profile Badge & Review Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1448] to-[#2F6FEF] text-amber-400 font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                  {participant.fullName ? participant.fullName.charAt(0) : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Creator Dossier
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ID: {participant._id || participant.id}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B1448] font-display uppercase tracking-tight">
                    {participant.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    District: <strong className="text-slate-800">{participant.district}</strong> • Primary Platform: <strong className="text-royal-blue">{participant.platform || 'Digital'}</strong>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Live Application Status
                </span>
                
                {participant.status?.toUpperCase() === 'PENDING' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 border border-red-200 text-xs font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Pending Review
                  </span>
                )}
                
                {participant.status?.toUpperCase() === 'SUBMITTED' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-800 border border-amber-200 text-xs font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Submitted & Under Jury Evaluation
                  </span>
                )}

                {(participant.status?.toUpperCase() === 'APPROVED' || participant.status?.toUpperCase() === 'APPROVE') && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    Approved & Shortlisted
                  </span>
                )}

                {participant.status?.toUpperCase() === 'REJECTED' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 text-slate-700 border border-slate-200 text-xs font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                    Application Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Application Review Timeline Visual */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-3">
                Review Lifecycle Tracking
              </span>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                
                {/* Step 1: Form Filled / Pending */}
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 text-[11px] uppercase">1. Form Entry</span>
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Draft / Pending
                  </span>
                </div>

                {/* Step 2: Submitted */}
                <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${
                  participant.status?.toUpperCase() === 'SUBMITTED' || participant.status?.toUpperCase() === 'APPROVED' || participant.status?.toUpperCase() === 'APPROVE'
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-white border-slate-200 opacity-60'
                }`}>
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 text-[11px] uppercase">2. OTP Verified</span>
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Submitted To Jury
                  </span>
                </div>

                {/* Step 3: Jury Approval */}
                <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${
                  participant.status?.toUpperCase() === 'APPROVED' || participant.status?.toUpperCase() === 'APPROVE'
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-white border-slate-200 opacity-60'
                }`}>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-slate-800 text-[11px] uppercase">3. Jury Verification</span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Approved / Final
                  </span>
                </div>

              </div>
            </div>

            {/* Category Information */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Award Category Nomination</span>
              </div>
              <h3 className="text-lg font-black text-[#0B1448] uppercase font-display">
                {participant.category?.title || participant.categoryTitle || 'State Creator Award'}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold text-slate-600">
                {participant.category?.tier && (
                  <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[11px]">
                    Tier: <strong>{participant.category.tier}</strong>
                  </span>
                )}
                {participant.category?.hashtag && (
                  <span className="bg-amber-100/60 text-amber-800 px-3 py-1 rounded-full text-[11px] border border-amber-200">
                    #{participant.category.hashtag}
                  </span>
                )}
              </div>
            </div>

            {/* Content Submission Links (TRACKED LINKS SECTION) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-royal-blue" />
                Submitted Media Content Links
              </h3>

              {/* Primary Content Link Card */}
              <div className="bg-white border-2 border-royal-blue/30 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-royal-blue text-white px-2.5 py-0.5 rounded-full">
                      Primary Entry Link
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      Platform: {participant.platform || 'Digital'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 break-all">
                    {participant.submissionLink || 'No link provided'}
                  </p>
                </div>

                {participant.submissionLink && (
                  <a
                    href={participant.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0B1448] hover:bg-royal-blue text-white font-black text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider shrink-0"
                  >
                    <span>View Submission</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Social Channels Track Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                {participant.instagram && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Instagram Handle</span>
                      <span className="text-slate-800 truncate block max-w-[200px]">{participant.instagram}</span>
                    </div>
                    <a
                      href={participant.instagram.startsWith('http') ? participant.instagram : `https://instagram.com/${participant.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-royal-blue hover:underline text-[11px] font-black uppercase flex items-center gap-1 shrink-0"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {participant.youtube && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">YouTube Channel</span>
                      <span className="text-slate-800 truncate block max-w-[200px]">{participant.youtube}</span>
                    </div>
                    <a
                      href={participant.youtube.startsWith('http') ? participant.youtube : `https://youtube.com/${participant.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-royal-blue hover:underline text-[11px] font-black uppercase flex items-center gap-1 shrink-0"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {participant.twitter && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">X / Twitter</span>
                      <span className="text-slate-800 truncate block max-w-[200px]">{participant.twitter}</span>
                    </div>
                    <a
                      href={participant.twitter.startsWith('http') ? participant.twitter : `https://x.com/${participant.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-royal-blue hover:underline text-[11px] font-black uppercase flex items-center gap-1 shrink-0"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {participant.linkedin && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 block">LinkedIn Profile</span>
                      <span className="text-slate-800 truncate block max-w-[200px]">{participant.linkedin}</span>
                    </div>
                    <a
                      href={participant.linkedin.startsWith('http') ? participant.linkedin : `https://linkedin.com/in/${participant.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-royal-blue hover:underline text-[11px] font-black uppercase flex items-center gap-1 shrink-0"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Verified Details Badges */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-slate-600">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Mobile OTP Verified</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px]">Terms Accepted</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-royal-blue shrink-0" />
                <span className="text-[11px]">Jury Consent Granted</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">Official Entry Logged</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
