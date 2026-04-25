import { useEffect } from 'react';

// Tiny helmet replacement. Keeps the bundle small — we only need document
// head control for a handful of fields (title, description, Open Graph
// canonical) so pulling react-helmet in isn't justified.
//
// Pass `jsonLd` to emit a <script type="application/ld+json"> block for
// Google structured data (Product, BreadcrumbList, Article, …). Each Seo
// instance owns a single tagged script so re-renders replace it cleanly.
export default function Seo({ title, description, image, type = 'website', canonical, jsonLd, jsonLdId = 'seo-jsonld' }) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (selector, attr, value) => {
      if (!value) return null;
      let tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const [a, v] = selector.replace(/^meta\[/, '').replace(/\]$/, '').split('=');
        tag.setAttribute(a, v.replace(/"/g, ''));
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
      return tag;
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:card"]', 'content', image ? 'summary_large_image' : 'summary');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    // Always emit a canonical so search engines never index two URLs (with
    // and without query strings) as duplicates. Strip the query/hash so
    // params like `?ref=…` don't fork the canonical surface.
    let canonicalHref = canonical;
    if (!canonicalHref && typeof window !== 'undefined') {
      try {
        const { origin, pathname } = window.location;
        canonicalHref = `${origin}${pathname}`;
      } catch { /* ignore */ }
    }

    if (canonicalHref) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalHref);
    }

    if (jsonLd) {
      let script = document.head.querySelector(`script[data-seo="${jsonLdId}"]`);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', jsonLdId);
        document.head.appendChild(script);
      }
      try {
        script.textContent = JSON.stringify(jsonLd);
      } catch {
        /* ignore malformed payloads */
      }
      return () => script?.parentNode?.removeChild(script);
    }
    return undefined;
  }, [title, description, image, type, canonical, jsonLd, jsonLdId]);

  return null;
}
