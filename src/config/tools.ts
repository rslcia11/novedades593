/** Herramientas interactivas. `href` sirve para tarjetas que llevan a un artículo en vez de a una página propia. */

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  cta: string;
  href: string;
}

export const TOOLS: readonly ToolInfo[] = [
  {
    id: 'diamantes',
    name: 'Calculadora de diamantes',
    description: 'Cuánto valen tus diamantes y tus batallas de TikTok LIVE en dólares.',
    icon: 'tool',
    cta: 'Calcular',
    href: '/herramientas/diamantes/',
  },
  {
    id: 'nombres',
    name: 'Nombres con letras especiales',
    description: 'Para Free Fire, TikTok y Roblox. Escribe tu nombre y copia.',
    icon: 'text',
    cta: 'Crear nombre',
    href: '/herramientas/nombres/',
  },
  {
    id: 'celular',
    name: '¿Qué celular me alcanza?',
    description: 'Elige tu juego y tu presupuesto y te decimos qué buscar.',
    icon: 'phone',
    cta: 'Recomendarme',
    href: '/herramientas/celular/',
  },
  {
    id: 'codigos',
    name: 'Códigos de Roblox',
    description: 'Los códigos activos de hoy, revisados, con botón para copiar.',
    icon: 'copy',
    cta: 'Ver códigos',
    href: '/juegos/roblox/codigos-roblox/',
  },
];

export function getTool(id: string): ToolInfo {
  const tool = TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Herramienta desconocida: ${id}`);
  return tool;
}
