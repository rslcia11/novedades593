import { describe, expect, it } from 'vitest';
import {
  findContentProblems,
  inGame,
  inSection,
  pickRelated,
  sortByPublished,
  sortByRecent,
  type ArticleLike,
} from '@/lib/article-utils';

function article(id: string, data: Partial<ArticleLike['data']> = {}): ArticleLike {
  return {
    id,
    data: {
      section: 'juegos',
      type: 'guia',
      featured: false,
      publishedAt: new Date('2026-10-01'),
      related: [],
      ...data,
    },
  };
}

const ids = (list: ArticleLike[]) => list.map((a) => a.id);

describe('orden de artículos', () => {
  it('ordena por última modificación y desempata por id', () => {
    const list = [
      article('b', { publishedAt: new Date('2026-10-01') }),
      article('a', { publishedAt: new Date('2026-10-01') }),
      article('c', { publishedAt: new Date('2026-09-01'), updatedAt: new Date('2026-10-05') }),
    ];
    expect(ids(sortByRecent(list))).toEqual(['c', 'a', 'b']);
  });

  it('ordena noticias por fecha de publicación sin mirar actualizaciones', () => {
    const list = [
      article('old', { publishedAt: new Date('2026-09-01'), updatedAt: new Date('2026-10-09') }),
      article('new', { publishedAt: new Date('2026-10-02') }),
    ];
    expect(ids(sortByPublished(list))).toEqual(['new', 'old']);
  });

  it('no modifica la lista original', () => {
    const list = [article('b'), article('a')];
    sortByRecent(list);
    expect(ids(list)).toEqual(['b', 'a']);
  });
});

describe('filtros', () => {
  const list = [
    article('mc', { game: { id: 'minecraft' } }),
    article('rb', { game: { id: 'roblox' } }),
    article('eq', { section: 'equipo', game: { id: 'roblox' } }),
  ];

  it('filtra por sección y por juego', () => {
    expect(ids(inSection(list, 'equipo'))).toEqual(['eq']);
    expect(ids(inGame(list, 'roblox'))).toEqual(['rb', 'eq']);
  });
});

describe('relacionados', () => {
  it('prioriza los elegidos a mano, luego mismo juego, luego destacados', () => {
    const current = article('x', { game: { id: 'minecraft' }, related: [{ id: 'manual' }] });
    const all = [
      current,
      article('manual', { section: 'noticias', type: 'noticia' }),
      article('same-game', { game: { id: 'minecraft' } }),
      article('viral', { section: 'virales', type: 'viral', game: { id: 'minecraft' } }),
      article('featured', { section: 'creadores', featured: true }),
      article('other', { section: 'creadores' }),
    ];
    expect(ids(pickRelated(current, all))).toEqual(['manual', 'same-game', 'featured']);
  });

  it('nunca incluye el propio artículo ni repite', () => {
    const current = article('x', { related: [{ id: 'x' }, { id: 'a' }, { id: 'a' }] });
    const all = [current, article('a'), article('b')];
    expect(ids(pickRelated(current, all))).toEqual(['a', 'b']);
  });

  it('ignora relacionados que no existen', () => {
    const current = article('x', { related: [{ id: 'borrado' }] });
    expect(ids(pickRelated(current, [current]))).toEqual([]);
  });
});

describe('validación de contenido', () => {
  const games = [{ id: 'minecraft', data: { tags: ['Granjas'] } }];

  it('no reporta nada si todo está bien', () => {
    const list = [
      article('a', { game: { id: 'minecraft' }, tag: 'Granjas', related: [{ id: 'b' }] }),
      article('b'),
    ];
    expect(findContentProblems(list, games)).toEqual([]);
  });

  it('detecta tags inexistentes, juegos inexistentes y relacionados rotos', () => {
    const list = [
      article('a', { game: { id: 'minecraft' }, tag: 'Pesca' }),
      article('b', { game: { id: 'zelda' }, tag: 'x' }),
      article('c', { related: [{ id: 'c' }, { id: 'fantasma' }] }),
    ];
    const problems = findContentProblems(list, games);
    expect(problems).toHaveLength(4);
    expect(problems.join('\n')).toMatch(/Pesca/);
    expect(problems.join('\n')).toMatch(/zelda/);
    expect(problems.join('\n')).toMatch(/sí mismo/);
    expect(problems.join('\n')).toMatch(/fantasma/);
  });
});
