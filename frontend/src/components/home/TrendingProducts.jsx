import React, { useState } from 'react';
import { FiHeart, FiTrendingUp, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function TrendingProducts() {
  const [wishlist, setWishlist] = useState([]);

  const trendingProducts = [
    {
      id: 101,
      name: "Silk Satin Slip Dress",
      brand: "Stylogist Couture",
      price: 11999,
      originalPrice: 15999,
      rating: 4.9,
      image: "https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 102,
      name: "Oversized Wool Coat",
      brand: "Nordic Time",
      price: 7999,
      originalPrice: 9499,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1670981321083-9b7ab0843f60?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 103,
      name: "Radiance Vitamin C Serum",
      brand: "Glow Botanica",
      price: 3200,
      originalPrice: 4500,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop",
    },
    {
      id: 104,
      name: "Gold Minimalist Watch",
      brand: "Accessories Co.",
      price: 14299,
      originalPrice: 18499,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1998&auto=format&fit=crop",
    }
  ];

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const ProductCard = ({ product, index }) => (
    <div 
      className="group flex flex-col relative w-full animate-[slideUp_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Framed Image Container */}
      <div className="relative aspect-[6/4] md:aspect-[4/4] lg:aspect-[3/4] rounded-[2rem] bg-white border border-gray-100 p-2 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
        <div className="w-full h-full bg-[#F7F3F0] rounded-md md:rounded-[1.5rem] overflow-hidden relative">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Trending Badge */}
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#007074] to-teal-400 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
            <FiTrendingUp size={10} /> Trending
          </div>

          {/* Wishlist Heart */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all hover:scale-110"
          >
            <FiHeart
              size={16}
              className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>

          {/* Quick Add Button - Slide Up Animation */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-12 group-hover:translate-y-0 transition-all duration-500 z-20">
            <button className="w-full bg-[#222]/95 backdrop-blur-md text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-[#007074] shadow-xl transition-colors">
              <FiShoppingCart size={14} /> Quick Add
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="mt-5 px-1 text-center">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#007074] mb-1 block bg-teal-50 w-fit mx-auto px-2 py-0.5 rounded">
          {product.brand}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[14px] font-bold text-[#222] hover:text-[#007074] transition-colors leading-tight line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[15px] font-black text-[#222]">
            Rs. {product.price.toLocaleString()}
          </span>
          <span className="text-[12px] text-gray-300 line-through font-bold">
            Rs. {product.originalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-center items-center gap-0.5 mt-2.5">
           {[...Array(5)].map((_, i) => (
             <FaStar key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-100'}`} />
           ))}
           <span className="text-[10px] font-black text-gray-300 ml-1.5">{product.rating}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#FDFDFD] py-10 overflow-hidden relative">
      {/* Soft Background Accent */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[#007074]/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 lg:mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
              <FiTrendingUp className="animate-pulse" /> Most Wanted Now
            </div>
            <h2 className="text-2xl lg:text-5xl font-serif font-black text-[#222] tracking-tight">
              Trending <span className="italic text-[#007074]">Right Now</span>
            </h2>
            <p className="text-gray-400 mt-5 max-w-lg text-sm lg:leading-relaxed lg:uppercase tracking-wide font-medium">
              Join the movement with our most-coveted essentials, styled by you.
            </p>
          </div>

          <div className="lg:mt-6 md:mt-0 flex justify-center">
            <Link
              to="/category"
              className="inline-flex items-center gap-3 text-[9px] lg:text-[11px] font-black uppercase tracking-[0.3em] text-[#222] hover:text-[#007074] transition-all group pb-1 border-b border-gray-100"
            >
              Explore Trending
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        
        {/* Bottom Decorative Line */}
        <div className="mt-20 w-full flex justify-center">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#007074]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}