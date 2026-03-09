import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMinus, 
  FiPlus, 
  FiTrash2, 
  FiArrowRight, 
  FiShield, 
  FiShoppingBag,
  FiChevronLeft,
  FiTag,
  FiClock
} from 'react-icons/fi';

// ==========================================
// CONSTANTS & MOCK DATA (Beauty & Wellness)
// ==========================================
const FREE_SHIPPING_THRESHOLD = 300;
const STANDARD_SHIPPING_COST = 15;

const INITIAL_CART = [
  {
    id: "cart_item_1",
    productId: 1,
    name: "Radiance Vitamin C Serum",
    brand: "Glow Botanica",
    price: 45,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop",
    color: "Standard",
    size: "30ml",
    quantity: 1,
    stock: 10
  },
  {
    id: "cart_item_2",
    productId: 6,
    name: "Daily Collagen Peptides",
    brand: "Vitality Labs",
    price: 35,
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=2070&auto=format&fit=crop",
    color: "Unflavored",
    size: "500g",
    quantity: 2,
    stock: 3 // Low stock
  },
  {
    id: "cart_item_3",
    productId: 4,
    name: "Organic Matcha Elixir",
    brand: "Zenith Wellness",
    price: 28,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop",
    color: "Ceremonial Grade",
    size: "100g",
    quantity: 1,
    stock: 15
  }
];

export default function CartPage() {
  // --- STATE (Simplified: No Local Storage) ---
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // --- HANDLERS ---
  const handleQuantity = (id, type) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        let newQty = item.quantity;
        if (type === 'dec' && newQty > 1) newQty--;
        if (type === 'inc' && newQty < item.stock) newQty++;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemove = (id) => setCartItems(prev => prev.filter(item => item.id !== id));
  
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "GLOW10") {
      setDiscount(0.10); // 10% off
    } else {
      alert("Try code: GLOW10");
      setDiscount(0);
    }
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST; 
  const total = subtotalAfterDiscount + shipping;
  const progressToFreeShipping = Math.min((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // --- ANIMATION STYLES ---
  const customStyles = `
    @keyframes slideIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger {
      opacity: 0;
      animation: slideIn 0.5s ease-out forwards;
    }
  `;

  // --- EMPTY CART STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-100 flex items-center justify-center p-4">
        <style>{customStyles}</style>
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl p-12 max-w-md w-full flex flex-col items-center text-center animate-stagger border border-white">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-[#007074]/30 shadow-inner">
            <FiShoppingBag size={44} />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-3 text-[#2a2a2a]">Your bag is empty</h2>
          <p className="text-sm text-gray-500 mb-8 px-4 leading-relaxed">
            Discover premium wellness and beauty essentials to elevate your daily routine.
          </p>
          <Link to="/shop" className="w-full bg-[#2a2a2a] text-white py-4 rounded-full font-bold hover:bg-[#007074] transition-all duration-500 shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-1">
            Browse Essentials <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // --- MAIN CART UI ---
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] flex flex-col items-center py-8 lg:py-16 font-sans text-[#2a2a2a] px-4 relative overflow-hidden">
      <style>{customStyles}</style>
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Centered Premium Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,112,116,0.05)] border border-white overflow-hidden flex flex-col lg:flex-row z-10 animate-stagger">
        
        {/* LEFT SIDE: ITEMS */}
        <div className="w-full lg:w-[60%] p-6 md:p-10 flex flex-col bg-white">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <div>
              <h1 className="text-3xl font-bold font-serif text-[#2a2a2a]">Shopping Bag</h1>
              <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">
                <span className="text-[#007074]">{cartItems.length}</span> Essentials
              </p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-[#007074] transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">
              <FiChevronLeft size={14} /> Back to Shop
            </Link>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
            {cartItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 group pb-6 border-b border-gray-50 last:border-0 animate-stagger"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Link to={`/product/${item.productId}`} className="w-20 h-24 md:w-24 md:h-28 shrink-0 bg-[#F7F3F0] rounded-2xl overflow-hidden relative shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                  {item.stock <= 5 && (
                    <div className="absolute bottom-0 left-0 w-full bg-rose-50 text-rose-600 text-[8px] font-bold text-center py-1 uppercase">
                      Low Stock
                    </div>
                  )}
                </Link>
                
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-bold text-[#007074] uppercase tracking-widest mb-1">{item.brand}</p>
                      <h3 className="font-bold text-sm md:text-base text-[#2a2a2a] line-clamp-1">{item.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">{item.color} • {item.size}</p>
                    </div>
                    <span className="font-bold text-[#2a2a2a] text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-100 shadow-inner">
                      <button 
                        onClick={() => handleQuantity(item.id, 'dec')} 
                        disabled={item.quantity <= 1}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${item.quantity <= 1 ? 'text-gray-300' : 'bg-white text-rose-500 shadow-sm hover:bg-rose-50'}`}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantity(item.id, 'inc')} 
                        disabled={item.quantity >= item.stock}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${item.quantity >= item.stock ? 'text-gray-300' : 'bg-white text-[#007074] shadow-sm hover:bg-teal-50'}`}
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-[10px] font-bold text-gray-400 hover:text-rose-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                      <FiTrash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="w-full lg:w-[40%] p-6 md:p-10 bg-gradient-to-br from-gray-50 to-[#F7F9FA] border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#2a2a2a] mb-6">Order Summary</h2>
            <div className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="GLOW10" 
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-xs focus:ring-1 focus:ring-[#007074] outline-none shadow-sm transition-all"
                  />
                </div>
                <button onClick={handleApplyPromo} className="bg-[#2a2a2a] text-white px-5 rounded-xl text-xs font-bold hover:bg-[#007074] transition-all shadow-md">
                  Apply
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-[#2a2a2a]">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-teal-600 font-medium italic">
                  <span>Special Discount (10%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 items-center">
                <span>Estimated Shipping</span>
                {shipping === 0 ? <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-teal-100">Free</span> : <span className="font-bold text-[#2a2a2a]">${shipping.toFixed(2)}</span>}
              </div>
              {shipping > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] mb-2 text-gray-400 font-bold uppercase tracking-widest">
                    <span>Add ${(FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount).toFixed(2)} for free shipping</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#007074] to-teal-400 rounded-full transition-all duration-700" style={{ width: `${progressToFreeShipping}%` }}></div>
                  </div>
                </div>
              )}
              <div className="border-t border-gray-50 pt-4 flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-[#007074] text-3xl font-serif">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <Link to="/checkout" className="w-full bg-gradient-to-r from-[#2a2a2a] to-gray-800 text-white py-4 rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:from-[#007074] hover:to-teal-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
              Proceed to Checkout <FiArrowRight size={18} />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
              <FiShield size={14} className="text-[#007074]" />
              <span>Verified <strong>COD</strong> Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}