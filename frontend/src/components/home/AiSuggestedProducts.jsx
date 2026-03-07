import React, { useState } from 'react';
import { FiCpu, FiPlus, FiArrowRight, FiCheckCircle, FiShield, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AiSuggestedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // A complete curated 'Regime' or 'Look'
  const curatedLook = {
    mainPiece: {
      id: 401,
      name: "Midnight Silk Slip Dress",
      brand: "Stylogist Couture",
      price: 14500,
      match: 98,
      reason: "Matches your affinity for fluid silhouettes.",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
    },
    accessories: [
      {
        id: 402,
        name: "Matte Onyx Timepiece",
        brand: "Nordic Time",
        price: 12999,
        match: 94,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1976&auto=format&fit=crop",
      },
      {
        id: 403,
        name: "Radiance Vitamin C Serum",
        brand: "Glow Botanica",
        price: 3200,
        match: 91,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop",
      }
    ]
  };

  return (
    <section className="w-full bg-[#FDFDFD] py-10 overflow-hidden relative">
      {/* AI Pulse Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#007074]/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
            <FiZap className="animate-pulse" /> Neural Style Pairing
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif font-black text-[#222] tracking-tight">
            AI Style <span className="italic text-[#007074]">Analysis</span>
          </h2>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 md:gap-8 items-stretch">
          
          {/* LEFT: AI PROFILE CONSOLE */}
          <div className="lg:col-span-4 bg-[#222] lg:rounded-[2.5rem] p-8 md:p-10 flex flex-col relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#007074]/30 rounded-full blur-[80px] animate-pulse"></div>

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-4 mb-10">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <span className="absolute h-full w-full rounded-2xl bg-[#007074]/30 animate-ping"></span>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#007074] to-teal-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiCpu size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-black tracking-[0.1em] uppercase text-xs">Stylogist Engine</h3>
                  <p className="text-[#007074] text-[10px] font-mono font-bold animate-pulse">SYSTEM STATUS: ACTIVE</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Detected Persona</p>
                  <p className="text-2xl text-white font-serif font-black italic">Minimalist Elegance</p>
                </div>

                <div className="space-y-6">
                  {/* Progress Bar 1 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Palette Match</span>
                      <span className="text-[#007074]">92%</span>
                    </div>
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#007074] to-teal-400 w-[92%] shadow-[0_0_10px_#007074]"></div>
                    </div>
                  </div>
                  {/* Progress Bar 2 */}
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      <span>Silhouette Fit</span>
                      <span className="text-[#007074]">88%</span>
                    </div>
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#007074] to-teal-400 w-[88%] shadow-[0_0_10px_#007074]"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                  <p className="text-gray-400 text-xs leading-relaxed italic font-medium">
                    "Analyzing your affinity for monochromatic tones and fluid structures. Neural pairing complete for this evening ensemble."
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-10 w-full bg-transparent border border-white/10 text-white hover:bg-white hover:text-[#222] py-4 rounded-full transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] z-10">
              Refine Neural Profile
            </button>
          </div>

          {/* RIGHT: BENTO GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* MAIN ANCHOR PIECE */}
            <div 
              className="relative rounded-[2.5rem] overflow-hidden group h-full md:row-span-2 shadow-xl border border-white p-2 bg-white"
              onMouseEnter={() => setHoveredProduct(curatedLook.mainPiece.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="w-full h-full lg:rounded-[2rem] overflow-hidden relative">
                <img 
                  src={curatedLook.mainPiece.image} 
                  alt={curatedLook.mainPiece.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#007074] text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <FiCheckCircle size={10}/> {curatedLook.mainPiece.match}% Neural Match
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif font-black leading-tight mb-2">{curatedLook.mainPiece.name}</h3>
                  <p className="text-[#007074] text-xl font-black mb-6">Rs. {curatedLook.mainPiece.price.toLocaleString()}</p>
                  
                  <button className="w-full bg-white text-[#222] py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#007074] hover:text-white transition-all duration-500 shadow-xl">
                    <FiPlus size={16}/> Add Anchor Piece
                  </button>
                </div>
              </div>
            </div>

            {/* ACCESSORIES GRID */}
            <div className="flex flex-col gap-6">
              {curatedLook.accessories.map((item, idx) => (
                <div 
                  key={item.id}
                  className="relative rounded-[2rem] overflow-hidden group h-[260px] shadow-lg border border-white p-2 bg-white"
                >
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[#007074] text-[10px] font-black uppercase tracking-widest mb-1">{item.match}% Match</p>
                          <h4 className="text-white text-sm font-bold truncate">{item.name}</h4>
                        </div>
                        <button className="bg-white p-2.5 rounded-full hover:bg-[#007074] hover:text-white transition-all shadow-xl">
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}