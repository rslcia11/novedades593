import { NAV_SECTIONS, type SectionId } from '@/config/sections';

/** Sección activa según la URL (las guías de /juegos/minecraft/... cuentan como "juegos"). */
export function currentSection(pathname: string): SectionId | undefined {
  const first = pathname.split('/').filter(Boolean)[0];
  return NAV_SECTIONS.find((s) => s === first);
}
