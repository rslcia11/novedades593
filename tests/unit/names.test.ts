import { describe, expect, it } from 'vitest';
import { DEFAULT_NAME, NAME_MAX_LENGTH, NAME_STYLES, generateNames, normalizeName } from '@/lib/tools/names';

const byId = (input: string) => Object.fromEntries(generateNames(input).map((n) => [n.id, n.value]));

describe('generador de nombres', () => {
  it('genera un resultado por estilo, con ids únicos', () => {
    const names = generateNames('Yeri');
    expect(names).toHaveLength(NAME_STYLES.length);
    expect(new Set(names.map((n) => n.id)).size).toBe(NAME_STYLES.length);
  });

  it('transforma letras y números en cada alfabeto', () => {
    const out = byId('Ab9');
    expect(out['negrita']).toBe('𝗔𝗯𝟵');
    expect(out['clasica']).toBe('𝐀𝐛𝟗');
    expect(out['ancha']).toBe('Ａｂ９');
    expect(out['versalitas']).toBe('ᴀʙ9');
    expect(out['alas']).toBe('꧁𝗔𝗯𝟵꧂');
    expect(out['corchetes']).toBe('『Ab9』');
  });

  it('usa los caracteres especiales de Unicode en doble línea', () => {
    expect(byId('CHNPQRZ')['doble']).toBe('ℂℍℕℙℚℝℤ');
    expect(byId('A')['doble']).toBe('𝔸');
  });

  it('deja intactos los caracteres que no son letras ASCII', () => {
    expect(byId('Ñañó_!')['negrita']).toBe('Ñ𝗮ñó_!');
  });

  it('usa el nombre de ejemplo si el campo queda vacío', () => {
    expect(normalizeName('   ')).toBe(DEFAULT_NAME);
  });

  it('recorta al largo máximo contando emojis como un carácter', () => {
    const long = '😀'.repeat(NAME_MAX_LENGTH + 5);
    expect(Array.from(normalizeName(long))).toHaveLength(NAME_MAX_LENGTH);
    expect(normalizeName('  Gamer  ')).toBe('Gamer');
  });
});
