import React, { useState, useMemo } from "react";
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiPackage,
  FiImage, FiUploadCloud, FiChevronDown, FiX, FiCheck
} from "react-icons/fi";

export default function ProductManage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editProduct, setEditProduct] = useState(null);

 const initialProducts = [
  {
    id: 1,
    name: "Silk Satin Slip Dress",
    category: "Women's Fashion",
    subCategory: "Dresses",
    price: "12,999",
    stock: 15,
    sku: "ST-SLK-001",
    status: "Active",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200"
  },
  {
    id: 2,
    name: "Onyx Chronograph Watch",
    category: "Accessories",
    subCategory: "Watches",
    price: "24,500",
    stock: 4,
    sku: "ST-WTH-092",
    status: "Low Stock",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200"
  },
  {
    id: 3,
    name: "Velvet Midnight Wrap",
    category: "Women's Fashion",
    subCategory: "Outerwear",
    price: "6,400",
    stock: 0,
    sku: "ST-VLV-044",
    status: "Out of Stock",
    img: "https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=200"
  },
  {
    id: 4,
    name: "Classic White Sneakers",
    category: "Footwear",
    subCategory: "Sneakers",
    price: "9,800",
    stock: 22,
    sku: "ST-SNK-118",
    status: "Active",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200"
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    category: "Accessories",
    subCategory: "Bags",
    price: "7,500",
    stock: 7,
    sku: "ST-BAG-210",
    status: "Low Stock",
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=200"
  },
  {
    id: 6,
    name: "Premium Denim Jacket",
    category: "Men's Apparel",
    subCategory: "Jackets",
    price: "11,200",
    stock: 18,
    sku: "ST-JKT-071",
    status: "Active",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200"
  },
  {
    id: 7,
    name: "Minimalist Gold Necklace",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "5,900",
    stock: 3,
    sku: "ST-JWL-333",
    status: "Low Stock",
    img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=200"
  },
  {
    id: 8,
    name: "Urban Slim Fit Jeans",
    category: "Men's Apparel",
    subCategory: "Denim",
    price: "6,800",
    stock: 0,
    sku: "ST-DNM-512",
    status: "Out of Stock",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200"
  },
  {
    id: 9,
    name: "Oversized Cotton Hoodie",
    category: "Men's Apparel",
    subCategory: "Hoodies",
    price: "4,900",
    stock: 26,
    sku: "ST-HOD-811",
    status: "Active",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=200"
  },
  {
    id: 10,
    name: "Luxury Silk Scarf",
    category: "Accessories",
    subCategory: "Scarves",
    price: "3,700",
    stock: 9,
    sku: "ST-SCF-623",
    status: "Low Stock",
    img: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=200"
  }
];

  const [products, setProducts] = useState(initialProducts);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "Women's Fashion",
    img: null
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = filterStatus === "All" || product.status === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [products, searchQuery, filterStatus]);

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditProduct({ ...editProduct, img: reader.result });
        } else {
          setFormData({ ...formData, img: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const status = formData.stock == 0 ? "Out of Stock" : formData.stock < 10 ? "Low Stock" : "Active";
    setProducts([...products, { id: Date.now(), ...formData, status }]);
    setShowAddForm(false);
    setFormData({ name: "", sku: "", price: "", stock: "", category: "Women's Fashion", img: null });
  };

  const handleUpdate = () => {
    setProducts(products.map((p) => (p.id === editProduct.id ? editProduct : p)));
    setEditProduct(null);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 px-4 md:px-0 bg-white min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#222222] uppercase tracking-tight">Product Registry</h1>
          <p className="text-xs text-[#007074] font-bold uppercase tracking-widest">Inventory Management System</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-[#007074] text-white rounded-2xl flex  justify-center items-center gap-2 font-bold text-center uppercase text-[10px] tracking-widest shadow-lg shadow-[#007074]/20 transition-transform active:scale-95"
        >
          {showAddForm ? <FiEye /> : <FiPlus />}
          {showAddForm ? "View Inventory" : "Add New Asset"}
        </button>
      </div>

      {!showAddForm ? (
        <>
          {/* SEARCH + FILTER */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007074] transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or SKU Index..."
                className="w-full border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/5 transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-2xl py-3 px-4 appearance-none text-sm font-bold outline-none focus:border-[#007074]/30"
              >
                <option>All</option>
                <option>Active</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#007074]" />
            </div>
          </div>

          {/* TABLE */}
          <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Identity</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">SKU</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Pricing</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Status</th>
                    <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-[#007074]/5 transition-colors group">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                          <img src={item.img} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-bold text-[#222222] text-sm group-hover:text-[#007074] transition-colors">{item.name}</span>
                      </td>
                      <td className="p-6 text-xs font-bold text-gray-500 tracking-tighter uppercase">{item.sku}</td>
                      <td className="p-6 font-black text-[#222222] text-sm">Rs. {item.price}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          item.stock === 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {item.stock} Units
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button onClick={() => setEditProduct(item)} className="p-2 text-gray-400 hover:text-[#007074] transition-colors"><FiEdit2 /></button>
                        <button onClick={() => setProducts(products.filter(p => p.id !== item.id))} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ADD PRODUCT FORM (Clean Split View) */
        <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in duration-500">
           <form onSubmit={handleAddProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                  <FiPackage className="text-[#007074]" size={20}/>
                  <h3 className="font-black uppercase tracking-widest text-sm text-[#222222]">Asset Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Product Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <InputField label="SKU Index" name="sku" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                  <InputField label="Price (PKR)" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  <InputField label="Opening Stock" name="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div className="space-y-6 border-l border-gray-50 pl-0 lg:pl-12">
                 <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                   <FiImage className="text-[#007074]" size={20}/>
                   <h3 className="font-black uppercase tracking-widest text-sm text-[#222222]">Media Control</h3>
                 </div>
                 <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-[#007074] transition-all">
                    {formData.img ? <img src={formData.img} className="h-full w-full object-contain p-4" /> : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUploadCloud size={30} className="text-gray-400 mb-2" />
                        <p className="text-[10px] font-black uppercase text-gray-400">Upload JPG/PNG</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e)} />
                 </label>
                 <button className="w-full bg-[#007074] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#007074]/20">Add Product</button>
              </div>
           </form>
        </div>
      )}

      {/* EDIT MODAL (Enhanced Aesthetic Layout) */}
      {editProduct && (
        <div className="fixed inset-0 z-[100] bg-[#222222]/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Left Column: Data */}
              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                 <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-5">
                    <h2 className="text-xl font-black text-[#222222] uppercase tracking-tighter flex items-center gap-3">
                       <FiEdit2 className="text-[#007074]" /> Update Asset
                    </h2>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Asset Name" value={editProduct.name} onChange={(e) => setEditProduct({...editProduct, name: e.target.value})} />
                    <InputField label="Price (PKR)" value={editProduct.price} onChange={(e) => setEditProduct({...editProduct, price: e.target.value})} />
                    <InputField label="Stock Units" type="number" value={editProduct.stock} onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})} />
                    <InputField label="SKU Code" value={editProduct.sku} onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})} />
                 </div>
              </div>

              {/* Right Column: Media & Actions */}
              <div className="w-full md:w-[350px] bg-gray-50/50 p-8 md:p-12 border-l border-gray-100 flex flex-col">
                 <div className="mb-6">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Visual Asset</label>
                    <div className="mt-3 relative group rounded-3xl overflow-hidden border-4 border-white shadow-xl aspect-square">
                       <img src={editProduct.img} className="w-full h-full object-cover" alt="" />
                       <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <FiUploadCloud className="text-white" size={24} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
                       </label>
                    </div>
                 </div>
                 <div className="mt-auto space-y-3">
                    <button onClick={handleUpdate} className="w-full bg-[#007074] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                       <FiCheck /> Update Product
                    </button>
                    <button onClick={() => setEditProduct(null)} className="w-full bg-white text-gray-400 border-2 border-gray-100 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-red-500 hover:border-red-100 transition-all">
                       Discard Changes
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 group-focus-within:text-[#007074] transition-colors">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50/50 border-2 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-[#222222] outline-none transition-all focus:bg-white focus:border-[#007074]/30 focus:ring-4 focus:ring-[#007074]/5"
      />
    </div>
  );
}