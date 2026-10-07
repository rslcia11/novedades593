/**
 * robots.txt. Mientras el sitio no esté listo para Google, bloquea todo el rastreo
 * (además del noindex en cada página), para no indexar contenido de ejemplo.
 */
import { withBase } from './urls';

export function buildRobotsTxt({ site, indexable }: { site: URL; indexable: boolean }): string {
  if (!indexable) return 'User-agent: *\nDisallow: /\n';
  return [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${withBase('/buscar/')}`,
    '',
    `Sitemap: ${new URL(withBase('/sitemap-index.xml'), site).href}`,
    `Sitemap: ${new URL(withBase('/news-sitemap.xml'), site).href}`,
    '',
  ].join('\n');
}
