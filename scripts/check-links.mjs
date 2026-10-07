/**
 * Revisa el sitio construido (dist/) sin levantar un servidor:
 * - cada enlace interno (href/src) apunta a un archivo que existe,
 * - cada ancla (#id) existe en la página de destino,
 * - ninguna URL interna de página olvida la barra final,
 * - cada página tiene <title>, meta description y canonical,
 * - si el sitio vive en una subcarpeta (BASE_PATH), todo enlace interno la incluye.
 *
 * Uso: npm run build && npm run test:links
 *      BASE_PATH=/novedades593 npm run build && BASE_PATH=/novedades593 npm run test:links
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const BASE = `/${(process.env.BASE_PATH ?? '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const SKIP_PREFIXES = ['pagefind/', '_astro/'].map((p) => BASE + p);

async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return listHtml(full);
      return e.name.endsWith('.html') ? [full] : [];
    }),
  );
  return files.flat();
}

const exists = async (file) => (await stat(file).catch(() => null))?.isFile() ?? false;

/** Archivo de dist/ que sirve una ruta pública. */
async function resolveTarget(pathname) {
  const clean = decodeURIComponent(pathname);
  if (clean.endsWith('/')) return path.join(DIST, clean, 'index.html');
  return path.join(DIST, clean);
}

const ids = new Map();
async function idsOf(file) {
  if (!ids.has(file)) {
    const html = await readFile(file, 'utf8');
    ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return ids.get(file);
}

const pages = await listHtml(DIST);
const problems = [];
let checked = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const rel = path.relative(DIST, page);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: falta <title>`);
  if (!/<meta name="description" content="[^"]{30,}"/.test(html))
    problems.push(`${rel}: falta meta description`);
  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) problems.push(`${rel}: falta canonical`);

  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(raw) || raw.startsWith('//')) continue;
    const pageUrl = `http://sitio${BASE}${rel.replace(/index\.html$/, '')}`;
    const url = new URL(raw.replaceAll('&amp;', '&'), pageUrl);
    if (SKIP_PREFIXES.some((p) => url.pathname.startsWith(p)) && attr === 'src') continue;
    checked++;

    if (!url.pathname.startsWith(BASE)) {
      problems.push(`${rel}: "${raw}" no incluye la base del sitio (${BASE})`);
      continue;
    }
    // Ruta dentro de dist/ (sin la subcarpeta pública).
    url.pathname = `/${url.pathname.slice(BASE.length)}`;

    const looksLikePage = !path.extname(url.pathname);
    if (looksLikePage && !url.pathname.endsWith('/')) {
      problems.push(`${rel}: "${raw}" no termina en barra`);
      continue;
    }
    const target = await resolveTarget(url.pathname);
    if (!(await exists(target))) {
      problems.push(`${rel}: enlace roto "${raw}"`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!(await idsOf(target)).has(id)) problems.push(`${rel}: el ancla "${raw}" no existe en el destino`);
    }
  }
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} problema(s) en ${pages.length} páginas:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} páginas y ${checked} enlaces internos revisados, sin problemas.`);
