import React, { useEffect, useMemo, useState } from 'react';
import {
  FiSearch, FiStar, FiCheck, FiTrash2, FiFlag, FiX, FiRefreshCw,
  FiAlertCircle, FiChevronLeft, FiChevronRight, FiPlus, FiEdit3, FiLoader
} from 'react-icons/fi';
import {
  useReviews,
  useUpdateReviewStatus,
  useDeleteReview,
  useAdminCreateReview,
  useAdminUpdateReview,
} from '../../features/reviews/useReviewHooks';
import { useProducts } from '../../features/products/useProductHooks';
import { ConfirmDialog } from './CategoryManage';

const PAGE_SIZE = 20;

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function ReviewManage() {
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editorReview, setEditorReview] = useState(null); // null | { mode: 'create' } | { mode: 'edit', review }

  const params = {
    status,
    search,
    page,
    limit: PAGE_SIZE,
    ...(ratingFilter !== 'all' ? { rating: ratingFilter } : {}),
  };
  const { data, isLoading, isError, refetch, isFetching } = useReviews(params);
  const updateMut = useUpdateReviewStatus();
  const deleteMut = useDeleteReview();

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const onStatus = (s) => { setStatus(s); setPage(1); };
  const onRating = (r) => { setRatingFilter(r); setPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      setDeleteTarget(null);
    } catch { /* hook toast */ }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">Moderate customer feedback or author reviews on behalf of buyers.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-max">
            {['pending', 'approved', 'flagged', 'all'].map((s) => (
              <TabButton key={s} active={status === s} onClick={() => onStatus(s)}>
                {s}
              </TabButton>
            ))}
          </div>
          <button
            onClick={() => setEditorReview({ mode: 'create' })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] shadow-sm"
          >
            <FiPlus size={14} /> Add review
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer, product, or comment"
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm w-max">
          <TabButton active={ratingFilter === 'all'} onClick={() => onRating('all')}>Any rating</TabButton>
          {[5, 4, 3, 2, 1].map((r) => (
            <TabButton key={r} active={ratingFilter === r} onClick={() => onRating(r)}>
              <span className="inline-flex items-center gap-1">{r} <FiStar size={10} className="fill-current" /></span>
            </TabButton>
          ))}
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Grid */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-14 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 mx-auto flex items-center justify-center mb-3">
            <FiCheck size={22} />
          </div>
          <p className="text-sm text-slate-500">
            {search || ratingFilter !== 'all'
              ? 'No reviews match your filters.'
              : `No ${status === 'all' ? '' : status + ' '}reviews yet.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                isSaving={updateMut.isPending}
                onApprove={() => updateMut.mutate({ id: r._id, status: 'approved' })}
                onFlag={() => updateMut.mutate({ id: r._id, status: 'flagged' })}
                onReopen={() => updateMut.mutate({ id: r._id, status: 'pending' })}
                onDelete={() => setDeleteTarget(r)}
                onEdit={() => setEditorReview({ mode: 'edit', review: r })}
              />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-5 py-3 shadow-sm">
              <div className="text-xs text-slate-500">
                Page <span className="font-medium text-slate-700">{pagination.page}</span> of{' '}
                <span className="font-medium text-slate-700">{pagination.pages}</span> · {pagination.total} total
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-md border border-slate-200 inline-flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft size={14} />
                </button>
                <button
                  disabled={page >= pagination.pages || isFetching}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  className="w-8 h-8 rounded-md border border-slate-200 inline-flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete review"
          message={`Permanently delete ${deleteTarget.user?.name || 'this customer'}'s review? This can't be undone.`}
          confirmLabel={deleteMut.isPending ? 'Deleting…' : 'Delete'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      {editorReview && (
        <ReviewEditorModal
          mode={editorReview.mode}
          review={editorReview.mode === 'edit' ? editorReview.review : null}
          onClose={() => setEditorReview(null)}
        />
      )}
    </div>
  );
}

/* ------------ subcomponents ------------ */

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
        active ? 'bg-[#007074] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function ReviewCard({ review, isSaving, onApprove, onFlag, onReopen, onDelete, onEdit }) {
  const { user, product, rating, comment, status, createdAt, displayName } = review;
  const authorName = displayName || user?.name || 'Unknown';
  const initials = authorName.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
      <div className={`h-1 ${statusBarClass(status)}`} />
      <div className="p-5 flex-1 flex flex-col">
        <header className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={13}
                className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400">{fmtDate(createdAt)}</span>
        </header>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#007074]/10 text-[#007074] flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{authorName}</div>
            <div className="text-xs text-[#007074] truncate">{product?.name || 'Unknown product'}</div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">
          {comment ? `"${comment}"` : <span className="italic text-slate-400">No comment provided.</span>}
        </p>

        <footer className="flex items-center gap-2 pt-3 border-t border-slate-100">
          {status !== 'approved' && (
            <button
              disabled={isSaving}
              onClick={onApprove}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium bg-[#007074] text-white hover:bg-[#005a5d] disabled:opacity-60"
            >
              <FiCheck size={12} /> Approve
            </button>
          )}
          {status !== 'flagged' && (
            <button
              disabled={isSaving}
              onClick={onFlag}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 hover:bg-amber-100 disabled:opacity-60"
            >
              <FiFlag size={12} /> Flag
            </button>
          )}
          {status !== 'pending' && (
            <button
              disabled={isSaving}
              onClick={onReopen}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-60"
            >
              Reopen
            </button>
          )}
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-[#007074] hover:bg-teal-50 border border-slate-200 flex-shrink-0"
            title="Edit review"
          >
            <FiEdit3 size={13} />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-md inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 flex-shrink-0"
            title="Delete"
          >
            <FiTrash2 size={13} />
          </button>
        </footer>
      </div>
    </article>
  );
}

function statusBarClass(status) {
  if (status === 'approved') return 'bg-emerald-400';
  if (status === 'flagged') return 'bg-rose-400';
  return 'bg-amber-400';
}

function ReviewEditorModal({ mode, review, onClose }) {
  const isEdit = mode === 'edit';
  const createMut = useAdminCreateReview();
  const updateMut = useAdminUpdateReview();
  const submitting = createMut.isPending || updateMut.isPending;

  // Product picker state — debounced autocomplete against the existing product
  // search endpoint. In create mode the admin types to find the product; in
  // edit mode the product is already attached to the review and locked.
  const [productQuery, setProductQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pickedProduct, setPickedProduct] = useState(
    isEdit ? { _id: review.product?._id, name: review.product?.name } : null
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(productQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [productQuery]);

  const productSearchEnabled = !isEdit && !pickedProduct && debouncedQuery.length >= 2;
  const { data: productSearchData, isFetching: searchingProducts } = useProducts(
    productSearchEnabled ? { search: debouncedQuery, limit: 8, status: 'all' } : {}
  );
  const productOptions = productSearchEnabled ? productSearchData?.items ?? [] : [];

  const [form, setForm] = useState(() => ({
    rating: review?.rating ?? 5,
    comment: review?.comment ?? '',
    status: review?.status ?? 'approved',
    displayName: review?.displayName ?? '',
  }));

  const canSubmit =
    !submitting &&
    (isEdit || !!pickedProduct) &&
    form.rating >= 1 && form.rating <= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      if (isEdit) {
        await updateMut.mutateAsync({
          id: review._id,
          payload: {
            rating: Number(form.rating),
            comment: form.comment.trim(),
            status: form.status,
            displayName: form.displayName.trim() || undefined,
          },
        });
      } else {
        await createMut.mutateAsync({
          product: pickedProduct._id,
          rating: Number(form.rating),
          comment: form.comment.trim() || undefined,
          status: form.status,
          displayName: form.displayName.trim() || undefined,
        });
      }
      onClose();
    } catch { /* hook toast */ }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#007074] text-white flex items-center justify-center">
              {isEdit ? <FiEdit3 size={16} /> : <FiPlus size={16} />}
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {isEdit ? 'Edit review' : 'Add review'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEdit
                  ? 'Edit any field. Rating / status changes recompute the product score.'
                  : 'Author a review on behalf of a customer. Skips the "must have a delivered order" check.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 inline-flex items-center justify-center"
          >
            <FiX size={16} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Product picker (create-only) */}
          {!isEdit && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 inline-block">
                Product <span className="text-red-500">*</span>
              </label>
              {pickedProduct ? (
                <div className="flex items-center justify-between gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-900 truncate">{pickedProduct.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPickedProduct(null); setProductQuery(''); }}
                    className="text-xs font-medium text-[#007074] hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-lg bg-white">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      autoFocus
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      placeholder="Search by product name…"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074]"
                    />
                  </div>
                  {productSearchEnabled && (
                    <ul className="max-h-52 overflow-y-auto border-t border-slate-100">
                      {searchingProducts ? (
                        <li className="px-4 py-3 text-xs text-slate-400 inline-flex items-center gap-2">
                          <FiLoader className="animate-spin" size={12} /> Searching…
                        </li>
                      ) : productOptions.length === 0 ? (
                        <li className="px-4 py-3 text-xs text-slate-400">No products match.</li>
                      ) : (
                        productOptions.map((p) => (
                          <li key={p._id}>
                            <button
                              type="button"
                              onClick={() => { setPickedProduct(p); setProductQuery(p.name); }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 truncate"
                            >
                              {p.name}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 inline-block">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className={`p-1.5 rounded-md hover:bg-slate-50 ${
                    n <= form.rating ? 'text-amber-400' : 'text-slate-300'
                  }`}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <FiStar size={20} className={n <= form.rating ? 'fill-amber-400' : ''} />
                </button>
              ))}
              <span className="ml-2 text-xs text-slate-500">{form.rating} / 5</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 inline-block">Comment</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={4}
              maxLength={2000}
              placeholder="Loved the texture and packaging…"
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074] resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">{form.comment.length} / 2000 chars</p>
          </div>

          {/* Author display name */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 inline-block">
              Display name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              placeholder="Shown publicly. Defaults to the linked user's name."
              maxLength={80}
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 inline-block">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['pending', 'approved', 'flagged'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`px-3 py-2 rounded-md border text-xs font-medium capitalize transition-colors ${
                    form.status === s
                      ? 'bg-[#007074] text-white border-[#007074]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#007074] hover:text-[#007074]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Only <strong>approved</strong> reviews count toward the product's average rating.
            </p>
          </div>
        </form>

        <footer className="border-t border-slate-100 p-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <FiLoader className="animate-spin" size={14} />}
            {isEdit ? 'Save changes' : 'Create review'}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
      <FiAlertCircle className="mx-auto text-red-500 mb-3" size={28} />
      <h3 className="text-sm font-semibold text-slate-900">Couldn't load reviews</h3>
      <p className="text-sm text-slate-500 mt-1">Check that the backend is running and you're signed in as an admin.</p>
      <button
        onClick={() => onRetry()}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#007074] text-white rounded-lg text-sm font-medium hover:bg-[#005a5d]"
      >
        <FiRefreshCw size={14} /> Try again
      </button>
    </div>
  );
}
