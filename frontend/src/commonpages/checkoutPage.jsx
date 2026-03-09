import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiChevronLeft, FiTruck, FiShield, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiPackage
} from 'react-icons/fi';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '', phone: '', fName: '', lName: '', address: '', city: '', zip: ''
  });

  const cartItems = [
    { id: 1, name: "Midnight Silk Wrap Dress", price: 210, qty: 1, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop" },
    { id: 2, name: "Premium Glow Elixir", price: 85, qty: 1, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop" }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal;

  // Optimized Input Field for Clarity and Production Standards
  const InputField = ({ label, name, icon: Icon, placeholder, type = "text" }) => (
    <div className="group flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1 group-focus-within:text-[#007074] transition-colors">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007074] transition-colors" size={16} />}
        <input 
          type={type}
          name={name}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold placeholder:text-gray-300 focus:ring-4 focus:ring-[#007074]/5 focus:border-[#007074] outline-none transition-all shadow-sm group-hover:border-gray-300"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] font-sans text-[#222222] pb-20 overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#007074]/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Bar */}
      <header className="w-full py-5 px-6 border-b border-gray-100 flex justify-center items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl w-full flex justify-between items-center px-2">
          <Link to="/cart" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#007074] transition-all">
            <FiChevronLeft size={16} /> Back to Bag
          </Link>
          <span className="text-base font-serif font-black italic tracking-tighter text-[#222222]">Stylogist.pk</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#007074]" />
            <div className="w-8 h-[2px] bg-gray-200 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================= */}
        {/* LEFT: MINIMALIST FORM (Deep Shadow)       */}
        {/* ========================================= */}
        <section className="lg:col-span-7 bg-white rounded-[2.5rem] p-6 md:p-10 border border-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]">
          
          <div className="mb-10">
            <h1 className="text-3xl font-serif font-black tracking-tight text-[#222]">Delivery Details</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Fill in your shipping information</p>
          </div>

          <div className="space-y-8">
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Email Address" icon={FiMail} placeholder="your@email.com" />
              <InputField label="Phone Number" icon={FiPhone} placeholder="+92 3XX XXXXXXX" />
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="First Name" icon={FiUser} placeholder="Jane" />
              <InputField label="Last Name" placeholder="Doe" />
            </div>
            
            {/* Address */}
            <InputField label="Shipping Address" icon={FiMapPin} placeholder="Suite, House No, Street name, Area..." />
            
            {/* Location details - No horizontal scroll ensured by grid-cols-1 base */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <InputField label="City" icon={FiGlobe} placeholder="Bahawalpur" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 ml-1">Province</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-2xl py-[13px] px-4 text-sm font-semibold outline-none focus:border-[#007074] focus:ring-4 focus:ring-[#007074]/5 transition-all appearance-none cursor-pointer shadow-sm">
                    <option>Punjab</option>
                    <option>Sindh</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>
              <InputField label="Zip Code" placeholder="63100" />
            </div>

            {/* Payment Section */}
            <div className="pt-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#222] mb-4">Payment Method</h3>
              <div className="border-2 border-[#007074] bg-[#007074]/5 rounded-2xl p-5 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(0,112,116,0.15)]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#007074] shadow-sm">
                    <FiTruck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#2a2a2a]">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Pay at your doorstep</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-[#007074] bg-white shadow-inner" />
              </div>
            </div>

            <button className="w-full bg-[#222] text-white py-4.5 rounded-full font-black uppercase tracking-[0.2em] text-xs mt-4 hover:bg-[#007074] hover:shadow-[0_20px_40px_-10px_rgba(0,112,116,0.4)] transform transition-all hover:-translate-y-1 active:scale-[0.98]">
              Complete Order • ${total.toFixed(2)}
            </button>
          </div>
        </section>

        {/* ========================================= */}
        {/* RIGHT: FLOATING SUMMARY (Sharp Shadow)    */}
        {/* ========================================= */}
        <aside className="lg:col-span-5 lg:sticky lg:top-28 w-full">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1.5 bg-[#007074]" />
            
            <h2 className="text-lg font-serif font-black text-[#222] mb-8 flex items-center gap-2">
              <FiPackage className="text-[#007074]" /> Order Summary
            </h2>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 items-center animate-[slideInRight_0.5s_ease-out]">
                  <div className="w-14 h-18 bg-[#F7F3F0] rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-[#222] leading-tight line-clamp-1 uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] text-[#007074] font-black uppercase mt-1">QTY: {item.qty} • ${item.price}</p>
                  </div>
                  <span className="text-xs font-black text-[#222]">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-dashed border-gray-200 text-xs">
              <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-[#222]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-teal-600 font-black">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-5 mt-2 border-t border-gray-100">
                <span className="text-[11px] font-black text-[#222] uppercase tracking-[0.2em]">Total Amount</span>
                <span className="text-3xl font-serif font-black text-[#007074] leading-none">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 border border-gray-100 shadow-inner">
              <FiShield className="text-[#007074]" size={14} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Secure COD Checkout</span>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}