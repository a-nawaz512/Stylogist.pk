import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function TestimonialSlider() {
    // --- MOCK REVIEW DATA ---
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Verified Buyer",
            text: "Since integrating Stylogist into my wardrobe, I've seen a massive improvement in my confidence. The premium silk quality is simply unmatched.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
        },
        {
            id: 2,
            name: "David Patel",
            role: "Fashion Enthusiast",
            text: "I've tested numerous luxury brands, but Stylogist stands out for its intuitive AI curation. It knows my style better than I do!",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
        },
        {
            id: 3,
            name: "Emily Carter",
            role: "Loyal Customer",
            text: "The delivery to Bahawalpur was incredibly fast. The packaging felt like opening a gift. 10/10 shopping experience!",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
        },
        {
            id: 4,
            name: "Marcus Thorne",
            role: "Verified Buyer",
            text: "Absolutely phenomenal craftsmanship. The tailored fit of the trousers is perfect. I'll definitely be refreshing my whole closet here.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
        },
        {
            id: 5,
            name: "Aisha Rahman",
            role: "Style Consultant",
            text: "I recommend Stylogist to all my clients. The attention to detail, fabric quality, and personalized sizing are truly next-level.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        }
    ];

    // Duplicate for seamless loop
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <section className="relative w-full bg-[#FDFDFD] py-10 overflow-hidden font-sans border-t border-gray-100">
            
            {/* Background Accent Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#007074]/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="inline-block bg-[#007074]/10 text-[#007074] text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-[0.2em]">
                        Community Voice
                    </div>
                    <h2 className="text-2xl lg:text-5xl md:text-4xl font-serif font-black text-[#222] tracking-tight">
                        What People <span className="italic text-[#007074]">Say</span>
                    </h2>
                    <p className="text-gray-400 mt-5 text-[12px] sm:text-sm uppercase tracking-widest font-medium leading-relaxed">
                        Discover the Stylogist experience through the eyes of our global community.
                    </p>
                </div>
            </div>

            {/* The Infinite Marquee Container */}
            <div
                className="relative w-full flex overflow-hidden sm:py-10 slider-container"
                style={{ 
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
                }}
            >
                <div className="flex w-max animate-testimonial-scroll gap-8 px-4">
                    {duplicatedReviews.map((review, index) => (
                        <div
                            key={index}
                            className="w-[320px] md:w-[400px] bg-white p-8 rounded-[2rem] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,112,116,0.15)] hover:-translate-y-2 group cursor-pointer shrink-0 shadow-sm"
                        >
                            {/* Header: Avatar + Stars */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#007074] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="relative w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                </div>
                                <div className="flex text-yellow-400 text-[10px] gap-0.5 mt-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className="text-[#222] text-base font-black tracking-tight mb-1">{review.name}</h4>
                                <p className="text-[#007074] text-[9px] font-black uppercase tracking-[0.2em] mb-4">{review.role}</p>
                                
                                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium italic">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Injected Styles for the Senior Animation */}
            <style jsx="true">{`
                @keyframes scrollTestimonials {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-testimonial-scroll {
                    animation: scrollTestimonials 50s linear infinite;
                }
                .slider-container:hover .animate-testimonial-scroll {
                    animation-play-state: paused;
                }
                /* Custom Scrollbar for better UX if needed */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #007074;
                    border-radius: 10px;
                }
            `}</style>
        </section>
    );
}