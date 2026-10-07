import { defineConfig, envField, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { inArticleAdsPlugin } from './src/lib/markdown/in-article-ads';
import { buildCspDirectives, scriptSources, styleSources } from './src/config/csp';

// Las variables de .env no están en process.env cuando se lee este archivo:
// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
const env = loadEnv(process.env['NODE_ENV'] ?? 'production', process.cwd(), '');
const adsProvider = env['PUBLIC_ADS_PROVIDER'] ?? 'placeholder';

const FONT_DIR = './node_modules/@fontsource-variable/schibsted-grotesk/files';
/** Rango Unicode del subconjunto latino (Latin-1 y puntuación). */
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

export default defineConfig({
  site: env['SITE_URL'] ?? 'https://entretenimiento593.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  markdown: {
    // Sin bloques de código en el contenido; Shiki además usa estilos en línea que choca con la CSP.
    syntaxHighlight: false,
    processor: satteri({
      hastPlugins: [inArticleAdsPlugin],
    }),
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !/\/(buscar|404)\/?$/.test(new URL(page).pathname),
    }),
  ],
  // Tipografía servida desde el propio sitio (sin Google Fonts): más rápida y sin cookies de terceros.
  // Los archivos vienen del paquete @fontsource-variable/schibsted-grotesk. Solo el subconjunto
  // latino: cubre todo el español (á, é, ñ, ¿, ¡) con un único archivo de unos 45 KB.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [
          {
            src: [`${FONT_DIR}/schibsted-grotesk-latin-wght-normal.woff2`],
            weight: '400 900',
            style: 'normal',
            unicodeRange: [LATIN],
          },
        ],
      },
    },
  ],
  security: {
    csp: {
      directives: buildCspDirectives(adsProvider),
      scriptDirective: {
        resources: scriptSources(adsProvider),
      },
      styleDirective: {
        resources: styleSources(adsProvider),
      },
    },
  },
  env: {
    schema: {
      PUBLIC_SITE_INDEXABLE: envField.boolean({ context: 'server', access: 'public', default: false }),
      PUBLIC_ADS_PROVIDER: envField.enum({
        context: 'server',
        access: 'public',
        values: ['none', 'placeholder', 'adsense'],
        default: 'placeholder',
      }),
      PUBLIC_ADSENSE_CLIENT: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        startsWith: 'ca-pub-',
      }),
    },
  },
});
