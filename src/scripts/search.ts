/**
 * Cliente del buscador. Pagefind genera el índice en `dist/pagefind/` al construir el sitio,
 * así que en `astro dev` no hay índice: las funciones devuelven `null` y la página lo explica.
 * Docs: https://pagefind.app/docs/api/
 */

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string | undefined>;
}

interface PagefindModule {
  options?: (options: { baseUrl?: string }) => Promise<void>;
  init?: () => Promise<void>;
  search: (query: string) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] }>;
  debouncedSearch?: (
    query: string,
    options?: object,
    debounceMs?: number,
  ) => Promise<{ results: { id: string; data: () => Promise<PagefindResultData> }[] } | null>;
}

export interface SearchHit {
  url: string;
  title: string;
  excerpt: string;
  kicker: string;
}

import { withBase } from '@/lib/urls';

const PAGEFIND_URL = withBase('/pagefind/pagefind.js');
let pagefind: Promise<PagefindModule | null> | undefined;

export function loadSearch(): Promise<PagefindModule | null> {
  pagefind ??= import(/* @vite-ignore */ PAGEFIND_URL)
    .then(async (mod: PagefindModule) => {
      // Las URLs del índice son relativas a dist/: se les antepone la base del sitio.
      await mod.options?.({ baseUrl: withBase('/') });
      await mod.init?.();
      return mod;
    })
    .catch(() => null);
  return pagefind;
}

async function toHits(
  response: { results: { data: () => Promise<PagefindResultData> }[] } | null,
  limit: number,
): Promise<SearchHit[] | null> {
  if (!response) return null;
  const data = await Promise.all(response.results.slice(0, limit).map((r) => r.data()));
  return data.map((d) => ({
    url: d.url,
    title: d.meta['title'] ?? d.url,
    excerpt: d.excerpt,
    kicker: d.meta['kicker'] ?? '',
  }));
}

/** Busca y devuelve hasta `limit` resultados; `null` si el índice no está disponible o la búsqueda se canceló. */
export async function search(query: string, limit = 20): Promise<SearchHit[] | null> {
  const mod = await loadSearch();
  if (!mod) return null;
  return toHits(await mod.search(query), limit);
}

/** Igual que `search`, pero espera a que la persona deje de escribir. */
export async function searchAsYouType(query: string, limit = 6): Promise<SearchHit[] | null> {
  const mod = await loadSearch();
  if (!mod) return null;
  const response = mod.debouncedSearch ? await mod.debouncedSearch(query, {}, 150) : await mod.search(query);
  return toHits(response, limit);
}

/**
 * Pinta el extracto de Pagefind conservando solo el texto y las marcas <mark>,
 * sin insertar HTML arbitrario en la página.
 */
export function renderExcerpt(target: HTMLElement, excerpt: string): void {
  const doc = new DOMParser().parseFromString(`<p>${excerpt}</p>`, 'text/html');
  target.replaceChildren();
  doc.body.firstElementChild?.childNodes.forEach((node) => {
    if (node.nodeName === 'MARK') {
      const mark = document.createElement('mark');
      mark.textContent = node.textContent;
      target.append(mark);
    } else {
      target.append(document.createTextNode(node.textContent ?? ''));
    }
  });
}
