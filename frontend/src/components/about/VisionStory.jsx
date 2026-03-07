import React from 'react';
import { FiTarget, FiEye, FiZap, FiShield } from 'react-icons/fi';

export default function VisionStory() {
  // Animation utility
  const revealClass = "animate-[revealUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards]";

  return (
    <section className="bg-[#FDFDFD] py-10 lg:pb-8 relative overflow-hidden font-sans border-t border-gray-50">
      {/* 1. DECORATIVE BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#007074]/5 rounded-full blur-[100px] pointer-events-none" />
      <div 
        className="absolute bottom-10 left-10 w-64 h-64 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#007074 1px, transparent 1px), linear-gradient(90deg, #007074 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      ></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* SECTION HEADER */}
        <div className="mb-10 lg:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-[#007074]/10 text-[#007074] ltext-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.3em]">
            Purpose & Direction
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#222] tracking-tight mb-6">
            Mission <span className="italic text-[#007074]">& Vision</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base lg:uppercase lg:tracking-widest leading-relaxed font-medium">
            Redefining the digital frontier of personalized fashion through innovation, integrity, and artisan-grade curation.
          </p>
        </div>

        {/* LAYOUT CONTAINER */}
        <div className="space-y-4 lg:space-y-32">

          {/* ========================================= */}
          {/* MISSION BLOCK (Framed Left, Content Right) */}
          {/* ========================================= */}
          <div className="flex flex-col lg:flex-row items-center gap-7 lg:gap-20">
            
            {/* Image Container with Luxury Frame */}
            <div className="w-full lg:w-1/2 relative group">
              {/* Floating Teal Accent Line */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#007074]/30 rounded-tl-[2rem] z-0" />
              
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                <div className="rounded-[2rem] overflow-hidden bg-[#F7F3F0]">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
                    alt="Stylogist Mission"
                    className="w-full h-[250px] lg:h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
              </div>
              
              {/* Floating Micro Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#222] text-white p-5 rounded-2xl shadow-xl z-20 hidden md:block">
                 <FiZap className="text-[#007074] mb-2" size={20}/>
                 <p className="text-[10px] font-black uppercase tracking-widest">Active <br/>Curation</p>
              </div>
            </div>

            {/* Text Side (Right) */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#007074] shadow-sm">
                    <FiTarget size={20} />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#222]">Our Mission</h3>
                </div>
                
                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                  At <span className="text-[#222] font-black">Stylogist.pk</span>, our mission is to empower every customer with ultimate style confidence. We are dedicated to delivering innovative fashion solutions tailored to your unique aesthetic DNA. 
                </p>
                
                <div className="grid grid-cols-2 gap-4 lg:pt-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[#007074] font-black text-xs uppercase tracking-tighter mb-1">Personalization</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Driven Styling</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-[#007074] font-black text-xs uppercase tracking-tighter mb-1">Excellence</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Artisan Quality</p>
                    </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================= */}
          {/* VISION BLOCK (Content Left, Framed Right) */}
          {/* ========================================= */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Side (Left) - Reversed order for Desktop */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1 text-right lg:text-left">
              <div className="space-y-6">
                <div className="flex items-center justify-start lg:justify-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#007074] shadow-sm order-2 lg:order-1">
                    <FiEye size={20} />
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#222] order-1 lg:order-2">Our Vision</h3>
                </div>
                
                <p className="text-gray-500 text-start  text-sm md:text-base leading-relaxed font-medium">
                  Our vision is to redefine global e-commerce by creating a seamless, transparent, and intensely personalized experience. We envision a future where luxury fashion is accessible and perfectly tailored to individual preferences.
                </p>

                <div className="inline-flex items-center gap-4 py-3 px-6 bg-[#222] rounded-full text-white shadow-xl shadow-black/10">
                   <FiShield className="text-[#007074]"/>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Industry Standard 2026</span>
                </div>
              </div>
            </div>

            {/* Image Container with Luxury Frame (Right) */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 relative group">
              {/* Floating Teal Accent Line */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#007074]/30 rounded-br-[2rem] z-0" />
              
              <div className="relative z-10 bg-white p-2 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                <div className="rounded-[2rem] overflow-hidden bg-[#F7F3F0]">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    alt="Stylogist Vision"
                    className="w-full h-[250px] lg:h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <style jsx="true">{`
        @keyframes revealUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}