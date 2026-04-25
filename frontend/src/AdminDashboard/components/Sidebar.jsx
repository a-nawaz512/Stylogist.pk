import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiBox, FiShoppingBag, FiUsers, FiSettings,
  FiLogOut, FiMessageSquare, FiBarChart2, FiMenu, FiX, FiTag, FiFolder, FiShield
} from 'react-icons/fi';
import logo from "../../../public/logo.png";
import useAuthStore from '../../store/useAuthStore';

// Sidebar entries are gated by permission keys. Super Admin bypasses every
// check; Staff users only see entries whose `requires` keys are satisfied.
// `requires: null` means "always visible to any admin".
const LINKS = [
  { name: 'Overview', path: '/admin/overview', icon: <FiGrid />, requires: null },
  { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 />, requires: 'analytics:read' },
  { name: 'Products', path: '/admin/products', icon: <FiBox />, requires: 'products:read' },
  { name: 'Categories', path: '/admin/categories', icon: <FiFolder />, requires: 'categories:write' },
  { name: 'Brands', path: '/admin/brands', icon: <FiTag />, requires: 'brands:write' },
  { name: 'Orders', path: '/admin/orders', icon: <FiShoppingBag />, requires: 'orders:read' },
  { name: 'Customers', path: '/admin/users', icon: <FiUsers />, requires: 'customers:read' },
  { name: 'Reviews', path: '/admin/reviews', icon: <FiMessageSquare />, requires: 'reviews:moderate' },
  { name: 'Staff & Permissions', path: '/admin/staff', icon: <FiShield />, requires: 'super-admin' },
  { name: 'Settings', path: '/admin/settings', icon: <FiSettings />, requires: 'settings:write' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const isSuperAdmin = user?.role === 'Super Admin';
  const granted = new Set(user?.permissions || []);

  const visibleLinks = LINKS.filter((link) => {
    if (!link.requires) return true;
    if (link.requires === 'super-admin') return isSuperAdmin;
    if (isSuperAdmin) return true;
    return granted.has(link.requires);
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="p-2.5 bg-[#1E293B] text-white rounded-lg shadow-lg border border-slate-700 hover:bg-[#007074] transition-colors inline-flex items-center justify-center"
        >
          <FiMenu size={18} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 bg-[#1E293B] flex flex-col shrink-0 z-[60]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} width={104} height={44} alt="" />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md text-xs uppercase tracking-widest transition-all
                ${isActive
                  ? 'bg-[#007074] text-white shadow-lg shadow-[#007074]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <span className="text-base">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 text-xs font-semibold uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
