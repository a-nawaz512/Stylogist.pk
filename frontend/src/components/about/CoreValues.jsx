import React from 'react';
import { FiCpu, FiFeather, FiGlobe, FiShield, FiArrowUpRight } from 'react-icons/fi';

export default function CoreValues() {
  const values = [
    {
      id: 1,
      icon: <FiCpu size={24} />,
      title: "Neural Curation",
      description: "Our proprietary algorithm analyzes your unique aesthetic DNA to curate a wardrobe that evolves with your lifestyle."
    },
    {
      id: 2,
      icon: <FiFeather size={24} />,
      title: "Artisan Quality",
      description: "We partner exclusively with top-tier global craftsmen to ensure every fabric and stitch meet luxury standards."
    },
    {
      id: 3,
      icon: <FiGlobe size={24} />,
      title: "Conscious Ethos",
      description: "Luxury with a soul. We prioritize eco-friendly materials and ethical manufacturing for a sustainable future."
    },
    {
      id: 4,
      icon: <FiShield size={24} />,
      title: "Seamless Security",
      description: "Experience total peace of mind with 256-bit encrypted checkouts and dedicated premium concierge support."
    }
  ];

  return (
    <section className="bg-[#FDFDFD] py-10 relative overflow-hidden border-t border-gray-100">
      {/* Subtle Background Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-serif font-black text-gray-50/50 pointer-events-none select-none uppercase tracking-tighter">
        Stylogist
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto lg:mb-20">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-[#007074]"></div>
            <span className="text-[#007074] text-[10px] font-black tracking-[0.3em] uppercase">The Stylogist Pillars</span>
            <div className="w-10 h-[1px] bg-[#007074]"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#222] tracking-tight mb-6">
            Our Core <span className="italic text-[#007074]">Philosophy</span>
          </h2>
          <p className="text-gray-400 text-xs font-bold lg:uppercase lg:tracking-widest leading-relaxed">
            The fundamental principles that define our commitment to excellence.
          </p>
        </div>

        {/* Values Grid - Refined & Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {values.map((value, index) => (
            <div 
              key={value.id} 
              className="group relative bg-white p-10 lg:rounded-[2.5rem] border border-gray-100 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Animated Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50/50 rounded-bl-[2.5rem] translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-center pt-2 pr-2">
                <FiArrowUpRight className="text-[#007074] opacity-0 group-hover:opacity-100 transition-opacity" size={16}/>
              </div>

              {/* Icon Container - Floating Glass Style */}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-50 text-[#222] mb-8 group-hover:bg-[#007074] group-hover:text-white group-hover:shadow-[0_10px_20px_rgba(0,112,116,0.2)] transition-all duration-500">
                {value.icon}
              </div>
              
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#222] mb-4">
                {value.title}
              </h3>
              
              <p className="text-gray-500 text-xs leading-relaxed font-medium">
                {value.description}
              </p>

              {/* Bottom Decoration Bar */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#007074] transition-all duration-500 group-hover:w-1/3 rounded-t-full" />
            </div>
          ))}
        </div>

      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}