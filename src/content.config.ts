import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CONTENT_SECTIONS } from './config/sections';

/**
 * Colecciones de contenido. Cada archivo se valida al construir el sitio:
 * si a una nota le falta un dato obligatorio o tiene un valor inválido, el build falla
 * y la nota nunca llega a publicarse rota.
 * Docs: https://docs.astro.build/en/guides/content-collections/
 */

const ARTICLE_TYPES = ['guia', 'codigos', 'comparativa', 'creador', 'noticia', 'viral'] as const;
const COVER_TONES = ['accent', 'inverse', 'soft', 'grid'] as const;

const games = defineCollection({
  loader: file('src/content/games.yaml'),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    description: z.string(),
    /** Datos destacados del encabezado del juego: [valor, etiqueta]. */
    facts: z.array(z.object({ value: z.string(), label: z.string() })).max(3),
    /** Filtros de la página del juego. Cada artículo del juego usa uno como `tag`. */
    tags: z.array(z.string()).min(1),
    /** Fecha de lanzamiento, para la cuenta regresiva. */
    releaseDate: z.coerce.date().optional(),
    order: z.number().int(),
  }),
});

const authors = defineCollection({
  loader: file('src/content/authors.yaml'),
  schema: z.object({
    name: z.string(),
    /** Iniciales o texto corto del avatar. */
    initials: z.string().max(3),
    role: z.string(),
    bio: z.string(),
    kind: z.enum(['person', 'organization']),
    links: z.array(z.object({ name: z.string(), url: z.url() })).default([]),
  }),
});

/** El id de un artículo es su nombre de archivo: las carpetas solo ordenan el contenido. */
const idFromFileName = ({ entry }: { entry: string }) => entry.replace(/^.*\//, '').replace(/\.mdx$/, '');

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles', generateId: idFromFileName }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(10).max(110),
        /** Entradilla: aparece bajo el título, en las tarjetas y como meta description. */
        description: z.string().min(30).max(200),
        /** "Respuesta corta": lo que la persona vino a buscar, en dos líneas. */
        summary: z.string().optional(),
        section: z.enum(CONTENT_SECTIONS),
        game: reference('games').optional(),
        /** Filtro dentro de la página del juego (debe existir en `tags` del juego). */
        tag: z.string().optional(),
        type: z.enum(ARTICLE_TYPES),
        author: reference('authors'),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        /** Aparece en "Lo más leído". */
        featured: z.boolean().default(false),
        /** Lleva enlaces de afiliado: muestra el aviso automáticamente. */
        affiliate: z.boolean().default(false),
        cover: z.object({
          /** Texto grande de la portada tipográfica (mientras no haya imagen). */
          label: z.string().max(14),
          tone: z.enum(COVER_TONES),
          image: image().optional(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        }),
        /** Solo virales: duración del clip y enlace del reproductor oficial. */
        video: z
          .object({
            duration: z.string().regex(/^\d{1,2}:\d{2}$/),
            embedUrl: z.url().optional(),
          })
          .optional(),
        related: z.array(reference('articles')).max(6).default([]),
        sources: z.array(z.object({ name: z.string(), url: z.url().optional() })).default([]),
        draft: z.boolean().default(false),
      })
      .superRefine((data, ctx) => {
        const issue = (message: string, path: string) =>
          ctx.addIssue({ code: 'custom', message, path: [path] });
        if (data.section === 'juegos' && !data.game)
          issue('Las guías de la sección juegos necesitan `game`.', 'game');
        if (data.game && !data.tag)
          issue('Los artículos de un juego necesitan `tag` para los filtros.', 'tag');
        if ((data.type === 'viral') !== (data.section === 'virales'))
          issue('Los virales van en la sección virales y viceversa.', 'type');
        if ((data.type === 'noticia') !== (data.section === 'noticias'))
          issue('Las noticias van en la sección noticias y viceversa.', 'type');
        if (data.type === 'viral' && !data.video) issue('Los virales necesitan `video`.', 'video');
        if (data.cover.image && !data.cover.alt) issue('Toda imagen de portada necesita `alt`.', 'cover');
        if (data.updatedAt && data.updatedAt < data.publishedAt)
          issue('`updatedAt` no puede ser anterior a `publishedAt`.', 'updatedAt');
      }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(30).max(200),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { games, authors, articles, pages };
