import React, { useEffect, useState } from "react";
import { FiShoppingBag, FiClock, FiStar, FiChevronRight, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function DealsOfDay() {
    const deals = [
        {
            id: 501,
            name: "Designer Leather Handbag",
            brand: "Stylogist Luxe",
            category: "Accessories",
            originalPrice: 18500,
            salePrice: 12999,
            rating: 4.9,
            soldStock: 88, // Percentage for the bar
            image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1974&auto=format&fit=crop",
        },
        {
            id: 502,
            name: "Onyx Chronograph Watch",
            brand: "Nordic Time",
            category: "Men's Watches",
            originalPrice: 24000,
            salePrice: 14500,
            rating: 4.8,
            soldStock: 65,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        },
        {
            id: 503,
            name: "Midnight Silk Wrap Dress",
            brand: "Stylogist Women",
            category: "Women's Apparel",
            originalPrice: 22000,
            salePrice: 15400,
            rating: 5.0,
            soldStock: 92,
            image: "https://img.freepik.com/free-photo/blond-female-dancing-long-red-dress_613910-6982.jpg?ga=GA1.1.2142144714.1772005373&semt=ais_hybrid&w=740&q=80",
        },
        {
            id: 504,
            name: "Suede Chelsea Boots",
            brand: "Urban Luxe",
            category: "Footwear",
            originalPrice: 11500,
            salePrice: 7900,
            rating: 4.7,
            soldStock: 45,
            image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1974&auto=format&fit=crop",
        }
    ];

    const [timeLeft, setTimeLeft] = useState(43200);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return { hrs, mins, secs };
    };

    const { hrs, mins, secs } = formatTime(timeLeft);

    return (
        <section className="relative bg-[#FDFDFD] py-10 overflow-hidden border-t border-gray-50">
            {/* Scarcity Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#007074]/5 blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* HEADER SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between lg:mb-16 mb:-4 gap-10">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                            <FiZap className="animate-pulse" /> Limited Availability
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-[#222] tracking-tighter">
                            Deals of the <span className="italic text-[#007074]">Day</span>
                        </h2>
                    </div>

                    {/* Premium Glassmorphism Timer */}
                    <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Ends In:</span>
                        <div className="flex items-center gap-3">
                            {[
                                { val: hrs, label: "HRS" },
                                { val: mins, label: "MIN" },
                                { val: secs, label: "SEC" }
                            ].map((unit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-serif font-black text-[#222] leading-none">{unit.val}</div>
                                        <div className="text-[8px] font-black text-[#007074] tracking-widest mt-1">{unit.label}</div>
                                    </div>
                                    {i < 2 && <div className="text-gray-200 text-xl font-light mb-4">:</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DEAL GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {deals.map((product, index) => {
                        const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
                        
                        return (
                            <div 
                                key={product.id} 
                                className="group flex flex-col relative w-full animate-slide-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Framed Luxury Image */}
                                <div className="relative lg:aspect-[3/4] rounded-[2rem] bg-white border border-gray-100 p-2 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 overflow-hidden">
                                    <div className="w-full h-full bg-[#F7F3F0] rounded-[1.5rem] overflow-hidden relative">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-110" />
                                        
                                        {/* Urgency Badge */}
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-lg z-10 animate-pulse">
                                            {discount}% OFF
                                        </div>

                                        {/* Quick Add Hover Bar */}
                                        <div className="absolute bottom-3 left-3 right-3 translate-y-14 group-hover:translate-y-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-20">
                                            <button className="w-full bg-[#222]/95 backdrop-blur-md text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#007074] shadow-2xl transition-colors">
                                                <FiShoppingBag size={14} /> Claim Deal
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="mt-6 px-1 text-center">
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5 block">
                                        {product.brand}
                                    </span>
                                    <h3 className="text-[14px] font-bold text-[#222] hover:text-[#007074] transition-colors leading-tight line-clamp-1 mb-2">
                                        {product.name}
                                    </h3>

                                    {/* Pricing */}
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <span className="text-[16px] font-black text-[#007074]">
                                            Rs. {product.salePrice.toLocaleString()}
                                        </span>
                                        <span className="text-[12px] text-gray-600 line-through font-bold opacity-60">
                                            Rs. {product.originalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Scarcity Stock Bar */}
                                    <div className="space-y-2 px-2">
                                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                                            <span>Sold: {product.soldStock}%</span>
                                            <span className={product.soldStock > 80 ? "text-red-500 animate-pulse" : ""}>
                                                {product.soldStock > 80 ? "ALMOST GONE" : "LIMITED STOCK"}
                                            </span>
                                        </div>
                                        <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 delay-500 rounded-full ${product.soldStock > 80 ? 'bg-red-500' : 'bg-[#007074]'}`}
                                                style={{ width: `${product.soldStock}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Call to Action */}
                <div className="mt-10 text-center">
                    <Link to="/category" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#222] hover:text-[#007074] transition-all group">
                        Discover All Active Deals
                        <div className="w-8 h-[1px] bg-gray-200 group-hover:w-12 group-hover:bg-[#007074] transition-all duration-500" />
                        <FiChevronRight className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>
            </div>

            <style jsx="true">{`
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    opacity: 0;
                    animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </section>
    );
}