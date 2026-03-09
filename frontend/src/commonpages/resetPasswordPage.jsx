import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { ShieldCheck } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import ComonButton from './ComonButton';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Real-time Validation Engine
  const validate = (name, value) => {
    let error = "";
    if (name === "password" && value.length < 8) error = "Min 8 characters required";
    if (name === "confirmPassword" && value !== formData.password) error = "Passwords do not match";
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
    
    // Cross-validate confirm password if primary password changes
    if (name === "password" && formData.confirmPassword) {
       if (value !== formData.confirmPassword) {
         setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
       } else {
         setErrors(prev => ({ ...prev, confirmPassword: "" }));
       }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword || Object.values(errors).some(x => x !== "")) return;
    
    setIsSubmitting(true);
    
    // MERN Production Mock - Password Update
    console.log("Dispatching new password to backend...");
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/login"); // Redirect to login upon success
    }, 1500);
  };

  return (
    // Strict Screen Lock: Matches Login/Signup exactly
    <div className="h-screen w-full flex items-center justify-center bg-[#F9FAFB] overflow-hidden p-4 sm:p-6 font-sans">
      
      {/* Scaled Inner Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl h-full max-h-[850px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl sm:rounded-[2.5rem] overflow-hidden">

        {/* --- LEFT SIDE: BRANDING (45%) --- */}
        <div className="hidden lg:flex w-[45%] relative flex-col justify-end p-10 overflow-hidden border-r border-slate-100">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover scale-105"
              alt="Fashion Wardrobe"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#007074] via-[#007074]/80 to-transparent z-10" />

          <div className="relative z-20 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white text-xl font-serif font-black">S</span>
              </div>
              <span className="text-white text-lg font-bold tracking-[0.2em] uppercase">tylogist</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-serif font-black text-white leading-tight">
              Secure Your <br /> <span className="text-[#FCD9B8] italic">Access.</span>
            </h1>
            <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs">
              Update your credentials to regain access to your exclusive boutique dashboard.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM (55%) --- */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 xl:px-20 bg-white relative h-full">

          <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 opacity-40">
            <ShieldCheck className="text-[#007074]" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Encrypted Setup</span>
          </div>

          <div className="w-full max-w-md mx-auto">
            
            <header className="mb-8 text-center lg:text-left">
              <div className="w-12 h-12 bg-teal-50 text-[#007074] rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-inner">
                 <FiLock size={22} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create New Key</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1.5 leading-relaxed">
                Your new password must be uniquely identifiable.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* New Password */}
              <div className="space-y-1 group w-full relative">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 focus-within:border-[#007074] focus-within:bg-white focus-within:shadow-md'}`}>
                  <FiLock className={`${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#007074]'} transition-colors`} size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent ml-3 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#007074] ml-2">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-black text-red-500 uppercase ml-1 absolute -bottom-4">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 group w-full relative pt-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Identity</label>
                <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-200 focus-within:border-[#007074] focus-within:bg-white focus-within:shadow-md'}`}>
                  <FiLock className={`${errors.confirmPassword ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#007074]'} transition-colors`} size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent ml-3 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                  />
                  {/* Dynamic Success Checkmark */}
                  {!errors.confirmPassword && formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && (
                     <FiCheckCircle className="text-emerald-500 ml-2" size={16} />
                  )}
                </div>
                {errors.confirmPassword && <p className="text-[10px] font-black text-red-500 uppercase ml-1 absolute -bottom-4">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-4">
                 <ComonButton
                   btntitle={isSubmitting ? "Encrypting..." : "Update Security Key"}
                   padding="py-3.5"
                   icon={<FiArrowRight />}
                   disabled={isSubmitting || !formData.password || !formData.confirmPassword || Object.keys(errors).some(k => errors[k] !== "")}
                 />
              </div>
            </form>

            {/* Back Navigation */}
            <div className="mb-2 text-center border-t border-slate-100 pt-6">
              <Link to="/login" className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-900 transition-colors group">
                 <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}