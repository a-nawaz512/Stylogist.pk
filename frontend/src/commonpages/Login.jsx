import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { ShieldCheck } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import ComonButton from './ComonButton';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = "";
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) error = "Invalid email";
    if (name === "password" && value.length < 1) error = "Password required";
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate(name, value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || Object.values(errors).some(x => x !== "")) return;
    
    setIsSubmitting(true);
    
    // MERN Production Mock Login
    setTimeout(() => {
      const loginUser = {
        name: "Allah Nawaz",
        email: "nawaz51412@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
        role: "Premium Member",
        joined: "March 2026"
      };
      localStorage.setItem("user", JSON.stringify(loginUser));
      setIsSubmitting(false);
      navigate("/");
    }, 1000);
  };

  return (
    // Strict Screen Lock: Matches Signup exactly
    <div className="h-screen w-full flex items-center justify-center bg-[#F9FAFB] overflow-hidden p-4 sm:p-6">
      
      {/* Scaled Inner Container: Matches Signup exactly */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl h-full max-h-[850px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl sm:rounded-[2.5rem] overflow-hidden">

        {/* --- LEFT SIDE: BRANDING (45%) --- */}
        <div className="hidden lg:flex w-[45%] relative flex-col justify-end p-10 overflow-hidden border-r border-slate-100">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover scale-105"
              alt="Fashion"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#007074] via-[#007074]/70 to-transparent z-10" />

          <div className="relative z-20 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white text-xl font-serif font-black">S</span>
              </div>
              <span className="text-white text-lg font-bold tracking-[0.2em] uppercase">tylogist</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-serif font-black text-white leading-tight">
              Welcome <br /> <span className="text-[#FCD9B8] italic">Back.</span>
            </h1>
            <p className="text-white/90 text-sm font-medium leading-relaxed max-w-xs">
              Log in to access your personalized fashion intelligence and track your orders.
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM (55%) --- */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 xl:px-20 bg-white relative h-full">

          <div className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 opacity-40">
            <ShieldCheck className="text-[#007074]" size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Encrypted</span>
          </div>

          <div className="w-full max-w-md mx-auto">
            
            <header className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1.5">
                Access your Stylogist account
              </p>
            </header>

            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div className="space-y-1 group w-full relative">
                <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 focus-within:border-[#007074] focus-within:bg-white focus-within:shadow-md'}`}>
                  <FiMail className={`${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#007074]'} transition-colors`} size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent ml-3 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                {errors.email && <p className="text-[10px] font-black text-red-500 uppercase ml-1 absolute -bottom-4">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1 group w-full relative pt-2">
                <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 focus-within:border-[#007074] focus-within:bg-white focus-within:shadow-md'}`}>
                  <FiLock className={`${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#007074]'} transition-colors`} size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent ml-3 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#007074]">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-black text-red-500 uppercase ml-1 absolute -bottom-4">{errors.password}</p>}
              </div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-transparent select-none">Spacer</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-[#007074] uppercase tracking-wider hover:underline">
                    Forgot Password?
                  </Link>
                </div>

              {/* Added top margin to account for absolute error text if needed, maintaining identical button spacing to signup */}
              <div className="pt-2">
                 <ComonButton
                   btntitle={isSubmitting ? "Authenticating..." : "Sign In"}
                   padding="py-3.5"
                   icon={<FiArrowRight />}
                   disabled={isSubmitting}
                 />
              </div>
            </form>

            {/* OR DIVIDER & SOCIAL LOGIN */}
            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-5">
                <div className="w-full border-t border-slate-200"></div>
                <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Sign In With</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <SocialBtn img="https://cdn-icons-png.flaticon.com/512/300/300221.png" label="Google" />
                <SocialBtn img="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" label="Facebook" />
                <SocialBtn img="https://cdn-icons-png.flaticon.com/512/0/747.png" label="Apple" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/signup" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-[#007074] transition-colors">
                New to Stylogist? <span className="text-[#007074] underline underline-offset-4 font-black ml-1">Create Account</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// High Contrast Social Buttons (Identical to Signup)
const SocialBtn = ({ img, label }) => (
  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-2 bg-white border border-slate-200 rounded-xl hover:border-[#007074] hover:bg-teal-50/30 transition-all duration-300 active:scale-95 group">
    <img src={img} className="w-4 h-4 object-contain" alt={label} />
    <span className="hidden sm:inline-block text-[10px] font-bold text-slate-600 uppercase tracking-wider group-hover:text-[#007074]">{label}</span>
  </button>
);