# Arquitectura

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
| Estilos              | CSS con tokens (`src/styles/tokens.css`) + estilos por componente | La ambientación completa vive en los tokens                   |
| Tipografía           | Schibsted Grotesk (texto) y Lilita One (títulos), servidas desde el sitio con la Fonts API de Astro | Sin Google Fonts: más rápido y sin cookies de terceros; respaldo calibrado para no mover el diseño |
| Portadas             | Ilustraciones SVG propias (`scripts/covers/`) exportadas a PNG con sharp y optimizadas por Astro | Originales, coherentes y sin derechos de terceros |
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

## Ambientación: Dimensión 593

Inspirada en la ciencia ficción animada, pero **100 % propia** para no arriesgar la monetización: sin personajes, logos, frases ni elementos reconocibles de ninguna serie o marca.

- **Paleta:** espacio profundo (`#0d1023`) de fondo, plasma verde (`#9dff3a`) para la acción, cian de portal y rosa "goo" como acentos, y el amarillo de Ecuador en el 593 del logo.
- **Forma:** contornos gruesos y sombras duras sin desenfoque (estilo caricatura), botones redondeados.
- **Motivos:** cielo de estrellas en CSS puro, el portal de plasma (`src/components/ui/Portal.astro`, dibujo propio en SVG que gira despacio y se detiene con `prefers-reduced-motion`).
- **Tipografía:** Lilita One para títulos (licencia OFL, del tipógrafo argentino Juan Montoreano) y Schibsted Grotesk para el texto.
- Todo está en `src/styles/tokens.css`: cambiar la ambientación es cambiar ese archivo.

## Contenido y AdSense

- 20 artículos iniciales: guías (Minecraft, Roblox, GTA VI, Free Fire, Fortnite), equipo, creadores y noticias, cada uno con fuentes oficiales enlazadas.
- Sin contenido de relleno: se eliminaron los textos de ejemplo, los códigos ficticios y los productos "por definir".
- Las secciones sin contenido (hoy, Virales) se ocultan del menú y quedan en `noindex` hasta tener artículos propios.
- Páginas que AdSense revisa: Quiénes somos, Cómo trabajamos (política editorial), Contacto, Privacidad y cookies (con la divulgación de cookies de Google y de terceros y los enlaces para desactivar la publicidad personalizada) y Términos.
- **Códigos diarios de juegos:** la función se quitó hasta que exista un proceso real para verificarlos cada día. Publicar códigos sin verificar es contenido engañoso.

## Pendiente antes del lanzamiento

- **Dominio** y correos reales (`hola@` y `marcas@`); hoy los correos del sitio apuntan a un dominio que todavía no existe.
- Variables de producción: `SITE_URL`, `PUBLIC_SITE_INDEXABLE=true`, luego `PUBLIC_ADS_PROVIDER=adsense` con el ID de editor y los IDs de bloque.
- Activar en AdSense el mensaje de consentimiento (Privacidad y mensajes) para Europa, Reino Unido y Suiza.
- Search Console, sitemap y, si se quiere medir, GA4 (actualizar la política de privacidad al agregarlo).
- Que Yeri Loco revise y firme los artículos de creadores en los que aporte su experiencia: es la mejor señal de confianza (E-E-A-T) del sitio.
