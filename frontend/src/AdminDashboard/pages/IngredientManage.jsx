import React, { useEffect, useMemo, useState } from 'react';
import {
  FiPlus, FiEdit3, FiTrash2, FiLoader, FiSearch, FiX, FiHelpCircle,
  FiEye, FiEyeOff, FiAlertCircle
} from 'react-icons/fi';
import {
  useIngredients,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
} from '../../features/ingredients/useIngredientHooks';
import { useUploadImage } from '../../features/uploads/useUploadHooks';
import { ImagePicker, IconBtn, ConfirmDialog } from './CategoryManage';
import toast from 'react-hot-toast';

const slugify = (value) =>
  (value || '').toString().toLowerCase().trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const emptyFaq = () => ({ question: '', answer: '' });

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  image: '',
  benefits: [],
  uses: [],
  faq: [],
  isIndexable: true,
  isActive: true,
};

export default function IngredientManage() {
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError } = useIngredients({ active: 'all', includeCount: 'true' });
  const createMut = useCreateIngredient();
  const updateMut = useUpdateIngredient();
  const deleteMut = useDeleteIngredient();
  const uploadMut = useUploadImage();

  const items = data?.items ?? [];
  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q) || i.slug?.toLowerCase().includes(q));
  }, [items, search]);

  const isSaving = createMut.isPending || updateMut.isPending;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setView('list');
  };

  const startEdit = (ing) => {
    setEditingId(ing._id);
    setForm({
      name: ing.name || '',
      slug: ing.slug || '',
      description: ing.description || '',
      metaTitle: ing.metaTitle || '',
      metaDescription: ing.metaDescription || '',
      image: ing.image || '',
      benefits: Array.isArray(ing.benefits) ? [...ing.benefits] : [],
      uses: Array.isArray(ing.uses) ? [...ing.uses] : [],
      faq: Array.isArray(ing.faq) ? ing.faq.map((f) => ({ question: f.question || '', answer: f.answer || '' })) : [],
      isIndexable: ing.isIndexable !== false,
      isActive: ing.isActive !== false,
    });
    setView('form');
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadMut.mutateAsync({
        file,
        productSlug: slugify(form.name) || 'ingredient',
        role: 'thumbnail',
      });
      setForm((f) => ({ ...f, image: res.url }));
    } catch { /* hook toast */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    if (form.metaTitle.length > 60) return toast.error('Meta title must be 60 chars or fewer');
    if (form.metaDescription.length > 160) return toast.error('Meta description must be 160 chars or fewer');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      metaTitle: form.metaTitle.trim() || undefined,
      metaDescription: form.metaDescription.trim() || undefined,
      image: form.image || null,
      benefits: form.benefits.map((s) => (s || '').trim()).filter(Boolean),
      uses: form.uses.map((s) => (s || '').trim()).filter(Boolean),
      faq: form.faq
        .map((q) => ({ question: (q.question || '').trim(), answer: (q.answer || '').trim() }))
        .filter((q) => q.question && q.answer),
      isIndexable: form.isIndexable,
      isActive: form.isActive,
    };

    try {
      if (editingId) await updateMut.mutateAsync({ id: editingId, payload });
      else await createMut.mutateAsync(payload);
      resetForm();
    } catch { /* hook toast */ }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      setDeleteTarget(null);
    } catch { /* hook toast */ }
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ingredients</h1>
          <p className="text-sm text-slate-500 mt-1">
            Canonical ingredient taxonomy
          </p>
        </div>
        <div className="flex items-center gap-3">
          {view === 'list' && (
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredients"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074]"
              />
            </div>
          )}
          <button
            onClick={() => (view === 'list' ? setView('form') : resetForm())}
            className="px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] inline-flex items-center gap-2"
          >
            {view === 'list' ? <><FiPlus size={14} /> New ingredient</> : <><FiX size={14} /> Cancel</>}
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {isError ? (
            <div className="p-10 text-center text-sm text-slate-500">
              <FiAlertCircle className="inline mr-2 text-red-500" /> Couldn't load ingredients.
            </div>
          ) : isLoading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading ingredients…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              {search ? 'No matches.' : 'No ingredients yet. Create your first one.'}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((ing) => (
                <li key={ing._id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {ing.image ? (
                      <img src={ing.image} alt={ing.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 truncate">{ing.name}</span>
                      {!ing.isIndexable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
                          <FiEyeOff size={10} /> noindex
                        </span>
                      )}
                      {!ing.isActive && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">
                          inactive
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">/{ing.slug}</div>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums">{ing.productCount ?? 0} products</span>
                  <IconBtn onClick={() => startEdit(ing)} hover="text-blue-600 hover:bg-blue-50"><FiEdit3 size={14} /></IconBtn>
                  <IconBtn onClick={() => setDeleteTarget(ing)} hover="text-red-600 hover:bg-red-50"><FiTrash2 size={14} /></IconBtn>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900">
              {editingId ? 'Edit ingredient' : 'New ingredient'}
            </h2>

            <Field label="Name" required>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Berberine"
                className={inputCls}
              />
            </Field>

            <Field label="Slug" hint="URL segment — auto-generated from name when blank.">
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                placeholder={slugify(form.name) || 'berberine'}
                className={inputCls}
              />
            </Field>

            <CountedField
              label="Meta title"
              hint="≤ 60 chars · keep unique per ingredient"
              value={form.metaTitle}
              max={60}
              onChange={(v) => setForm({ ...form, metaTitle: v })}
              placeholder="Berberine | Stylogist"
            />

            <CountedField
              label="Meta description"
              hint="≤ 160 chars · summarises the ingredient for Google"
              value={form.metaDescription}
              max={160}
              onChange={(v) => setForm({ ...form, metaDescription: v })}
              placeholder="What is berberine? Benefits, uses, and supplements containing it…"
            />

            <Field label="Description" hint="Long-form SEO content rendered on the public ingredient page.">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className={`${inputCls} resize-none`}
                placeholder="Plain text or basic HTML. Headings (H2/H3), lists, paragraphs are all supported on the public page."
              />
            </Field>

            <BulletEditor
              label="Benefits"
              hint="Surfaces under an H2 on the public ingredient page."
              value={form.benefits}
              onChange={(next) => setForm({ ...form, benefits: next })}
              placeholder="Supports healthy glucose metabolism"
              addLabel="Add benefit"
            />

            <BulletEditor
              label="Uses"
              hint="Surfaces under an H2 on the public ingredient page."
              value={form.uses}
              onChange={(next) => setForm({ ...form, uses: next })}
              placeholder="Take 500mg before meals"
              addLabel="Add use"
            />

            <FaqEditor
              value={form.faq}
              onChange={(next) => setForm({ ...form, faq: next })}
            />
          </section>

          <section className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Image</h3>
              <ImagePicker
                url={form.image}
                uploading={uploadMut.isPending}
                onFile={handleImage}
                onClear={() => setForm({ ...form, image: '' })}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Visibility</h3>
              <ToggleRow
                checked={form.isActive}
                onChange={(v) => setForm({ ...form, isActive: v })}
                label="Active"
                hint="Hides from filters and dropdowns when off — products keep their tag."
              />
              <ToggleRow
                checked={form.isIndexable}
                onChange={(v) => setForm({ ...form, isIndexable: v })}
                label="Index in search engines"
                hint="When off, the public ingredient page emits noindex and is excluded from sitemap."
                icon={form.isIndexable ? <FiEye size={13} /> : <FiEyeOff size={13} />}
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] disabled:opacity-60 inline-flex items-center gap-2"
              >
                {isSaving && <FiLoader className="animate-spin" size={14} />}
                {editingId ? 'Save changes' : 'Create ingredient'}
              </button>
            </div>
          </section>
        </form>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete ingredient"
          message={`Permanently delete "${deleteTarget.name}"? Tagged products will lose this ingredient.`}
          confirmLabel={deleteMut.isPending ? 'Deleting…' : 'Delete'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

/* -------- bullet + faq editors -------- */

function BulletEditor({ label, hint, value, onChange, placeholder, addLabel }) {
  const items = value.length ? value : [''];
  const set = (idx, next) => {
    const copy = [...items];
    copy[idx] = next;
    onChange(copy);
  };
  const add = () => onChange([...items, '']);
  const remove = (idx) => {
    if (items.length === 1) return onChange([]);
    onChange(items.filter((_, i) => i !== idx));
  };
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-semibold flex items-center justify-center shrink-0">{idx + 1}</span>
            <input
              value={it}
              onChange={(e) => set(idx, e.target.value)}
              placeholder={placeholder}
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={() => remove(idx)} className="text-slate-400 hover:text-red-600 p-1.5">
              <FiX size={14} />
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-[#007074] hover:underline inline-flex items-center gap-1">
          <FiPlus size={12} /> {addLabel}
        </button>
      </div>
    </Field>
  );
}

function FaqEditor({ value, onChange }) {
  const set = (idx, patch) => onChange(value.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  const add = () => onChange([...value, { question: '', answer: '' }]);
  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));
  return (
    <Field
      label="FAQ"
      hint="Rendered as Schema.org FAQPage JSON-LD on the public ingredient page."
    >
      <div className="space-y-3">
        {value.map((q, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 inline-flex items-center gap-1">
                <FiHelpCircle size={11} /> Q{idx + 1}
              </span>
              <button type="button" onClick={() => remove(idx)} className="text-slate-400 hover:text-red-600">
                <FiX size={14} />
              </button>
            </div>
            <input
              value={q.question}
              onChange={(e) => set(idx, { question: e.target.value })}
              placeholder="Question"
              className={inputCls}
              maxLength={500}
            />
            <textarea
              value={q.answer}
              onChange={(e) => set(idx, { answer: e.target.value })}
              placeholder="Answer"
              rows={3}
              className={`${inputCls} resize-none`}
              maxLength={2000}
            />
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-[#007074] hover:underline inline-flex items-center gap-1">
          <FiPlus size={12} /> Add FAQ
        </button>
      </div>
    </Field>
  );
}

function ToggleRow({ checked, onChange, label, hint, icon }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 accent-[#007074]"
      />
      <span className="min-w-0 flex-1">
        <span className="text-sm font-medium text-slate-800 inline-flex items-center gap-1.5">
          {icon}{label}
        </span>
        {hint && <span className="block text-[11px] text-slate-500 mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

const inputCls =
  'w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074] transition-colors';

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

function CountedField({ label, hint, value, max, onChange, placeholder }) {
  const used = (value || '').length;
  const over = used > max;
  return (
    <label className="block">
      <span className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={`text-[10px] font-semibold tabular-nums ${over ? 'text-red-500' : used > max * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
          {used} / {max}
        </span>
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      {hint && <span className="text-[11px] text-slate-400 mt-1 block">{hint}</span>}
    </label>
  );
}
