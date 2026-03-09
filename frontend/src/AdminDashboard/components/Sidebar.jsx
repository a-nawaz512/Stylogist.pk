import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiBox, FiShoppingBag, FiUsers, 
  FiSettings, FiLogOut, FiMessageSquare, 
  FiBarChart2, FiMenu, FiX 
} from 'react-icons/fi';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: 'Overview', path: '/admin/overview', icon: <FiGrid /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Categories', path: '/admin/categories', icon: <FiBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'Customers', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FiMessageSquare /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Helper to close sidebar when clicking a link on mobile
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* ========================================= */}
      {/* MOBILE HAMBURGER BUTTON (Top Left)        */}
      {/* ========================================= */}
      <div className="lg:hidden fixed top-5 md:left-4 left-1 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="md:p-3 p-2 bg-[#1E293B] text-white rounded-xl shadow-lg border border-slate-700"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* ========================================= */}
      {/* MOBILE OVERLAY (Dark Background)          */}
      {/* ========================================= */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* ========================================= */}
      {/* SIDEBAR CONTAINER                         */}
      {/* ========================================= */}
      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-[#1E293B] flex flex-col shrink-0 z-[60]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* HEADER & CLOSE BUTTON */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007074] rounded-lg flex items-center justify-center font-bold text-white shadow-lg">S</div>
            <span className="text-white font-black tracking-tighter uppercase text-sm">Stylogist Admin</span>
          </div>
          
          {/* Close button for mobile only */}
          <button 
            onClick={closeSidebar}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] md:text-xs  uppercase font-semibold tracking-widest transition-all
                ${isActive 
                  ? 'bg-[#007074] text-white shadow-xl shadow-[#007074]/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="text-sm">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT FOOTER */}
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}