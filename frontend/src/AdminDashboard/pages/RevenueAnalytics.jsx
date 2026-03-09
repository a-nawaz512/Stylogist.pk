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

  // Bar Chart Data (Weekly Logistics & COD Dispatches)
  const barData = [
    { day: 'Mon', orders: 124, height: '60%' },
    { day: 'Tue', orders: 145, height: '75%' },
    { day: 'Wed', orders: 98, height: '40%' },
    { day: 'Thu', orders: 210, height: '100%' },
    { day: 'Fri', orders: 180, height: '85%' },
    { day: 'Sat', orders: 155, height: '70%' },
    { day: 'Sun', orders: 190, height: '90%' },
  ];

  // --- PRODUCTION-LEVEL CSS ANIMATIONS ---
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
  `;

  return (
    <div className="space-y-8 pb-10">
      <style>{customStyles}</style>

      {/* 1. HEADER & CONTROLS (0ms delay) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-cascade" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Intelligence</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] text-[10px] mt-1">
            Comprehensive Store Analytics
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
           {['7D', '30D', '3M', '1Y'].map(tf => (
             <button 
               key={tf}
               onClick={() => setTimeframe(tf)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                 timeframe === tf 
                 ? 'bg-[#007074] text-white shadow-[0_5px_15px_rgba(0,112,116,0.3)] scale-105' 
                 : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
               }`}
             >
               {tf}
             </button>
           ))}
        </div>
      </div>

      {/* 2. TIER 1: EXPANDED METRICS GRID (Staggered 100ms - 400ms) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="animate-cascade" style={{ animationDelay: '100ms' }}>
           <MetricCard title="Gross Revenue" value="Rs. 1.42M" growth="+14.5%" isUp={true} icon={<FiTrendingUp />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '200ms' }}>
           <MetricCard title="Total Orders" value="3,248" growth="+12.2%" isUp={true} icon={<FiShoppingBag />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '300ms' }}>
           <MetricCard title="Net Profit (Est)" value="Rs. 480K" growth="+8.2%" isUp={true} icon={<FiActivity />} />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '400ms' }}>
           <MetricCard title="Return Rate" value="2.4%" growth="-1.1%" isUp={false} icon={<FiBox />} inverseColors />
        </div>
      </div>

      {/* 3. TIER 2: MACRO VIEW (Area Chart + Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* SVG AREA CHART (Revenue) - Delay 500ms */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group animate-cascade hover:shadow-[0_30px_60px_-20px_rgba(0,112,116,0.1)] transition-all duration-500" style={{ animationDelay: '500ms' }}>
           <ChartHeader title="Revenue Flow" subtitle="Trailing 6 Months" icon={<FiTrendingUp />} />
           
           <div className="relative w-full h-72 mt-8">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full h-[1px] bg-slate-100/50 border-b border-dashed border-slate-200" />
                ))}
              </div>

              {/* SVG Area with Reveal Animation */}
              <svg className="absolute inset-0 w-full h-full overflow-visible animate-reveal" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007074" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#007074" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 C8,80 8,50 16.6,50 C25,50 25,70 33.3,70 C41,70 41,30 50,30 C58,30 58,45 66.6,45 C75,45 75,20 83.3,20 C91,20 95,10 100,10 L100,100 L0,100 Z" 
                  fill="url(#chartGradient)" 
                />
                <path 
                  d="M0,80 C8,80 8,50 16.6,50 C25,50 25,70 33.3,70 C41,70 41,30 50,30 C58,30 58,45 66.6,45 C75,45 75,20 83.3,20 C91,20 95,10 100,10" 
                  fill="none" stroke="#007074" strokeWidth="3" strokeLinecap="round"
                  className="drop-shadow-[0_8px_12px_rgba(0,112,116,0.4)]"
                />
                {/* Data Points */}
                {areaPoints.map((pt, i) => (
                  <circle 
                    key={i} cx={`${pt.x}`} cy={`${pt.y}`} r="2" 
                    className="fill-white stroke-[#007074] stroke-[1.5px] transition-all duration-300 hover:r-4 hover:stroke-[2px]" 
                  />
                ))}
              </svg>

              {/* Tooltips & X-Axis */}
              {areaPoints.map((pt, i) => (
                <div key={`tt-${i}`} className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 group/tt cursor-pointer flex justify-center animate-cascade" style={{ left: `${pt.x}%`, top: `${pt.y}%`, animationDelay: `${600 + (i*100)}ms` }}>
                  <div className="opacity-0 group-hover/tt:opacity-100 absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 translate-y-2 group-hover/tt:translate-y-0 shadow-xl z-20">
                    {pt.value}
                  </div>
                </div>
              ))}
              <div className="absolute bottom-0 w-full flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest translate-y-6">
                {areaPoints.map((pt, i) => <span key={`label-${i}`}>{pt.label}</span>)}
              </div>
           </div>
        </div>

        {/* CSS DONUT CHART (Market Share) - Delay 600ms */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] animate-cascade hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500" style={{ animationDelay: '600ms' }}>
           <ChartHeader title="Market Share" subtitle="Sales by Category" icon={<FiPieChart />} />
           
           <div className="relative w-full aspect-square mt-6 flex items-center justify-center">
              {/* Center Text */}
              <div className="absolute flex flex-col items-center justify-center text-center z-10">
                 <span className="text-3xl font-serif font-black text-slate-900">8.4k</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Items</span>
              </div>
              
              {/* SVG Donut with Spin-In Animation */}
              <div className="w-full h-full animate-spin-in drop-shadow-2xl" style={{ animationDelay: '800ms' }}>
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                   {/* Women's Fashion (45%) */}
                   <circle strokeDasharray="45 100" strokeDashoffset="0" cx="18" cy="18" r="15.915" fill="transparent" stroke="#007074" strokeWidth="4" className="hover:stroke-[5px] transition-all duration-300 cursor-pointer" />
                   {/* Accessories (30%) */}
                   <circle strokeDasharray="30 100" strokeDashoffset="-45" cx="18" cy="18" r="15.915" fill="transparent" stroke="#14b8a6" strokeWidth="4" className="hover:stroke-[5px] transition-all duration-300 cursor-pointer" />
                   {/* Men's Collection (25%) */}
                   <circle strokeDasharray="25 100" strokeDashoffset="-75" cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="4" className="hover:stroke-[5px] transition-all duration-300 cursor-pointer" />
                </svg>
              </div>
           </div>

           {/* Legend */}
           <div className="mt-8 space-y-3">
              <LegendRow color="bg-[#007074]" label="Women's Fashion" value="45%" delay="700ms" />
              <LegendRow color="bg-teal-400" label="Accessories" value="30%" delay="800ms" />
              <LegendRow color="bg-slate-800" label="Men's Collection" value="25%" delay="900ms" />
           </div>
        </div>
      </div>

      {/* 4. TIER 3: MICRO VIEW (Bar Chart + Volume Leaders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         
         {/* BAR CHART (Order Logistics) - Delay 700ms */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] animate-cascade hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500" style={{ animationDelay: '700ms' }}>
            <ChartHeader title="Order Logistics" subtitle="Daily Dispatch Volume" icon={<FiBox />} />
            
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 mt-8 pt-4 border-b border-slate-100 relative">
               {/* Y-Axis Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pb-2 pointer-events-none">
                  {[1, 2, 3].map(i => <div key={i} className="w-full h-[1px] border-b border-dashed border-slate-100" />)}
               </div>

               {barData.map((data, i) => (
                 <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-300 shadow-xl translate-y-2 group-hover:translate-y-0">
                      {data.orders} Orders
                    </div>
                    {/* Animated Growing Bar */}
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-teal-50 to-[#007074] rounded-t-xl transition-all duration-300 group-hover:brightness-110 group-hover:shadow-[0_0_20px_rgba(0,112,116,0.3)] origin-bottom" 
                      style={{ 
                        height: data.height,
                        animation: `barGrowUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                        animationDelay: `${900 + (i * 100)}ms` 
                      }} 
                    />
                    <span className="absolute -bottom-8 text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{data.day}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* TOP SELLING PRODUCTS - Delay 800ms */}
         <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] animate-cascade hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500" style={{ animationDelay: '800ms' }}>
           <ChartHeader title="Volume Leaders" subtitle="Highest Converting Assets" />
           <div className="space-y-7 mt-6">
              {[
                { name: "Silk Satin Slip Dress", sales: "142 Units", revenue: "Rs. 1.8M", percent: 90, color: "from-[#007074] to-teal-400" },
                { name: "Onyx Chronograph", sales: "98 Units", revenue: "Rs. 2.4M", percent: 75, color: "from-slate-800 to-slate-600" },
                { name: "Velvet Midnight Wrap", sales: "76 Units", revenue: "Rs. 0.9M", percent: 55, color: "from-rose-500 to-rose-400" },
                { name: "Radiance C Serum", sales: "210 Units", revenue: "Rs. 0.6M", percent: 40, color: "from-amber-500 to-amber-300" },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                   <div className="flex justify-between items-end mb-2">
                      <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#007074] transition-colors">{item.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.sales}</p>
                      </div>
                      <p className="text-[11px] font-black text-slate-900 tracking-tighter transform transition-transform duration-300 group-hover:-translate-x-1">{item.revenue}</p>
                   </div>
                   <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner relative">
                      {/* Animated Growing Width */}
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full origin-left`} 
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

// --- SUB COMPONENTS ---

function MetricCard({ title, value, growth, isUp, icon, inverseColors }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden cursor-pointer transform hover:-translate-y-1 ${
      inverseColors ? 'bg-slate-900 border-slate-800 text-white shadow-xl hover:shadow-2xl' : 'bg-white border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,112,116,0.15)] hover:border-teal-100'
    }`}>
      {/* Shine Hover Effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1s_ease-in-out]" />

      <div className={`absolute -top-4 -right-4 p-4 transition-all duration-500 rotate-12 group-hover:rotate-0 group-hover:scale-110 ${inverseColors ? 'text-white opacity-[0.05] group-hover:opacity-10' : 'text-[#007074] opacity-[0.03] group-hover:opacity-10'}`}>
        {React.cloneElement(icon, { size: 120 })}
      </div>
      
      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2 ${inverseColors ? 'text-slate-400' : 'text-slate-400'}`}>
          {title}
        </p>
        <h2 className={`text-3xl font-serif font-black tracking-tight mb-4 transition-colors duration-300 ${inverseColors ? 'text-white group-hover:text-teal-300' : 'text-slate-900 group-hover:text-[#007074]'}`}>
          {value}
        </h2>
        
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
            isUp 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white' 
            : 'bg-red-500/10 text-red-500 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white'
          }`}>
            {isUp ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />} 
            {growth}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${inverseColors ? 'text-slate-500' : 'text-slate-300'}`}>vs last month</span>
        </div>
      </div>
    </div>
  );
}

function ChartHeader({ title, subtitle, icon }) {
  return (
    <div className="flex justify-between items-center relative z-10 border-b border-slate-50 pb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-[#007074] hover:bg-teal-50 transition-colors rounded-xl active:scale-95">
        <FiMoreHorizontal size={20} />
      </button>
    </div>
  );
}

function LegendRow({ color, label, value, delay }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors animate-cascade" style={{ animationDelay: delay }}>
      <div className="flex items-center gap-3 transform transition-transform duration-300 group-hover:translate-x-1">
        <div className={`w-3 h-3 rounded-full ${color} shadow-inner transition-transform duration-300 group-hover:scale-125`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-[#007074] transition-colors">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 transform transition-transform duration-300 group-hover:-translate-x-1">{value}</span>
    </div>
  );
}