/**
 * Sitemap de Google News: solo noticias de los últimos 2 días, como pide Google.
 * Docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */
import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { articleHref, getArticles } from '@/lib/content';
import { buildNewsSitemap } from '@/lib/news-sitemap';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  const news = (await getArticles())
    .filter((a) => a.data.type === 'noticia')
    .map((a) => ({
      url: new URL(articleHref(a), site).href,
      title: a.data.title,
      publishedAt: a.data.publishedAt,
    }));
  const xml = buildNewsSitemap(news, { name: SITE.name, language: SITE.lang, now: new Date() });
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
