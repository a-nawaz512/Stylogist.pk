import React from 'react';
import { FiMail, FiZap, FiArrowRight } from 'react-icons/fi';

export default function NewsletterBanner() {
  const customStyles = `
    @keyframes shimmer { 100% { transform: translateX(100%); } }
    .animate-shimmer { position: relative; overflow: hidden; }
    .animate-shimmer::after {
      content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: shimmer 2s infinite;
    }
  `;

  return (
    <section className="w-full px-6 py-3 bg-[#FDFDFD] font-sans relative overflow-hidden">
      <style>{customStyles}</style>

      {/* Decorative Branding Background */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 text-[10vw] font-serif font-black text-gray-50 pointer-events-none select-none uppercase tracking-tighter opacity-50">
        Newsletter
      </div>

      <div className="max-w-6xl mx-auto bg-[#222] rounded-[3rem] p-10  flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/5">
        
        {/* Cinematic Glowing Background Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#007074] opacity-20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[#007074] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

        {/* LEFT: EDITORIAL TYPOGRAPHY */}
        <div className="w-full lg:w-[55%] relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 text-[#007074] text-[9px] font-black tracking-[0.3em] uppercase mb-6 border border-white/10">
            <FiZap className="animate-pulse" /> Insider Access
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
            Stay ahead of <br />
            <span className="italic text-[#007074]">The Curve.</span>
          </h2>
          <p className="text-gray-400 mt-3 md:mt-8 text-[10px] lg:text-sm md:text-base leading-relaxed uppercase tracking-widest font-medium max-w-md mx-auto lg:mx-0">
            Join the Stylogist collective for early access to neural drops and exclusive editorial offers.
          </p>
        </div>

        {/* RIGHT: PREMIUM INTERACTIVE FORM */}
        <div className="w-full lg:w-[40%] flex flex-col gap-5 relative z-10">
          
          {/* Email Input - Glass Style */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#007074] rounded-full blur-md opacity-0 group-focus-within:opacity-20 transition-opacity duration-500" />
            <div className="relative">
              <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#007074] transition-colors duration-300" size={20} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-white/5 border border-white/10 text-white text-[11px] font-black tracking-[0.2em] placeholder-gray-500 py-3 lg:py-5 pl-16 pr-6 rounded-full outline-none focus:bg-white/10 focus:border-[#007074]/50 transition-all shadow-2xl"
              />
            </div>
          </div>

          {/* Subscribe Button - Stylogist Teal Shimmer */}
          <button className="animate-shimmer group w-full bg-[#007074] text-white font-black text-[8px] lg:text-[11px] uppercase tracking-[0.3em] py-3 lg:py-5 px-8 rounded-full transition-all duration-500 shadow-[0_15px_30px_rgba(0,112,116,0.3)] hover:shadow-[0_20px_40px_rgba(0,112,116,0.5)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
            Join The Collective
            <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" size={16} />
          </button>
          
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest text-center">
            By subscribing, you agree to our <span className="text-white border-b border-gray-700 cursor-pointer">Privacy Policy</span>
          </p>
        </div>

      </div>
    </section>
  );
}