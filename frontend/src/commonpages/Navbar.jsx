import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiSearch, FiHeart, FiShoppingCart, FiUser, FiChevronDown, FiZap, FiTruck, FiLogOut, FiSettings, FiPackage
} from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // AUTH STATE: Get user from localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Re-check on route change

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // UI Resets
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
    setMobileCategoryOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'Collections',
      path: '/category',
      hasDropdown: true,
      subItems: [
        { name: 'Women', path: '/category' },
        { name: 'Men', path: '/category' },
        { name: 'Accessories', path: '/category' },
        { name: 'Beauty', path: '/category' },
      ],
    },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Hot Deals', path: '/deals', highlight: true },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#222] text-white py-2 px-4 text-center text-[6px] sm:text-[9px] font-black tracking-[0.3em] uppercase relative z-[80]">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <FiTruck className="text-[#007074] text-[8px]" />
          <span>Complimentary Shipping on orders over Rs. 5000</span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className={`sticky top-0 z-[70] w-full transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-3' : 'bg-white py-5'}`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#222] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-serif font-black italic">S</span>
            </div>
            <div className="flex flex-col hidden sm:flex">
                <span className="text-xl font-serif font-black tracking-tighter text-[#222] leading-none">STYLOGIST<span className="text-[#007074]">.PK</span></span>
                <span className="text-[7px] font-black tracking-[0.5em] text-gray-400 uppercase mt-1">Neural Boutique</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group h-full">
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => `flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-2 ${isActive && link.path !== '#' ? 'text-[#007074]' : 'text-gray-500 hover:text-[#222]'} ${link.highlight ? 'text-[#007074]' : ''}`}
                >
                  {link.highlight && <FiZap className="animate-pulse" />}
                  {link.name}
                  {link.hasDropdown && <FiChevronDown className="group-hover:rotate-180 transition-transform" />}
                </NavLink>

                {link.hasDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white border border-gray-100 rounded-md shadow-2xl p-6 w-48 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#007074]/5 rounded-bl-[3rem]" />
                      {link.subItems.map((sub) => (
                        <Link key={sub.name} to={sub.path} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#007074] transition-colors relative z-10">{sub.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ACTIONS & AUTH SECTION */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsSearchOpen(true)} className="text-[#222] hover:text-[#007074] transition-all"><FiSearch size={20} /></button>
            <Link to="/wishlist" className="relative text-[#222] hover:text-[#007074] hidden sm:block"><FiHeart size={20} /></Link>
            <Link to="/cart" className="relative text-[#222] hover:text-[#007074]"><FiShoppingCart size={20} /></Link>

            {/* DYNAMIC USER SECTION */}
            {user ? (
              <div className="relative group pl-4 border-l border-gray-100">
                <button 
                  onMouseEnter={() => setIsProfileOpen(true)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <img 
                    src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} 
                    className="w-9 h-9 rounded-2xl object-cover border-2 border-teal-50 shadow-sm group-hover:border-[#007074] transition-all"
                    alt="Profile"
                  />
                  <div className="hidden xl:flex flex-col items-start text-left">
                    <span className="text-[10px] font-black text-[#222] uppercase tracking-tighter truncate w-20">{user.name}</span>
                    <span className="text-[8px] font-bold text-[#007074] uppercase tracking-widest">Active</span>
                  </div>
                </button>

                {/* USER DROPDOWN */}
                <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-56">
                  <div className="bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden">
                    <div className="bg-gray-50 p-5 border-b border-gray-100">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated As</p>
                       <p className="text-xs font-bold text-[#222] truncate">{user.email}</p>
                    </div>
                    <div className="p-3">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-gray-600 hover:text-[#007074] transition-all">
                        <FiUser size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">My Identity</span>
                      </Link>
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-teal-50 text-gray-600 hover:text-[#007074] transition-all">
                        <FiPackage size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Admin Panel</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-400 transition-all mt-2 border-t border-gray-50">
                        <FiLogOut size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#222] pl-4 border-l border-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#222] group-hover:text-white transition-all"><FiUser size={16} /></div>
                <span>Sign In</span>
              </Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#222]"><FiMenu size={26} /></button>
          </div>
        </div>
      </nav>

      {/* 3. NEURAL SEARCHBAR OVERLAY (Preserved) */}
      <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-[#111]/95 backdrop-blur-2xl" onClick={() => setIsSearchOpen(false)} />
        <div className={`relative w-full max-w-3xl mx-auto mt-32 px-6 transition-all duration-700 ${isSearchOpen ? 'translate-y-0' : 'translate-y-12'}`}>
          <div className="flex items-center gap-4 border-b border-white/20 pb-6 mb-8">
            <FiSearch className="text-[#007074]" size={32} />
            <input autoFocus={isSearchOpen} placeholder="SEARCH THE CATALOG..." className="bg-transparent w-full text-3xl font-serif font-black text-white outline-none placeholder:text-white/10 uppercase tracking-tighter" />
            <button onClick={() => setIsSearchOpen(false)} className="text-white/40 hover:text-white transition-colors"><FiX size={32} /></button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE SIDEBAR MENU (Updated for User state) */}
      <div className={`lg:hidden fixed inset-0 z-[90] w- transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className={`absolute left-0 top-0 h-full w-[60%] sm:w-[40%] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col p-10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-3 sm:gap-6">
            {user ? (
               <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} className="w-12 h-12 rounded-2xl object-cover" alt="User" />
                  <div>
                    <p className="text-xs font-black uppercase text-[#222]">{user.name}</p>
                    <button onClick={handleLogout} className="text-[9px] font-black uppercase text-red-400 tracking-widest mt-1">Logout</button>
                  </div>
               </div>
            ) : (
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#222] rounded-2xl flex items-center justify-center mb-4"><span className="text-white text-2xl font-serif font-black italic">S</span></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Stylogist.pk</p>
              </div>
            )}
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="text-md sm:text-2xl font-serif lg:font-black text-[#222]">{link.name}</Link>
            ))}
          </div>
          <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-6">
             {!user && <Link to="/login" className="flex items-center gap-3 text-[#222] font-black uppercase text-[10px] tracking-widest"><FiUser size={18} /> Sign In</Link>}
             <Link to="/cart" className="flex items-center gap-3 text-[#222] font-black uppercase text-[10px] tracking-widest"><FiShoppingCart size={18} /> My Cart</Link>
          </div>
        </div>
      </div>
    </>
  );
}