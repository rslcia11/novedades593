/** Íconos propios (SVG 24×24, trazo con el color del texto). */
const stroke = 'fill="none" stroke="currentColor" stroke-width="2"';
const round = 'stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = {
  home: `<path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" ${stroke} stroke-linejoin="round"/>`,
  pad: `<rect x="2" y="7" width="20" height="11" rx="5" ${stroke}/><path d="M7 11v3M5.5 12.5h3" ${stroke} stroke-linecap="round"/><circle cx="16" cy="11.5" r="1.2" fill="currentColor"/><circle cx="18" cy="14" r="1.2" fill="currentColor"/>`,
  phone: `<rect x="6" y="2" width="12" height="20" rx="2.5" ${stroke}/><path d="M10.5 18.5h3" ${stroke} stroke-linecap="round"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3" ${stroke}/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" ${stroke} stroke-linecap="round"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16" ${stroke} stroke-linecap="round"/>`,
  x: `<path d="M6 6l12 12M18 6 6 18" ${stroke} stroke-linecap="round"/>`,
  tool: `<rect x="4" y="3" width="16" height="18" rx="2" ${stroke}/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" ${stroke} stroke-linecap="round"/>`,
  search: `<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m20 20-4-4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`,
  play: `<circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 8v8l6-4z" fill="currentColor"/>`,
  copy: `<rect x="8" y="8" width="12" height="12" rx="2" ${stroke}/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" ${stroke}/>`,
  text: `<path d="M4 6V4h16v2M12 4v16M9 20h6" ${stroke} stroke-linecap="round"/>`,
  block: `<path d="M12 2 21 7v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10" ${stroke} stroke-linejoin="round"/>`,
  cube: `<rect x="3" y="3" width="18" height="18" rx="2" ${stroke}/><rect x="9" y="9" width="6" height="6" fill="currentColor" transform="rotate(15 12 12)"/>`,
  car: `<path d="M3 15v-3l2-5h14l2 5v3zM3 15v3h3v-3M18 15v3h3v-3" ${stroke} stroke-linejoin="round"/><circle cx="7.5" cy="12.5" r="1" fill="currentColor"/><circle cx="16.5" cy="12.5" r="1" fill="currentColor"/>`,
  fire: `<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z" ${stroke} stroke-linejoin="round"/>`,
  bus: `<path d="M4 20 12 3l8 17-8-4z" ${stroke} stroke-linejoin="round"/>`,
  grid: `<rect x="3" y="3" width="7" height="7" ${stroke}/><rect x="14" y="3" width="7" height="7" ${stroke}/><rect x="3" y="14" width="7" height="7" ${stroke}/><rect x="14" y="14" width="7" height="7" ${stroke}/>`,
  cpu: `<rect x="6" y="6" width="12" height="12" rx="1.5" ${stroke}/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" ${stroke} stroke-linecap="round"/>`,
  news: `<path d="M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 16h3" ${stroke} ${round}/>`,
} as const;

export type IconName = keyof typeof ICONS;

export function isIconName(name: string): name is IconName {
  return name in ICONS;
}
