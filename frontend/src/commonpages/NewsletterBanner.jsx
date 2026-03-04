import React from 'react';
import { FiMail } from 'react-icons/fi';

export default function NewsletterBanner() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-white font-sans">
      <div className="max-w-7xl mx-auto bg-[#222222] rounded-md p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
        
        {/* ========================================= */}
        {/* BACKGROUND DECORATIONS                    */}
        {/* ========================================= */}
        {/* Subtle Teal glowing orb in the background to make the black card less flat */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#007074] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#007074] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>

        {/* ========================================= */}
        {/* LEFT: HUGE TYPOGRAPHY                     */}
        {/* ========================================= */}
        <div className="w-full md:w-[55%] relative z-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tighter uppercase">
            Stay Upto Date About <br className="hidden lg:block" /> Our Latest Offers
          </h2>
        </div>

        {/* ========================================= */}
        {/* RIGHT: FORM INPUTS                        */}
        {/* ========================================= */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col gap-4 relative z-10">
          
          {/* Email Input */}
          <div className="relative group">
            <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007074] transition-colors duration-300" size={22} />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-white text-[#222222] text-sm md:text-base font-medium placeholder-gray-400 py-4 md:py-4 pl-16 pr-6 rounded-full outline-none focus:ring-4 focus:ring-[#007074]/30 border-2 border-transparent focus:border-[#007074] transition-all shadow-inner"
            />
          </div>

          {/* Subscribe Button */}
          <button className="w-full bg-white text-[#222222] hover:bg-[#007074] hover:text-white font-bold text-sm md:text-base uppercase tracking-widest py-4 md:py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#007074]/40 active:scale-[0.98] border-2 border-transparent">
            Subscribe to Newsletter
          </button>
          
        </div>

      </div>
    </section>
  );
}