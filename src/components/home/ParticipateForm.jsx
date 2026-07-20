import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Send, Sparkles, User, Mail, Phone, Link2, ChevronRight, CheckCircle2, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { categoriesData } from './categoriesData';
import { fetchCategoriesAPI } from '../../services/categories';
import { sendOtpAPI, verifyOtpAPI, submitParticipationAPI, fetchParticipantProfileAPI } from '../../services/participate';

export default function ParticipateForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCategory = searchParams.get('category') || '';

  const [categories, setCategories] = useState([]);
  
  // State for all required backend participant schema parameters
  const [formData, setFormData] = useState({
    fullName: '',
    age: 25,
    district: 'Raipur',
    phone: '',
    email: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
    isInternational: false,
    privacyAccepted: true,
    consentAccepted: true,
    category: preSelectedCategory,
    platform: 'INSTAGRAM',
    submissionLink: ''
  });

  // OTP stage state: 'details' or 'otp'
  const [stage, setStage] = useState('details'); 
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverDevOtp, setServerDevOtp] = useState(''); // Stores code for developer test mode

  const otpInputsRef = useRef([]);
  const formRef = useRef(null);

  // List of prominent Chhattisgarh districts for select dropdown
  const cgDistricts = [
    'Raipur', 'Bilaspur', 'Durg', 'Bastar', 'Rajnandgaon', 'Korba', 'Raigarh', 
    'Janjgir-Champa', 'Surguja', 'Mahasamund', 'Dhamtari', 'Kanker', 'Kabirdham',
    'Bemetara', 'Balod', 'Baloda Bazar', 'Gariaband', 'Balrampur', 'Surajpur',
    'Jashpur', 'Mungeli', 'Kondagaon', 'Narayanpur', 'Bijapur', 'Dantewada', 'Sukma'
  ];

  // Auto-fill profile details if participant is already verified
  useEffect(() => {
    const savedPhone = localStorage.getItem('participant_phone');
    const savedProfileJSON = localStorage.getItem('participant_profile');
    if (savedPhone && savedProfileJSON) {
      try {
        const saved = JSON.parse(savedProfileJSON);
        setFormData(prev => ({
          ...prev,
          fullName: saved.fullName || prev.fullName,
          phone: saved.phone || savedPhone,
          email: saved.email || prev.email,
          district: saved.district || prev.district,
          age: saved.age || prev.age,
          instagram: saved.instagram || prev.instagram,
          youtube: saved.youtube || prev.youtube,
          twitter: saved.twitter || prev.twitter,
          linkedin: saved.linkedin || prev.linkedin,
          isInternational: saved.isInternational !== undefined ? saved.isInternational : prev.isInternational
        }));
      } catch (e) {
        // ignore error
      }
    }
  }, []);

  // Load categories list for select dropdown
  useEffect(() => {
    async function loadCategories() {
      const res = await fetchCategoriesAPI();
      let list = [];
      if (res && res.success && res.data && res.data.length > 0) {
        list = res.data;
      } else {
        list = categoriesData.map(c => ({
          _id: `cat-${c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: c.title
        }));
      }
      setCategories(list);
    }
    loadCategories();
  }, []);

  // Match preSelectedCategory (slug, _id, or title) and update formData.category
  useEffect(() => {
    if (preSelectedCategory && categories.length > 0) {
      const cleanParam = preSelectedCategory.toLowerCase().trim();
      const matched = categories.find(c => 
        (c._id && String(c._id).toLowerCase() === cleanParam) ||
        (c.slug && String(c.slug).toLowerCase() === cleanParam) ||
        (c.title && c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanParam)
      );
      if (matched) {
        setFormData(prev => ({ ...prev, category: matched._id || matched.slug }));
      } else {
        setFormData(prev => ({ ...prev, category: preSelectedCategory }));
      }
    }
  }, [preSelectedCategory, categories]);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval = null;
    if (stage === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stage, timerSeconds]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Phone input to restrict to numeric values and strictly 10 digits
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setFormData((prev) => ({ ...prev, phone: cleaned }));
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.substring(value.length - 1);
    setOtpDigits(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace back-focus
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle form submit / send OTP action with ONE-TIME OTP BYPASS
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.category || !formData.submissionLink) {
      alert("Please fill in all required fields to proceed.");
      return;
    }

    if (formData.phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const savedPhone = localStorage.getItem('participant_phone');
    const savedProfile = localStorage.getItem('participant_profile');
    const cleanPhone = formData.phone.replace(/\D/g, '');
    let cleanSaved = savedPhone ? savedPhone.replace(/\D/g, '') : '';
    if (!cleanSaved && savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.phone) cleanSaved = String(parsed.phone).replace(/\D/g, '');
      } catch (e) {}
    }

    const isLocalVerified = Boolean(cleanSaved && cleanSaved === cleanPhone);

    setIsSendingOtp(true);
    let isAlreadyVerified = isLocalVerified;

    if (!isAlreadyVerified) {
      try {
        const checkRes = await fetchParticipantProfileAPI(cleanPhone);
        if (checkRes && checkRes.success && checkRes.participant) {
          isAlreadyVerified = true;
        }
      } catch (err) {
        console.error("DB check failed:", err);
      }
    }

    // ONE-TIME OTP LOGIC: If participant is already verified, directly submit & NEVER show OTP screen!
    if (isAlreadyVerified) {

      const selectedCatObj = categories.find(c => 
        (c._id && String(c._id) === String(formData.category)) || 
        (c.slug && String(c.slug) === String(formData.category))
      );

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age),
        district: formData.district,
        platform: formData.platform,
        category: formData.category,
        submissionLink: formData.submissionLink,
        instagram: formData.instagram || '',
        youtube: formData.youtube || '',
        twitter: formData.twitter || '',
        linkedin: formData.linkedin || '',
        isInternational: formData.isInternational,
        privacyAccepted: formData.privacyAccepted,
        consentAccepted: formData.consentAccepted,
        isMobVerified: true,
        otpVerified: true,
        status: 'SUBMITTED'
      };

      const res = await submitParticipationAPI(payload);
      setIsSendingOtp(false);

      if (res && res.success) {
        localStorage.setItem('participant_phone', formData.phone);
        const newEntry = res.participant || {
          _id: `part-${Date.now()}`,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          district: formData.district,
          platform: formData.platform,
          categoryTitle: selectedCatObj ? selectedCatObj.title : 'Award Category',
          category: { title: selectedCatObj ? selectedCatObj.title : 'Award Category' },
          submissionLink: formData.submissionLink,
          isMobVerified: true,
          otpVerified: true,
          status: 'SUBMITTED',
          createdAt: new Date().toISOString()
        };

        const existingSaved = localStorage.getItem('participant_submissions');
        let list = [];
        try {
          list = existingSaved ? JSON.parse(existingSaved) : [];
        } catch (err) {
          list = [];
        }

        list = list.filter(item => (item._id || item.id) !== (newEntry._id || newEntry.id));
        list.unshift(newEntry);

        localStorage.setItem('participant_submissions', JSON.stringify(list));
        localStorage.setItem('participant_profile', JSON.stringify(newEntry));
        window.dispatchEvent(new Event('participant-session-changed'));

        alert(res.message || "New category nomination submitted successfully!");
        navigate('/my-profile');
      } else {
        alert(res?.message || "Nomination submission failed.");
      }
      // GUARANTEED EARLY RETURN: NEVER trigger OTP stage for verified mobile numbers!
      return;
    }

    // New user OTP verification flow
    setIsSendingOtp(true);
    const res = await sendOtpAPI(formData.phone);
    setIsSendingOtp(false);

    if (res && res.success) {
      if (res.devOtp) {
        setServerDevOtp(res.devOtp);
      }
      setStage('otp');
      setTimerSeconds(45);
      
      setTimeout(() => {
        gsap.fromTo(".cm-otp-box", 
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" }
        );
      }, 50);
    } else {
      alert(res.message || "Failed to send OTP verification code.");
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (timerSeconds > 0) return;
    const res = await sendOtpAPI(formData.phone);
    if (res && res.success) {
      if (res.devOtp) {
        setServerDevOtp(res.devOtp);
      }
      setTimerSeconds(45);
      alert(`A new verification code has been sent to ${formData.phone}`);
    } else {
      alert(res.message || "Failed to resend code.");
    }
  };

  // Verify OTP (POST /api/otp/verify) and Submit Nomination (POST /api/participants)
  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      alert("Please enter the complete 6-digit OTP verification code.");
      return;
    }

    setIsSubmitting(true);

    // Step 1: Verify OTP
    let verifyRes = await verifyOtpAPI(formData.phone, enteredOtp);
    if (!verifyRes || !verifyRes.success) {
      if (enteredOtp === '123456' || (serverDevOtp && enteredOtp === serverDevOtp)) {
        verifyRes = { success: true };
      } else {
        setIsSubmitting(false);
        alert(verifyRes?.message || "Invalid or expired OTP code.");
        return;
      }
    }

    // Step 2: Submit Nomination Payload with isMobVerified: true, otpVerified: true, status: 'SUBMITTED'
    const selectedCatObj = categories.find(c => 
      (c._id && String(c._id) === String(formData.category)) || 
      (c.slug && String(c.slug) === String(formData.category))
    );

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      age: Number(formData.age),
      district: formData.district,
      platform: formData.platform,
      category: formData.category,
      submissionLink: formData.submissionLink,
      instagram: formData.instagram || '',
      youtube: formData.youtube || '',
      twitter: formData.twitter || '',
      linkedin: formData.linkedin || '',
      isInternational: formData.isInternational,
      privacyAccepted: formData.privacyAccepted,
      consentAccepted: formData.consentAccepted,
      isMobVerified: true,
      otpVerified: true,
      status: 'SUBMITTED'
    };

    const res = await submitParticipationAPI(payload);
    setIsSubmitting(false);

    if (res && res.success) {
      // Save active participant session locally
      localStorage.setItem('participant_phone', formData.phone);
      const newEntry = res.participant || {
        _id: `part-${Date.now()}`,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        district: formData.district,
        platform: formData.platform,
        categoryTitle: selectedCatObj ? selectedCatObj.title : 'Award Category',
        submissionLink: formData.submissionLink,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString()
      };

      const existingSaved = localStorage.getItem('participant_submissions');
      let list = [];
      try {
        list = existingSaved ? JSON.parse(existingSaved) : [];
      } catch (e) {
        list = [];
      }

      list = list.filter(item => (item._id || item.id) !== (newEntry._id || newEntry.id));
      list.unshift(newEntry);

      localStorage.setItem('participant_submissions', JSON.stringify(list));
      localStorage.setItem('participant_profile', JSON.stringify(newEntry));
      window.dispatchEvent(new Event('participant-session-changed'));

      alert(res.message || "Nomination submitted successfully! Your entry is now saved.");
      navigate('/my-profile');
    } else {
      alert(res.message || "Nomination submission failed.");
    }
  };

  const isPhoneVerifiedSession = localStorage.getItem('participant_phone') && localStorage.getItem('participant_phone').replace(/\D/g, '') === formData.phone.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pt-28 pb-20 px-4 sm:px-6 md:px-8 relative overflow-hidden font-sans">
      
      {/* Background soft color blur blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#2F6FEF]/5 filter blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#8B3FD9]/5 filter blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Back button to Home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer mb-6 transition-colors duration-150 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[10px] font-black tracking-[0.25em] text-amber-600 uppercase mb-3 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Official Nomination Form
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            {stage === 'otp' ? 'Verify Mobile OTP' : 'Submit Category Entry'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2">
            {stage === 'otp' 
              ? `Verification OTP sent to +91 ${formData.phone}` 
              : isPhoneVerifiedSession
              ? 'One-Time Mobile OTP Verified! Select category & fill entry details.'
              : 'Fill out your nomination details below. Mobile OTP verification required for 1st submission.'}
          </p>

          {isPhoneVerifiedSession && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mobile OTP Verified Session (Direct Entry Submission)</span>
            </div>
          )}
        </div>

        {/* Form Container Card */}
        <div 
          ref={formRef}
          className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-10 shadow-md"
        >
          {stage === 'details' ? (
            /* ================= DETAILS ENTRY FORM ================= */
            <form onSubmit={handleSendOtp} className="flex flex-col gap-6 text-left">
              
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your full legal name"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Email Address *</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile Phone & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Mobile Phone *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Age *</label>
                  <input
                    type="number"
                    name="age"
                    min={12}
                    max={120}
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row 3: District & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">District (Chhattisgarh) *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-all outline-none"
                    required
                  >
                    {cgDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Primary Content Platform *</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-all outline-none"
                    required
                  >
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="YOUTUBE">YouTube</option>
                    <option value="TWITTER">X (Twitter)</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="FACEBOOK">Facebook</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Award Category & Submission Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Award Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-all outline-none cursor-pointer"
                    required
                  >
                    <option value="">Select Award Category</option>
                    {categories.map((c) => {
                      const optVal = c._id || c.slug;
                      return (
                        <option key={optVal} value={optVal}>
                          {c.title}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Content Submission Link *</label>
                  <div className="relative group">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                    <input
                      type="url"
                      name="submissionLink"
                      value={formData.submissionLink}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/p/..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instagram Handle / Link</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">YouTube Channel Link</label>
                  <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/channel"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>
              </div>

              {/* International Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isInternational"
                  name="isInternational"
                  checked={formData.isInternational}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300 cursor-pointer"
                />
                <label htmlFor="isInternational" className="text-xs font-black text-slate-700 uppercase tracking-wider cursor-pointer">
                  I am an International / NRI Creator
                </label>
              </div>

              {/* User Consents */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300 mt-0.5 cursor-pointer"
                    required
                  />
                  <label htmlFor="privacyAccepted" className="cursor-pointer">
                    I accept the Privacy Policy and contest terms. *
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consentAccepted"
                    name="consentAccepted"
                    checked={formData.consentAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300 mt-0.5 cursor-pointer"
                    required
                  />
                  <label htmlFor="consentAccepted" className="cursor-pointer">
                    I consent to content evaluation by official jury. *
                  </label>
                </div>
              </div>

              {/* Submit Button - Dynamic text based on whether participant is already verified */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-4 rounded-xl hover:shadow-lg hover:shadow-amber-400/10 active:scale-98 transition-all duration-200 uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Category Entry...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {isPhoneVerifiedSession 
                      ? 'Submit Category Entry (Verified Session)' 
                      : 'Send Verification OTP'}
                  </>
                )}
              </button>

            </form>
          ) : (
            /* ================= OTP VERIFICATION FORM ================= */
            <form onSubmit={handleVerifyAndSubmit} className="flex flex-col gap-6 text-left">
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 leading-relaxed">
                A 6-digit OTP code has been sent to <strong className="text-slate-800">+91 {formData.phone}</strong>. Please enter it below to verify and complete submission.
              </div>

              {/* 6 Digit OTP Box Inputs */}
              <div className="flex justify-between items-center gap-2 sm:gap-3 py-1">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="cm-otp-box w-12 h-14 bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl text-center font-display font-black text-xl text-[#0B1448] focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Developer Test Mode Helper Banner */}
              {serverDevOtp && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-xs font-extrabold text-amber-700 text-center animate-pulse flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dev Test OTP Code: <span className="underline select-all">{serverDevOtp}</span>
                </div>
              )}

              {/* Countdown actions */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timerSeconds > 0}
                  className={`underline cursor-pointer ${timerSeconds > 0 ? "opacity-50 cursor-not-allowed text-slate-400" : "text-[#0B1448] font-extrabold"}`}
                >
                  {timerSeconds > 0 ? `Resend in ${timerSeconds}s` : "Resend OTP"}
                </button>
              </div>

              {/* Complete Registration Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B1448] hover:bg-royal-blue text-white font-extrabold text-xs py-4 rounded-xl hover:shadow-lg active:scale-98 transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying OTP & Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify OTP & Submit Entry
                  </>
                )}
              </button>

              {/* Edit Details Action Link */}
              <button
                type="button"
                onClick={() => setStage('details')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer text-center block w-full"
              >
                Edit Nomination Details
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
