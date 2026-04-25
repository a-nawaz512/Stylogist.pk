import { Router } from "express";
import { Product } from "../products/product.model.js";
import { Category } from "../categories/category.model.js";
import { Brand } from "../brands/brand.model.js";
import env from "../../config/env.js";
import { catchAsync } from "../../utils/catchAsync.js";

const router = Router();

const escapeXml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toIsoDate = (d) => {
  if (!d) return new Date().toISOString();
  try { return new Date(d).toISOString(); } catch { return new Date().toISOString(); }
};

// Concatenate the dynamic content into the W3C sitemap envelope. We cap the
// total to 50,000 URLs (the spec limit) to keep this single-file generator
// safe even as the catalogue scales — beyond that we'd split into a sitemap
// index, which can be wired in later when needed.
const SITEMAP_LIMIT = 50000;

const buildUrl = ({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${toIsoDate(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

router.get(
  "/sitemap.xml",
  catchAsync(async (_req, res) => {
    const base = env.siteUrl;

    // Static landing entries — high priority, infrequent changes.
    const staticUrls = [
      { loc: `${base}/`, changefreq: 'daily', priority: 1.0 },
      { loc: `${base}/about`, changefreq: 'monthly', priority: 0.4 },
      { loc: `${base}/contact`, changefreq: 'monthly', priority: 0.3 },
      { loc: `${base}/deals`, changefreq: 'daily', priority: 0.7 },
      { loc: `${base}/category`, changefreq: 'daily', priority: 0.8 },
      { loc: `${base}/terms`, changefreq: 'yearly', priority: 0.2 },
      { loc: `${base}/privacy`, changefreq: 'yearly', priority: 0.2 },
    ].map((e) => ({ ...e, lastmod: new Date() }));

    // Concurrent reads — three small queries, all selecting only what we need
    // for the sitemap so we don't pull rich text descriptions.
    const [products, categories, brands] = await Promise.all([
      Product.find({ status: 'published' })
        .select('slug updatedAt')
        .sort({ updatedAt: -1 })
        .limit(SITEMAP_LIMIT)
        .lean(),
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
      Brand.find({ isActive: true }).select('slug updatedAt').lean(),
    ]);

    const productUrls = products.map((p) => ({
      loc: `${base}/product/${p.slug}`,
      lastmod: p.updatedAt,
      changefreq: 'weekly',
      priority: 0.8,
    }));

    const categoryUrls = categories.map((c) => ({
      loc: `${base}/category/${c.slug}`,
      lastmod: c.updatedAt,
      changefreq: 'weekly',
      priority: 0.6,
    }));

    const brandUrls = brands.map((b) => ({
      loc: `${base}/brand/${b.slug}`,
      lastmod: b.updatedAt,
      changefreq: 'weekly',
      priority: 0.5,
    }));

    const all = [...staticUrls, ...productUrls, ...categoryUrls, ...brandUrls].slice(0, SITEMAP_LIMIT);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(buildUrl).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    // Cache for 1 hour at the CDN, but allow up to 6 hours of stale-revalidate
    // so a slow regen never makes Google retry.
    res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=21600');
    res.send(xml);
  })
);

router.get(
  "/robots.txt",
  catchAsync(async (_req, res) => {
    const base = env.siteUrl;
    const body = [
      'User-agent: *',
      'Allow: /',
      // Block admin and checkout-only routes from indexing.
      'Disallow: /admin',
      'Disallow: /admin/',
      'Disallow: /checkout',
      'Disallow: /cart',
      'Disallow: /wishlist',
      'Disallow: /profile',
      'Disallow: /api/',
      '',
      `Sitemap: ${base}/sitemap.xml`,
      '',
    ].join('\n');

    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(body);
  })
);

export default router;
