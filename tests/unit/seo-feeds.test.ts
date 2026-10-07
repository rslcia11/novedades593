import { describe, expect, it } from 'vitest';
import {
  articleSchema,
  breadcrumbSchema,
  graph,
  schemaContext,
  serializeJsonLd,
  websiteSchema,
} from '@/lib/seo';
import { buildNewsSitemap } from '@/lib/news-sitemap';
import { buildRobotsTxt } from '@/lib/robots';
import { adsTxtLine, validateAdsConfig } from '@/config/ads';
import { buildCspDirectives, scriptSources, styleSources } from '@/config/csp';

const ctx = { site: new URL('https://ejemplo.com') };

describe('datos estructurados', () => {
  it('migas de pan con posiciones y URLs absolutas', () => {
    expect(breadcrumbSchema([{ label: 'Inicio', href: '/' }, { label: 'Juegos' }], ctx)).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://ejemplo.com/' },
        { '@type': 'ListItem', position: 2, name: 'Juegos' },
      ],
    });
  });

  it('artículo y noticia con fechas, autor e imagen', () => {
    const input = {
      url: '/noticias/x/',
      title: 'Título',
      description: 'Desc',
      image: '/og-default.png',
      publishedAt: new Date('2026-10-01T10:00:00Z'),
      section: 'Noticias',
      news: true,
      author: {
        id: 'redaccion',
        name: 'Redacción',
        kind: 'organization' as const,
        url: '/autores/redaccion/',
      },
    };
    const schema = articleSchema(input, ctx);
    expect(schema['@type']).toBe('NewsArticle');
    expect(schema['dateModified']).toBe('2026-10-01T10:00:00.000Z');
    expect(schema['image']).toEqual(['https://ejemplo.com/og-default.png']);
    expect(articleSchema({ ...input, news: false }, ctx)['@type']).toBe('Article');
  });

  it('declara el buscador del sitio para Google', () => {
    const site = websiteSchema(ctx) as { potentialAction: { target: { urlTemplate: string } } };
    expect(site.potentialAction.target.urlTemplate).toBe(
      'https://ejemplo.com/buscar/?q={search_term_string}',
    );
  });

  it('no permite cerrar la etiqueta <script> desde el contenido', () => {
    const json = serializeJsonLd(graph([{ name: '</script><script>alert(1)</script>' }]));
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)['@graph'][0].name).toBe('</script><script>alert(1)</script>');
  });

  it('exige el dominio del sitio', () => {
    expect(() => schemaContext(undefined)).toThrow();
  });
});

describe('sitemap de noticias', () => {
  const now = new Date('2026-10-07T12:00:00Z');
  const xml = buildNewsSitemap(
    [
      { url: 'https://ejemplo.com/a/', title: 'Hoy & "ya"', publishedAt: new Date('2026-10-07T08:00:00Z') },
      { url: 'https://ejemplo.com/b/', title: 'Vieja', publishedAt: new Date('2026-10-01T08:00:00Z') },
      { url: 'https://ejemplo.com/c/', title: 'Futura', publishedAt: new Date('2026-10-09T08:00:00Z') },
    ],
    { name: 'Sitio', language: 'es', now },
  );

  it('incluye solo noticias de los últimos 2 días', () => {
    expect(xml).toContain('https://ejemplo.com/a/');
    expect(xml).not.toContain('https://ejemplo.com/b/');
    expect(xml).not.toContain('https://ejemplo.com/c/');
  });

  it('escapa caracteres especiales de XML', () => {
    expect(xml).toContain('Hoy &amp; &quot;ya&quot;');
  });
});

describe('robots.txt', () => {
  const site = new URL('https://ejemplo.com');

  it('bloquea todo mientras el sitio no se publique', () => {
    expect(buildRobotsTxt({ site, indexable: false })).toBe('User-agent: *\nDisallow: /\n');
  });

  it('declara los sitemaps al publicar', () => {
    const txt = buildRobotsTxt({ site, indexable: true });
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Sitemap: https://ejemplo.com/sitemap-index.xml');
    expect(txt).toContain('Sitemap: https://ejemplo.com/news-sitemap.xml');
  });
});

describe('configuración de anuncios', () => {
  it('no exige nada sin AdSense', () => {
    expect(() => validateAdsConfig('none', undefined)).not.toThrow();
    expect(() => validateAdsConfig('placeholder', undefined)).not.toThrow();
  });

  it('exige un ID de editor válido y los bloques al activar AdSense', () => {
    expect(() => validateAdsConfig('adsense', undefined)).toThrow(/ca-pub/);
    expect(() => validateAdsConfig('adsense', 'ca-pub-123')).toThrow(/ca-pub/);
    expect(() => validateAdsConfig('adsense', 'ca-pub-1234567890123456')).toThrow(/IDs de bloque/);
  });

  it('genera la línea de ads.txt', () => {
    expect(adsTxtLine('ca-pub-1234567890123456')).toBe(
      'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0',
    );
  });

  it('abre la CSP a Google solo cuando AdSense está activo', () => {
    expect(scriptSources('placeholder')).toEqual(["'self'", "'wasm-unsafe-eval'"]);
    expect(scriptSources('adsense')).toContain('https://pagead2.googlesyndication.com');
    expect(styleSources('adsense')).toContain("'unsafe-inline'");
    expect(buildCspDirectives('none').join(';')).not.toContain('googlesyndication');
    expect(buildCspDirectives('adsense').join(';')).toContain('googlesyndication');
  });
});
