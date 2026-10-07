# Arquitectura (fase 1)

> 7 de octubre de 2026 · Complementa la sección 6 de [`PROPUESTA.md`](PROPUESTA.md). Donde difieran, manda este documento.

## Decisión principal: sitio estático

La propuesta recomendaba Astro con servidor (SSR) y un CMS hospedado (Sanity). Para la etapa actual se eligió **Astro 100 % estático**, sin servidor ni base de datos:

| Criterio                  | Estático (elegido)                                                           |
| ------------------------- | ---------------------------------------------------------------------------- |
| Velocidad                 | HTML listo en el CDN: el mejor Core Web Vitals posible. Más visibilidad de anuncios = más RPM |
| Costo                     | $0 en Cloudflare Pages                                                       |
| Seguridad                 | No hay servidor, panel ni base de datos que atacar                           |
| Publicar                  | Un archivo MDX por nota; el sitio se reconstruye en ~1 minuto                |
| Riesgo                    | Bajo: si un build falla, sigue en línea la versión anterior                  |

**Cuándo revisar esta decisión:** si se publican muchas notas al día desde el celular por personas que no usan Git. El paso siguiente sería un **CMS que guarda en Git** (Keystatic o Decap CMS): sigue siendo estático y no cambia nada del sitio.

## Stack

| Capa                 | Tecnología                                                       | Por qué                                                       |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------- |
| Framework            | Astro 7 (salida estática, `trailingSlash: 'always'`)             | HTML casi sin JavaScript; islas solo donde hay interacción    |
| Contenido            | Content Collections con esquemas Zod, MDX procesado con Sätteri  | Validación en el build; componentes dentro del texto           |
| Interactividad       | Custom elements con `<script>` de Astro (sin framework de UI)    | Cero dependencias en el navegador; lo recomendado por Astro   |
| Estilos              | CSS con tokens (`src/styles/tokens.css`) + estilos por componente | La fase 2 (ambientación) se hace cambiando los tokens          |
| Tipografía           | Schibsted Grotesk servida desde el sitio (Fonts API de Astro)    | Sin Google Fonts: más rápido y sin cookies de terceros; respaldo calibrado para no mover el diseño |
| Búsqueda             | Pagefind (índice estático generado en el build)                  | Funciona sin servidor; con el sitio estático ya no tiene la limitación que mencionaba la propuesta |
| SEO                  | Canonical, Open Graph, JSON-LD (WebSite, Organization, Article/NewsArticle, BreadcrumbList, Person), sitemap, news sitemap, RSS | Requisitos de Google Discover y News |
| Seguridad            | CSP generada por Astro con hashes + `public/_headers`            | Protección contra XSS sin `unsafe-inline` (mientras no haya AdSense) |
| Hosting              | Cloudflare Pages                                                 | CDN global, vistas previas por pull request                   |
| Pruebas              | Vitest (lógica), Playwright + axe (navegador y accesibilidad), revisor de enlaces | Todo lo que el sitio hace está probado        |
| Calidad              | ESLint (TypeScript estricto + accesibilidad), Prettier, `astro check`, GitHub Actions | Nada entra a la rama principal sin pasar todo |

## Principios del código

- **Una sola fuente de verdad.** Textos del sitio, secciones, herramientas y anuncios en `src/config/`; URLs en `src/lib/urls.ts`; colores y medidas en `tokens.css`.
- **Lógica pura separada de la vista.** Todo lo que calcula (diamantes, nombres, fechas, relacionados, ubicación de anuncios, datos estructurados) vive en `src/lib/` sin depender de Astro, y tiene pruebas unitarias.
- **Funciona sin JavaScript.** Las herramientas muestran su resultado inicial ya calculado; el buscador es un formulario normal; el menú es un `<dialog>` nativo. El JavaScript mejora, no es requisito.
- **Falla al construir, no en producción.** Esquemas de contenido, validación de anuncios, relacionados y etiquetas se revisan en el build.
- **Accesible por defecto.** Sin violaciones de axe (WCAG 2.2 AA), navegación con teclado, objetivos táctiles de 44 px y respeto de `prefers-reduced-motion`.

## Anuncios

- `AdSlot` reserva el alto de cada espacio (CLS = 0) y cambia de comportamiento según `PUBLIC_ADS_PROVIDER`: `none`, `placeholder` (vista previa) o `adsense`.
- Los anuncios dentro de los artículos los inserta un plugin del procesador de Markdown (`src/lib/markdown/in-article-ads.ts`): después del segundo bloque, nunca tras un título, máximo dos por nota. Así ningún redactor tiene que acordarse de ponerlos.
- AdSense se pide solo cuando el espacio está por entrar en pantalla y nunca en espacios ocultos (por ejemplo, la barra lateral en celular).
- Al activar AdSense, la CSP se abre solo para los dominios de Google y se genera `ads.txt`.
- **Fase 2 de monetización (Ad Manager):** se agrega un proveedor `gam` en `AdSlot` con los mismos espacios, sin rediseñar.

## Indexación

Mientras `PUBLIC_SITE_INDEXABLE=false`, todas las páginas llevan `noindex` y `robots.txt` bloquea el rastreo. Esto evita que Google indexe el contenido de ejemplo, que podría perjudicar la aprobación de AdSense. Se cambia a `true` el día del lanzamiento, con contenido real y textos legales completos.

## Pendiente para las siguientes fases

- **Fase 2:** ambientación visual (universo de ciencia ficción animada, con identidad propia y sin usar personajes ni marcas de terceros).
- **Fase 3:** artículos reales, imágenes propias de portada e imágenes Open Graph por artículo.
- Antes del lanzamiento: dominio, textos legales completos, CMP de consentimiento certificada por Google, GA4 y Search Console.
