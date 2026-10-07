import { withBase } from '@/lib/urls';

/**
 * Datos generales del sitio. Lo que cambie la marca o el creador se edita aquí, no en los componentes.
 */

export interface CommunityChannel {
  name: string;
  /** Enlace al canal. Si está vacío, el botón aparece como "pronto". */
  url?: string;
}

export const SITE = {
  name: 'entretenimiento593',
  /** Partes del logotipo: texto normal + resaltado. */
  logo: { text: 'entretenimiento', highlight: '593' },
  tagline: 'Guías de juegos y trucos para creadores',
  description:
    'Guías de juegos, equipo, trucos para creadores, noticias gamer y virales. Hecho en Ecuador para toda Latinoamérica.',
  locale: 'es-EC',
  lang: 'es',
  timeZone: 'America/Guayaquil',
  themeColor: '#0d1023',
  foundingYear: 2026,
  email: {
    contact: 'hola@entretenimiento593.com',
    sales: 'marcas@entretenimiento593.com',
  },
} as const;

/** Creador principal: su experiencia es la señal de confianza (E-E-A-T) del sitio. */
export const CREATOR = {
  authorId: 'yeri-loco',
  name: 'Yeri Loco',
  initials: 'YL',
  stats: [
    { value: '4 años', label: 'haciendo lives' },
    { value: '+300', label: 'batallas' },
  ],
} as const;

/** Canales de la comunidad: deja solo los que use el creador. */
export const COMMUNITY: readonly CommunityChannel[] = [
  { name: 'WhatsApp' },
  { name: 'Discord' },
  { name: 'Telegram' },
];

/**
 * Enlace del botón oficial de Google "Fuente preferida".
 * Mientras esté vacío, el bloque no se muestra.
 */
export const GOOGLE_PREFERRED_SOURCE_URL: string | undefined = undefined;

/**
 * Artículos que otras partes del sitio enlazan por nombre (portada, herramientas).
 * Si uno se renombra o se borra, el build falla con un mensaje claro.
 */
export const KEY_ARTICLES = {
  gtaGuide: 'gta-6-todo-lo-que-sabemos',
  codesGuide: 'codigos-roblox',
  phonesGuide: 'requisitos-free-fire',
} as const;

/** Búsquedas frecuentes que se muestran bajo el buscador de la portada. */
export const POPULAR_SEARCHES = [
  { label: 'códigos de Roblox', href: withBase('/juegos/roblox/codigos-roblox/') },
  { label: 'diamantes en Minecraft', href: withBase('/juegos/minecraft/diamantes-minecraft/') },
  { label: 'GTA VI: precio y fecha', href: withBase('/juegos/gta6/gta-6-todo-lo-que-sabemos/') },
  { label: 'cuánto paga TikTok LIVE', href: withBase('/herramientas/diamantes/') },
] as const;

/** Sugerencias de la página de búsqueda vacía. */
export const SEARCH_SUGGESTIONS = ['roblox', 'diamantes', 'tiktok', 'celular', 'gta'] as const;

export const FOOTER_LINKS = {
  site: [
    { label: 'Quiénes somos', href: withBase('/quienes-somos/') },
    { label: 'Cómo trabajamos', href: withBase('/como-trabajamos/') },
    { label: 'Anuncia con nosotros', href: withBase('/anuncia/') },
    { label: 'Contacto', href: withBase('/contacto/') },
  ],
  legal: [
    { label: 'Privacidad y cookies', href: withBase('/privacidad/') },
    { label: 'Términos de uso', href: withBase('/terminos/') },
  ],
} as const;
