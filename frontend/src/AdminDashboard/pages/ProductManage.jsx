import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiPackage, FiImage, FiUploadCloud,
  FiTag, FiChevronDown, FiX, FiLoader, FiAlertTriangle, FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useProductById,
} from '../../features/products/useProductHooks';
import {
  useCategories,
  useCreateCategory,
} from '../../features/categories/useCategoryHooks';
import {
  useBrands,
  useCreateBrand,
} from '../../features/brands/useBrandHooks';
import { useUploadImage, useUploadImages } from '../../features/uploads/useUploadHooks';
import axiosClient from '../../api/axiosClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const slugify = (value) =>
  (value || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formats = [
  'header', 'font', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent', 'align',
  'link', 'image', 'video'
];

const emptyVariant = () => ({
  sku: '',
  size: '',
  color: '',
  material: '',
  originalPrice: '',
  salePrice: '',
  stock: '',
});

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  category: '',
  subCategory: '',
  brand: '',
  status: 'draft',
  isFeatured: false,
  variants: [emptyVariant()],
  thumbnail: null, // { url, filename, slug, metaTitle, metaDescription, alt }
  media: [],       // [{ url, filename, slug, metaTitle, metaDescription, alt }]
};

export default function ProductManage() {
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const [offcanvas, setOffcanvas] = useState(null); // 'category' | 'brand' | null

  const { data: productsResp, isLoading: loadingProducts } = useProducts({ status: statusFilter, limit: 100 });
  const { data: categories = [] } = useCategories({ active: 'all' });
  const { data: brands = [] } = useBrands();
  const { data: editingProductData } = useProductById(editingId);
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const deleteMut = useDeleteProduct();
  const uploadOne = useUploadImage();
  const uploadMany = useUploadImages();

  const products = productsResp?.items ?? [];

  const { topCategories, subCategories } = useMemo(() => {
    const tops = categories.filter((c) => c.level === 0);
    const subs = form.category ? categories.filter((c) => String(c.parent) === form.category) : [];
    return { topCategories: tops, subCategories: subs };
  }, [categories, form.category]);

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q)
    );
  }, [products, search]);

  // When the editing query resolves, hydrate the form with the fetched product.
  useEffect(() => {
    if (!editingId || !editingProductData) return;
    const { product, variants = [], media = [] } = editingProductData;
    const thumbDoc = media.find((m) => m.isThumbnail) || null;
    const gallery = media.filter((m) => !m.isThumbnail);
    setForm({
      
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      category: product.category?._id || product.category || '',
      subCategory: product.subCategory?._id || product.subCategory || '',
      brand: product.brand?._id || product.brand || '',
      status: product.status || 'draft',
      isFeatured: !!product.isFeatured,
      variants: variants.length
        ? variants.map((v) => ({
          sku: v.sku || '',
          size: v.size || '',
          color: v.color || '',
          material: v.material || '',
          originalPrice: v.originalPrice ?? '',
          salePrice: v.salePrice ?? '',
          stock: v.stock ?? '',
        }))
        : [emptyVariant()],
      thumbnail: thumbDoc
        ? {
          url: thumbDoc.url,
          filename: thumbDoc.filename,
          slug: thumbDoc.slug,
          metaTitle: thumbDoc.metaTitle || '',
          metaDescription: thumbDoc.metaDescription || '',
          alt: thumbDoc.alt || '',
        }
        : null,
      media: gallery.map((m) => ({
        url: m.url,
        filename: m.filename,
        slug: m.slug,
        metaTitle: m.metaTitle || '',
        metaDescription: m.metaDescription || '',
        alt: m.alt || '',
      })),
    });
  }, [editingId, editingProductData]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setView('list');
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setView('form');
  };

  const handleGenerateSlug = () => {
    if (!form.name.trim()) {
      toast.error('Enter a product name first');
      return;
    }
    const next = slugify(form.name);
    setForm((f) => ({ ...f, slug: next }));
    toast.success('Slug generated');
  };

  const updateVariant = (idx, patch) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)),
    }));
  };

  const addVariant = () => {
    setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  };

  const removeVariant = (idx) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.length > 1 ? f.variants.filter((_, i) => i !== idx) : f.variants,
    }));
  };

  // --- Thumbnail upload (single) ---
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const productSlug = form.slug || slugify(form.name) || 'product';
    try {
      const res = await uploadOne.mutateAsync({
        file,
        productSlug,
        role: 'thumbnail',
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        alt: form.metaTitle || form.name,
      });
      setForm((f) => ({
        ...f,
        thumbnail: {
          url: res.url,
          filename: res.filename,
          slug: res.slug,
          metaTitle: res.metaTitle || f.metaTitle,
          metaDescription: res.metaDescription || f.metaDescription,
          alt: res.alt || f.metaTitle || f.name,
        },
      }));
      toast.success('Thumbnail uploaded');
    } catch {
      /* hook toast */
    }
    e.target.value = '';
  };

  const removeThumbnail = () => setForm((f) => ({ ...f, thumbnail: null }));

  // --- Gallery upload (multi) ---
  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const productSlug = form.slug || slugify(form.name) || 'product';
    const startIndex = (form.media?.length || 0) + 1;
    try {
      const uploaded = await uploadMany.mutateAsync({
        files,
        productSlug,
        startIndex,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
      });
      setForm((f) => ({
        ...f,
        media: [
          ...f.media,
          ...uploaded.map((u) => ({
            url: u.url,
            filename: u.filename,
            slug: u.slug,
            metaTitle: u.metaTitle || f.metaTitle,
            metaDescription: u.metaDescription || f.metaDescription,
            alt: u.alt || f.metaTitle || f.name,
          })),
        ],
      }));
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch {
      /* hook toast */
    }
    e.target.value = '';
  };

  const removeMedia = (url) => {
    setForm((f) => ({ ...f, media: f.media.filter((m) => m.url !== url) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Name is required');
    const plainShortDesc = form.shortDescription.replace(/<[^>]*>/g, '').trim();
    if (form.shortDescription && plainShortDesc.length > 200) {
      return toast.error('Short description should be under 200 characters');
    }
    const plainDesc = form.description.replace(/<[^>]*>/g, '').trim();
    if (!plainDesc || plainDesc.length < 5)
      return toast.error('Description must be at least 5 characters');
    if (!form.category) return toast.error('Select a category');

    const variants = form.variants.map((v) => ({
      sku: v.sku.trim() || undefined,
      size: v.size.trim() || undefined,
      color: v.color.trim() || undefined,
      material: v.material.trim() || undefined,
      originalPrice: Number(v.originalPrice),
      salePrice: Number(v.salePrice),
      stock: Number(v.stock),
    }));

    for (const [i, v] of variants.entries()) {
      if (Number.isNaN(v.originalPrice) || Number.isNaN(v.salePrice) || Number.isNaN(v.stock)) {
        return toast.error(`Variant ${i + 1}: numeric fields required`);
      }
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      metaTitle: form.metaTitle.trim() || undefined,
      metaDescription: form.metaDescription.trim() || undefined,
      category: form.category,
      subCategory: form.subCategory || undefined,
      brand: form.brand || undefined,
      status: form.status,
      isFeatured: form.isFeatured,
      variants,
      thumbnail: form.thumbnail
        ? {
          url: form.thumbnail.url,
          filename: form.thumbnail.filename,
          slug: form.thumbnail.slug,
          metaTitle: form.thumbnail.metaTitle,
          metaDescription: form.thumbnail.metaDescription,
          alt: form.thumbnail.alt,
          isThumbnail: true,
          position: 0,
        }
        : undefined,
      media: form.media.length
        ? form.media.map((m, idx) => ({
          url: m.url,
          filename: m.filename,
          slug: m.slug,
          metaTitle: m.metaTitle,
          metaDescription: m.metaDescription,
          alt: m.alt,
          position: idx + 1,
        }))
        : [],
    };

    try {
      if (editingId) {
        await updateMut.mutateAsync({ id: editingId, payload });
      } else {
        await createMut.mutateAsync(payload);
      }
      resetForm();
    } catch {
      /* hook toast */
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      setDeleteTarget(null);
    } catch {
      /* hook toast */
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {view === 'list'
              ? 'All products across your catalog.'
              : editingId
                ? 'Edit an existing product.'
                : 'Add a new product to your catalog.'}
          </p>
        </div>
        <button
          onClick={() => (view === 'list' ? setView('form') : resetForm())}
          className="px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] flex items-center gap-2"
        >
          {view === 'list' ? (<><FiPlus size={16} /> New product</>) : (<><FiEye size={16} /> View list</>)}
        </button>
      </header>

      {view === 'list' ? (
        <ListView
          products={filteredProducts}
          loading={loadingProducts}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEdit={startEdit}
          onDelete={setDeleteTarget}
        />
      ) : (
        <ProductForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          topCategories={topCategories}
          subCategories={subCategories}
          brands={brands}
          onGenerateSlug={handleGenerateSlug}
          onThumbnailUpload={handleThumbnailUpload}
          onRemoveThumbnail={removeThumbnail}
          onMediaUpload={handleMediaUpload}
          onRemoveMedia={removeMedia}
          addVariant={addVariant}
          removeVariant={removeVariant}
          updateVariant={updateVariant}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          submitting={createMut.isPending || updateMut.isPending}
          uploadingOne={uploadOne.isPending}
          uploadingMany={uploadMany.isPending}
          onOpenCategory={() => setOffcanvas('category')}
          onOpenBrand={() => setOffcanvas('brand')}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <FiAlertTriangle size={22} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 text-center">Delete product</h3>
            <p className="text-sm text-slate-500 mt-2 text-center">
              Permanently delete <span className="font-medium text-slate-800">{deleteTarget.name}</span> and all its variants & media?
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMut.isPending}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {offcanvas === 'category' && (
        <CategoryOffcanvas
          categories={categories}
          onClose={() => setOffcanvas(null)}
          onCreated={(cat) => {
            setForm((f) => ({ ...f, category: cat._id }));
            setOffcanvas(null);
          }}
        />
      )}
      {offcanvas === 'brand' && (
        <BrandOffcanvas
          onClose={() => setOffcanvas(null)}
          onCreated={(brand) => {
            setForm((f) => ({ ...f, brand: brand._id }));
            setOffcanvas(null);
          }}
        />
      )}
    </div>
  );
}

function ListView({ products, loading, search, setSearch, statusFilter, setStatusFilter, onEdit, onDelete }) {
  return (
    <>
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
          {[
            { value: 'all', label: 'All' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${statusFilter === opt.value
                ? 'bg-[#007074] text-white'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

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
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
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
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProductForm({
  form,
  setForm,
  editingId,
  topCategories,
  subCategories,
  brands,
  onGenerateSlug,
  onThumbnailUpload,
  onRemoveThumbnail,
  onMediaUpload,
  onRemoveMedia,
  addVariant,
  removeVariant,
  updateVariant,
  onSubmit,
  onCancel,
  submitting,
  uploadingOne,
  uploadingMany,
  onOpenCategory,
  onOpenBrand,
}) {
  // Custom Quill image handlers. Each editor gets its own so its ref stays stable.
  const descriptionRef = useRef(null);
  const shortRef = useRef(null);

  const uploadQuillImage = async (editorRef) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('role', 'editor');
        if (form.slug) fd.append('productSlug', form.slug);
        else if (form.name) fd.append('productSlug', slugify(form.name));
        if (form.metaTitle) {
          fd.append('metaTitle', form.metaTitle);
          fd.append('alt', form.metaTitle);
        }
        if (form.metaDescription) fd.append('metaDescription', form.metaDescription);
        const { data } = await axiosClient.post('/uploads/image', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const url = data.data.url;
        const editor = editorRef.current?.getEditor();
        if (!editor) return;
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, 'image', url, 'user');
        editor.setSelection(range.index + 1);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Image upload failed');
      }
    };
    input.click();
  };

  const descriptionModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: () => uploadQuillImage(descriptionRef),
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [form.slug, form.name, form.metaTitle, form.metaDescription]);

  const shortModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
        ['clean'],
      ],
      handlers: {
        image: () => uploadQuillImage(shortRef),
      },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [form.slug, form.name, form.metaTitle, form.metaDescription]);

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: core fields */}
      <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <SectionTitle icon={<FiPackage size={14} />}>Details</SectionTitle>

        <Field label="Product name" required>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Silk Satin Slip Dress"
            className={inputCls}
          />
        </Field>

        <Field
          label="Slug"
          hint={editingId
            ? 'Leave unchanged to keep the existing slug. Regenerate only if you really need a new URL.'
            : 'Click "Generate slug" to derive one from the product name.'}
        >
          <div className="flex items-stretch gap-2">
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              placeholder="silk-satin-slip-dress"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={onGenerateSlug}
              className="shrink-0 px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <FiRefreshCw size={12} /> Generate slug
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Meta title" hint="For search engines (50–60 chars)">
            <input
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              placeholder="Silk Satin Slip Dress | Stylogist"
              className={inputCls}
              maxLength={80}
            />
          </Field>
          <Field label="Meta description" hint="For search engines (140–160 chars)">
            <input
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              placeholder="Featherlight silk slip dress in a minimal silhouette…"
              className={inputCls}
              maxLength={200}
            />
          </Field>
        </div>

        <Field label="Short description" hint="One-line blurb shown in listings">
          <div className="bg-white rounded-lg relative border border-slate-200 focus-within:ring-2 focus-within:ring-[#007074]/20 focus-within:border-[#007074] z-20">
            <ReactQuill
              ref={shortRef}
              theme="snow"
              value={form.shortDescription}
              onChange={(value) => setForm({ ...form, shortDescription: value })}
              modules={shortModules}
              placeholder="Featherlight silk in a minimal silhouette..."
              className="short-quill"
            />
          </div>
        </Field>

        <Field label="Description" required>
          <div className="bg-white rounded-lg relative border border-slate-200 focus-within:ring-2 focus-within:ring-[#007074]/20 focus-within:border-[#007074] z-10">
            <ReactQuill
              ref={descriptionRef}
              theme="snow"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              modules={descriptionModules}
              formats={formats}
              placeholder="Write a detailed product description..."
              className="quill-editor"
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Category" required>
            <div className="flex items-stretch gap-2">
              <div className="flex-1">
                <SelectInput
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v, subCategory: '' })}
                  options={topCategories.map((c) => ({ value: c._id, label: c.name }))}
                  placeholder="Select category"
                />
              </div>
              <button
                type="button"
                onClick={onOpenCategory}
                className="shrink-0 px-2 py-2 border border-slate-200 rounded-lg text-xs font-medium text-[#007074] hover:bg-[#007074]/5 flex items-center gap-1"
                title="Add new category"
              >
                <FiPlus size={12} /> Add
              </button>
            </div>
          </Field>
          <Field label="Sub-category" hint={!form.category ? 'Pick a category first' : undefined}>
            <SelectInput
              value={form.subCategory}
              onChange={(v) => setForm({ ...form, subCategory: v })}
              options={subCategories.map((c) => ({ value: c._id, label: c.name }))}
              placeholder={subCategories.length ? 'Select sub-category' : 'None available'}
              disabled={!subCategories.length}
            />
          </Field>
          <Field label="Brand">
            <div className="flex items-stretch gap-2">
              <div className="flex-1">
                <SelectInput
                  value={form.brand}
                  onChange={(v) => setForm({ ...form, brand: v })}
                  options={brands.map((b) => ({ value: b._id, label: b.name }))}
                  placeholder="Select brand"
                />
              </div>
              <button
                type="button"
                onClick={onOpenBrand}
                className="shrink-0 px-2 py-2 border border-slate-200 rounded-lg text-xs font-medium text-[#007074] hover:bg-[#007074]/5 flex items-center gap-1"
                title="Add new brand"
              >
                <FiPlus size={12} /> Add
              </button>
            </div>
          </Field>
          <Field label="Status">
            <SelectInput
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v })}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ]}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="w-4 h-4 accent-[#007074]"
          />
          Mark as featured
        </label>
      </section>

      {/* RIGHT: media + variants */}
      <section className="lg:col-span-5 space-y-5">
        {/* Thumbnail */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <SectionTitle icon={<FiImage size={14} />}>Thumbnail</SectionTitle>
          {form.thumbnail ? (
            <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
              <img src={form.thumbnail.url} alt={form.thumbnail.alt} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onRemoveThumbnail}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow hover:bg-white"
              >
                <FiX size={14} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/70 to-transparent text-xs text-white p-2 truncate">
                /{form.thumbnail.slug}
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-[#007074] transition-colors">
              {uploadingOne ? (
                <FiLoader className="animate-spin text-[#007074]" size={22} />
              ) : (
                <>
                  <FiUploadCloud size={22} className="text-[#007074] mb-1" />
                  <span className="text-xs text-slate-500">Upload thumbnail (stored as webp)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={onThumbnailUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <SectionTitle icon={<FiImage size={14} />}>Gallery images</SectionTitle>

          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-[#007074] transition-colors">
            {uploadingMany ? (
              <FiLoader className="animate-spin text-[#007074]" size={22} />
            ) : (
              <>
                <FiUploadCloud size={22} className="text-[#007074] mb-1" />
                <span className="text-xs text-slate-500">Click to upload (multiple, webp)</span>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={onMediaUpload} className="hidden" />
          </label>

          {form.media.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {form.media.map((m, idx) => (
                <div key={m.url} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group">
                  <img src={m.url} alt={m.alt || `image ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-slate-900/70 text-white text-[10px] font-semibold rounded px-1.5 py-0.5">
                    {idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(m.url)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-slate-600 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={<FiTag size={14} />}>Variants</SectionTitle>
            <button
              type="button"
              onClick={addVariant}
              className="text-xs font-medium text-[#007074] hover:underline flex items-center gap-1"
            >
              <FiPlus size={12} /> Add variant
            </button>
          </div>
          <p className="text-xs text-slate-400 -mt-2">
            Leave SKU blank to auto-generate one (e.g. <code className="text-slate-500">NIK-FAS-SILKSATI-BLK-M-A1B2</code>).
          </p>

          <div className="space-y-3">
            {form.variants.map((v, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Variant {idx + 1}</span>
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
                <input
                  value={v.sku}
                  onChange={(e) => updateVariant(idx, { sku: e.target.value })}
                  placeholder="SKU (auto if blank)"
                  className={inputCls}
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={v.size}
                    onChange={(e) => updateVariant(idx, { size: e.target.value })}
                    placeholder="Size"
                    className={inputCls}
                  />
                  <input
                    value={v.color}
                    onChange={(e) => updateVariant(idx, { color: e.target.value })}
                    placeholder="Color"
                    className={inputCls}
                  />
                  <input
                    value={v.material}
                    onChange={(e) => updateVariant(idx, { material: e.target.value })}
                    placeholder="Material"
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.originalPrice}
                    onChange={(e) => updateVariant(idx, { originalPrice: e.target.value })}
                    placeholder="MRP"
                    className={inputCls}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={v.salePrice}
                    onChange={(e) => updateVariant(idx, { salePrice: e.target.value })}
                    placeholder="Sale"
                    className={inputCls}
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, { stock: e.target.value })}
                    placeholder="Stock"
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer spanning both columns */}
      <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && <FiLoader className="animate-spin" size={16} />}
          {editingId ? 'Update product' : 'Save product'}
        </button>
      </div>
    </form>
  );
}

function CategoryOffcanvas({ categories, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [description, setDescription] = useState('');
  const createCat = useCreateCategory();

  const topLevel = useMemo(() => categories.filter((c) => c.level === 0), [categories]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Category name is required');
    try {
      const cat = await createCat.mutateAsync({
        name: name.trim(),
        parent: parent || null,
        description: description.trim() || undefined,
      });
      onCreated(cat);
    } catch { /* hook toast */ }
  };

  return (
    <>
      <div className="offcanvas-backdrop" onClick={onClose} />
      <aside className="offcanvas-panel">
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Add category</h3>
            <p className="text-xs text-slate-500">New top-level or sub-category.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center">
            <FiX size={16} />
          </button>
        </header>
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <Field label="Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dresses"
              className={inputCls}
            />
          </Field>
          <Field label="Parent category" hint="Leave empty for a top-level category">
            <SelectInput
              value={parent}
              onChange={setParent}
              options={topLevel.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Top-level"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Short internal description (optional)"
            />
          </Field>
        </form>
        <footer className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={createCat.isPending}
            className="px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] disabled:opacity-60 flex items-center gap-2"
          >
            {createCat.isPending && <FiLoader className="animate-spin" size={14} />}
            Add category
          </button>
        </footer>
      </aside>
    </>
  );
}

function BrandOffcanvas({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState(null); // { url }
  const uploadOne = useUploadImage();
  const createBrand = useCreateBrand();

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadOne.mutateAsync({
        file,
        productSlug: slugify(name) || 'brand',
        role: 'thumbnail',
      });
      setLogo({ url: res.url });
    } catch { /* hook toast */ }
    e.target.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Brand name is required');
    try {
      const brand = await createBrand.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        website: website.trim() || undefined,
        logo: logo?.url || undefined,
      });
      onCreated(brand);
    } catch { /* hook toast */ }
  };

  return (
    <>
      <div className="offcanvas-backdrop" onClick={onClose} />
      <aside className="offcanvas-panel">
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Add brand</h3>
            <p className="text-xs text-slate-500">Brand details appear on product pages.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center">
            <FiX size={16} />
          </button>
        </header>
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <Field label="Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stylogist"
              className={inputCls}
            />
          </Field>
          <Field label="Website">
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={inputCls}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Short brand description (optional)"
            />
          </Field>
          <Field label="Logo" hint="Uploaded and stored as webp">
            {logo ? (
              <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200">
                <img src={logo.url} alt="logo" className="w-full h-full object-contain bg-slate-50" />
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 text-slate-600 flex items-center justify-center shadow"
                >
                  <FiX size={12} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-[#007074] transition-colors">
                {uploadOne.isPending ? (
                  <FiLoader className="animate-spin text-[#007074]" size={20} />
                ) : (
                  <>
                    <FiUploadCloud size={20} className="text-[#007074] mb-1" />
                    <span className="text-xs text-slate-500">Upload logo</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              </label>
            )}
          </Field>
        </form>
        <footer className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={createBrand.isPending}
            className="px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] disabled:opacity-60 flex items-center gap-2"
          >
            {createBrand.isPending && <FiLoader className="animate-spin" size={14} />}
            Add brand
          </button>
        </footer>
      </aside>
    </>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
      <span className="w-7 h-7 rounded-md bg-[#007074]/10 text-[#007074] flex items-center justify-center">{icon}</span>
      <h3 className="text-sm font-semibold text-slate-900">{children}</h3>
    </div>
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600 mb-1 inline-block">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-slate-400 mt-1 block">{hint}</span>}
    </label>
  );
}

function SelectInput({ value, onChange, options, placeholder, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputCls} appearance-none pr-8 ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
    </div>
  );
}

const inputCls =
  'w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074] transition-colors';
