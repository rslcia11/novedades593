# entretenimiento593

Guías de juegos y trucos para creadores. Hecho en Ecuador para toda Latinoamérica.

Sitio **estático** hecho con [Astro 7](https://docs.astro.build/): cada página se genera como HTML al construir el sitio, sin servidor ni base de datos. Es lo más rápido posible (mejor Core Web Vitals, anuncios más visibles, mejor RPM), cuesta $0 en hosting y no hay nada que hackear.

> Estado: **fases 1, 2 y 3 terminadas.** Sitio en Astro con la ambientación "Dimensión 593" y 20 artículos reales con fuentes oficiales y portadas ilustradas. Sigue en `noindex` hasta el lanzamiento (dominio, correos y alta en AdSense).

## Requisitos

- Node.js 22.12 o superior (`.nvmrc` dice 22)
- npm

## Comandos

| Comando              | Qué hace                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ |
| `npm install`        | Instala las dependencias                                                             |
| `npm run dev`        | Sitio en modo desarrollo en `http://localhost:4321` (el buscador no funciona en dev) |
| `npm run build`      | Construye el sitio en `dist/` y genera el índice del buscador (Pagefind)             |
| `npm run preview`    | Sirve `dist/` para revisarlo tal como quedará publicado                              |
| `npm run lint`       | Revisa el código con ESLint (incluye reglas de accesibilidad)                        |
| `npm run format`     | Ordena el formato del código con Prettier                                            |
| `npm run check`      | Revisa los tipos de TypeScript y de los componentes Astro                            |
| `npm test`           | Pruebas unitarias (Vitest) de la lógica: herramientas, URLs, fechas, SEO, anuncios   |
| `npm run test:links` | Revisa `dist/`: enlaces rotos, anclas, barra final, título, descripción y canonical  |
| `npm run test:e2e`   | Pruebas en navegador (Playwright + axe) en computadora y celular, contra `dist/`     |
| `npm run covers`     | Genera las portadas ilustradas de los artículos (ver docs/GUIA-CONTENIDO.md)         |
| `npm run verify`     | Todo lo anterior en orden. Es lo mismo que corre la CI en cada cambio                |

## Estructura

```
src/
├── assets/covers/  Portadas de los artículos (PNG 1600×900, las genera scripts/covers)
├── config/          Datos editables: sitio, creador, secciones, herramientas, anuncios, CSP
├── content/
│   ├── articles/    Artículos en MDX, una carpeta por sección
│   ├── pages/       Páginas institucionales y legales (MDX)
│   ├── games.yaml   Juegos con página propia
│   └── authors.yaml Autores con perfil
├── content.config.ts  Esquemas: qué datos lleva cada archivo (se validan al construir)
├── components/
│   ├── ads/         Espacios de anuncio (vista previa, AdSense)
│   ├── articles/    Tarjetas, listas, portada, vista de artículo y de viral
│   ├── content/     Componentes que se usan dentro del MDX (<Steps>, <Box>, <Picks>...)
│   ├── home/        Bloques de la portada
│   ├── layout/      Cabecera, pie, menú, barra del celular, plantillas de sección y herramienta
│   ├── search/      Buscador
│   ├── seo/         Metadatos, Open Graph y JSON-LD
│   ├── tools/       Calculadora, generador de nombres, recomendador, cuenta regresiva
│   └── ui/          Piezas comunes (íconos, botones de copiar, migas de pan...)
├── layouts/         Estructura HTML común
├── lib/             Lógica pura y probada (sin Astro): URLs, fechas, herramientas, SEO
├── pages/           Rutas del sitio (cada archivo es una URL)
├── scripts/         JavaScript del navegador (buscador, AdSense, atajos)
└── styles/          tokens.css (colores, tipografía, medidas) y estilos base
tests/
├── unit/            Vitest
└── e2e/             Playwright
legacy/              Maquetas HTML anteriores, como referencia
docs/                Investigación, propuesta, arquitectura y guía de contenido
```

## URLs

| Página                 | URL                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Guía de un juego       | `/juegos/<juego>/<artículo>/`                                                      |
| Otros artículos        | `/<sección>/<artículo>/` (equipo, creadores, noticias, virales)                    |
| Juego                  | `/juegos/<juego>/`                                                                 |
| Sección                | `/juegos/`, `/equipo/`, `/creadores/`, `/noticias/`, `/virales/`, `/herramientas/` |
| Herramienta            | `/herramientas/diamantes/`, `/herramientas/nombres/`, `/herramientas/celular/`     |
| Autor                  | `/autores/<autor>/`                                                                |
| Buscar                 | `/buscar/?q=...`                                                                   |
| Institucionales        | `/quienes-somos/`, `/anuncia/`, `/privacidad/`...                                  |
| Para Google y lectores | `/sitemap-index.xml`, `/news-sitemap.xml`, `/rss.xml`, `/robots.txt`, `/ads.txt`   |

## Variables de entorno

Copia `.env.example` como `.env`. Todas son públicas (se usan al construir).

| Variable                | Valores                                          | Para qué                                                        |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------------------- |
| `SITE_URL`              | `https://dominio.com`                            | Canonical, sitemap, RSS y datos estructurados                   |
| `PUBLIC_SITE_INDEXABLE` | `false` (por defecto) / `true`                   | Con `false`, todo lleva `noindex` y `robots.txt` bloquea Google |
| `PUBLIC_ADS_PROVIDER`   | `placeholder` (por defecto) / `none` / `adsense` | Recuadros de vista previa, nada o anuncios reales               |
| `PUBLIC_ADSENSE_CLIENT` | `ca-pub-0000000000000000`                        | ID de editor de AdSense                                         |

**Activar AdSense:** pon los IDs de bloque en `src/config/ads.ts`, `PUBLIC_ADS_PROVIDER=adsense` y `PUBLIC_ADSENSE_CLIENT`. Si falta algo, el build falla con un mensaje claro (nunca se publica a medias). `ads.txt` y la CSP se ajustan solos.

## Publicar en Cloudflare Pages

1. En Cloudflare → Workers & Pages → Crear → Pages → conectar este repositorio.
2. Comando de build: `npm run build` · Carpeta de salida: `dist` · Variable `NODE_VERSION=22`.
3. Agregar las variables de entorno de la tabla de arriba (en producción y en vista previa).
4. Cada push a la rama principal publica el sitio; cada pull request genera una URL de vista previa.

`public/_headers` define los encabezados de seguridad y caché para Cloudflare.

## Escribir contenido

Ver [`docs/GUIA-CONTENIDO.md`](docs/GUIA-CONTENIDO.md). En corto: un artículo es un archivo `.mdx` en `src/content/articles/<sección>/`; el nombre del archivo es la URL. Si falta un dato obligatorio, el build lo dice.

## Decisiones técnicas

Ver [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md).
