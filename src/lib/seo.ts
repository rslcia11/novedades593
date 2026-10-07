/**
 * Datos estructurados (schema.org) para Google: buscador del sitio, organización,
 * migas de pan, artículos y autores. Funciones puras: reciben URLs absolutas ya resueltas.
 * Docs: https://developers.google.com/search/docs/appearance/structured-data/article
 */
import { SITE } from '@/config/site';

export type JsonLd = Record<string, unknown>;

export interface SchemaContext {
  /** URL base del sitio (astro.config `site`). */
  site: URL;
}

const abs = (path: string, { site }: SchemaContext) => new URL(path, site).href;

export function organizationSchema(ctx: SchemaContext): JsonLd {
  return {
    '@type': 'Organization',
    '@id': abs('/#organization', ctx),
    name: SITE.name,
    url: abs('/', ctx),
    logo: { '@type': 'ImageObject', url: abs('/logo.png', ctx), width: 512, height: 512 },
    email: SITE.email.contact,
  };
}

export function websiteSchema(ctx: SchemaContext): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website', ctx),
    name: SITE.name,
    url: abs('/', ctx),
    inLanguage: SITE.lang,
    publisher: { '@id': abs('/#organization', ctx) },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${abs('/buscar/', ctx)}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[], ctx: SchemaContext): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: abs(item.href, ctx) } : {}),
    })),
  };
}

export interface AuthorInfo {
  id: string;
  name: string;
  kind: 'person' | 'organization';
  url: string;
  sameAs?: string[];
}

export function authorSchema(author: AuthorInfo, ctx: SchemaContext): JsonLd {
  return {
    '@type': author.kind === 'person' ? 'Person' : 'Organization',
    '@id': abs(`${author.url}#author`, ctx),
    name: author.name,
    url: abs(author.url, ctx),
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  };
}

export interface ArticleSchemaInput {
  url: string;
  title: string;
  description: string;
  image: string;
  publishedAt: Date;
  updatedAt?: Date | undefined;
  section: string;
  news: boolean;
  author: AuthorInfo;
}

export function articleSchema(input: ArticleSchemaInput, ctx: SchemaContext): JsonLd {
  return {
    '@type': input.news ? 'NewsArticle' : 'Article',
    '@id': abs(`${input.url}#article`, ctx),
    mainEntityOfPage: abs(input.url, ctx),
    headline: input.title,
    description: input.description,
    image: [abs(input.image, ctx)],
    datePublished: input.publishedAt.toISOString(),
    dateModified: (input.updatedAt ?? input.publishedAt).toISOString(),
    articleSection: input.section,
    inLanguage: SITE.lang,
    author: [authorSchema(input.author, ctx)],
    publisher: { '@id': abs('/#organization', ctx) },
  };
}

/** Envuelve varios nodos en un solo @graph para emitir un único bloque JSON-LD por página. */
export function graph(nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Serializa para un <script type="application/ld+json"> sin permitir cerrar la etiqueta desde el contenido. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Contexto de los datos estructurados a partir de `Astro.site`. */
export function schemaContext(site: URL | undefined): SchemaContext {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  return { site };
}
