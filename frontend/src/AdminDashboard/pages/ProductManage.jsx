import React, { useState } from 'react';
import { 
  FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, 
  FiEye, FiPackage, FiImage, FiUploadCloud, FiTag,
  FiChevronDown, FiClock, FiCheckCircle
} from 'react-icons/fi';

export default function ProductManage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState(['M']);

  // Production-Level Mock Data
  const products = [
    { 
      id: 1, name: "Silk Satin Slip Dress", category: "Women's Fashion", subCategory: "Dresses",
      price: "12,999", stock: 15, sku: "ST-SLK-001", status: "Active",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200" 
    },
    { 
      id: 2, name: "Onyx Chronograph Watch", category: "Accessories", subCategory: "Watches",
      price: "24,500", stock: 4, sku: "ST-WTH-092", status: "Low Stock",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200" 
    },
    { 
      id: 3, name: "Velvet Midnight Wrap", category: "Women's Fashion", subCategory: "Outerwear",
      price: "6,400", stock: 0, sku: "ST-VLV-044", status: "Out of Stock",
      img: "https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=200" 
    },
  ];

  const customStyles = `
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-cascade { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `;

  return (
    <div className="space-y-8 pb-10">
      <style>{customStyles}</style>
      
      {/* 1. HEADER & ACTIONS (0ms delay) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-cascade" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Registry</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Manage Stylogist Catalog & Inventory</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all duration-300 active:scale-95 shadow-xl ${
            showAddForm 
            ? 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50' 
            : 'bg-[#007074] text-white hover:bg-[#005a5d] shadow-[#007074]/20 hover:shadow-[0_15px_30px_-10px_rgba(0,112,116,0.4)] transform hover:-translate-y-1'
          }`}
        >
          {showAddForm ? <FiEye size={16} /> : <FiPlus size={16} />} 
          {showAddForm ? 'View Registry' : 'Deploy New Product'}
        </button>
      </div>

      {!showAddForm ? (
        <>
          {/* 2. FILTERS & SEARCH (100ms delay) */}
          <div className="flex flex-col md:flex-row gap-4 animate-cascade" style={{ animationDelay: '100ms' }}>
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007074] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by product name, SKU, or tag..." 
                className="w-full bg-white border border-slate-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-900 shadow-sm outline-none focus:ring-4 focus:ring-[#007074]/10 focus:border-[#007074]/30 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-[#007074] hover:shadow-md transition-all active:scale-95">
              <FiFilter size={16} /> Advanced Filters
            </button>
          </div>

          {/* 3. PRODUCT TABLE (200ms delay) */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden animate-cascade" style={{ animationDelay: '200ms' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Identity</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxonomy / SKU</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Level</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((item, index) => (
                    <tr key={item.id} className="hover:bg-teal-50/30 transition-all duration-300 group cursor-pointer animate-cascade" style={{ animationDelay: `${300 + (index * 100)}ms` }}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5 transform transition-transform duration-300 group-hover:translate-x-2">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200 group-hover:border-[#007074]/30 transition-colors">
                             <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-[#007074] transition-colors">{item.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 transform transition-transform duration-300 group-hover:translate-x-1">
                        <p className="text-xs font-bold text-slate-800">{item.sku}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {item.category} <span className="text-teal-500 mx-1">•</span> {item.subCategory}
                        </p>
                      </td>
                      <td className="px-8 py-5 transform transition-transform duration-300 group-hover:translate-x-1">
                        <p className="text-sm font-black text-slate-900 tracking-tighter">Rs. {item.price}</p>
                      </td>
                      <td className="px-8 py-5 transform transition-transform duration-300 group-hover:translate-x-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                          item.stock > 10 ? 'bg-green-50 text-green-600 border border-green-100' : 
                          item.stock > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {item.stock > 0 ? <FiCheckCircle size={10} /> : <FiClock size={10} />}
                          {item.stock > 0 ? `${item.stock} Units` : 'Depleted'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-2 transform transition-transform duration-300 group-hover:-translate-x-2">
                        <button className="p-3 text-slate-400 hover:text-[#007074] hover:bg-teal-50 rounded-xl transition-all"><FiEdit2 size={16}/></button>
                        <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* 4. ADD PRODUCT FORM - Fully Comprehensive */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] p-8 md:p-12 animate-cascade" style={{ animationDelay: '100ms' }}>
          <form className="space-y-12">
            
            {/* Row 1: Basic Info & Media */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               
               {/* Left: Metadata */}
               <div className="xl:col-span-2 space-y-8">
                  <FormSectionHeader title="Asset Definition" icon={<FiPackage />} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Product Title" placeholder="e.g. Velvet Midnight Wrap" />
                    <InputField label="SKU Code" placeholder="ST-VLV-044" />
                    
                    {/* Select Dropdowns for Taxonomy */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/10 transition-all appearance-none cursor-pointer">
                          <option>Women's Fashion</option>
                          <option>Men's Apparel</option>
                          <option>Accessories</option>
                        </select>
                        <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Sub-Category</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/10 transition-all appearance-none cursor-pointer">
                          <option>Outerwear</option>
                          <option>Dresses</option>
                          <option>Tops</option>
                        </select>
                        <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Description</label>
                        <textarea className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-6 text-sm font-medium text-slate-900 outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/10 transition-all min-h-[120px]" placeholder="Detailed rich text description..."></textarea>
                    </div>
                  </div>
               </div>
               
               {/* Right: Media Upload */}
               <div className="space-y-8">
                  <FormSectionHeader title="Media Engine" icon={<FiImage />} />
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group hover:border-[#007074] hover:bg-[#007074]/5 transition-all cursor-pointer h-[calc(100%-4rem)] min-h-[250px]">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                        <FiUploadCloud size={28} className="text-slate-400 group-hover:text-[#007074] transition-colors" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Drag & Drop Assets</p>
                      <p className="text-xs text-slate-400 font-medium max-w-[200px]">Supports high-res JPG, PNG, WEBP. Max 5MB per file.</p>
                  </div>
               </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100" />

            {/* Row 2: Economics, Variants & SEO */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
               
               <div className="space-y-8">
                  <FormSectionHeader title="Economics & Variants" icon={<FiTag />} />
                  
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label="Sale Price (Rs)" placeholder="6,400" />
                    <InputField label="Original Price (Rs)" placeholder="8,000" />
                    <InputField label="Stock Quantity" placeholder="50" type="number" />
                    <InputField label="Deal Days Countdown" placeholder="3" type="number" />
                  </div>

                  {/* Variants Configuration */}
                  <div className="pt-4 space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Available Sizes</label>
                     <div className="flex flex-wrap gap-3">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <button 
                            type="button"
                            key={size}
                            onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              selectedSizes.includes(size) 
                              ? 'bg-[#007074] text-white border-[#007074] shadow-lg shadow-[#007074]/20 scale-105' 
                              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <FormSectionHeader title="Search Engine Optimization" icon={<FiSearch />} />
                  <div className="space-y-6">
                    <InputField label="SEO Meta Title" placeholder="Velvet Midnight Wrap | Stylogist" />
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Meta Description</label>
                        <textarea className="w-full bg-slate-50 border-2 border-transparent rounded-2xl p-4 text-sm font-medium text-slate-900 outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/10 transition-all h-24" placeholder="Brief 160 character description..."></textarea>
                    </div>
                    <InputField label="Global Tags (Comma Separated)" placeholder="winter, velvet, luxury, dark" />
                  </div>
               </div>
            </div>

            {/* Form Footer Actions */}
            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 -mx-8 -mb-8 md:-mx-12 md:-mb-12 p-8 md:p-12 rounded-b-[2.5rem]">
                <button type="button" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto px-10 py-4.5 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-slate-900 hover:bg-slate-200/50 rounded-2xl transition-all">
                  Cancel Deployment
                </button>
                <button type="submit" className="w-full sm:w-auto bg-[#007074] text-white px-12 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#005a5d] shadow-xl shadow-[#007074]/20 transition-all active:scale-95 transform hover:-translate-y-1 ml-auto">
                  Publish to Database
                </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

function FormSectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
      <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#007074] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">{title}</h3>
    </div>
  );
}

// Fully Controlled Input Field Ready for MERN Integration
function InputField({ label, placeholder, type = "text", name, value, onChange }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-[#007074] transition-colors">
        {label}
      </label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/10 transition-all shadow-sm hover:border-slate-200"
      />
    </div>
  );
}