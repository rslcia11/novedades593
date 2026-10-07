import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { articleHref, getArticles } from '@/lib/content';
import { SECTIONS } from '@/config/sections';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  const articles = await getArticles();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    customData: `<language>${SITE.lang}</language>`,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      link: articleHref(a),
      pubDate: a.data.updatedAt ?? a.data.publishedAt,
      categories: [SECTIONS[a.data.section].name],
    })),
  });
};
