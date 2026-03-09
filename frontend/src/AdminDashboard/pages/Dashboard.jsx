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
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #007074; border-radius: 10px; }
  `;

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6 bg-[#FBFBFA] min-h-screen">
      <style>{customStyles}</style>
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-cascade" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-xl md:text-3xl font-black text-[#222222] tracking-tight uppercase">System Overview</h1>
          <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] mt-1">
            Hello Javeria, here is your operations pulse for today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#007074]/20 w-max px-4 py-2 rounded-xl shadow-sm">
           <div className="w-2 h-2 bg-[#007074] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,112,116,0.6)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-[#007074]">System Online</span>
        </div>
      </div>

      {/* 2. CORE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="animate-cascade" style={{ animationDelay: '100ms' }}>
          <StatCard title="Revenue" value="Rs. 42,500" icon={<FiDollarSign />} trend="+14%" colorClass="text-[#007074]" bgClass="bg-[#007074]/10" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '200ms' }}>
          <StatCard title="New Orders" value="24" icon={<FiShoppingBag />} trend="+8%" colorClass="text-[#222222]" bgClass="bg-slate-100" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '300ms' }}>
          <StatCard title="Active Sessions" value="156" icon={<FiUsers />} trend="+12%" colorClass="text-[#007074]" bgClass="bg-[#007074]/10" />
        </div>
        <div className="animate-cascade" style={{ animationDelay: '400ms' }}>
          <StatCard title="Stock Alerts" value="04" icon={<FiAlertCircle />} trend="Critical" colorClass="text-red-600" bgClass="bg-red-50" isAlert />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* 3. RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm animate-cascade" style={{ animationDelay: '500ms' }}>
           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
              <div>
                 <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-[#222222]">Recent Transactions</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Awaiting Confirmation</p>
              </div>
              <button className="group text-[10px] font-black uppercase tracking-widest text-[#007074] border border-[#007074]/20 px-4 py-2 rounded-full hover:bg-[#007074] hover:text-white transition-all w-max">
                View All <FiArrowRight className="inline ml-1 transform transition-transform group-hover:translate-x-1" />
              </button>
           </div>

           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[500px]">
               <thead>
                 <tr className="border-b border-slate-100">
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                   <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {recentOrders.map((order, i) => (
                   <tr key={i} className="group hover:bg-[#007074]/5 transition-all duration-300">
                     <td className="py-4 font-bold text-[13px] text-[#222222]">{order.id}</td>
                     <td className="py-4">
                       <p className="font-bold text-[13px] text-[#222222]">{order.customer}</p>
                       <p className="text-[9px] font-medium text-slate-400">{order.time}</p>
                     </td>
                     <td className="py-4 font-black text-[13px] text-[#222222]">Rs. {order.amount}</td>
                     <td className="py-4 text-right">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                         order.status === 'Confirmed' ? 'bg-[#222222] text-white border-[#222222]' : 
                         'bg-[#007074] text-white border-[#007074]'
                       }`}>
                         {order.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* 4. SIDEBAR CONTENT */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Chart Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-cascade" style={{ animationDelay: '600ms' }}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#222222]">Weekly Pulse</h3>
                <div className="p-2 rounded-lg bg-[#007074]/10">
                  <FiTrendingUp className="text-[#007074]" size={16} />
                </div>
             </div>
             <div className="h-32 flex items-end justify-between gap-2 mt-4 px-2">
                {weeklySales.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div 
                      className="w-full max-w-[12px] md:max-w-[20px] bg-slate-100 rounded-t-md group-hover:bg-[#007074] transition-all duration-500 bar-origin-bottom shadow-sm" 
                      style={{ 
                        height: `${data.amount}%`,
                        animation: `barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                        animationDelay: `${700 + (i * 100)}ms` 
                      }}
                    />
                    <span className="mt-2 text-[8px] font-black text-slate-400 uppercase">{data.day}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Stock Alerts Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 border-t-4 border-t-red-500 shadow-sm animate-cascade" style={{ animationDelay: '700ms' }}>
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#222222] mb-4 flex items-center gap-2">
                Inventory Alerts <FiAlertCircle className="text-red-500" />
             </h3>
             <div className="space-y-3">
                {lowStock.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                      <div>
                        <p className="text-[11px] font-bold text-[#222222]">{item.name}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black border border-red-200 shadow-inner">
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

function StatCard({ title, value, icon, trend, colorClass, bgClass, isAlert }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-200 hover:border-[#007074]/30 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-1 cursor-pointer ${isAlert ? 'hover:border-red-200' : ''}`}>
      <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-[shine_1s_ease-in-out]" />
      
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-slate-100 ${bgClass} ${colorClass}`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
          isAlert 
          ? 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white' 
          : 'bg-[#222222] text-white border-[#222222] group-hover:bg-[#007074] group-hover:border-[#007074]'
        }`}>
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-semibold text-[#222222] group-hover:text-[#007074] transition-colors">
          {value}
        </h2>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1.5">
          {title}
        </p>
      </div>
    </div>
  );
}