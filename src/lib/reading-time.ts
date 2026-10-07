/** Minutos de lectura a partir del texto MDX, sin contar etiquetas ni atributos de componentes. */

const WORDS_PER_MINUTE = 200;

export function countWords(source: string): number {
  const text = source
    .replace(/^import .*$/gm, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ');
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function readingMinutes(source: string): number {
  return Math.max(1, Math.round(countWords(source) / WORDS_PER_MINUTE));
}
