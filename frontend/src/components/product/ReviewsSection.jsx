import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiSend, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import {
  useProductReviews,
  useReviewEligibility,
  useCreateReview,
} from '../../features/reviews/useReviewHooks';

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

// Renders the approved reviews list + an inline form that the backend only
// accepts from users who have a delivered order for this product.
export default function ReviewsSection({ product }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { data: reviews = [], isLoading } = useProductReviews(product?._id);
  const { data: eligibility } = useReviewEligibility(product?._id, isAuthed);

  if (!product) return null;

  return (
    <div className="space-y-6">
      <ReviewForm product={product} isAuthed={isAuthed} eligibility={eligibility} />

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r._id} className="border-b border-gray-100 pb-5 last:border-b-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F7F3F0] flex items-center justify-center text-[10px] font-black uppercase text-[#007074]">
                    {(r.user?.name || 'U').slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#222]">{r.user?.name || 'Customer'}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-gray-400">{fmtDate(r.createdAt)}</div>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewForm({ product, isAuthed, eligibility }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview(product._id);

  if (!isAuthed) {
    return (
      <div className="bg-[#F7F3F0] border border-[#007074]/10 rounded-xl p-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>Sign in to leave a review for customers who've already ordered.</span>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#222] text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#007074]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (eligibility?.hasReviewed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700">
        You already reviewed this product — thanks for the feedback!
      </div>
    );
  }

  if (eligibility && !eligibility.canReview) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
        You can write a review once your order for this product is marked as delivered.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return toast.error('Pick a rating between 1 and 5');
    try {
      await createReview.mutateAsync({
        product: product._id,
        rating,
        comment: comment.trim() || undefined,
        order: eligibility?.orderId || undefined,
      });
      setRating(5);
      setComment('');
    } catch {
      /* toast already surfaced by hook */
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="text-sm font-semibold text-[#222]">Share your experience</h4>
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="What did you love? Anything to improve?"
        className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007074]/20 focus:border-[#007074] resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
          Reviews are moderated before going live
        </span>
        <button
          type="submit"
          disabled={createReview.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#007074] text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#005a5d] disabled:opacity-60"
        >
          {createReview.isPending ? <FiLoader className="animate-spin" size={13} /> : <FiSend size={13} />}
          Submit
        </button>
      </div>
    </form>
  );
}

function RatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5"
        >
          <FiStar
            size={18}
            className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
          />
        </button>
      ))}
    </div>
  );
}

function Stars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FiStar
          key={n}
          size={12}
          className={n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  );
}
