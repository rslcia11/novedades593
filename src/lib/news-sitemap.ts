export interface NewsItem {
  url: string;
  title: string;
  publishedAt: Date;
}

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] ?? c,
  );

/** Sitemap de noticias con las publicadas en los últimos 2 días (Google ignora las más viejas). */
export function buildNewsSitemap(
  items: NewsItem[],
  publication: { name: string; language: string; now: Date },
): string {
  const recent = items.filter((item) => {
    const age = publication.now.getTime() - item.publishedAt.getTime();
    return age >= 0 && age <= TWO_DAYS;
  });
  const entries = recent
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publication.name)}</news:name>
        <news:language>${publication.language}</news:language>
      </news:publication>
      <news:publication_date>${item.publishedAt.toISOString()}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>
`;
}
