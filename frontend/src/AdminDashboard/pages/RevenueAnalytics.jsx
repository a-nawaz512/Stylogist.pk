import React, { useState } from 'react';
import { 
  FiTrendingUp, FiArrowUpRight, FiArrowDownRight, 
  FiPieChart, FiMoreHorizontal, FiShoppingBag, FiBox, FiActivity
} from 'react-icons/fi';

export default function RevenueAnalytics() {
  const [timeframe, setTimeframe] = useState('30D');

  // SVG Area Chart Data (Stylogist Revenue - PKR)
  const areaPoints = [
    { x: 0, y: 80, label: 'Jan', value: 'Rs. 420K' },
    { x: 16.6, y: 50, label: 'Feb', value: 'Rs. 680K' },
    { x: 33.3, y: 70, label: 'Mar', value: 'Rs. 510K' },
    { x: 50, y: 30, label: 'Apr', value: 'Rs. 890K' },
    { x: 66.6, y: 45, label: 'May', value: 'Rs. 750K' },
    { x: 83.3, y: 20, label: 'Jun', value: 'Rs. 1.2M' },
    { x: 100, y: 10, label: 'Jul', value: 'Rs. 1.4M' },
  ];

  const barData = [
    { day: 'Mon', orders: 124, height: '60%' },
    { day: 'Tue', orders: 145, height: '75%' },
    { day: 'Wed', orders: 98, height: '40%' },
    { day: 'Thu', orders: 210, height: '100%' },
    { day: 'Fri', orders: 180, height: '85%' },
    { day: 'Sat', orders: 155, height: '70%' },
    { day: 'Sun', orders: 190, height: '90%' },
  ];

  const customStyles = `
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes revealRight {
      0% { clip-path: inset(0 100% 0 0); opacity: 0.5; }
      100% { clip-path: inset(0 0 0 0); opacity: 1; }
    }
    @keyframes barGrowUp {
      0% { transform: scaleY(0); opacity: 0; }
      100% { transform: scaleY(1); opacity: 1; }
    }
    @keyframes barGrowRight {
      0% { transform: scaleX(0); opacity: 0; }
      100% { transform: scaleX(1); opacity: 1; }
    }
    @keyframes spinIn {
      0% { transform: rotate(-90deg) scale(0.8); opacity: 0; }
      100% { transform: rotate(0deg) scale(1); opacity: 1; }
    }
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    .animate-cascade { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-reveal { animation: revealRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-spin-in { opacity: 0; animation: spinIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .origin-bottom { transform-origin: bottom; }
    .origin-left { transform-origin: left; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #007074; border-radius: 10px; }
  `;

  return (
    <div className="space-y-6 md:space-y-8 pb-10 px-2 md:px-0 bg-white min-h-screen">
      <style>{customStyles}</style>

      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-cascade" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#222222] tracking-tight uppercase">Financial Intelligence</h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Comprehensive Store Analytics
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
           {['7D', '30D', '3M', '1Y'].map(tf => (
             <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  timeframe === tf 
                  ? 'bg-[#007074] text-white shadow-lg scale-105' 
                  : 'text-slate-400 hover:text-[#222222] hover:bg-white'
                }`}
             >
                {tf}
             </button>
           ))}
        </div>
      </div>

      {/* 2. METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="animate-cascade" style={{ animationDelay: '100ms' }}>
           <MetricCard title="Gross Revenue" value="Rs. 1.42M" growth="+14.5%" isUp={true} icon={<FiTrendingUp />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '200ms' }}>
           <MetricCard title="Total Orders" value="3,248" growth="+12.2%" isUp={true} icon={<FiShoppingBag />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '300ms' }}>
           <MetricCard title="Net Profit" value="Rs. 480K" growth="+8.2%" isUp={true} icon={<FiActivity />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '400ms' }}>
           <MetricCard title="Return Rate" value="2.4%" growth="-1.1%" isUp={false} icon={<FiBox />} inverseColors />
        </div>
      </div>

      {/* 3. CHARTS TIER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* AREA CHART */}
        <div className="lg:col-span-2 bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-xl relative overflow-hidden group animate-cascade" style={{ animationDelay: '500ms' }}>
           <ChartHeader title="Revenue Flow" subtitle="Trailing 6 Months" icon={<FiTrendingUp />} />
           
           <div className="relative w-full h-56 md:h-72 mt-8">
              <svg className="absolute inset-0 w-full h-full overflow-visible animate-reveal" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007074" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#007074" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 C8,80 8,50 16.6,50 C25,50 25,70 33.3,70 C41,70 41,30 50,30 C58,30 58,45 66.6,45 C75,45 75,20 83.3,20 C91,20 95,10 100,10 L100,100 L0,100 Z" fill="url(#chartGradient)" />
                <path d="M0,80 C8,80 8,50 16.6,50 C25,50 25,70 33.3,70 C41,70 41,30 50,30 C58,30 58,45 66.6,45 C75,45 75,20 83.3,20 C91,20 95,10 100,10" fill="none" stroke="#007074" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="absolute bottom-0 w-full flex justify-between text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest translate-y-6">
                {areaPoints.map((pt, i) => <span key={i}>{pt.label}</span>)}
              </div>
           </div>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-xl animate-cascade" style={{ animationDelay: '600ms' }}>
           <ChartHeader title="Market Share" subtitle="Category Split" icon={<FiPieChart />} />
           <div className="relative w-full aspect-square mt-6 flex items-center justify-center">
              <div className="absolute flex flex-col items-center justify-center text-center z-10">
                 <span className="text-2xl md:text-3xl font-black text-[#222222]">8.4k</span>
                 <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">Items</span>
              </div>
              <div className="w-full h-full animate-spin-in drop-shadow-2xl">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                   <circle strokeDasharray="45 100" strokeDashoffset="0" cx="18" cy="18" r="15.915" fill="transparent" stroke="#007074" strokeWidth="4" />
                   <circle strokeDasharray="30 100" strokeDashoffset="-45" cx="18" cy="18" r="15.915" fill="transparent" stroke="#14b8a6" strokeWidth="4" />
                   <circle strokeDasharray="25 100" strokeDashoffset="-75" cx="18" cy="18" r="15.915" fill="transparent" stroke="#222222" strokeWidth="4" />
                </svg>
              </div>
           </div>
           <div className="mt-8 space-y-2">
              <LegendRow color="bg-[#007074]" label="Women's" value="45%" delay="700ms" />
              <LegendRow color="bg-teal-400" label="Accessories" value="30%" delay="800ms" />
              <LegendRow color="bg-[#222222]" label="Men's" value="25%" delay="900ms" />
           </div>
        </div>
      </div>

      {/* 4. LOGISTICS & LEADERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
         <div className="lg:col-span-2 bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-xl animate-cascade" style={{ animationDelay: '700ms' }}>
            <ChartHeader title="Order Logistics" subtitle="Daily Volume" icon={<FiBox />} />
            <div className="h-48 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 mt-8 pt-4 border-b border-slate-100 relative">
               {barData.map((data, i) => (
                 <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                    <div className="w-full max-w-[32px] bg-gradient-to-t from-teal-50 to-[#007074] rounded-t-xl origin-bottom" 
                      style={{ 
                        height: data.height,
                        animation: `barGrowUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                        animationDelay: `${900 + (i * 100)}ms` 
                      }} 
                    />
                    <span className="absolute -bottom-8 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{data.day}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-xl animate-cascade" style={{ animationDelay: '800ms' }}>
            <ChartHeader title="Top Sellers" subtitle="Volume Leaders" />
            <div className="space-y-6 mt-6">
               {[
                 { name: "Silk Satin Dress", revenue: "Rs. 1.8M", percent: 90, color: "from-[#007074] to-teal-400" },
                 { name: "Onyx Watch", revenue: "Rs. 2.4M", percent: 75, color: "from-[#222222] to-slate-600" },
                 { name: "Velvet Wrap", revenue: "Rs. 0.9M", percent: 55, color: "from-rose-500 to-rose-400" },
               ].map((item, i) => (
                 <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[11px] md:text-xs font-bold text-[#222222]">{item.name}</p>
                       <p className="text-[10px] md:text-[11px] font-black text-[#222222] tracking-tighter">{item.revenue}</p>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-slate-50 rounded-full overflow-hidden relative">
                      <div className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full origin-left`} 
                        style={{ 
                          width: `${item.percent}%`,
                          animation: `barGrowRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                          animationDelay: `${1000 + (i * 150)}ms`
                        }} 
                      />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, growth, isUp, icon, inverseColors }) {
  return (
    <div className={`p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden cursor-pointer transform hover:-translate-y-1 ${
      inverseColors ? 'bg-[#222222] border-[#222222] text-white shadow-2xl' : 'bg-white border-slate-100 shadow-lg hover:shadow-2xl hover:border-teal-200'
    }`}>
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-[shine_1s_ease-in-out]" />
      <div className="relative z-10">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-400">{title}</p>
        <h2 className={`text-lg font-semibold  mb-4 ${inverseColors ? 'text-white' : 'text-[#222222]'}`}>{value}</h2>
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-black transition-all ${
            isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isUp ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />} {growth}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartHeader({ title, subtitle, icon }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#007074]">{icon}</div>}
        <div>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-[#222222]">{title}</h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-[#007074] transition-colors"><FiMoreHorizontal size={18} /></button>
    </div>
  );
}

function LegendRow({ color, label, value, delay }) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors animate-cascade" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${color}`} />
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
      </div>
      <span className="text-xs md:text-sm font-bold text-[#222222]">{value}</span>
    </div>
  );
}