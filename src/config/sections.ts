/**
 * Secciones del sitio. El orden de este objeto es el orden de la navegación.
 * Las secciones de contenido tienen artículos; "herramientas" es una sección de páginas propias.
 */

export const CONTENT_SECTIONS = ['juegos', 'equipo', 'creadores', 'noticias', 'virales'] as const;
export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export type SectionId = ContentSection | 'herramientas';

export interface SectionInfo {
  name: string;
  description: string;
  /** Texto corto para el menú del celular. */
  hint: string;
  /** Ícono de la barra inferior (solo las que aparecen ahí). */
  icon: string;
}

export const SECTIONS: Record<SectionId, SectionInfo> = {
  juegos: {
    name: 'Juegos',
    description: 'Guías paso a paso de los juegos que más se juegan en Latinoamérica.',
    hint: 'Guías por juego',
    icon: 'pad',
  },
  equipo: {
    name: 'Equipo',
    description: 'Celulares para jugar, PC, audífonos y equipo para stream. Lo que usamos y probamos.',
    hint: 'Celulares, PC, stream',
    icon: 'phone',
  },
  creadores: {
    name: 'Creadores',
    description: 'Lives, batallas, OBS y cómo crecer. Lo que aprendimos haciendo stream todos los días.',
    hint: 'Lives y batallas',
    icon: 'mic',
  },
  noticias: {
    name: 'Noticias',
    description: 'Lo que pasó hoy en los juegos, en TikTok y en el streaming, explicado en corto.',
    hint: 'Lo que pasó hoy',
    icon: 'news',
  },
  virales: {
    name: 'Virales',
    description: 'Lo más gracioso de los lives y de la comunidad gamer.',
    hint: 'Clips y memes',
    icon: 'play',
  },
  herramientas: {
    name: 'Herramientas',
    description: 'Gratis, sin registrarte y desde el celular.',
    hint: 'Gratis',
    icon: 'tool',
  },
};

export const NAV_SECTIONS = Object.keys(SECTIONS) as SectionId[];

export function isContentSection(value: string): value is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(value);
}
