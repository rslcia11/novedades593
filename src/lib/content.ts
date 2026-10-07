/**
 * Acceso a las colecciones de contenido. Los componentes y páginas usan estas funciones
 * en vez de llamar a getCollection directamente, así las reglas (borradores, orden,
 * validaciones) viven en un solo lugar.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { articleUrl } from './urls';
import { findContentProblems, sortByRecent } from './article-utils';
import { readingMinutes } from './reading-time';
import { SECTIONS } from '@/config/sections';

export type Article = CollectionEntry<'articles'>;
export type Game = CollectionEntry<'games'>;
export type Author = CollectionEntry<'authors'>;
export type GameCode = CollectionEntry<'codes'>;
export type Page = CollectionEntry<'pages'>;

let articlesPromise: Promise<Article[]> | undefined;

async function loadArticles(): Promise<Article[]> {
  const [articles, games] = await Promise.all([
    getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft),
    getGames(),
  ]);
  const problems = findContentProblems(articles, games);
  if (problems.length > 0) {
    throw new Error(`Hay problemas en el contenido:\n- ${problems.join('\n- ')}`);
  }
  return sortByRecent(articles);
}

/** Artículos publicados, del más reciente al más antiguo. */
export function getArticles(): Promise<Article[]> {
  articlesPromise ??= loadArticles();
  return articlesPromise;
}

export async function getGames(): Promise<Game[]> {
  const games = await getCollection('games');
  return games.sort((a, b) => a.data.order - b.data.order);
}

export async function getGame(id: string): Promise<Game> {
  const game = await getEntry('games', id);
  if (!game) throw new Error(`Juego desconocido: ${id}`);
  return game;
}

export async function getAuthor(id: string): Promise<Author> {
  const author = await getEntry('authors', id);
  if (!author) throw new Error(`Autor desconocido: ${id}`);
  return author;
}

export async function getCodes(
  game: string,
  status: 'active' | 'expired' | 'all' = 'all',
): Promise<GameCode[]> {
  const codes = await getCollection('codes', ({ data }) => data.game.id === game);
  if (status === 'all') return codes;
  return codes.filter((c) => c.data.active === (status === 'active'));
}

export const articleHref = (article: Article) =>
  articleUrl({ id: article.id, section: article.data.section, game: article.data.game?.id });

export const articleReadingMinutes = (article: Article) => readingMinutes(article.body ?? '');

let gameNamesPromise: Promise<Map<string, string>> | undefined;

/** Etiqueta corta de un artículo en tarjetas: el juego si lo tiene, si no la sección. */
export async function articleKicker(article: Article): Promise<string> {
  gameNamesPromise ??= getGames().then((games) => new Map(games.map((g) => [g.id, g.data.name])));
  const names = await gameNamesPromise;
  const game = article.data.game?.id;
  return (game && names.get(game)) || SECTIONS[article.data.section].name;
}

/** id del juego de un artículo que debe tenerlo (las guías de la sección juegos). */
export function requireGameId(article: Article): string {
  const game = article.data.game?.id;
  if (!game) throw new Error(`El artículo ${article.id} no tiene juego.`);
  return game;
}
