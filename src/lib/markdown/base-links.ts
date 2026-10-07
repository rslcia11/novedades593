import { defineHastPlugin } from 'satteri';
import { joinBase } from '../urls';

/**
 * Los enlaces internos escritos dentro del contenido ("[guía](/juegos/...)") son rutas del sitio.
 * Este plugin les antepone la base al compilar, para que funcionen igual si el sitio vive en la
 * raíz de un dominio o en una subcarpeta (GitHub Pages: /novedades593/).
 */
export function baseLinksPlugin(base: string) {
  return defineHastPlugin({
    name: 'entretenimiento593:base-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.['href'];
        if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
          ctx.setProperty(node, 'href', joinBase(base, href));
        }
      },
    },
  });
}
