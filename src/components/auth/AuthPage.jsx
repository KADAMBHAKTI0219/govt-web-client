import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, Phone, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import loginVdo from "../../assets/vdo/login.mp4";
import registerVdo from "../../assets/vdo/register.mp4";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [showPassword, setShowPassword] = useState(false);

  // Registration stage state: 'details' or 'otp'
  const [regStage, setRegStage] = useState('details'); 
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Refs for GSAP
  const formCardRef = useRef(null);
  const inputGroupRef = useRef(null);
  const bgBlobsRef = useRef(null);
  const otpInputsRef = useRef([]);

  // Sync mode prop with internal state
  useEffect(() => {
    setIsLogin(mode === "login");
    setRegStage('details'); // reset registration stage when toggling mode
  }, [mode]);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval = null;
    if (regStage === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [regStage, timerSeconds]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Only allow numbers
    const newOtp = [...otpDigits];
    newOtp[index] = value.substring(value.length - 1); // capture only the last char
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

  // Toggle View Handler
  const toggleAuthMode = () => {
    const nextState = !isLogin;
    setIsLogin(nextState);
    setRegStage('details');
    navigate(nextState ? "/login" : "/register");
  };

  // Handle Send OTP click
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in Name, Phone, and Email to register.");
      return;
    }
    setIsSendingOtp(true);
    // Simulate sending OTP SMS api call
    setTimeout(() => {
      setIsSendingOtp(false);
      setRegStage('otp');
      setTimerSeconds(45);
      toast.success(`Verification code sent to +91 ${formData.phone}`);
      // Animates transition into OTP input boxes
      gsap.fromTo(".cm-otp-box", 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" }
      );
    }, 1200);
  };

  // Resend OTP Action
  const handleResendOtp = () => {
    if (timerSeconds > 0) return;
    setTimerSeconds(45);
    toast.success(`A new 6-digit verification code has been sent to ${formData.phone}`);
  };

  // Handle final registration after OTP verification
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifying(true);
    // Simulate verification check and registration
    setTimeout(async () => {
      const mockPassword = `otp_${formData.phone}`; // set password dynamically
      const result = await register(
        formData.name,
        formData.email,
        mockPassword,
        mockPassword
      );

      setIsVerifying(false);
      if (result.success) {
        toast.success("Mobile verified and registered successfully!");
        navigate("/"); // Redirect to Homepage as requested!
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    }, 1500);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success("Welcome back! Login successful.");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Invalid credentials.");
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleWhatsAppAuth = () => {
    toast.error("WhatsApp Authentication is currently in beta. Please use Google or Email to sign in!");
  };

  // GSAP Animations on Mount
  useEffect(() => {
    gsap.fromTo(
      formCardRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }
    );

    if (bgBlobsRef.current) {
      const blobs = bgBlobsRef.current.children;
      gsap.to(blobs[0], { x: 30, y: -45, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(blobs[1], { x: -45, y: 30, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, []);

  // Trigger GSAP transition when switching between login & register
  useEffect(() => {
    if (inputGroupRef.current) {
      gsap.fromTo(
        inputGroupRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden select-none font-sans">
      
      {/* 1. Floating Background Blobs */}
      <div ref={bgBlobsRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#EC4899]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#3B82F6]/10 blur-[120px]" />
      </div>

      {/* Back button to Home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-900 cursor-pointer transition-colors duration-150 z-30 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </button>

      {/* 2. Unified Auth Card */}
      <div
        ref={formCardRef}
        className="w-full max-w-[940px] h-auto lg:h-[640px] py-6 lg:py-0 bg-gradient-to-br from-[#EC4899] via-[#8B5CF6] to-[#3B82F6] border border-white/20 rounded-[32px] shadow-2xl relative flex flex-col lg:flex-row overflow-hidden z-10"
      >
        
        {/* Panel A: Inputs Form (Slides right in login mode, slides left in register mode) */}
        <div 
          className={`w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative transition-transform duration-700 ease-in-out z-10 ${
            isLogin ? "lg:translate-x-full" : "lg:translate-x-0"
          }`}
        >
          
          <div className="flex items-center gap-2 mb-2 text-white/90">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Creator Hub Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mb-6 tracking-tight uppercase leading-tight text-white !text-white">
            {isLogin ? "Welcome Back, Creator!" : regStage === 'otp' ? "Verify OTP code!" : "Start Your Journey!"}
          </h2>

          {/* Switch Tab Trigger for mobile */}
          <p className="text-xs text-white/80 mb-6 lg:hidden font-semibold">
            {isLogin ? "New here? " : "Already have a profile? "}
            <button onClick={toggleAuthMode} className="text-white font-black hover:underline cursor-pointer">
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>

          {/* 3. INPUT FORM RENDER */}
          {isLogin ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div ref={inputGroupRef} className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="relative group">
                  <Mail className="absolute left-4.5 top-[15px] w-4.5 h-4.5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 sm:py-3.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-sans font-semibold"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <Lock className="absolute left-4.5 top-[15px] w-4.5 h-4.5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-2.5 sm:py-3.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-sans font-semibold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[15px] text-white/60 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-white text-[#8B5CF6] hover:bg-white/90 font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all duration-200 text-sm uppercase tracking-wider font-display mt-2"
              >
                Sign In
              </button>

              {/* Connect with divider */}
              <div className="flex items-center gap-4 my-3">
                <div className="flex-1 h-[1px] bg-white/20" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Or connect with</span>
                <div className="flex-1 h-[1px] bg-white/20" />
              </div>

              {/* Quick Auth Pills */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-white/10 border border-white/20 rounded-xl py-3 text-xs font-black text-white hover:bg-white/20 cursor-pointer transition-colors duration-150"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppAuth}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl py-3 text-xs font-black text-emerald-200 hover:bg-emerald-500/30 cursor-pointer transition-colors duration-150"
                >
                  WhatsApp
                </button>
              </div>
            </form>
          ) : regStage === 'details' ? (
            /* ================= REGISTRATION STAGE 1: BASIC DETAILS ================= */
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div ref={inputGroupRef} className="flex flex-col gap-4">
                
                {/* Name Field */}
                <div className="relative group">
                  <User className="absolute left-4.5 top-[15px] w-4.5 h-4.5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 sm:py-3.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-sans font-semibold"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="relative group">
                  <Phone className="absolute left-4.5 top-[15px] w-4.5 h-4.5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 sm:py-3.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-sans font-semibold"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <Mail className="absolute left-4.5 top-[15px] w-4.5 h-4.5 text-white/60 group-focus-within:text-white transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 sm:py-3.5 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all font-sans font-semibold"
                    required
                  />
                </div>

              </div>

              {/* Get OTP Submit Button */}
              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full bg-white text-[#8B5CF6] hover:bg-white/90 font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all duration-200 text-sm uppercase tracking-wider font-display mt-2 flex items-center justify-center gap-2"
              >
                {isSendingOtp ? "Sending Verification Code..." : "Send Verification OTP"}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-[1px] bg-white/20" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Or Register with</span>
                <div className="flex-1 h-[1px] bg-white/20" />
              </div>

              {/* Quick Auth Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2.5 bg-white/10 border border-white/20 rounded-xl py-3.5 text-xs font-black text-white hover:bg-white/20 cursor-pointer transition-colors"
              >
                Sign Up with Google
              </button>
            </form>
          ) : (
            /* ================= REGISTRATION STAGE 2: OTP VERIFICATION ================= */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5 text-left">
              
              <div>
                <p className="text-xs text-white/90 font-semibold mb-1">
                  We've sent a 6-digit verification code to:
                </p>
                <p className="text-sm font-black text-white tracking-wide mb-4">
                  {formData.phone}
                </p>
              </div>

              {/* 6 Digit Input Blocks */}
              <div className="flex justify-between items-center gap-2.5 py-1">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="cm-otp-box w-11 h-13 sm:w-12 sm:h-14 bg-white/10 border border-white/20 focus:border-white rounded-xl text-center font-display font-black text-lg sm:text-xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-white"
                  />
                ))}
              </div>

              {/* Resend OTP actions */}
              <div className="flex justify-between items-center text-xs font-bold text-white/80">
                <span>Didn't get code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timerSeconds > 0}
                  className={`underline cursor-pointer ${timerSeconds > 0 ? "opacity-50 cursor-not-allowed text-white/70" : "text-white font-black"}`}
                >
                  {timerSeconds > 0 ? `Resend code in ${timerSeconds}s` : "Resend OTP code"}
                </button>
              </div>

              {/* Verify OTP Code and Submit Form */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-white text-[#8B5CF6] hover:bg-white/90 font-black py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all duration-200 text-sm uppercase tracking-wider font-display mt-2 flex items-center justify-center gap-2"
              >
                {isVerifying ? "Verifying Mobile..." : "Verify & Complete Registration"}
              </button>

              {/* Return link to Edit basic details */}
              <button
                type="button"
                onClick={() => setRegStage('details')}
                className="text-xs text-white/80 hover:text-white font-bold underline cursor-pointer text-center block w-full mt-2"
              >
                Change Phone or Name
              </button>
            </form>
          )}

        </div>

        {/* Panel B: Sliding Video Panel (Slides left in login mode, slides right in register mode) */}
        <div 
          className={`hidden lg:block w-1/2 transition-transform duration-700 ease-in-out z-20 relative overflow-hidden ${
            isLogin ? "lg:-translate-x-full" : "lg:translate-x-0"
          }`}
        >
          {/* Loop, Muted, AutoPlay video background playing corresponding state vdo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 z-10 pointer-events-none" />
          
          <video
            key={isLogin ? "login" : "register"}
            src={isLogin ? loginVdo : registerVdo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover relative z-0"
          />

          {/* Info Card Content overlaying the video */}
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between items-center text-center">
            
            {/* Header info */}
            <div>
              <h4 className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1 font-sans">
                Chhattisgarh State Initiative
              </h4>
              <h3 className="text-lg font-black uppercase text-white font-display">
                Youth Creator Awards
              </h3>
            </div>

            {/* Switching description */}
            <div className="flex flex-col gap-4 items-center">
              <p className="text-xs text-white/90 max-w-[260px] leading-relaxed font-semibold">
                {isLogin
                  ? "Join thousands of youth creators showcase their digital talents across Chhattisgarh!"
                  : "Secure your entry ticket to the largest state celebration of digital excellence!"}
              </p>
              
              {/* Switching trigger button */}
              <button
                onClick={toggleAuthMode}
                className="px-6 py-2.5 bg-white/20 hover:bg-white text-white hover:text-[#8B5CF6] font-extrabold text-[11px] uppercase tracking-wider rounded-full border border-white/20 hover:border-white cursor-pointer transition-all duration-200 select-none shadow-md backdrop-blur-sm"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
