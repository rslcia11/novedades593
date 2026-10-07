import { describe, expect, it } from 'vitest';
import { pickAdPositions } from '@/lib/markdown/in-article-ads';

const blocks = (...names: string[]) => names.map((name) => ({ name }));

describe('anuncios dentro del artículo', () => {
  it('pone el primero después del segundo bloque y el segundo desde el sexto', () => {
    expect(pickAdPositions(blocks('p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'))).toEqual([1, 5]);
  });

  it('nunca pone un anuncio justo después de un título', () => {
    expect(pickAdPositions(blocks('p', 'h2', 'Steps', 'p', 'h2', 'p', 'p', 'p'))).toEqual([2, 5]);
  });

  it('no supera el máximo de dos', () => {
    expect(pickAdPositions(blocks(...Array<string>(30).fill('p')))).toHaveLength(2);
  });

  it('no pone anuncios pegados al final salvo en artículos cortos', () => {
    expect(pickAdPositions(blocks('p', 'p', 'p'))).toEqual([1]);
    expect(pickAdPositions(blocks('p', 'Tip'))).toEqual([1]);
    expect(pickAdPositions(blocks('p'))).toEqual([0]);
  });

  it('evita bloques que no deben llevar anuncio después', () => {
    expect(pickAdPositions(blocks('p', 'Countdown', 'p', 'p'))).toEqual([2]);
  });

  it('no hace nada en un artículo vacío', () => {
    expect(pickAdPositions([])).toEqual([]);
  });

  it('respeta reglas personalizadas', () => {
    expect(pickAdPositions(blocks('p', 'p', 'p'), { firstAfter: 1, secondAfter: 2, max: 2 })).toEqual([0, 1]);
    expect(pickAdPositions(blocks('p', 'p', 'p'), { firstAfter: 1, secondAfter: 2, max: 0 })).toEqual([]);
  });
});
