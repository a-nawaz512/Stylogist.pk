import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEdit2, FiTrash2, FiPackage, FiEye } from 'react-icons/fi';

export default function ProductList({
  products,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <Toolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Brand</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Stock</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-slate-400 text-sm">
                  {search ? 'No matches.' : 'No products yet. Create your first one.'}
                </td></tr>
              ) : (
                products.map((p) => (
                  <ProductRow key={p._id} product={p} onEdit={onEdit} onDelete={onDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Toolbar({ search, setSearch, statusFilter, setStatusFilter }) {
  const opts = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or slug"
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074]"
        />
      </div>
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
        {opts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === opt.value ? 'bg-[#007074] text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductRow({ product: p, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {p.image ? (
              <img src={p.image} alt={p.name} width="40" height="40" className="w-full h-full object-cover" />
            ) : (
              <FiPackage size={14} className="text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
            <div className="text-xs text-slate-400 truncate">/{p.slug}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{p.category?.name || '—'}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{p.brand?.name || '—'}</td>
      <td className="px-4 py-3 text-right text-sm text-slate-900 font-medium">
        {p.minPrice != null ? `Rs ${p.minPrice.toLocaleString()}` : '—'}
      </td>
      <td className="px-4 py-3 text-right text-sm">
        <span className={p.totalStock === 0 ? 'text-red-600' : 'text-slate-700'}>
          {p.totalStock ?? 0}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
            p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {p.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          {/* Opens the public storefront PDP in a new tab so the admin can
              QA pricing, copy and SEO without losing their place in the list. */}
          <Link
            to={`/product/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-[#007074] hover:bg-teal-50"
            title="View product page"
          >
            <FiEye size={14} />
          </Link>
          <button
            onClick={() => onEdit(p)}
            className="w-8 h-8 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-[#007074] hover:bg-[#007074]/10"
            title="Edit product"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(p)}
            className="w-8 h-8 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50"
            title="Delete product"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
