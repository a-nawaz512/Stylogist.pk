import React from 'react';
import { FiSearch, FiBell, FiMoon, FiGlobe, FiChevronDown } from 'react-icons/fi';

export default function AdminNavbar() {
  // We can pull this from localStorage later
  const adminName = "Allah Nawaz";

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 relative z-40">
      
      {/* 1. SMART SEARCH BAR */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007074] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products, orders, or customers..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-[#007074]/5 focus:bg-white transition-all"
          />
          {/* Keyboard Shortcut Hint */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
             <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 shadow-sm">CTRL</kbd>
             <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-400 shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      {/* 2. SYSTEM ACTIONS & PROFILE */}
      <div className="flex items-center gap-4 lg:gap-8">
        
        {/* Quick Links */}
        <div className="hidden md:flex items-center gap-2 border-r border-slate-100 pr-8">
           <button title="View Live Site" className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#007074] transition-all">
              <FiGlobe size={20} />
           </button>
           <button title="Dark Mode" className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#007074] transition-all">
              <FiMoon size={20} />
           </button>
           
           {/* Notification Badge */}
           <button className="relative p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-[#007074] transition-all">
              <FiBell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
           </button>
        </div>

        {/* Admin Profile Display */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Super Admin</p>
              <p className="text-xs font-bold text-slate-900">{adminName}</p>
           </div>
           <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#007074] flex items-center justify-center text-white font-black shadow-lg shadow-[#007074]/20 group-hover:scale-105 transition-transform">
                {adminName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
           </div>
           <FiChevronDown className="text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>

      </div>
    </header>
  );
}