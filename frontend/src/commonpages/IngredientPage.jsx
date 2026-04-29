import React, { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FiAlertCircle, FiCheck, FiChevronDown } from 'react-icons/fi';
import {
  useIngredient,
  useIngredientProducts,
} from '../features/ingredients/useIngredientHooks';
import StorefrontProductCard from '../components/common/StorefrontProductCard';
import Seo from '../components/common/Seo';

const PAGE_SIZE = 12;

export default function IngredientPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [openFaq, setOpenFaq] = useState(0);

  const { data: ingredient, isLoading, isError } = useIngredient(slug);
  const { data: productData, isFetching } = useIngredientProducts(slug, {
    page,
    limit: PAGE_SIZE,
  });

  const items = productData?.items ?? [];
  const pagination = productData?.pagination;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = `${origin}/ingredient/${slug}`;
  const seoTitle = ingredient?.metaTitle?.trim() || (ingredient ? `${ingredient.name} | Stylogist` : '');
  const seoDescription = ingredient?.metaDescription?.trim() ||
    (ingredient?.description ? ingredient.description.slice(0, 160) : '');

  // FAQPage JSON-LD — Google rich-result eligible. We only emit when the
  // ingredient has at least one FAQ entry, otherwise the schema is invalid.
  const faqJsonLd = useMemo(() => {
    if (!ingredient?.faq?.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ingredient.faq.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    };
  }, [ingredient]);

  // ItemList JSON-LD for the product grid. Helps Google understand the page
  // is a curated list and surface rich results.
  const itemListJsonLd = useMemo(() => {
    if (!ingredient || !items.length) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: items.map((p, idx) => ({
        '@type': 'ListItem',
        position: (page - 1) * PAGE_SIZE + idx + 1,
        url: `${origin}/product/${p.slug}`,
        name: p.name,
      })),
    };
  }, [ingredient, items, page, origin]);

  const goToPage = (p) => {
    setPage(p);
    const next = new URLSearchParams(searchParams);
    if (p === 1) next.delete('page');
    else next.set('page', String(p));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="h-8 w-1/2 bg-slate-100 rounded animate-pulse mb-4" />
        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !ingredient) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <FiAlertCircle className="mx-auto text-[#007074] mb-3" size={32} />
        <h1 className="font-serif text-2xl font-black text-[#222]">Ingredient not found</h1>
        <p className="text-sm text-slate-500 mt-2">
          We couldn't find an ingredient called <code>{slug}</code>.
        </p>
        <Link to="/category" className="inline-flex mt-6 px-5 py-3 bg-[#222] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#007074]">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <Seo
        title={seoTitle}
        description={seoDescription}
        type="article"
        image={ingredient.image || undefined}
        canonical={canonical}
        jsonLd={faqJsonLd}
        jsonLdId={`ingredient-faq-${ingredient._id}`}
      />
      {itemListJsonLd && (
        <Seo
          jsonLd={itemListJsonLd}
          jsonLdId={`ingredient-itemlist-${ingredient._id}`}
        />
      )}
      {/* Crawler-respecting noindex when the admin disabled indexability.
          Still allow follow so internal links keep their PageRank. */}
      {ingredient.isIndexable === false && <NoIndexHint />}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold flex items-center gap-1.5 mb-6">
          <Link to="/" className="hover:text-[#007074]">Home</Link>
          <span>/</span>
          <Link to="/category" className="hover:text-[#007074]">Shop</Link>
          <span>/</span>
          <span className="text-[#222]">{ingredient.name}</span>
        </nav>

        {/* Header */}
        <header className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-12">
          {ingredient.image && (
            <div className="md:col-span-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
                <img src={ingredient.image} alt={ingredient.name} loading="eager" decoding="async" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
          <div className={ingredient.image ? 'md:col-span-9' : 'md:col-span-12'}>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#222] tracking-tight">
              {ingredient.name}
            </h1>
            {ingredient.description && (
              <div className="tiptap mt-4 text-slate-600 leading-relaxed max-w-3xl">
                {/* Description renders as plain HTML — same `.tiptap`
                    stylesheet the admin editor uses, so headings/lists
                    survive intact. */}
                <div dangerouslySetInnerHTML={{ __html: ingredient.description }} />
              </div>
            )}
          </div>
        </header>

        {/* Benefits + Uses */}
        {(ingredient.benefits?.length > 0 || ingredient.uses?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ingredient.benefits?.length > 0 && (
              <section className="bg-white border border-slate-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#222] mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {ingredient.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 text-[#007074]"><FiCheck size={14} /></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {ingredient.uses?.length > 0 && (
              <section className="bg-white border border-slate-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-[#222] mb-4">Uses</h2>
                <ul className="space-y-2">
                  {ingredient.uses.map((u, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-1 w-5 h-5 rounded-full bg-[#007074]/10 text-[#007074] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* FAQ */}
        {ingredient.faq?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-[#222] mb-4">Frequently asked questions</h2>
            <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-100">
              {ingredient.faq.map((q, idx) => {
                const open = openFaq === idx;
                return (
                  <div key={idx}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50"
                      aria-expanded={open}
                    >
                      <span className="text-sm font-semibold text-slate-900">{q.question}</span>
                      <FiChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Products tagged with this ingredient */}
        <section>
          <header className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold text-[#222]">Products with {ingredient.name}</h2>
            {pagination && (
              <span className="text-xs text-slate-500">
                {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
              </span>
            )}
          </header>

          {items.length === 0 && !isFetching ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-sm text-slate-500">
              No products tagged with {ingredient.name} yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((p, idx) => (
                <StorefrontProductCard key={p._id} product={p} index={idx} />
              ))}
            </div>
          )}

          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={page >= pagination.pages}
                onClick={() => goToPage(page + 1)}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NoIndexHint() {
  // Inject `<meta name="robots" content="noindex, follow">` into <head>
  // when isIndexable is false. Cleaned up on unmount so navigating to
  // another page doesn't carry the noindex over.
  React.useEffect(() => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    tag.setAttribute('content', 'noindex, follow');
    tag.setAttribute('data-ingredient-noindex', '1');
    document.head.appendChild(tag);
    return () => {
      document.head.querySelectorAll('meta[data-ingredient-noindex="1"]').forEach((n) => n.remove());
    };
  }, []);
  return null;
}
