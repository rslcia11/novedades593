/**
 * Todas las URLs internas salen de aquí. El sitio usa barra final (`trailingSlash: 'always'`),
 * así que nunca hay que escribir rutas a mano en los componentes.
 */
import type { ContentSection } from '@/config/sections';

export interface ArticleRef {
  id: string;
  section: ContentSection;
  /** id del juego, si lo tiene. */
  game?: string | undefined;
}

export const homeUrl = () => '/';
export const sectionUrl = (section: string) => `/${section}/`;
export const gameUrl = (game: string) => `/juegos/${game}/`;
export const toolUrl = (tool: string) => `/herramientas/${tool}/`;
export const authorUrl = (author: string) => `/autores/${author}/`;
export const pageUrl = (page: string) => `/${page}/`;
export const searchUrl = (query?: string) => (query ? `/buscar/?q=${encodeURIComponent(query)}` : '/buscar/');

/**
 * Las guías de la sección juegos cuelgan de su juego (/juegos/minecraft/diamantes-minecraft/);
 * el resto, de su sección (/creadores/hacer-live-tiktok/).
 */
export function articleUrl(article: ArticleRef): string {
  if (article.section === 'juegos') {
    if (!article.game) throw new Error(`La guía ${article.id} no tiene juego.`);
    return `/juegos/${article.game}/${article.id}/`;
  }
  return `/${article.section}/${article.id}/`;
}

/** Convierte una ruta interna en URL absoluta (canonical, Open Graph, sitemap, RSS). */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  return new URL(path, site).href;
}
