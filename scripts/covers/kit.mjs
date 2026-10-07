/**
 * Kit de ilustración de la Dimensión 593.
 * Todas las portadas comparten estas piezas: cielo, portal, estrellas, destellos y el
 * estilo "pop" (contorno grueso oscuro + sombra dura). Lienzo: 1600×900 (16:9).
 *
 * Reglas de marketing aplicadas (ver docs/ARQUITECTURA.md):
 * - un solo sujeto grande y centrado (Discover recorta los bordes),
 * - fondo oscuro saturado con sujeto brillante (máximo contraste),
 * - sin texto ni logos dentro de la imagen.
 */

export const W = 1600;
export const H = 900;

export const C = {
  ink: '#0d1023',
  deep: '#060814',
  white: '#f3f1ff',
  green: '#9dff3a',
  greenDark: '#4fb81a',
  cyan: '#3fe6ff',
  cyanDark: '#1a9fbd',
  pink: '#ff5db1',
  pinkDark: '#c22f7f',
  yellow: '#ffd23f',
  yellowDark: '#d19a0c',
  purple: '#8b5cff',
  purpleDark: '#5631c9',
  orange: '#ff8a3d',
  orangeDark: '#cc5a14',
  red: '#ff4d5e',
  gray: '#8d8fb8',
  grayDark: '#55588a',
};

/** Fondos por sección: [color de arriba, color de abajo, nebulosa principal, nebulosa secundaria]. */
export const THEMES = {
  juegos: ['#0f2a2f', '#0d1023', C.green, C.cyan],
  equipo: ['#0b2440', '#0d1023', C.cyan, C.purple],
  creadores: ['#2a0f3a', '#0d1023', C.pink, C.purple],
  noticias: ['#2d220a', '#0d1023', C.yellow, C.orange],
};

/** Generador pseudoaleatorio con semilla: la misma portada siempre sale igual. */
export function rng(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const OUTLINE = 10;

/** Atributos de trazo del estilo pop. */
export const stroke = (w = OUTLINE) =>
  `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Cielo con degradado, nebulosas y estrellas. */
export function sky(theme, seed) {
  const [top, bottom, neb1, neb2] = THEMES[theme] ?? THEMES.juegos;
  const rand = rng(seed);
  const stars = Array.from({ length: 140 }, () => {
    const x = Math.round(rand() * W);
    const y = Math.round(rand() * H);
    const r = (rand() * 1.8 + 0.4).toFixed(2);
    const o = (rand() * 0.6 + 0.25).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${o}"/>`;
  }).join('');
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="neb1" cx="0.78" cy="0.2" r="0.6">
      <stop offset="0" stop-color="${neb1}" stop-opacity="0.35"/><stop offset="1" stop-color="${neb1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="neb2" cx="0.12" cy="0.85" r="0.55">
      <stop offset="0" stop-color="${neb2}" stop-opacity="0.28"/><stop offset="1" stop-color="${neb2}" stop-opacity="0"/>
    </radialGradient>
    <filter id="silhouette">
      <feFlood flood-color="${C.deep}" flood-opacity="0.85"/>
      <feComposite in2="SourceAlpha" operator="in"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#neb1)"/>
  <rect width="${W}" height="${H}" fill="url(#neb2)"/>
  ${stars}`;
}

/** Portal de plasma detrás del sujeto. */
export function portal(cx = 800, cy = 450, r = 330, color = C.green) {
  const arms = [0, 72, 144, 216, 288]
    .map(
      (deg, i) =>
        `<path d="M${cx} ${cy} c ${r * 0.25} ${-r * 0.32}, ${r * 0.62} ${-r * 0.2}, ${r * 0.66} ${r * 0.12} s ${-r * 0.2} ${r * 0.55}, ${-r * 0.42} ${r * 0.6}" fill="none" stroke="${i % 2 ? C.white : color}" stroke-opacity="${i % 2 ? 0.35 : 0.6}" stroke-width="${i % 2 ? 10 : 18}" stroke-linecap="round" transform="rotate(${deg} ${cx} ${cy})"/>`,
    )
    .join('');
  return `
  <circle cx="${cx}" cy="${cy}" r="${r * 1.05}" fill="${color}" opacity="0.35" filter="url(#glow)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.18"/>
  ${arms}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.white}" stroke-opacity="0.55" stroke-width="8" stroke-dasharray="60 28"/>`;
}

/** Destello de cuatro puntas. */
export function sparkle(x, y, s = 30, color = C.white) {
  return `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z" fill="${color}"/>`;
}

/** Varios destellos alrededor de un punto. */
export function sparkles(seed, cx = 800, cy = 450, radius = 420, count = 6) {
  const rand = rng(`${seed}-sparkles`);
  const colors = [C.white, C.yellow, C.cyan, C.green, C.pink];
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.6;
    const dist = radius * (0.8 + rand() * 0.35);
    const x = cx + Math.cos(angle) * dist * 1.25;
    const y = cy + Math.sin(angle) * dist * 0.8;
    return sparkle(Math.round(x), Math.round(y), Math.round(14 + rand() * 22), colors[i % colors.length]);
  }).join('');
}

/**
 * Estilo pop: dibuja el sujeto con una sombra dura desplazada.
 * `inner` es el SVG del sujeto (formas con contorno oscuro).
 */
export function pop(id, inner, dx = 18, dy = 18) {
  return `
  <defs><g id="${id}">${inner}</g></defs>
  <use href="#${id}" filter="url(#silhouette)" transform="translate(${dx} ${dy})"/>
  <use href="#${id}"/>`;
}

/** Brillo blanco sobre una forma (reflejo de caricatura). */
export const shine = (d, w = 12, o = 0.7) =>
  `<path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;

/** Arma el SVG final. */
export function svg(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${content}</svg>`;
}
