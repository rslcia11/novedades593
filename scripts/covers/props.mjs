/**
 * Objetos ilustrados (props) de las portadas. Cada función devuelve SVG con el contorno
 * oscuro del estilo pop. Todos son dibujos genéricos y propios: nada imita logos,
 * personajes ni interfaces de marcas reales.
 */
import { C, shine, stroke } from './kit.mjs';

const pts = (list) => list.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(' ');

/** Gema facetada (diamante). */
export function gem(cx, cy, s, color = C.cyan, dark = C.cyanDark) {
  const tl = [cx - s * 0.55, cy - s * 0.8];
  const tr = [cx + s * 0.55, cy - s * 0.8];
  const r = [cx + s, cy - s * 0.3];
  const l = [cx - s, cy - s * 0.3];
  const tip = [cx, cy + s];
  return `
  <polygon points="${pts([tl, tr, r, tip, l])}" fill="${color}" ${stroke()}/>
  <polygon points="${pts([tl, tr, r, l])}" fill="#ffffff" fill-opacity="0.35"/>
  <polygon points="${pts([[cx - s * 0.3, cy - s * 0.3], [cx + s * 0.3, cy - s * 0.3], tip])}" fill="${dark}" fill-opacity="0.45"/>
  <polyline points="${pts([l, r])}" fill="none" ${stroke(6)}/>
  <polyline points="${pts([tl, [cx - s * 0.3, cy - s * 0.3], tip, [cx + s * 0.3, cy - s * 0.3], tr])}" fill="none" ${stroke(5)}/>
  <polyline points="${pts([
    [cx - s * 0.3, cy - s * 0.3],
    [cx, cy - s * 0.8],
    [cx + s * 0.3, cy - s * 0.3],
  ])}" fill="none" ${stroke(5)}/>
  ${shine(`M${cx - s * 0.62} ${cy - s * 0.42} L${cx - s * 0.38} ${cy - s * 0.68}`, s * 0.08, 0.9)}`;
}

/** Pico de minero. */
export function pickaxe(cx, cy, s, rot = -35, head = C.cyan) {
  return `
  <g transform="rotate(${rot} ${cx} ${cy})">
    <rect x="${cx - s * 0.07}" y="${cy - s * 0.55}" width="${s * 0.14}" height="${s * 1.25}" rx="${s * 0.05}" fill="${C.orange}" ${stroke()}/>
    <rect x="${cx - s * 0.07}" y="${cy + s * 0.45}" width="${s * 0.14}" height="${s * 0.25}" rx="${s * 0.05}" fill="${C.orangeDark}" ${stroke(8)}/>
    <path d="M${cx - s * 0.62} ${cy - s * 0.35} Q${cx} ${cy - s * 0.85} ${cx + s * 0.62} ${cy - s * 0.35} L${cx + s * 0.5} ${cy - s * 0.25} Q${cx} ${cy - s * 0.58} ${cx - s * 0.5} ${cy - s * 0.25} Z" fill="${head}" ${stroke()}/>
    ${shine(`M${cx - s * 0.35} ${cy - s * 0.48} Q${cx} ${cy - s * 0.7} ${cx + s * 0.3} ${cy - s * 0.5}`, s * 0.04, 0.8)}
  </g>`;
}

/** Bloque isométrico (cubo de vóxeles genérico). */
export function cube(cx, cy, s, top = C.green, left = C.greenDark, right = '#6fd12a') {
  const h = s * 0.5;
  return `
  <polygon points="${pts([
    [cx, cy - h],
    [cx + s, cy],
    [cx, cy + h],
    [cx - s, cy],
  ])}" fill="${top}" ${stroke()}/>
  <polygon points="${pts([
    [cx - s, cy],
    [cx, cy + h],
    [cx, cy + h + s],
    [cx - s, cy + s],
  ])}" fill="${left}" ${stroke()}/>
  <polygon points="${pts([
    [cx + s, cy],
    [cx, cy + h],
    [cx, cy + h + s],
    [cx + s, cy + s],
  ])}" fill="${right}" ${stroke()}/>`;
}

/** Celular con contenido en pantalla. */
export function phone(cx, cy, w, h, screen = C.ink, inner = '') {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.14}" fill="${C.white}" ${stroke()}/>
  <rect x="${x + w * 0.07}" y="${y + h * 0.06}" width="${w * 0.86}" height="${h * 0.86}" rx="${w * 0.08}" fill="${screen}" ${stroke(6)}/>
  <rect x="${cx - w * 0.12}" y="${y + h * 0.025}" width="${w * 0.24}" height="${h * 0.018}" rx="${h * 0.01}" fill="${C.ink}"/>
  ${inner}
  ${shine(`M${x + w * 0.16} ${y + h * 0.12} L${x + w * 0.16} ${y + h * 0.3}`, w * 0.03, 0.5)}`;
}

/** Monitor de computadora con base. */
export function monitor(cx, cy, w, h, screen = C.ink, inner = '') {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `
  <path d="M${cx - w * 0.08} ${y + h} L${cx - w * 0.12} ${y + h * 1.22} L${cx + w * 0.12} ${y + h * 1.22} L${cx + w * 0.08} ${y + h} Z" fill="${C.gray}" ${stroke()}/>
  <rect x="${cx - w * 0.22}" y="${y + h * 1.2}" width="${w * 0.44}" height="${h * 0.07}" rx="${h * 0.03}" fill="${C.grayDark}" ${stroke()}/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.04}" fill="${C.white}" ${stroke()}/>
  <rect x="${x + w * 0.04}" y="${y + h * 0.06}" width="${w * 0.92}" height="${h * 0.86}" rx="${w * 0.02}" fill="${screen}" ${stroke(6)}/>
  ${inner}`;
}

/** Micrófono de estudio con soporte. */
export function mic(cx, cy, s, body = C.pink) {
  return `
  <path d="M${cx - s * 0.42} ${cy - s * 0.05} Q${cx - s * 0.42} ${cy + s * 0.5} ${cx} ${cy + s * 0.5} Q${cx + s * 0.42} ${cy + s * 0.5} ${cx + s * 0.42} ${cy - s * 0.05}" fill="none" ${stroke(14)}/>
  <rect x="${cx - s * 0.06}" y="${cy + s * 0.5}" width="${s * 0.12}" height="${s * 0.38}" fill="${C.gray}" ${stroke()}/>
  <rect x="${cx - s * 0.36}" y="${cy + s * 0.84}" width="${s * 0.72}" height="${s * 0.14}" rx="${s * 0.07}" fill="${C.grayDark}" ${stroke()}/>
  <rect x="${cx - s * 0.28}" y="${cy - s * 0.85}" width="${s * 0.56}" height="${s * 1.1}" rx="${s * 0.28}" fill="${body}" ${stroke()}/>
  ${[0.55, 0.38, 0.21, 0.04].map((k) => `<line x1="${cx - s * 0.28}" y1="${cy - s * k}" x2="${cx + s * 0.28}" y2="${cy - s * k}" ${stroke(6)}/>`).join('')}
  ${shine(`M${cx - s * 0.15} ${cy - s * 0.7} L${cx - s * 0.15} ${cy - s * 0.45}`, s * 0.06, 0.7)}`;
}

/** Aro de luz. */
export function ringLight(cx, cy, r) {
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="${r * 0.3 + 20}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.yellow}" stroke-width="${r * 0.3}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="${r * 0.08}"/>`;
}

/** Escudo con candado. */
export function shield(cx, cy, s, color = C.green, dark = C.greenDark) {
  return `
  <path d="M${cx} ${cy - s} L${cx + s * 0.8} ${cy - s * 0.65} L${cx + s * 0.8} ${cy - s * 0.05} Q${cx + s * 0.8} ${cy + s * 0.65} ${cx} ${cy + s} Q${cx - s * 0.8} ${cy + s * 0.65} ${cx - s * 0.8} ${cy - s * 0.05} L${cx - s * 0.8} ${cy - s * 0.65} Z" fill="${color}" ${stroke()}/>
  <path d="M${cx} ${cy - s} L${cx} ${cy + s} Q${cx + s * 0.8} ${cy + s * 0.65} ${cx + s * 0.8} ${cy - s * 0.05} L${cx + s * 0.8} ${cy - s * 0.65} Z" fill="${dark}" fill-opacity="0.45"/>
  ${lock(cx, cy + s * 0.05, s * 0.42)}
  ${shine(`M${cx - s * 0.55} ${cy - s * 0.45} L${cx - s * 0.55} ${cy}`, s * 0.06, 0.7)}`;
}

/** Candado. */
export function lock(cx, cy, s, body = C.yellow) {
  return `
  <path d="M${cx - s * 0.45} ${cy - s * 0.1} L${cx - s * 0.45} ${cy - s * 0.45} Q${cx - s * 0.45} ${cy - s} ${cx} ${cy - s} Q${cx + s * 0.45} ${cy - s} ${cx + s * 0.45} ${cy - s * 0.45} L${cx + s * 0.45} ${cy - s * 0.1}" fill="none" stroke="${C.ink}" stroke-width="${s * 0.22 + 8}"/>
  <path d="M${cx - s * 0.45} ${cy - s * 0.1} L${cx - s * 0.45} ${cy - s * 0.45} Q${cx - s * 0.45} ${cy - s} ${cx} ${cy - s} Q${cx + s * 0.45} ${cy - s} ${cx + s * 0.45} ${cy - s * 0.45} L${cx + s * 0.45} ${cy - s * 0.1}" fill="none" stroke="${C.gray}" stroke-width="${s * 0.22}"/>
  <rect x="${cx - s * 0.7}" y="${cy - s * 0.15}" width="${s * 1.4}" height="${s * 1.05}" rx="${s * 0.18}" fill="${body}" ${stroke()}/>
  <circle cx="${cx}" cy="${cy + s * 0.3}" r="${s * 0.14}" fill="${C.ink}"/>
  <rect x="${cx - s * 0.05}" y="${cy + s * 0.32}" width="${s * 0.1}" height="${s * 0.28}" fill="${C.ink}"/>`;
}

/** Caja de regalo. */
export function gift(cx, cy, s, box = C.pink, ribbon = C.yellow) {
  return `
  <rect x="${cx - s * 0.8}" y="${cy - s * 0.2}" width="${s * 1.6}" height="${s * 1.1}" rx="${s * 0.06}" fill="${box}" ${stroke()}/>
  <rect x="${cx - s * 0.92}" y="${cy - s * 0.52}" width="${s * 1.84}" height="${s * 0.38}" rx="${s * 0.06}" fill="${box}" ${stroke()}/>
  <rect x="${cx - s * 0.14}" y="${cy - s * 0.52}" width="${s * 0.28}" height="${s * 1.42}" fill="${ribbon}" ${stroke(8)}/>
  <path d="M${cx} ${cy - s * 0.52} C${cx - s * 0.2} ${cy - s * 1.05}, ${cx - s * 0.75} ${cy - s * 0.95}, ${cx - s * 0.5} ${cy - s * 0.6} Z" fill="${ribbon}" ${stroke(8)}/>
  <path d="M${cx} ${cy - s * 0.52} C${cx + s * 0.2} ${cy - s * 1.05}, ${cx + s * 0.75} ${cy - s * 0.95}, ${cx + s * 0.5} ${cy - s * 0.6} Z" fill="${ribbon}" ${stroke(8)}/>
  ${shine(`M${cx - s * 0.65} ${cy - s * 0.05} L${cx - s * 0.65} ${cy + s * 0.35}`, s * 0.06, 0.6)}`;
}

/** Moneda. */
export function coin(cx, cy, r, color = C.yellow) {
  return `
  <ellipse cx="${cx}" cy="${cy + r * 0.12}" rx="${r}" ry="${r}" fill="${C.yellowDark}" ${stroke()}/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" ${stroke()}/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="none" stroke="${C.yellowDark}" stroke-width="${r * 0.1}"/>
  ${sparkleShape(cx, cy, r * 0.38, C.yellowDark)}`;
}

function sparkleShape(x, y, s, color) {
  return `<path d="M${x} ${y - s} Q${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} Q${x + s * 0.2} ${y + s * 0.2} ${x} ${y + s} Q${x - s * 0.2} ${y + s * 0.2} ${x - s} ${y} Q${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s}Z" fill="${color}"/>`;
}

/** Control de videojuego genérico. */
export function controller(cx, cy, s, body = C.purple) {
  return `
  <path d="M${cx - s * 0.6} ${cy - s * 0.35} L${cx + s * 0.6} ${cy - s * 0.35} Q${cx + s} ${cy - s * 0.35} ${cx + s * 1.05} ${cy + s * 0.1} L${cx + s * 1.1} ${cy + s * 0.45} Q${cx + s * 1.12} ${cy + s * 0.75} ${cx + s * 0.85} ${cy + s * 0.75} Q${cx + s * 0.6} ${cy + s * 0.75} ${cx + s * 0.45} ${cy + s * 0.4} L${cx - s * 0.45} ${cy + s * 0.4} Q${cx - s * 0.6} ${cy + s * 0.75} ${cx - s * 0.85} ${cy + s * 0.75} Q${cx - s * 1.12} ${cy + s * 0.75} ${cx - s * 1.1} ${cy + s * 0.45} L${cx - s * 1.05} ${cy + s * 0.1} Q${cx - s} ${cy - s * 0.35} ${cx - s * 0.6} ${cy - s * 0.35} Z" fill="${body}" ${stroke()}/>
  <path d="M${cx - s * 0.62} ${cy - s * 0.12} h${s * 0.1} v${-s * 0.1} h${s * 0.12} v${s * 0.1} h${s * 0.1} v${s * 0.12} h${-s * 0.1} v${s * 0.1} h${-s * 0.12} v${-s * 0.1} h${-s * 0.1} Z" fill="${C.ink}"/>
  <circle cx="${cx + s * 0.52}" cy="${cy - s * 0.15}" r="${s * 0.08}" fill="${C.green}" ${stroke(5)}/>
  <circle cx="${cx + s * 0.7}" cy="${cy - s * 0.02}" r="${s * 0.08}" fill="${C.pink}" ${stroke(5)}/>
  <circle cx="${cx + s * 0.34}" cy="${cy - s * 0.02}" r="${s * 0.08}" fill="${C.cyan}" ${stroke(5)}/>
  <circle cx="${cx + s * 0.52}" cy="${cy + s * 0.11}" r="${s * 0.08}" fill="${C.yellow}" ${stroke(5)}/>
  <circle cx="${cx - s * 0.28}" cy="${cy + s * 0.2}" r="${s * 0.12}" fill="${C.grayDark}" ${stroke(6)}/>
  <circle cx="${cx + s * 0.18}" cy="${cy + s * 0.2}" r="${s * 0.12}" fill="${C.grayDark}" ${stroke(6)}/>
  ${shine(`M${cx - s * 0.75} ${cy - s * 0.22} Q${cx - s * 0.95} ${cy} ${cx - s * 0.95} ${cy + s * 0.3}`, s * 0.05, 0.6)}`;
}

/** Router con antenas y ondas de wifi. */
export function router(cx, cy, s, body = C.cyan) {
  return `
  <line x1="${cx - s * 0.6}" y1="${cy - s * 0.2}" x2="${cx - s * 0.75}" y2="${cy - s * 0.95}" ${stroke(16)}/>
  <line x1="${cx + s * 0.6}" y1="${cy - s * 0.2}" x2="${cx + s * 0.75}" y2="${cy - s * 0.95}" ${stroke(16)}/>
  <line x1="${cx - s * 0.6}" y1="${cy - s * 0.2}" x2="${cx - s * 0.75}" y2="${cy - s * 0.95}" stroke="${C.gray}" stroke-width="8" stroke-linecap="round"/>
  <line x1="${cx + s * 0.6}" y1="${cy - s * 0.2}" x2="${cx + s * 0.75}" y2="${cy - s * 0.95}" stroke="${C.gray}" stroke-width="8" stroke-linecap="round"/>
  <rect x="${cx - s}" y="${cy - s * 0.25}" width="${s * 2}" height="${s * 0.6}" rx="${s * 0.14}" fill="${body}" ${stroke()}/>
  ${[0, 1, 2, 3].map((i) => `<circle cx="${cx - s * 0.6 + i * s * 0.22}" cy="${cy + s * 0.05}" r="${s * 0.05}" fill="${i < 3 ? C.green : C.yellow}" ${stroke(4)}/>`).join('')}
  ${shine(`M${cx - s * 0.85} ${cy - s * 0.1} L${cx + s * 0.2} ${cy - s * 0.1}`, s * 0.04, 0.6)}`;
}

/** Arcos de señal (wifi o transmisión). */
export function waves(cx, cy, r, color = C.green, count = 3, start = -140, end = -40) {
  const rad = (d) => (d * Math.PI) / 180;
  return Array.from({ length: count }, (_, i) => {
    const rr = r * (0.45 + i * 0.3);
    const x1 = cx + rr * Math.cos(rad(start));
    const y1 = cy + rr * Math.sin(rad(start));
    const x2 = cx + rr * Math.cos(rad(end));
    const y2 = cy + rr * Math.sin(rad(end));
    const d = `M${x1.toFixed(1)} ${y1.toFixed(1)} A${rr} ${rr} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="16" stroke-linecap="round"/>`;
  }).join('');
}

/** Velocímetro (rendimiento, ping, FPS). `value` de 0 a 1. */
export function gauge(cx, cy, r, value = 0.8, needle = C.pink) {
  const angle = -180 + 180 * value;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + Math.cos(rad) * r * 0.78;
  const ny = cy + Math.sin(rad) * r * 0.78;
  const seg = (a0, a1, color) => {
    const p = (a) => [
      cx + Math.cos((a * Math.PI) / 180) * r * 0.82,
      cy + Math.sin((a * Math.PI) / 180) * r * 0.82,
    ];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r * 0.82} ${r * 0.82} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${r * 0.16}"/>`;
  };
  return `
  <path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z" fill="${C.white}" ${stroke()}/>
  ${seg(-180, -120, C.red)}${seg(-120, -60, C.yellow)}${seg(-60, 0, C.green)}
  <line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${C.ink}" stroke-width="${r * 0.09 + 8}" stroke-linecap="round"/>
  <line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${needle}" stroke-width="${r * 0.09}" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.12}" fill="${C.ink}"/>`;
}

/** Trofeo. */
export function trophy(cx, cy, s, color = C.yellow) {
  return `
  <path d="M${cx - s * 0.55} ${cy - s * 0.75} Q${cx - s * 1.05} ${cy - s * 0.75} ${cx - s * 0.95} ${cy - s * 0.35} Q${cx - s * 0.85} ${cy - s * 0.05} ${cx - s * 0.42} ${cy - s * 0.02}" fill="none" ${stroke(26)}/>
  <path d="M${cx + s * 0.55} ${cy - s * 0.75} Q${cx + s * 1.05} ${cy - s * 0.75} ${cx + s * 0.95} ${cy - s * 0.35} Q${cx + s * 0.85} ${cy - s * 0.05} ${cx + s * 0.42} ${cy - s * 0.02}" fill="none" ${stroke(26)}/>
  <path d="M${cx - s * 0.55} ${cy - s * 0.75} Q${cx - s * 1.05} ${cy - s * 0.75} ${cx - s * 0.95} ${cy - s * 0.35} Q${cx - s * 0.85} ${cy - s * 0.05} ${cx - s * 0.42} ${cy - s * 0.02}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
  <path d="M${cx + s * 0.55} ${cy - s * 0.75} Q${cx + s * 1.05} ${cy - s * 0.75} ${cx + s * 0.95} ${cy - s * 0.35} Q${cx + s * 0.85} ${cy - s * 0.05} ${cx + s * 0.42} ${cy - s * 0.02}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
  <path d="M${cx - s * 0.62} ${cy - s * 0.85} L${cx + s * 0.62} ${cy - s * 0.85} L${cx + s * 0.55} ${cy - s * 0.25} Q${cx + s * 0.45} ${cy + s * 0.2} ${cx} ${cy + s * 0.25} Q${cx - s * 0.45} ${cy + s * 0.2} ${cx - s * 0.55} ${cy - s * 0.25} Z" fill="${color}" ${stroke()}/>
  <rect x="${cx - s * 0.12}" y="${cy + s * 0.22}" width="${s * 0.24}" height="${s * 0.35}" fill="${C.yellowDark}" ${stroke()}/>
  <rect x="${cx - s * 0.5}" y="${cy + s * 0.55}" width="${s}" height="${s * 0.28}" rx="${s * 0.05}" fill="${C.purple}" ${stroke()}/>
  ${sparkleShape(cx, cy - s * 0.4, s * 0.22, '#ffffff')}
  ${shine(`M${cx - s * 0.42} ${cy - s * 0.7} L${cx - s * 0.36} ${cy - s * 0.25}`, s * 0.06, 0.6)}`;
}

/** Llama. */
export function flame(cx, cy, s, outer = C.orange, inner = C.yellow) {
  return `
  <path d="M${cx} ${cy - s} C${cx + s * 0.25} ${cy - s * 0.55}, ${cx + s * 0.75} ${cy - s * 0.4}, ${cx + s * 0.7} ${cy + s * 0.25} C${cx + s * 0.65} ${cy + s * 0.75}, ${cx - s * 0.65} ${cy + s * 0.75}, ${cx - s * 0.7} ${cy + s * 0.25} C${cx - s * 0.75} ${cy - s * 0.15}, ${cx - s * 0.45} ${cy - s * 0.35}, ${cx - s * 0.3} ${cy - s * 0.55} C${cx - s * 0.2} ${cy - s * 0.3}, ${cx - s * 0.05} ${cy - s * 0.35}, ${cx} ${cy - s} Z" fill="${outer}" ${stroke()}/>
  <path d="M${cx} ${cy - s * 0.35} C${cx + s * 0.2} ${cy - s * 0.1}, ${cx + s * 0.38} ${cy + s * 0.05}, ${cx + s * 0.34} ${cy + s * 0.32} C${cx + s * 0.3} ${cy + s * 0.58}, ${cx - s * 0.3} ${cy + s * 0.58}, ${cx - s * 0.34} ${cy + s * 0.32} C${cx - s * 0.36} ${cy + s * 0.1}, ${cx - s * 0.12} ${cy - s * 0.05}, ${cx} ${cy - s * 0.35} Z" fill="${inner}" stroke="${C.ink}" stroke-width="6"/>`;
}

/** Señal de advertencia (triángulo con signo de exclamación dibujado). */
export function warning(cx, cy, s, color = C.yellow) {
  return `
  <path d="M${cx} ${cy - s} L${cx + s * 1.05} ${cy + s * 0.8} L${cx - s * 1.05} ${cy + s * 0.8} Z" fill="${color}" ${stroke()}/>
  <rect x="${cx - s * 0.09}" y="${cy - s * 0.4}" width="${s * 0.18}" height="${s * 0.75}" rx="${s * 0.09}" fill="${C.ink}"/>
  <circle cx="${cx}" cy="${cy + s * 0.56}" r="${s * 0.11}" fill="${C.ink}"/>`;
}

/** Señal de prohibido. */
export function ban(cx, cy, r, color = C.red) {
  return `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="${r * 0.28 + 16}"/>
  <line x1="${cx - r * 0.7}" y1="${cy + r * 0.7}" x2="${cx + r * 0.7}" y2="${cy - r * 0.7}" stroke="${C.ink}" stroke-width="${r * 0.28 + 16}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${r * 0.28}"/>
  <line x1="${cx - r * 0.7}" y1="${cy + r * 0.7}" x2="${cx + r * 0.7}" y2="${cy - r * 0.7}" stroke="${color}" stroke-width="${r * 0.28}"/>`;
}

/** Anzuelo de pesca (estafas / phishing). */
export function hook(cx, cy, s) {
  const d = `M${cx} ${cy - s} L${cx} ${cy + s * 0.35} Q${cx} ${cy + s * 0.75} ${cx - s * 0.38} ${cy + s * 0.75} Q${cx - s * 0.72} ${cy + s * 0.75} ${cx - s * 0.72} ${cy + s * 0.38} L${cx - s * 0.55} ${cy + s * 0.52}`;
  return `
  <line x1="${cx}" y1="${cy - s * 2.2}" x2="${cx}" y2="${cy - s}" stroke="${C.white}" stroke-width="5" stroke-opacity="0.8"/>
  <path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${s * 0.16 + 14}" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="${C.gray}" stroke-width="${s * 0.16}" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${cx}" cy="${cy - s}" r="${s * 0.12}" fill="${C.gray}" ${stroke(6)}/>`;
}

/** Palmera. */
export function palm(x, y, s, lean = 8) {
  const top = [x + lean * s * 0.03, y - s];
  const leaves = [-160, -120, -75, -30, 10]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      const ex = top[0] + Math.cos(rad) * s * 0.55;
      const ey = top[1] + Math.sin(rad) * s * 0.45 + s * 0.12;
      const mx = top[0] + Math.cos(rad) * s * 0.3;
      const my = top[1] + Math.sin(rad) * s * 0.3 - s * 0.12;
      return `<path d="M${top[0]} ${top[1]} Q${mx} ${my} ${ex} ${ey} Q${(mx + ex) / 2} ${my + s * 0.08} ${top[0]} ${top[1]} Z" fill="${C.green}" ${stroke(7)}/>`;
    })
    .join('');
  return `
  <path d="M${x} ${y} Q${x + lean * s * 0.012} ${y - s * 0.5} ${top[0]} ${top[1]}" fill="none" stroke="${C.ink}" stroke-width="${s * 0.08 + 12}" stroke-linecap="round"/>
  <path d="M${x} ${y} Q${x + lean * s * 0.012} ${y - s * 0.5} ${top[0]} ${top[1]}" fill="none" stroke="${C.orange}" stroke-width="${s * 0.08}" stroke-linecap="round"/>
  ${leaves}`;
}

/** Calendario con un día marcado (sin números: un círculo resalta el día). */
export function calendar(cx, cy, s, accent = C.pink) {
  const x = cx - s;
  const y = cy - s * 0.85;
  const cells = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 5; c++) {
      const hot = r === 2 && c === 3;
      cells.push(
        `<rect x="${x + s * 0.2 + c * s * 0.34}" y="${y + s * 0.62 + r * s * 0.27}" width="${s * 0.22}" height="${s * 0.17}" rx="${s * 0.03}" fill="${hot ? accent : C.gray}" fill-opacity="${hot ? 1 : 0.45}"/>`,
      );
    }
  return `
  <rect x="${x}" y="${y}" width="${s * 2}" height="${s * 1.75}" rx="${s * 0.16}" fill="${C.white}" ${stroke()}/>
  <path d="M${x} ${y + s * 0.45} L${x} ${y + s * 0.16} Q${x} ${y} ${x + s * 0.16} ${y} L${x + s * 1.84} ${y} Q${x + s * 2} ${y} ${x + s * 2} ${y + s * 0.16} L${x + s * 2} ${y + s * 0.45} Z" fill="${accent}" ${stroke()}/>
  <rect x="${x + s * 0.45}" y="${y - s * 0.15}" width="${s * 0.12}" height="${s * 0.35}" rx="${s * 0.06}" fill="${C.gray}" ${stroke(6)}/>
  <rect x="${x + s * 1.43}" y="${y - s * 0.15}" width="${s * 0.12}" height="${s * 0.35}" rx="${s * 0.06}" fill="${C.gray}" ${stroke(6)}/>
  ${cells.join('')}
  <circle cx="${x + s * 0.2 + 3 * s * 0.34 + s * 0.11}" cy="${y + s * 0.62 + 2 * s * 0.27 + s * 0.085}" r="${s * 0.2}" fill="none" stroke="${C.ink}" stroke-width="7"/>`;
}

/** Flecha de descarga. */
export function download(cx, cy, s, color = C.green) {
  return `
  <path d="M${cx - s * 0.22} ${cy - s} L${cx + s * 0.22} ${cy - s} L${cx + s * 0.22} ${cy - s * 0.1} L${cx + s * 0.55} ${cy - s * 0.1} L${cx} ${cy + s * 0.55} L${cx - s * 0.55} ${cy - s * 0.1} L${cx - s * 0.22} ${cy - s * 0.1} Z" fill="${color}" ${stroke()}/>
  <rect x="${cx - s * 0.8}" y="${cy + s * 0.72}" width="${s * 1.6}" height="${s * 0.22}" rx="${s * 0.11}" fill="${C.white}" ${stroke()}/>`;
}

/** Botón de reproducir (plataforma de video genérica). */
export function playButton(cx, cy, s, color = C.purple) {
  return `
  <rect x="${cx - s}" y="${cy - s * 0.72}" width="${s * 2}" height="${s * 1.44}" rx="${s * 0.36}" fill="${color}" ${stroke()}/>
  <path d="M${cx - s * 0.25} ${cy - s * 0.38} L${cx + s * 0.42} ${cy} L${cx - s * 0.25} ${cy + s * 0.38} Z" fill="${C.white}" ${stroke(7)}/>
  ${shine(`M${cx - s * 0.75} ${cy - s * 0.42} L${cx - s * 0.75} ${cy}`, s * 0.08, 0.5)}`;
}

/** Insignia de transmisión en vivo: punto blanco sobre rojo, sin texto. */
export function liveBadge(cx, cy, s) {
  return `
  <rect x="${cx - s}" y="${cy - s * 0.42}" width="${s * 2}" height="${s * 0.84}" rx="${s * 0.42}" fill="${C.red}" ${stroke()}/>
  <circle cx="${cx - s * 0.5}" cy="${cy}" r="${s * 0.17}" fill="#ffffff"/>
  <rect x="${cx - s * 0.18}" y="${cy - s * 0.1}" width="${s * 0.95}" height="${s * 0.2}" rx="${s * 0.1}" fill="#ffffff" opacity="0.9"/>`;
}

/** Disco de estado sólido (almacenamiento). */
export function ssd(cx, cy, w, h, color = C.cyan) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.08}" fill="${C.ink}" ${stroke()}/>
  <rect x="${x + w * 0.06}" y="${y + h * 0.18}" width="${w * 0.3}" height="${h * 0.64}" rx="${h * 0.05}" fill="${color}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${x + w * 0.42}" y="${y + h * 0.18}" width="${w * 0.24}" height="${h * 0.64}" rx="${h * 0.05}" fill="${C.grayDark}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${x + w * 0.72}" y="${y + h * 0.18}" width="${w * 0.2}" height="${h * 0.64}" rx="${h * 0.05}" fill="${C.grayDark}" stroke="${C.ink}" stroke-width="5"/>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${x + w + 4}" y="${y + h * 0.1 + i * h * 0.1}" width="${w * 0.04}" height="${h * 0.05}" fill="${C.yellow}"/>`).join('')}`;
}

/** Barra de almacenamiento (cuánto espacio queda). `used` de 0 a 1. */
export function storageBar(cx, cy, w, h, used = 0.85) {
  const x = cx - w / 2;
  return `
  <rect x="${x}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.white}" ${stroke()}/>
  <rect x="${x + 6}" y="${cy - h / 2 + 6}" width="${(w - 12) * used}" height="${h - 12}" rx="${(h - 12) / 2}" fill="${used > 0.75 ? C.red : C.green}"/>`;
}

/** Cabeza de cubo con cara simple (avatar genérico, no es un personaje de ningún juego). */
export function cubeHead(cx, cy, s, color = C.cyan, dark = C.cyanDark) {
  return `
  ${cube(cx, cy - s * 0.5, s, color, dark, color)}
  <polygon points="${pts([
    [cx - s, cy - s * 0.5],
    [cx, cy],
    [cx, cy + s],
    [cx - s, cy + s * 0.5],
  ])}" fill="${dark}" ${stroke()}/>
  <circle cx="${cx - s * 0.62}" cy="${cy + s * 0.12}" r="${s * 0.1}" fill="${C.white}" ${stroke(5)}/>
  <circle cx="${cx - s * 0.3}" cy="${cy + s * 0.28}" r="${s * 0.1}" fill="${C.white}" ${stroke(5)}/>
  <path d="M${cx - s * 0.66} ${cy + s * 0.42} Q${cx - s * 0.48} ${cy + s * 0.62} ${cx - s * 0.28} ${cy + s * 0.56}" fill="none" ${stroke(6)}/>`;
}

/** Árbol alto (álamo) con copa redondeada. */
export function poplar(x, y, s, leaf = C.yellow, dark = C.orange) {
  return `
  <rect x="${x - s * 0.05}" y="${y - s * 0.35}" width="${s * 0.1}" height="${s * 0.35}" fill="${C.orangeDark}" ${stroke(7)}/>
  <path d="M${x} ${y - s * 1.2} C${x + s * 0.32} ${y - s * 1.05}, ${x + s * 0.32} ${y - s * 0.45}, ${x} ${y - s * 0.32} C${x - s * 0.32} ${y - s * 0.45}, ${x - s * 0.32} ${y - s * 1.05}, ${x} ${y - s * 1.2} Z" fill="${leaf}" ${stroke(7)}/>
  <path d="M${x} ${y - s * 1.1} C${x + s * 0.2} ${y - s * 0.95}, ${x + s * 0.2} ${y - s * 0.55}, ${x} ${y - s * 0.4}" fill="none" stroke="${dark}" stroke-width="${s * 0.05}" stroke-linecap="round" opacity="0.7"/>`;
}

/** Carpa de campamento. */
export function tent(cx, cy, s, color = C.orange) {
  return `
  <path d="M${cx} ${cy - s * 0.8} L${cx + s} ${cy + s * 0.4} L${cx - s} ${cy + s * 0.4} Z" fill="${color}" ${stroke()}/>
  <path d="M${cx} ${cy - s * 0.8} L${cx + s * 0.28} ${cy + s * 0.4} L${cx - s * 0.28} ${cy + s * 0.4} Z" fill="${C.ink}" opacity="0.85"/>
  <line x1="${cx - s * 1.15}" y1="${cy + s * 0.4}" x2="${cx + s * 1.15}" y2="${cy + s * 0.4}" ${stroke(12)}/>`;
}

/** Marco de portal rectangular de bloques oscuros con remolino morado (portal genérico de fantasía). */
export function blockPortal(cx, cy, cell, color = C.purple) {
  const cols = 4;
  const rows = 5;
  const x0 = cx - (cols * cell) / 2;
  const y0 = cy - (rows * cell) / 2;
  const blocks = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const edge = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      const corner = (r === 0 || r === rows - 1) && (c === 0 || c === cols - 1);
      if (edge && !corner)
        blocks.push(
          `<rect x="${x0 + c * cell}" y="${y0 + r * cell}" width="${cell}" height="${cell}" fill="#2a1d4d" ${stroke(7)}/><rect x="${x0 + c * cell + cell * 0.15}" y="${y0 + r * cell + cell * 0.15}" width="${cell * 0.3}" height="${cell * 0.12}" fill="${color}" opacity="0.7"/>`,
        );
    }
  const ix = x0 + cell;
  const iy = y0 + cell;
  const iw = cell * (cols - 2);
  const ih = cell * (rows - 2);
  return `
  <rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${color}" ${stroke(7)}/>
  ${[0.2, 0.45, 0.7].map((k, i) => `<path d="M${ix + iw * 0.1} ${iy + ih * k} Q${ix + iw * 0.5} ${iy + ih * (k - 0.12)} ${ix + iw * 0.9} ${iy + ih * k}" fill="none" stroke="${i % 2 ? C.pink : '#ffffff'}" stroke-opacity="0.65" stroke-width="10" stroke-linecap="round"/>`).join('')}
  ${blocks.join('')}`;
}

/** Ventanas de escenas (software de transmisión genérico). */
export function scenesUi(x, y, w, h) {
  return `
  <rect x="${x}" y="${y}" width="${w * 0.66}" height="${h * 0.62}" rx="10" fill="${C.purpleDark}" stroke="${C.ink}" stroke-width="5"/>
  <circle cx="${x + w * 0.33}" cy="${y + h * 0.31}" r="${h * 0.13}" fill="${C.pink}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${x + w * 0.7}" y="${y}" width="${w * 0.3}" height="${h * 0.28}" rx="10" fill="${C.cyan}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${x + w * 0.7}" y="${y + h * 0.34}" width="${w * 0.3}" height="${h * 0.28}" rx="10" fill="${C.green}" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${x}" y="${y + h * 0.7}" width="${w}" height="${h * 0.3}" rx="10" fill="${C.grayDark}" stroke="${C.ink}" stroke-width="5"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${x + 20 + i * w * 0.18}" y="${y + h * 0.78}" width="${w * 0.14}" height="${h * 0.14}" rx="6" fill="${i === 0 ? C.green : C.gray}"/>`).join('')}
  <circle cx="${x + w * 0.92}" cy="${y + h * 0.85}" r="${h * 0.07}" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/>`;
}

/** Burbuja de chat. */
export function bubble(cx, cy, w, h, color = C.white, dots = C.ink) {
  return `
  <path d="M${cx - w / 2 + 20} ${cy - h / 2} L${cx + w / 2 - 20} ${cy - h / 2} Q${cx + w / 2} ${cy - h / 2} ${cx + w / 2} ${cy - h / 2 + 20} L${cx + w / 2} ${cy + h / 2 - 20} Q${cx + w / 2} ${cy + h / 2} ${cx + w / 2 - 20} ${cy + h / 2} L${cx - w / 4} ${cy + h / 2} L${cx - w / 2 + 10} ${cy + h / 2 + h * 0.35} L${cx - w / 2 + 20} ${cy + h / 2} Q${cx - w / 2} ${cy + h / 2} ${cx - w / 2} ${cy + h / 2 - 20} L${cx - w / 2} ${cy - h / 2 + 20} Q${cx - w / 2} ${cy - h / 2} ${cx - w / 2 + 20} ${cy - h / 2} Z" fill="${color}" ${stroke()}/>
  ${[-1, 0, 1].map((k) => `<circle cx="${cx + k * w * 0.22}" cy="${cy}" r="${h * 0.1}" fill="${dots}"/>`).join('')}`;
}

/** Corazón. */
export function heart(cx, cy, s, color = C.pink) {
  return `<path d="M${cx} ${cy + s * 0.8} C${cx - s * 1.3} ${cy - s * 0.1}, ${cx - s * 0.6} ${cy - s * 1.1}, ${cx} ${cy - s * 0.4} C${cx + s * 0.6} ${cy - s * 1.1}, ${cx + s * 1.3} ${cy - s * 0.1}, ${cx} ${cy + s * 0.8} Z" fill="${color}" ${stroke()}/>`;
}

/** Chip de memoria RAM. */
export function ram(cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${C.green}" ${stroke()}/>
  ${[0, 1, 2, 3].map((i) => `<rect x="${x + w * 0.08 + i * w * 0.23}" y="${y + h * 0.2}" width="${w * 0.17}" height="${h * 0.45}" rx="4" fill="${C.ink}"/>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${x + w * 0.05 + i * w * 0.077}" y="${y + h * 0.78}" width="${w * 0.04}" height="${h * 0.22}" fill="${C.yellow}"/>`).join('')}`;
}
