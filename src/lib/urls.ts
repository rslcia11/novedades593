/**
 * Todas las URLs internas salen de aquí. El sitio usa barra final (`trailingSlash: 'always'`),
 * así que nunca hay que escribir rutas a mano en los componentes.
 *
 * El sitio puede vivir en la raíz de un dominio o en una subcarpeta (por ejemplo
 * `usuario.github.io/novedades593/`). Por eso toda ruta pasa por `withBase`, que antepone
 * la base configurada en `astro.config.ts` (BASE_PATH).
 */
import type { ContentSection } from '@/config/sections';

export interface ArticleRef {
  id: string;
  section: ContentSection;
  /** id del juego, si lo tiene. */
  game?: string | undefined;
}

/** Une una base (`/` o `/subcarpeta/`) con una ruta del sitio (`/juegos/`). */
export function joinBase(base: string, path: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return prefix + path.replace(/^\//, '');
}

/** Quita la base de una ruta pública para compararla con las rutas del sitio. */
export function stripBase(base: string, pathname: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return pathname.startsWith(prefix) ? `/${pathname.slice(prefix.length)}` : pathname;
}

/** Ruta del sitio → ruta pública, con la base configurada. */
export const withBase = (path: string) => joinBase(import.meta.env.BASE_URL, path);

export const homeUrl = () => withBase('/');
export const sectionUrl = (section: string) => withBase(`/${section}/`);
export const gameUrl = (game: string) => withBase(`/juegos/${game}/`);
export const toolUrl = (tool: string) => withBase(`/herramientas/${tool}/`);
export const authorUrl = (author: string) => withBase(`/autores/${author}/`);
export const pageUrl = (page: string) => withBase(`/${page}/`);
export const searchUrl = (query?: string) =>
  withBase(query ? `/buscar/?q=${encodeURIComponent(query)}` : '/buscar/');

/**
 * Las guías de la sección juegos cuelgan de su juego (/juegos/minecraft/diamantes-minecraft/);
 * el resto, de su sección (/creadores/hacer-live-tiktok/).
 */
export function articleUrl(article: ArticleRef): string {
  if (article.section === 'juegos') {
    if (!article.game) throw new Error(`La guía ${article.id} no tiene juego.`);
    return withBase(`/juegos/${article.game}/${article.id}/`);
  }
  return withBase(`/${article.section}/${article.id}/`);
}

/** Convierte una ruta interna en URL absoluta (canonical, Open Graph, sitemap, RSS). */
export function absoluteUrl(path: string, site: URL | string | undefined): string {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  return new URL(path, site).href;
}
