import React from 'react';
import { FiCheck, FiCpu, FiAward } from 'react-icons/fi';

export default function AboutStory() {
  // Custom animations for the reveal
  const customStyles = `
    @keyframes revealLeft {
      0% { opacity: 0; transform: translateX(-40px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    .animate-reveal-left { animation: revealLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `;

  return (
    <section className="bg-[#FDFDFD] py-10 relative overflow-hidden">
      <style>{customStyles}</style>
      
      {/* 1. DECORATIVE BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#F7F3F0]/40 pointer-events-none" />
      <div 
        className="absolute top-20 right-[-5%] w-80 h-80 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#007074 1px, transparent 1px), linear-gradient(90deg, #007074 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
          
          {/* ========================================= */}
          {/* LEFT: EDITORIAL TEXT CARD                 */}
          {/* ========================================= */}
          <div className="w-full lg:w-[55%] z-20 animate-reveal-left">
            {/* The Framed Card */}
            <div className="bg-white p-10 md:p-16 lg:pr-24 rounded-[2.5rem] rounded-br-[120px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-gray-100 relative">
              
              {/* Brand Accent Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#007074] rounded-b-full shadow-[0_4px_10px_rgba(0,112,116,0.2)]" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-[#007074]" />
                <span className="text-[#007074] text-[10px] font-black tracking-[0.3em] uppercase">
                  Our Genesis
                </span>
              </div>
              
              <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-black text-[#222] leading-[1.1] mb-4 lg:mb-8">
                Where Fashion Meets <br />
                <span className="italic text-[#007074]">Style Intelligence.</span>
              </h2>
              
              <div className="space-y-3 lg:space-y-6 text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                <p>
                  At <span className="text-[#222] font-black">Stylogist.pk</span>, we believe that shopping should be a curated journey rather than a simple transaction. Our mission is to empower the modern individual through a seamless fusion of luxury aesthetics and data-driven personalization.
                </p>
                <p>
                  As a pioneer in fashion technology, we curate editorial collections that transcend seasons. By leveraging <span className="text-[#007074] font-black">Neural Styling Engines</span>, we provide a tailored experience that adapts to your unique aesthetic DNA, ensuring every piece you discover feels like it was made specifically for your life.
                </p>
              </div>

              {/* Mini Feature List */}
              <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#007074]">
                    <FiCpu size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#222]">AI Curation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#007074]">
                    <FiAward size={14} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#222]">Artisan Quality</span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT: COMPOSITE IMAGE GALLERY            */}
          {/* ========================================= */}
          <div className="w-full lg:w-[55%] lg:-ml-20 relative">
            
            {/* Primary Image Frame */}
            <div className="relative rounded-md lg:rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white group">
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
                alt="Stylogist Editorial" 
                className="w-full h-[300px] lg:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Overlapping Floating Detail Image (The Senior Touch) */}
            <div className="absolute -bottom-10 left-0 w-48 h-48 md:w-64  rounded-[2rem] overflow-hidden border-[8px] border-white shadow-2xl z-30 hidden md:block group/small">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                alt="Detail view" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover/small:scale-110"
              />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute top-10 -right-4 bg-[#222] text-white p-6 rounded-md shadow-2xl z-30 animate-bounce transition-all duration-1000 [animation-duration:4s]">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#007074] mb-1">Established</p>
              <p className="sm:text-xl font-serif font-black italic tracking-tighter">2024</p>
              <div className="w-full h-[1px] bg-white/10 my-2" />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Premium  E-Commerce</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}