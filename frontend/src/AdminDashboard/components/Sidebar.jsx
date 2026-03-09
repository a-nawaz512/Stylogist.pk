import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 /> },
    { name: 'Products', path: '/admin/products', icon: <FiBox /> },
    { name: 'Categories', path: '/admin/categories', icon: <FiBox /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'Customers', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FiMessageSquare /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <aside className="w-64 bg-[#1E293B] h-full flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#007074] rounded-lg flex items-center justify-center font-bold text-white shadow-lg">S</div>
        <span className="text-white font-black tracking-tighter uppercase text-sm">Stylogist Admin</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${isActive ? 'bg-[#007074] text-white shadow-xl shadow-[#007074]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="text-lg">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div onClick={handleLogout} className="p-4 border-t border-slate-700/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all">
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}