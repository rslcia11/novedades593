/** Minutos de lectura a partir del texto MDX: cuenta el texto y los títulos de los componentes, no el código. */

const WORDS_PER_MINUTE = 200;

export function countWords(source: string): number {
  // Los títulos de pasos, datos y recuadros también se leen: se guarda su texto antes de quitar las etiquetas.
  const attributes = [...source.matchAll(/\b(?:title|value|badge|name)=(["'])(.*?)\1/g)].map((m) => m[2]);
  const text = [
    source
      .replace(/^import .*$/gm, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[#>*_`|[\]()-]/g, ' '),
    ...attributes,
  ].join(' ');
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function readingMinutes(source: string): number {
  return Math.max(1, Math.round(countWords(source) / WORDS_PER_MINUTE));
}
