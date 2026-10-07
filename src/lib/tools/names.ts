/**
 * Generador de nombres con letras especiales. Usa caracteres Unicode "matemáticos" que
 * se ven como otra tipografía y se pueden copiar en juegos y redes.
 * Algunos juegos no aceptan todos: por eso la herramienta recomienda probar antes de pagar.
 */

export const NAME_MAX_LENGTH = 16;
export const DEFAULT_NAME = 'Gamer593';

interface AlphabetMap {
  upper: number;
  lower: number;
  digit?: number;
  /** Letras que Unicode tiene fuera del bloque continuo. */
  exceptions?: Readonly<Record<string, string>>;
}

function mapAlphabet(text: string, map: AlphabetMap): string {
  return Array.from(text)
    .map((ch) => {
      const exception = map.exceptions?.[ch];
      if (exception) return exception;
      const code = ch.codePointAt(0) ?? 0;
      if (code >= 65 && code <= 90) return String.fromCodePoint(map.upper + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(map.lower + code - 97);
      if (map.digit !== undefined && code >= 48 && code <= 57)
        return String.fromCodePoint(map.digit + code - 48);
      return ch;
    })
    .join('');
}

const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ';
const DOUBLE_STRUCK_EXCEPTIONS = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' } as const;

const bold = (s: string) => mapAlphabet(s, { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec });

function smallCaps(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const code = ch.toLowerCase().charCodeAt(0);
      return ch.length === 1 && code >= 97 && code <= 122 ? (SMALL_CAPS[code - 97] ?? ch) : ch;
    })
    .join('');
}

export interface NameStyle {
  id: string;
  label: string;
  apply: (text: string) => string;
}

export const NAME_STYLES: readonly NameStyle[] = [
  { id: 'negrita', label: 'Negrita', apply: bold },
  {
    id: 'clasica',
    label: 'Clásica',
    apply: (s) => mapAlphabet(s, { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce }),
  },
  {
    id: 'cursiva',
    label: 'Cursiva elegante',
    apply: (s) => mapAlphabet(s, { upper: 0x1d4d0, lower: 0x1d4ea }),
  },
  { id: 'gotica', label: 'Gótica', apply: (s) => mapAlphabet(s, { upper: 0x1d56c, lower: 0x1d586 }) },
  {
    id: 'doble',
    label: 'Doble línea',
    apply: (s) =>
      mapAlphabet(s, {
        upper: 0x1d538,
        lower: 0x1d552,
        digit: 0x1d7d8,
        exceptions: DOUBLE_STRUCK_EXCEPTIONS,
      }),
  },
  { id: 'versalitas', label: 'Versalitas', apply: smallCaps },
  { id: 'alas', label: 'Con alas', apply: (s) => `꧁${bold(s)}꧂` },
  { id: 'estrella', label: 'Estrella', apply: (s) => `★彡 ${s} 彡★` },
  { id: 'corchetes', label: 'Corchetes', apply: (s) => `『${s}』` },
  {
    id: 'ancha',
    label: 'Ancha',
    apply: (s) => mapAlphabet(s, { upper: 0xff21, lower: 0xff41, digit: 0xff10 }),
  },
];

/** Recorta espacios y largo; si queda vacío usa el nombre de ejemplo. */
export function normalizeName(input: string): string {
  const trimmed = Array.from(input.trim()).slice(0, NAME_MAX_LENGTH).join('');
  return trimmed || DEFAULT_NAME;
}

export function generateNames(input: string): { id: string; label: string; value: string }[] {
  const name = normalizeName(input);
  return NAME_STYLES.map((style) => ({ id: style.id, label: style.label, value: style.apply(name) }));
}
