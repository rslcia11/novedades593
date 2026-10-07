import { NAV_SECTIONS, type SectionId } from '@/config/sections';
import { stripBase } from '@/lib/urls';

/** Sección activa según la URL (las guías de /juegos/minecraft/... cuentan como "juegos"). */
export function currentSection(pathname: string): SectionId | undefined {
  const first = stripBase(import.meta.env.BASE_URL, pathname)
    .split('/')
    .filter(Boolean)[0];
  return NAV_SECTIONS.find((s) => s === first);
}
