/**
 * Reglas sobre listas de artículos (orden, relacionados, validación).
 * No dependen de Astro: reciben los datos ya cargados, así se pueden probar con datos de ejemplo.
 */

export interface ArticleLike {
  id: string;
  data: {
    section: string;
    type: string;
    game?: { id: string } | undefined;
    tag?: string | undefined;
    featured: boolean;
    publishedAt: Date;
    updatedAt?: Date | undefined;
    related: readonly { id: string }[];
  };
}

/** Fecha que cuenta para ordenar: la última actualización o la publicación. */
export const lastModified = (a: ArticleLike) => a.data.updatedAt ?? a.data.publishedAt;

/** Del más reciente al más antiguo. Estable para artículos con la misma fecha. */
export function sortByRecent<T extends ArticleLike>(articles: readonly T[]): T[] {
  return [...articles].sort(
    (a, b) => lastModified(b).getTime() - lastModified(a).getTime() || a.id.localeCompare(b.id),
  );
}

/** Por fecha de publicación (noticias): lo último que salió primero. */
export function sortByPublished<T extends ArticleLike>(articles: readonly T[]): T[] {
  return [...articles].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id),
  );
}

export const inSection = <T extends ArticleLike>(articles: readonly T[], section: string) =>
  articles.filter((a) => a.data.section === section);

export const inGame = <T extends ArticleLike>(articles: readonly T[], game: string) =>
  articles.filter((a) => a.data.game?.id === game);

export const featured = <T extends ArticleLike>(articles: readonly T[]) =>
  articles.filter((a) => a.data.featured);

/**
 * "Sigue con": primero los relacionados elegidos a mano, luego los del mismo juego o sección
 * (sin virales) y, si faltan, los más leídos. Nunca repite ni incluye el artículo actual.
 */
export function pickRelated<T extends ArticleLike>(article: T, all: readonly T[], limit = 3): T[] {
  const byId = new Map(all.map((a) => [a.id, a]));
  const chosen: T[] = [];
  const add = (a: T | undefined) => {
    if (a && a.id !== article.id && !chosen.includes(a) && chosen.length < limit) chosen.push(a);
  };
  article.data.related.forEach((r) => add(byId.get(r.id)));
  all
    .filter(
      (a) =>
        a.data.type !== 'viral' &&
        ((article.data.game && a.data.game?.id === article.data.game.id) ||
          a.data.section === article.data.section),
    )
    .forEach(add);
  featured(all).forEach(add);
  return chosen;
}

export interface GameLike {
  id: string;
  data: { tags: readonly string[] };
}

/**
 * Revisa lo que el esquema no puede revisar solo: que cada `tag` exista en su juego
 * y que los relacionados apunten a artículos publicados. Devuelve la lista de problemas.
 */
export function findContentProblems(articles: readonly ArticleLike[], games: readonly GameLike[]): string[] {
  const problems: string[] = [];
  const ids = new Set(articles.map((a) => a.id));
  const gameTags = new Map(games.map((g) => [g.id, g.data.tags]));
  for (const a of articles) {
    const game = a.data.game?.id;
    if (game) {
      const tags = gameTags.get(game);
      if (!tags) problems.push(`${a.id}: el juego "${game}" no existe.`);
      else if (a.data.tag && !tags.includes(a.data.tag))
        problems.push(`${a.id}: el tag "${a.data.tag}" no está en los tags de ${game} (${tags.join(', ')}).`);
    }
    for (const r of a.data.related) {
      if (r.id === a.id) problems.push(`${a.id}: no puede ser relacionado de sí mismo.`);
      else if (!ids.has(r.id)) problems.push(`${a.id}: el relacionado "${r.id}" no existe o es borrador.`);
    }
  }
  return problems;
}
