import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  User, ShieldCheck, CheckCircle2, Clock, FileCheck, ExternalLink, Link2, 
  Phone, Mail, MapPin, Award, Sparkles, ArrowLeft, Loader2, LogOut, PlusCircle, Eye, X, Globe 
} from 'lucide-react';
import { fetchParticipantProfileAPI, sendOtpAPI, verifyOtpAPI } from '../../services/participate';
import { categoriesData } from './categoriesData';

export default function MyProfile() {
  const navigate = useNavigate();

  const [submissionsList, setSubmissionsList] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login Form State if no active session
  const [loginPhone, setLoginPhone] = useState('');
  const [loginStage, setLoginStage] = useState('phone');
  const [loginOtp, setLoginOtp] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [serverDevOtp, setServerDevOtp] = useState('');

  const loadProfileSubmissions = async () => {
    setLoading(true);
    const savedPhone = localStorage.getItem('participant_phone');

    let list = [];

    if (savedPhone) {
      const res = await fetchParticipantProfileAPI(savedPhone);
      if (res && res.success && res.participant) {
        const p = res.participant;
        // Keep profile metadata cached for navbar badge
        localStorage.setItem('participant_profile', JSON.stringify(p));

        if (p.categorySubmissions && Array.isArray(p.categorySubmissions) && p.categorySubmissions.length > 0) {
          list = p.categorySubmissions.map(sub => {
            // Resolve category details
            let catInfo = null;
            if (sub.category && typeof sub.category === 'object') {
              catInfo = sub.category;
            } else if (sub.category) {
              const subCatId = String(sub.category);
              const matchedLocal = categoriesData.find(c => {
                const generatedId = `cat-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return generatedId === subCatId || slug === subCatId || c._id === subCatId;
              });
              if (matchedLocal) {
                let streamTag = "Creative Arts";
                if (matchedLocal.stream === "Social Impact") streamTag = "Social Impact";
                else if (matchedLocal.stream === "Craft & Platform") streamTag = "Craft & Platform";
                catInfo = {
                  _id: subCatId,
                  title: matchedLocal.title,
                  slug: matchedLocal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  tier: matchedLocal.stream === "Creative Arts" ? "A_CULTURE_IDENTITY" : matchedLocal.stream === "Social Impact" ? "B_NATION_STATE_BUILDING" : "C_CRAFT_PLATFORM",
                  stream: streamTag
                };
              }
            }

            const categoryTitle = catInfo?.title || sub.categoryTitle || "Award Category";
            const categorySlug = catInfo?.slug || "";
            const categoryTier = catInfo?.tier || "";
            let streamTag = "Creative Arts";
            if (categoryTier === "B_NATION_STATE_BUILDING") streamTag = "Social Impact";
            else if (categoryTier === "C_CRAFT_PLATFORM") streamTag = "Craft & Platform";
            else if (catInfo?.stream) streamTag = catInfo.stream;

            return {
              _id: sub._id || `${p._id}-${sub.category?._id || sub.category}`,
              id: sub._id || `${p._id}-${sub.category?._id || sub.category}`,
              participantId: p._id,
              fullName: p.fullName,
              email: p.email,
              phone: p.phone,
              district: p.district,
              platform: p.platform,
              instagram: p.instagram,
              youtube: p.youtube,
              twitter: p.twitter,
              linkedin: p.linkedin,
              category: catInfo || sub.category,
              categoryTitle,
              categorySlug,
              stream: streamTag,
              submissionLink: sub.submissionLink,
              status: (sub.status || 'SUBMITTED').toUpperCase(),
              submittedAt: sub.submittedAt || p.createdAt
            };
          });
        }
      }
    }

    setSubmissionsList(list);
    setLoading(false);
  };

  useEffect(() => {
    loadProfileSubmissions();

    const handleSessionChange = () => {
      loadProfileSubmissions();
    };

    window.addEventListener('participant-session-changed', handleSessionChange);
    return () => window.removeEventListener('participant-session-changed', handleSessionChange);
  }, []);

  // Handle Login Send OTP
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoggingIn(true);
    const res = await sendOtpAPI(cleanPhone);
    setIsLoggingIn(false);

    if (res && res.success) {
      if (res.devOtp) setServerDevOtp(res.devOtp);
      setLoginStage('otp');
    } else {
      alert(res.message || "Failed to send verification OTP.");
    }
  };

  // Handle Verify Login OTP & Fetch Profile
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (loginOtp.length < 6) {
      alert("Please enter the 6-digit verification code.");
      return;
    }

    setIsLoggingIn(true);
    const verifyRes = await verifyOtpAPI(cleanPhone, loginOtp);
    if (!verifyRes || !verifyRes.success) {
      setIsLoggingIn(false);
      alert(verifyRes?.message || "Invalid OTP verification code.");
      return;
    }

    // OTP verified -> fetch participant profile
    const profileRes = await fetchParticipantProfileAPI(cleanPhone);
    setIsLoggingIn(false);

    if (profileRes && profileRes.success) {
      localStorage.setItem('participant_phone', cleanPhone);
      const profileData = profileRes.participant || (profileRes.participants && profileRes.participants[0]) || null;
      if (profileData) {
        localStorage.setItem('participant_profile', JSON.stringify(profileData));
      }
      window.dispatchEvent(new Event('participant-session-changed'));
    } else {
      alert("No participant profile found for this mobile number. Please register your entry.");
      navigate('/participate');
    }
  };

  // Handle Signout
  const handleSignout = () => {
    if (window.confirm("Are you sure you want to sign out of your participant profile?")) {
      localStorage.removeItem('participant_phone');
      localStorage.removeItem('participant_profile');
      localStorage.removeItem('participant_submissions');
      setSubmissionsList([]);
      window.dispatchEvent(new Event('participant-session-changed'));
    }
  };

  const primaryProfile = submissionsList[0] || null;

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

        {loading ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
            <Loader2 className="w-8 h-8 text-royal-blue animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading your profile submissions...</p>
          </div>
        ) : primaryProfile ? (
          /* ================= ACTIVE PARTICIPANT PROFILE & NOMINATIONS LIST ================= */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B1448] to-[#2F6FEF] text-amber-400 font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                  {primaryProfile.fullName ? primaryProfile.fullName.charAt(0) : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Registered Creator Profile
                    </span>
                    <span className="text-[10px] font-extrabold text-royal-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {submissionsList.length} {submissionsList.length === 1 ? 'Category Entry' : 'Category Entries'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0B1448] font-display uppercase tracking-tight">
                    {primaryProfile.fullName}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    District: <strong className="text-slate-800">{primaryProfile.district}</strong> • Phone: <strong className="text-slate-800">{primaryProfile.phone}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => navigate('/participate')}
                  className="bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Nominate New Category</span>
                </button>
                <button
                  onClick={handleSignout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-4 py-3 rounded-2xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* LIST OF SUBMITTED CATEGORY NOMINATIONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-[#0B1448] uppercase tracking-wider font-display">
                    Submitted Category Entries
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Click "View Details" on any entry to track evaluation progress & links
                  </p>
                </div>
                <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Total: {submissionsList.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
                {submissionsList.map((item, idx) => {
                  const statusStr = (item.status || 'PENDING').toUpperCase();
                  const catTitle = item.category?.title || item.categoryTitle || 'State Creator Award';
                  const platformStr = item.platform || 'Digital';

                  return (
                    <div 
                      key={item._id || item.id || idx}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold text-xs"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 font-black flex items-center justify-center shrink-0 border border-amber-200">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0B1448] text-sm font-display">
                            {catTitle}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span>Platform: <strong className="text-royal-blue">{platformStr}</strong></span>
                            {item.category?.tier && (
                              <span>• Tier: <strong>{item.category.tier}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        {/* Status Badge with SINGLE CLEAN DOT */}
                        {statusStr === 'PENDING' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-600 border border-red-200 text-[11px] font-black uppercase">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            Pending Review
                          </span>
                        )}
                        {statusStr === 'SUBMITTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-200 text-[11px] font-black uppercase">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Submitted
                          </span>
                        )}
                        {(statusStr === 'APPROVED' || statusStr === 'APPROVE') && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            Approved & Shortlisted
                          </span>
                        )}
                        {statusStr === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-500/10 text-slate-700 border border-slate-200 text-[11px] font-black uppercase">
                            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                            Rejected
                          </span>
                        )}

                        {/* View Details Action Button */}
                        <button
                          onClick={() => setSelectedSubmission(item)}
                          className="bg-[#0B1448] hover:bg-royal-blue text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* ================= NO ACTIVE SESSION LOG IN CARD ================= */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-lg max-w-xl mx-auto">
            <User className="w-14 h-14 text-royal-blue mx-auto mb-4 p-3 bg-blue-50 rounded-2xl" />
            <h2 className="text-2xl font-black text-[#0B1448] uppercase font-display tracking-tight">
              Participant Profile Access
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-2 mb-6 leading-relaxed">
              Verify your mobile number to view your submitted category entries and live evaluation statuses.
            </p>

            {loginStage === 'phone' ? (
              <form onSubmit={handleSendLoginOtp} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-royal-blue"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#0B1448] hover:bg-royal-blue text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                  <span>Send Login OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-4 text-left">
                <div className="bg-slate-50 p-3 rounded-xl text-xs font-bold text-slate-600">
                  OTP sent to <strong>+91 {loginPhone}</strong>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Enter 6-Digit OTP *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-center tracking-widest font-black text-lg text-[#0B1448] py-2.5 outline-none focus:border-royal-blue"
                    required
                  />
                </div>

                {serverDevOtp && (
                  <div className="text-xs font-extrabold text-amber-700 bg-amber-50 p-2 rounded-lg text-center">
                    Dev Test Code: {serverDevOtp}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Verify & Access Profile</span>
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Have not participated yet?</span>
              <button
                onClick={() => navigate('/participate')}
                className="text-royal-blue font-black underline cursor-pointer"
              >
                Register Nomination →
              </button>
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL MOUNTED DIRECTLY TO DOCUMENT.BODY VIA REACT PORTAL */}
        {selectedSubmission && createPortal(
          <div className="fixed inset-0 bg-[#0B1448]/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 my-auto max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Close Modal Button */}
              <button
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-slate-100 pb-4 pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Category Entry Details
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ID: {selectedSubmission._id || selectedSubmission.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1448] font-display uppercase tracking-tight">
                  {selectedSubmission.category?.title || selectedSubmission.categoryTitle || 'State Creator Award'}
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Applicant: <strong className="text-slate-800">{selectedSubmission.fullName}</strong> • District: <strong className="text-slate-800">{selectedSubmission.district}</strong>
                </p>
              </div>

              {/* Review Status Badge (SINGLE DOT) */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-xs font-black uppercase text-slate-600">Current Evaluation Status:</span>
                { (selectedSubmission.status?.toUpperCase() === 'PENDING') && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 border border-red-200 text-xs font-black uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Pending Review
                  </span>
                )}
                { (selectedSubmission.status?.toUpperCase() === 'SUBMITTED') && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-200 text-xs font-black uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Submitted & Under Jury Review
                  </span>
                )}
                { (selectedSubmission.status?.toUpperCase() === 'APPROVED' || selectedSubmission.status?.toUpperCase() === 'APPROVE') && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-200 text-xs font-black uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    Approved & Shortlisted
                  </span>
                )}
                { (selectedSubmission.status?.toUpperCase() === 'REJECTED') && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-500/10 text-slate-700 border border-slate-200 text-xs font-black uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                    Application Rejected
                  </span>
                )}
              </div>

              {/* Nomination Progress Lifecycle */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Review Lifecycle
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col items-center gap-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] uppercase text-slate-700">1. Registered</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                    selectedSubmission.status?.toUpperCase() === 'SUBMITTED' || selectedSubmission.status?.toUpperCase() === 'APPROVED' || selectedSubmission.status?.toUpperCase() === 'APPROVE'
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 opacity-50'
                  }`}>
                    <FileCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-[10px] uppercase">2. Submitted</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 ${
                    selectedSubmission.status?.toUpperCase() === 'APPROVED' || selectedSubmission.status?.toUpperCase() === 'APPROVE'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 opacity-50'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] uppercase">3. Approved</span>
                  </div>
                </div>
              </div>

              {/* Submission Link Details */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-royal-blue" />
                  Submitted Media Entry Link
                </span>

                <div className="bg-white border-2 border-royal-blue/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase bg-royal-blue text-white px-2 py-0.5 rounded-full inline-block mb-1">
                      {selectedSubmission.platform || 'Digital'} Entry Link
                    </span>
                    <p className="text-xs font-bold text-slate-800 break-all">
                      {selectedSubmission.submissionLink || selectedSubmission.channelUrl || 'No link provided'}
                    </p>
                  </div>

                  {(selectedSubmission.submissionLink || selectedSubmission.channelUrl) && (
                    <a
                      href={selectedSubmission.submissionLink || selectedSubmission.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0B1448] hover:bg-royal-blue text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-wider shrink-0"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Social Media Handles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-2">
                {selectedSubmission.instagram && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px]">Instagram</span>
                    <a href={selectedSubmission.instagram} target="_blank" rel="noreferrer" className="text-royal-blue hover:underline font-black">View Profile →</a>
                  </div>
                )}
                {selectedSubmission.youtube && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 font-extrabold uppercase text-[10px]">YouTube</span>
                    <a href={selectedSubmission.youtube} target="_blank" rel="noreferrer" className="text-royal-blue hover:underline font-black">View Channel →</a>
                  </div>
                )}
              </div>

              {/* Modal Close Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}
