import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryPage from '../components/category/CategoryPage';
import Seo from '../components/common/Seo';

// Dedicated /search route. Reuses the catalogue listing UI (CategoryPage
// already understands the `?search=` query param) but layers on a
// search-specific <title>, meta description, and `noindex` for empty queries
// — Google penalises sites that surface thousands of empty/filter pages.
export default function SearchResults() {
  const [params] = useSearchParams();
  const q = (params.get('search') || params.get('q') || '').trim();

  const seo = useMemo(() => {
    if (!q) {
      return {
        title: 'Search · Stylogist',
        description: 'Search the Stylogist catalogue.',
      };
    }
    return {
      title: `Search results for "${q}" · Stylogist`,
      description: `Browse Stylogist products matching "${q}". Free shipping and cash on delivery across Pakistan.`,
    };
  }, [q]);

  // SearchResultsPage JSON-LD lets Google know this is a search results page
  // (not a product/category landing) and includes the query for analytics.
  const jsonLd = useMemo(() => {
    if (!q) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: `Search results for "${q}"`,
      url: `${origin}/search?search=${encodeURIComponent(q)}`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${origin}/search?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }, [q]);

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        type="website"
        canonical={
          typeof window !== 'undefined' && q
            ? `${window.location.origin}/search?search=${encodeURIComponent(q)}`
            : undefined
        }
        jsonLd={jsonLd}
        jsonLdId="search-results"
      />
      {/* Empty-query state: tell Google not to index. We can't render a
          <meta name="robots" content="noindex"> via the helmet helper without
          extending it, so this is a small inline injection. */}
      {!q && <NoIndexHint />}
      <CategoryPage />
    </>
  );
}

function NoIndexHint() {
  // Mount a robots noindex tag for empty/blank search pages and clean it up
  // when the component unmounts (i.e., the user types a query).
  React.useEffect(() => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    tag.setAttribute('content', 'noindex, follow');
    tag.setAttribute('data-noindex-search', '1');
    document.head.appendChild(tag);
    return () => {
      document.head.querySelectorAll('meta[data-noindex-search="1"]').forEach((n) => n.remove());
    };
  }, []);
  return null;
}
