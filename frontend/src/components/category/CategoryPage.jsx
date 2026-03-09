import React, { useState, useMemo } from 'react';
import { 
  FiFilter, FiChevronRight, FiChevronDown, FiStar, FiX, FiShoppingCart, FiHeart 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// ==========================================
// MOCK DATA (Expanded Categories)
// ==========================================
const MOCK_PRODUCTS = [
  // --- ORIGINAL 6 ---
  { id: 1, name: "Midnight Silk Wrap Dress", brand: "Stylogist Women", type: "Women", style: "Formal", price: 210, originalPrice: 250, discount: 16, rating: 4.8, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop" },
  { id: 2, name: "Classic Oxford Cotton Shirt", brand: "Stylogist Men", type: "Men", style: "Formal", price: 145, originalPrice: null, rating: 4.5, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop" },
  { id: 3, name: "Radiance Vitamin C Serum", brand: "Stylogist Beauty", type: "Beauty", style: "Skincare", price: 85, originalPrice: 110, discount: 22, rating: 5.0, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop" },
  { id: 4, name: "Gold Minimalist Watch", brand: "Accessories", type: "Accessories", style: "Minimalist", price: 320, originalPrice: 350, discount: 8, rating: 4.9, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1998&auto=format&fit=crop" },
  { id: 5, name: "Slim Fit Chino Trousers", brand: "Stylogist Men", type: "Men", style: "Casual", price: 120, originalPrice: null, rating: 4.4, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1974&auto=format&fit=crop" },
  { id: 6, name: "Pure Silk Scarf", brand: "Accessories", type: "Accessories", style: "Luxury", price: 95, originalPrice: 120, discount: 20, rating: 4.7, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2070&auto=format&fit=crop" },

  // --- WOMEN'S SECTION (6 MORE) ---
  { id: 7, name: "Cashmere Turtleneck", brand: "Stylogist Women", type: "Women", style: "Casual", price: 195, originalPrice: 225, discount: 13, rating: 4.9, image: "https://images.unsplash.com/photo-1574015974293-817f0efebb1b?q=80&w=1974&auto=format&fit=crop" },
  { id: 8, name: "High-Waist Tailored Trousers", brand: "Stylogist Women", type: "Women", style: "Formal", price: 140, originalPrice: null, rating: 4.6, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop" },
  { id: 9, name: "Velvet Cocktail Dress", brand: "Stylogist Women", type: "Women", style: "Formal", price: 280, originalPrice: 320, discount: 12, rating: 5.0, image: "https://images.unsplash.com/photo-1518183214770-9cffbbe7258a?q=80&w=1974&auto=format&fit=crop" },
  { id: 10, name: "Linen Summer Blazer", brand: "Stylogist Women", type: "Women", style: "Casual", price: 165, originalPrice: null, rating: 4.3, image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1978&auto=format&fit=crop" },
  { id: 11, name: "Pleated Midi Skirt", brand: "Stylogist Women", type: "Women", style: "Casual", price: 88, originalPrice: 110, discount: 20, rating: 4.5, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1974&auto=format&fit=crop" },
  { id: 12, name: "Satin Camisole Top", brand: "Stylogist Women", type: "Women", style: "Casual", price: 55, originalPrice: null, rating: 4.7, image: "https://images.unsplash.com/photo-1609357483215-0604b9319e7a?q=80&w=1974&auto=format&fit=crop" },

  // --- MEN'S SECTION (6 MORE) ---
  { id: 13, name: "Wool Blend Overcoat", brand: "Stylogist Men", type: "Men", style: "Formal", price: 350, originalPrice: 420, discount: 16, rating: 4.9, image: "https://images.unsplash.com/photo-1539571483399-6a56e01a88b5?q=80&w=1974&auto=format&fit=crop" },
  { id: 14, name: "Raw Denim Jeans", brand: "Stylogist Men", type: "Men", style: "Casual", price: 130, originalPrice: null, rating: 4.8, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926&auto=format&fit=crop" },
  { id: 15, name: "Italian Leather Loafers", brand: "Stylogist Men", type: "Men", style: "Formal", price: 215, originalPrice: 260, discount: 17, rating: 4.7, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1974&auto=format&fit=crop" },
  { id: 16, name: "Merino Wool Sweater", brand: "Stylogist Men", type: "Men", style: "Casual", price: 110, originalPrice: 135, discount: 18, rating: 4.6, image: "https://images.unsplash.com/photo-1610384029674-d6a053bd1b21?q=80&w=1974&auto=format&fit=crop" },
  { id: 17, name: "Premium Leather Belt", brand: "Accessories", type: "Men", style: "Casual", price: 65, originalPrice: null, rating: 4.4, image: "https://images.unsplash.com/photo-1624222247344-550fb805cc05?q=80&w=1974&auto=format&fit=crop" },
  { id: 18, name: "Linen Grandad Shirt", brand: "Stylogist Men", type: "Men", style: "Casual", price: 90, originalPrice: 110, discount: 18, rating: 4.5, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1974&auto=format&fit=crop" },

  // --- BEAUTY & ACCESSORIES (8 MORE) ---
  { id: 19, name: "Hyaluronic Acid Serum", brand: "Stylogist Beauty", type: "Beauty", style: "Skincare", price: 75, originalPrice: 90, discount: 16, rating: 4.9, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1974&auto=format&fit=crop" },
  { id: 20, name: "Rose Quartz Face Roller", brand: "Stylogist Beauty", type: "Beauty", style: "Wellness", price: 40, originalPrice: null, rating: 4.3, image: "https://images.unsplash.com/photo-1601049676518-d820512b3200?q=80&w=1974&auto=format&fit=crop" },
  { id: 21, name: "Sandalwood Beard Oil", brand: "Stylogist Beauty", type: "Beauty", style: "Grooming", price: 35, originalPrice: 45, discount: 22, rating: 4.8, image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1974&auto=format&fit=crop" },
  { id: 22, name: "Silver Herringbone Chain", brand: "Accessories", type: "Accessories", style: "Minimalist", price: 115, originalPrice: null, rating: 4.7, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1974&auto=format&fit=crop" },
  { id: 23, name: "Classic Tortoise Sunglasses", brand: "Accessories", type: "Accessories", style: "Classic", price: 180, originalPrice: 220, discount: 18, rating: 4.9, image: "https://images.unsplash.com/photo-1511499767350-a159402e5bf1?q=80&w=1974&auto=format&fit=crop" },
  { id: 24, name: "Canvas Weekend Bag", brand: "Accessories", type: "Accessories", style: "Travel", price: 210, originalPrice: null, rating: 4.6, image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1974&auto=format&fit=crop" },
  { id: 25, name: "Matte Clay Pomade", brand: "Stylogist Beauty", type: "Beauty", style: "Grooming", price: 28, originalPrice: 35, discount: 20, rating: 4.5, image: "https://images.unsplash.com/photo-1590156191108-de74e3056477?q=80&w=1974&auto=format&fit=crop" },
  { id: 26, name: "Gold Hoop Earrings", brand: "Accessories", type: "Accessories", style: "Classic", price: 125, originalPrice: 150, discount: 16, rating: 4.8, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop" }
];

const CATEGORIES = ['Men', 'Women', 'Accessories', 'Beauty'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function CategoryPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    if (selectedCategory !== 'All') result = result.filter(p => p.type === selectedCategory);
    result = result.filter(p => p.price <= maxPrice);
    
    switch (sortBy) {
      case 'price-low': return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      default: return result.sort((a, b) => a.id - b.id);
    }
  }, [selectedCategory, maxPrice, sortBy]);

  return (
    <div className="w-full bg-[#FDFDFD] font-sans text-[#222222] min-h-screen">
      
      {/* BREADCRUMBS */}
      <div className="container mx-auto px-4 md:px-8 py-6 max-w-7xl">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-[#007074] transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <span className="text-[#222222] font-black">Collections</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-24 max-w-7xl flex flex-col lg:flex-row gap-12">
        
        {/* ========================================= */}
        {/* SIDEBAR FILTERS                           */}
        {/* ========================================= */}
        <aside className="w-full lg:w-[240px] shrink-0">
          <div className="lg:sticky lg:top-24 space-y-10">
            
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Category</h3>
              <div className="flex flex-col gap-4">
                <button onClick={() => setSelectedCategory('All')} className={`text-sm text-left font-bold transition-all ${selectedCategory === 'All' ? 'text-[#007074] pl-2 border-l-2 border-[#007074]' : 'text-gray-500 hover:text-[#222222]'}`}>All Collections</button>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm text-left font-bold transition-all ${selectedCategory === cat ? 'text-[#007074] pl-2 border-l-2 border-[#007074]' : 'text-gray-500 hover:text-[#222222]'}`}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Price Range</h3>
                <span className="text-xs font-bold text-[#007074]">${maxPrice}</span>
              </div>
              <input type="range" min="50" max="500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#007074]" />
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Size</h3>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <button key={size} onClick={() => toggleSize(size)} className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${selectedSizes.includes(size) ? 'bg-[#222] text-white border-[#222]' : 'bg-white text-gray-400 border-gray-100 hover:border-[#007074]'}`}>{size}</button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================= */}
        {/* PRODUCT GRID                              */}
        {/* ========================================= */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-serif font-black tracking-tight text-[#222] mb-2">{selectedCategory}</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredProducts.length} unique pieces</p>
            </div>
            
            <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer text-[#007074]">
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative flex flex-col animate-fadeIn">
                
                {/* Image Container with Hover Actions */}
                <div className="relative aspect-[3/4] rounded-[2rem] bg-white border border-gray-100 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 overflow-hidden">
                  
                  <div className="w-full h-full bg-[#F7F3F0] rounded-[1.5rem] overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                    
                    {/* Floating Heart */}
                    <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm translate-y-2 group-hover:translate-y-0">
                      <FiHeart size={16} />
                    </button>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-all duration-500">
                      <button className="w-full bg-[#222]/95 backdrop-blur-md text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#007074] shadow-xl">
                        <FiShoppingCart size={14} /> Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info Section */}
                <div className="mt-6 px-2 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{product.brand}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-bold text-[#222] mb-2 hover:text-[#007074] transition-colors">{product.name}</h3>
                  </Link>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-base font-black text-[#222]">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-300 line-through font-bold">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Production Star Display */}
                  <div className="flex justify-center items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-[10px] font-black text-gray-300 ml-1">{product.rating}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <FiFilter size={32} />
              </div>
              <h3 className="text-xl font-serif font-black mb-2">No items match your filters</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Try adjusting your price range or category</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}