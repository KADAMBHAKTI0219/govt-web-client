import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Send, Sparkles, User, Mail, Phone, Link2, FileText, ChevronRight, CheckCircle2, Loader2, Globe, HelpCircle } from 'lucide-react';
import { categoriesData } from './categoriesData';
import { fetchCategoriesAPI } from '../../services/categories';
import { sendOtpAPI, submitParticipationAPI } from '../../services/participate';

export default function ParticipateForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCategory = searchParams.get('category') || '';

  const [categories, setCategories] = useState([]);
  
  // State for all required API payload parameters
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    district: 'Raipur',
    phone: '',
    email: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
    isNriCreator: false,
    country: 'India',
    privacyPolicyAccepted: true,
    ipUsageConsent: true,
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
  const [serverMockOtp, setServerMockOtp] = useState(''); // Stores code for developer test ease

  const otpInputsRef = useRef([]);
  const formRef = useRef(null);

  // List of prominent Chhattisgarh districts for select dropdown
  const cgDistricts = [
    'Raipur', 'Bilaspur', 'Durg', 'Bastar', 'Rajnandgaon', 'Korba', 'Raigarh', 
    'Janjgir-Champa', 'Surguja', 'Mahasamund', 'Dhamtari', 'Kanker', 'Kabirdham',
    'Bemetara', 'Balod', 'Baloda Bazar', 'Gariaband', 'Balrampur', 'Surajpur',
    'Jashpur', 'Mungeli', 'Kondagaon', 'Narayanpur', 'Bijapur', 'Dantewada', 'Sukma'
  ];

  // Load categories list for select dropdown
  useEffect(() => {
    async function loadCategories() {
      const res = await fetchCategoriesAPI();
      if (res && res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      } else {
        const staticList = categoriesData.map(c => ({
          slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: c.title
        }));
        setCategories(staticList);
      }
    }
    loadCategories();
  }, []);

  // Update selected category if query parameter changes
  useEffect(() => {
    if (preSelectedCategory) {
      setFormData((prev) => ({ ...prev, category: preSelectedCategory }));
    }
  }, [preSelectedCategory]);

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

  // Handle Phone input to restrict to numeric values and strictly maximum 10 digits
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, ''); // strip non-digits
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

    // Auto-focus next input field
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

  // Handle send OTP action
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.category || !formData.submissionLink) {
      alert("Please fill in all required fields to proceed.");
      return;
    }

    setIsSendingOtp(true);
    
    // Call backend API /api/participate/send-otp
    const res = await sendOtpAPI(formData.phone);
    setIsSendingOtp(false);

    if (res && res.success) {
      // Store mock OTP returned by server for test convenience
      if (res.data && res.data.otp) {
        setServerMockOtp(res.data.otp);
      }
      setStage('otp');
      setTimerSeconds(45);
      
      // Animates transition into OTP input boxes
      gsap.fromTo(".cm-otp-box", 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" }
      );
    } else {
      alert(res.message || "Failed to send verification code. Please check your phone number.");
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (timerSeconds > 0) return;
    const res = await sendOtpAPI(formData.phone);
    if (res && res.success) {
      if (res.data && res.data.otp) {
        setServerMockOtp(res.data.otp);
      }
      setTimerSeconds(45);
      alert(`A new verification code has been dispatched to ${formData.phone}`);
    } else {
      alert(res.message || "Failed to resend code.");
    }
  };

  // Submit complete participation payload to backend
  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      alert("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);

    // Build the social handles object dynamically
    const socialHandles = {};
    if (formData.instagram) socialHandles.instagram = formData.instagram;
    if (formData.youtube) socialHandles.youtube = formData.youtube;
    if (formData.twitter) socialHandles.twitter = formData.twitter;
    if (formData.linkedin) socialHandles.linkedin = formData.linkedin;

    // Construct the payload matching the backend schema
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      district: formData.district,
      phone: formData.phone,
      email: formData.email,
      socialHandles,
      isNriCreator: formData.isNriCreator,
      country: formData.isNriCreator ? formData.country : 'India',
      privacyPolicyAccepted: formData.privacyPolicyAccepted,
      ipUsageConsent: formData.ipUsageConsent,
      category: formData.category,
      platform: formData.platform.toUpperCase(),
      submissionLink: formData.submissionLink,
      otp: enteredOtp
    };

    // Call backend API /api/participate
    const res = await submitParticipationAPI(payload);
    setIsSubmitting(false);

    if (res && res.success) {
      // Store access token returned in response for login state sync
      if (res.data && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      }
      alert(res.message || "Your participation entry has been submitted successfully!");
      navigate('/'); // Redirect to Homepage!
    } else {
      alert(res.message || "Verification failed. Please check the code entered.");
    }
  };

  // Initial GSAP Form Load Animation
  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

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
            Participation form
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0B1448] font-display">
            {stage === 'otp' ? 'Verify Mobile' : 'Submit Entry'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2">
            {stage === 'otp' 
              ? `We have sent a verification code to ${formData.phone}` 
              : 'Submit your entry directly. No pre-registration or login required.'}
          </p>
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
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
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

              {/* Row 2: Phone Number & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Phone Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="10-digit number"
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
                    min={18}
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
                    <option value="SHARECHAT">ShareChat</option>
                    <option value="KOO">Koo</option>
                    <option value="ROPOSO">Roposo</option>
                    <option value="MOJ">Moj</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Category Dropdown & Submission Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Award Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none transition-all outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
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

              {/* Social media handles row A: Instagram & YouTube */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Instagram URL (Optional)</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">YouTube URL (Optional)</label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/c/channel"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>
              </div>

              {/* Social media handles row B: Twitter & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">X / Twitter URL (Optional)</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://x.com/username"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn URL (Optional)</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                  />
                </div>
              </div>

              {/* NRI toggle and Country Selection */}
              <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNriCreator"
                    name="isNriCreator"
                    checked={formData.isNriCreator}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300"
                  />
                  <label htmlFor="isNriCreator" className="text-xs font-black text-slate-700 uppercase tracking-wider cursor-pointer">
                    I am an International / NRI Creator
                  </label>
                </div>

                {formData.isNriCreator && (
                  <div className="flex flex-col gap-1.5 animate-fadeIn">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Country of Residence *</label>
                    <div className="relative group">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 focus-within:text-royal-blue transition-colors" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="e.g. United States"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-royal-blue/30 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all outline-none"
                        required={formData.isNriCreator}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* User Consent checkboxes */}
              <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="privacyPolicyAccepted"
                    name="privacyPolicyAccepted"
                    checked={formData.privacyPolicyAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300 mt-0.5"
                    required
                  />
                  <label htmlFor="privacyPolicyAccepted" className="cursor-pointer">
                    I accept the Privacy Policy and official contest guidelines. *
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="ipUsageConsent"
                    name="ipUsageConsent"
                    checked={formData.ipUsageConsent}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-royal-blue focus:ring-royal-blue/30 border-slate-300 mt-0.5"
                    required
                  />
                  <label htmlFor="ipUsageConsent" className="cursor-pointer">
                    I consent to the usage of my submitted content links for evaluation & voting. *
                  </label>
                </div>
              </div>

              {/* Submit Details to Get OTP */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full bg-gradient-to-r from-amber-400 to-[#FFA320] text-[#0B1448] font-extrabold text-xs py-4 rounded-xl hover:shadow-lg hover:shadow-amber-400/10 active:scale-98 transition-all duration-200 uppercase tracking-wider mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP code...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Verify Phone & Send OTP
                  </>
                )}
              </button>

            </form>
          ) : (
            /* ================= OTP VERIFICATION FORM ================= */
            <form onSubmit={handleVerifyAndSubmit} className="flex flex-col gap-6 text-left">
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-bold text-slate-600 leading-relaxed">
                A 6-digit verification code has been dispatched to <strong className="text-slate-800">{formData.phone}</strong>. Please type it in below to verify and complete your entry.
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

              {/* Developer Test Helper Panel */}
              {serverMockOtp && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-xs font-extrabold text-amber-700 text-center animate-pulse flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Testing Code: <span className="underline select-all">{serverMockOtp}</span>
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
                    Submitting Entry...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify & Submit Entry
                  </>
                )}
              </button>

              {/* Edit Details Action Link */}
              <button
                type="button"
                onClick={() => setStage('details')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer text-center block w-full"
              >
                Back to edit entry details
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
