import React from 'react';
import { 
  FiDollarSign, FiShoppingBag, FiUsers, FiAlertCircle, 
  FiArrowRight, FiClock, FiCheckCircle, FiTrendingUp 
} from 'react-icons/fi';

export default function AdminDashboard() {
  // Mock Data
  const weeklySales = [
    { day: 'Mon', amount: 45 }, { day: 'Tue', amount: 70 },
    { day: 'Wed', amount: 35 }, { day: 'Thu', amount: 90 },
    { day: 'Fri', amount: 55 }, { day: 'Sat', amount: 85 },
    { day: 'Sun', amount: 100 },
  ];

  const recentOrders = [
    { id: 'ST-9021', customer: 'Ahmed Ali', amount: '12,500', status: 'Pending', time: '10 mins ago' },
    { id: 'ST-9020', customer: 'Sara Malik', amount: '8,400', status: 'Confirmed', time: '1 hour ago' },
    { id: 'ST-9019', customer: 'Usman Khan', amount: '24,000', status: 'Shipped', time: '3 hours ago' },
    { id: 'ST-9018', customer: 'Ayesha Noor', amount: '6,200', status: 'Pending', time: '5 hours ago' },
  ];

  const lowStock = [
    { name: 'Silk Satin Slip Dress', stock: 2, sku: 'ST-SLK-01' },
    { name: 'Onyx Chronograph', stock: 4, sku: 'ST-WTCH-09' },
  ];

  // Professional Level Custom Animations
  const customStyles = `
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes barGrow {
      0% { transform: scaleY(0); opacity: 0; }
      100% { transform: scaleY(1); opacity: 1; }
    }
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    .animate-cascade {
      opacity: 0;
      animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .bar-origin-bottom { transform-origin: bottom; }
  `;

  return (
    <div className="space-y-8 pb-10">
      <style>{customStyles}</style>
      
      {/* 1. WELCOME HEADER (Fades in immediately) */}
      <div className="flex justify-between items-end animate-cascade" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Hello Javeria, here is your operations pulse for today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-green-700">System Online</span>
        </div>
      </div>

      {/* 2. CORE METRICS GRID (Staggered Load: 100ms, 200ms...) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-cascade" style={{ animationDelay: '100ms' }}>
          <StatCard title="Today's Revenue" value="Rs. 42,500" icon={<FiDollarSign />} trend="+14%" colorClass="text-[#007074]" bgClass="bg-teal-50" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '200ms' }}>
          <StatCard title="New Orders" value="24" icon={<FiShoppingBag />} trend="+8%" colorClass="text-blue-600" bgClass="bg-blue-50" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '300ms' }}>
          <StatCard title="Active Sessions" value="156" icon={<FiUsers />} trend="+12%" colorClass="text-purple-600" bgClass="bg-purple-50" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '400ms' }}>
          <StatCard title="Stock Alerts" value="04" icon={<FiAlertCircle />} trend="Action Required" colorClass="text-red-600" bgClass="bg-red-50" isAlert />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 3. RECENT ORDERS TABLE (Action Area) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] animate-cascade transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,112,116,0.1)]" style={{ animationDelay: '500ms' }}>
           <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
              <div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Recent Transactions</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Awaiting COD Confirmation</p>
              </div>
              <button className="group text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#007074] flex items-center gap-2 transition-colors">
                View All <FiArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
              </button>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-slate-50">
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {recentOrders.map((order, i) => (
                   <tr key={i} className="group hover:bg-teal-50/30 transition-all duration-300 cursor-pointer">
                     <td className="py-5 font-bold text-sm text-slate-900 transition-transform duration-300 group-hover:translate-x-2 relative">
                        {/* Hover Action Arrow */}
                        <span className="absolute -left-4 opacity-0 group-hover:opacity-100 text-[#007074] transition-opacity duration-300">
                          <FiArrowRight size={14} />
                        </span>
                        {order.id}
                     </td>
                     <td className="py-5 transition-transform duration-300 group-hover:translate-x-1">
                       <p className="font-bold text-sm text-slate-800 group-hover:text-[#007074] transition-colors">{order.customer}</p>
                       <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{order.time}</p>
                     </td>
                     <td className="py-5 font-black text-sm text-slate-900 transition-transform duration-300 group-hover:translate-x-1">
                        Rs. {order.amount}
                     </td>
                     <td className="py-5 text-right transition-transform duration-300 group-hover:-translate-x-2">
                       <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 group-hover:shadow-md ${
                         order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-100 group-hover:bg-orange-500 group-hover:text-white' : 
                         order.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                         'bg-teal-50 text-[#007074] border border-teal-100'
                       }`}>
                         {order.status === 'Pending' ? <FiClock size={10} /> : <FiCheckCircle size={10} />}
                         {order.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* 4. RIGHT SIDEBAR: QUICK CHARTS & ALERTS */}
        <div className="space-y-8">
          
          {/* Animated Mini Weekly Sales Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] animate-cascade" style={{ animationDelay: '600ms' }}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">7-Day Pulse</h3>
                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#007074]">
                   <FiTrendingUp size={14} />
                </div>
             </div>
             
             {/* Flexbox CSS Bar Chart with Growth Animation */}
             <div className="h-40 w-full flex items-end justify-between gap-2 mt-4 border-b border-slate-50 pb-2 relative">
                {weeklySales.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative">
                     {/* Tooltip */}
                     <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-900 text-white text-[9px] font-black tracking-widest px-2 py-1 rounded-md whitespace-nowrap transition-all duration-300 shadow-xl z-20 translate-y-2 group-hover:translate-y-0">
                       {data.amount}
                     </div>
                     {/* Animated Bar */}
                     <div 
                       className="w-full max-w-[24px] bg-slate-100 rounded-t-lg transition-all duration-500 group-hover:bg-[#007074] group-hover:shadow-[0_10px_20px_rgba(0,112,116,0.3)] relative overflow-hidden bar-origin-bottom" 
                       style={{ 
                         height: `${data.amount}%`,
                         animation: `barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                         animationDelay: `${700 + (i * 100)}ms` 
                       }}
                     >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     </div>
                     <span className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-widest transition-colors duration-300 group-hover:text-slate-900">{data.day}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border-t-4 border-t-red-500 animate-cascade hover:shadow-[0_20px_50px_-15px_rgba(239,68,68,0.15)] transition-all duration-500" style={{ animationDelay: '700ms' }}>
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 border-b border-slate-50 pb-4 mb-4 flex items-center gap-2">
               Inventory Alerts <FiAlertCircle className="text-red-500" />
             </h3>
             <div className="space-y-3">
                {lowStock.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer p-3 hover:bg-red-50/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-100">
                     <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                       <p className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">{item.name}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black shadow-inner transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white">
                       {item.stock}
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-component: Professional Stat Card with "Shine" Effect
function StatCard({ title, value, icon, trend, colorClass, bgClass, isAlert }) {
  return (
    <div className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,112,116,0.15)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-1 cursor-pointer ${isAlert ? 'hover:border-red-200 hover:shadow-[0_25px_50px_-15px_rgba(239,68,68,0.15)]' : 'hover:border-teal-100'}`}>
      
      {/* Shine Hover Effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-[shine_1s_ease-in-out]" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${bgClass} ${colorClass}`}>
          {React.cloneElement(icon, { size: 22 })}
        </div>
        <div className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm transition-colors duration-300 ${
          isAlert ? 'bg-red-50 text-red-600 border border-red-100 group-hover:bg-red-500 group-hover:text-white' : 'bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white'
        }`}>
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-[#007074]">
          {value}
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 transition-colors duration-300 group-hover:text-slate-500">
          {title}
        </p>
      </div>
    </div>
  );
}