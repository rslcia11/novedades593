/** Metadatos SEO de un artículo: Open Graph, fechas y datos estructurados (Article/NewsArticle + migas). */
import { getImage } from 'astro:assets';
import type { SeoProps } from '@/components/seo/Seo.astro';
import { SECTIONS } from '@/config/sections';
import { articleHref, getAuthor, type Article } from './content';
import { articleSchema, breadcrumbSchema, schemaContext } from './seo';
import { authorUrl } from './urls';

const DEFAULT_IMAGE = '/og-default.png';

export async function articleSeo(
  article: Article,
  crumbs: { label: string; href?: string }[],
  site: URL | undefined,
): Promise<SeoProps> {
  const ctx = schemaContext(site);
  const { data } = article;
  const path = articleHref(article);
  const author = await getAuthor(data.author.id);
  const image = data.cover.image
    ? (await getImage({ src: data.cover.image, width: 1200, height: 630, fit: 'cover', format: 'jpg' })).src
    : DEFAULT_IMAGE;

  return {
    title: data.title,
    description: data.description,
    path,
    image,
    ...(data.cover.alt ? { imageAlt: data.cover.alt } : {}),
    type: 'article',
    article: {
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      section: SECTIONS[data.section].name,
    },
    schema: [
      articleSchema(
        {
          url: path,
          title: data.title,
          description: data.description,
          image,
          publishedAt: data.publishedAt,
          updatedAt: data.updatedAt,
          section: SECTIONS[data.section].name,
          news: data.type === 'noticia',
          author: {
            id: author.id,
            name: author.data.name,
            kind: author.data.kind,
            url: authorUrl(author.id),
            sameAs: author.data.links.map((l) => l.url),
          },
        },
        ctx,
      ),
      breadcrumbSchema(crumbs, ctx),
    ],
  };
}
