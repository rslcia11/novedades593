import { defineHastPlugin } from 'satteri';

/**
 * Inserta los anuncios dentro del cuerpo de los artículos, siguiendo las reglas de la propuesta:
 * - nunca antes del segundo bloque (el lector primero recibe contenido),
 * - nunca justo después de un título ni de una frase que presenta una lista ("…estos son:"),
 * - nunca pegado al final,
 * - como máximo dos por artículo (más no sube el ingreso y empeora la experiencia),
 * - en artículos muy cortos, uno solo al final del texto.
 *
 * El plugin solo agrega `<AdSlot placement="in-article" />`; el componente decide qué mostrar
 * según el proveedor configurado, así que con `none` no queda rastro en la página.
 */

export interface BlockInfo {
  /** Nombre de la etiqueta o del componente MDX (`p`, `h2`, `Steps`...). */
  name: string;
  /** El bloque presenta lo que sigue (termina en dos puntos): separarlos cortaría la idea. */
  leadsIn?: boolean;
}

export interface AdRules {
  /** Bloques de contenido que debe haber antes del primer anuncio. */
  firstAfter: number;
  /** Bloques de contenido que debe haber antes del segundo anuncio. */
  secondAfter: number;
  max: number;
}

export const DEFAULT_AD_RULES: AdRules = { firstAfter: 2, secondAfter: 6, max: 2 };

const HEADING = /^h[1-6]$/;

/** Bloques después de los cuales no conviene poner un anuncio. */
const NO_AD_AFTER = new Set(['AffiliateDisclosure', 'Countdown']);

/**
 * Devuelve los índices (dentro de `blocks`) después de los cuales va un anuncio.
 * Función pura para poder probarla sin compilar MDX.
 */
export function pickAdPositions(blocks: readonly BlockInfo[], rules: AdRules = DEFAULT_AD_RULES): number[] {
  const positions: number[] = [];
  const thresholds = [rules.firstAfter, rules.secondAfter];

  for (let i = 0; i < blocks.length - 1 && positions.length < rules.max; i++) {
    const block = blocks[i];
    const threshold = thresholds[positions.length];
    if (!block || threshold === undefined) break;
    const count = i + 1;
    if (count < threshold) continue;
    if (HEADING.test(block.name) || NO_AD_AFTER.has(block.name) || block.leadsIn) continue;
    positions.push(i);
  }
  if (positions.length === 0 && blocks.length > 0 && rules.max > 0) positions.push(blocks.length - 1);
  return positions;
}

type AnyNode = { type: string; tagName?: string; name?: string | null };

function blockName(node: AnyNode): string | undefined {
  if (node.type === 'element') return node.tagName;
  if (node.type === 'mdxJsxFlowElement') return node.name ?? undefined;
  return undefined;
}

export const inArticleAdsPlugin = defineHastPlugin({
  name: 'entretenimiento593:in-article-ads',
  after(root, ctx) {
    // Solo artículos (MDX); las páginas en Markdown simple no llevan anuncios.
    if (ctx.sourceFormat !== 'mdx') return;
    const path = ctx.fileURL?.pathname ?? '';
    if (!path.includes('/content/articles/')) return;

    const children = root.children as readonly AnyNode[];
    const blocks: { info: BlockInfo; index: number }[] = [];
    children.forEach((node, index) => {
      const name = blockName(node);
      if (!name) return;
      const leadsIn =
        name === 'p' && /:\s*$/.test(ctx.textContent(node as Parameters<typeof ctx.textContent>[0]));
      blocks.push({ info: { name, leadsIn }, index });
    });

    const positions = pickAdPositions(blocks.map((b) => b.info));
    // De atrás hacia adelante para que los índices no se corran al insertar.
    for (const position of [...positions].reverse()) {
      const target = blocks[position];
      if (!target) continue;
      ctx.insertChildAt(root, target.index + 1, {
        type: 'mdxJsxFlowElement',
        name: 'AdSlot',
        attributes: [{ type: 'mdxJsxAttribute', name: 'placement', value: 'in-article' }],
        children: [],
      });
    }
  },
});
