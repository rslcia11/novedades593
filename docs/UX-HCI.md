# UX, HCI e interfaces: cómo se aplicó en el sitio

> 7 de octubre de 2026 · Auditoría del sistema completo contra principios de interacción humano-computador, accesibilidad y multimedia. Cada punto dice dónde está aplicado y, cuando se puede automatizar, qué prueba lo verifica para que no se rompa en el futuro.

## Heurísticas de Nielsen

| Heurística | Cómo se aplica | Dónde / prueba |
| --- | --- | --- |
| 1. Visibilidad del estado del sistema | Barra de progreso de lectura; botón "Copiado ✓"; sección actual marcada en el menú y en la barra inferior; "Buscando…" mientras carga la búsqueda; número de resultados | `Header`, `CopyButton`, `buscar.astro` · `navigation.spec`, `search.spec` |
| 2. Coincidencia con el mundo real | Español neutro de Latinoamérica, sin jerga técnica; "Respuesta corta" al inicio; fechas y monedas en formato local (es-EC, hora de Guayaquil) | `lib/dates.ts`, `lib/format.ts` · `urls-dates-text.test` |
| 3. Control y libertad | El menú se cierra con Esc, botón o clic afuera; botón para borrar la búsqueda; "Reiniciar" en la calculadora; filtros con opción "Todo" | `MenuDialog`, `SearchBox`, `TagFilter` · `navigation.spec`, `tools.spec` |
| 4. Consistencia y estándares | Un solo sistema de tokens y componentes; patrones web conocidos (migas de pan, lupa, menú hamburguesa, `<dialog>` nativo) | `styles/tokens.css`, `components/` |
| 5. Prevención de errores | Las herramientas aceptan cualquier entrada sin romperse (vacío o negativo = 0); el contenido se valida al construir (no se publican enlaces rotos ni datos faltantes) | `lib/tools/*`, `content.config.ts` · `diamonds.test`, `check-links.mjs` |
| 6. Reconocer antes que recordar | Búsquedas populares bajo el buscador; sugerencias mientras escribes; índice del artículo; "Sigue con" al final | `index.astro`, `SearchBox`, `Toc` · `search.spec`, `articles.spec` |
| 7. Flexibilidad y eficiencia | Atajo "/" para buscar; flechas para moverse en las sugerencias; precarga de páginas al pasar el cursor | `scripts/shortcuts.ts`, `prefetch` · `navigation.spec`, `search.spec` |
| 8. Diseño estético y minimalista | Un sujeto por portada, sin texto encima; jerarquía clara (título, respuesta corta, pasos); anuncios limitados a 2 dentro del texto | `scripts/covers/`, `in-article-ads.ts` · `in-article-ads.test` |
| 9. Ayudar a reconocer y recuperarse de errores | 404 con buscador y juegos; búsqueda sin resultados con ejemplos; mensaje claro si el portapapeles falla | `404.astro`, `buscar.astro`, `CopyButton` · `pages.spec`, `search.spec` |
| 10. Ayuda y documentación | Preguntas frecuentes en cada herramienta; "Cómo se calcula" en la calculadora; política editorial pública | `Faq`, `DiamondCalculator`, `/como-trabajamos/` |

## Leyes de interacción

- **Fitts (objetivos fáciles de tocar):** objetivos táctiles de 44 px como mínimo en pantallas táctiles; navegación principal en una barra inferior, al alcance del pulgar en el celular; botones grandes en las herramientas.
- **Hick (menos opciones, decisiones más rápidas):** 5 accesos en la barra inferior; secciones vacías ocultas del menú; filtros solo con etiquetas que tienen artículos.
- **Jakob (lo conocido funciona):** buscador arriba, logo que lleva al inicio, migas de pan, pie con enlaces legales: donde la gente los espera.
- **Ley de Doherty (respuesta inmediata):** sitio estático en CDN, tipografía propia precargada, imágenes AVIF/WebP en varios tamaños y carga diferida de lo que está fuera de pantalla.

## Gestalt y jerarquía visual

- **Proximidad y región común:** tarjetas con contorno agrupan imagen, etiqueta, título y fecha.
- **Semejanza:** cada tipo de bloque tiene un estilo propio y constante (pasos numerados, recuadros de advertencia en rosa, consejos con barra cian, datos en verde).
- **Figura y fondo:** fondo espacial oscuro y sujetos brillantes, tanto en la interfaz como en las portadas.
- **Jerarquía tipográfica:** títulos en Lilita One y texto en Schibsted Grotesk; texto largo a 17–18 px con interlineado 1,7 y un ancho máximo de unos 700 px (entre 60 y 75 caracteres por línea).

## Accesibilidad (WCAG 2.2 AA)

- Revisión automática con **axe** en 23 páginas (todas las plantillas del sitio), en computadora y celular, en cada cambio: **0 violaciones** (`pages.spec`).
- Contraste AA en todos los textos sobre el fondo oscuro (verificado por axe).
- Enlace "Ir al contenido", foco visible (anillo cian de 3 px), estructura semántica (`header`, `nav`, `main`, `article`, `aside`, `footer`) y un solo `h1` por página.
- Imágenes con `alt` descriptivo (obligatorio en el esquema de contenido); íconos decorativos ocultos para lectores de pantalla.
- Avisos con `aria-live` (copiado, resultados de las herramientas), `aria-pressed` en filtros y opciones, y un combobox accesible en las sugerencias de búsqueda.
- Los enlaces que abren otra pestaña lo avisan a los lectores de pantalla (WCAG 3.2.5).
- **Movimiento reducido:** el portal deja de girar y se desactiva el desplazamiento suave si la persona lo pide al sistema (`prefers-reduced-motion`).
- La página nunca se desborda hacia los lados en celular (`pages.spec`).

## Principios multimedia (Mayer)

- **Coherencia:** las portadas no llevan texto ni adornos que distraigan; el portal es decorativo y está oculto para lectores de pantalla.
- **Señalización:** "Respuesta corta", títulos frecuentes, datos destacados y recuadros guían la lectura.
- **Segmentación:** los procesos se explican en pasos numerados, uno a la vez.
- **Contigüidad espacial:** la calculadora está dentro del artículo que la explica, junto al texto que la usa.
- **Personalización:** se escribe en segunda persona ("tú"), con tono cercano.

## Usabilidad de la monetización

- Los anuncios reservan su espacio antes de cargar: la página no "salta" (CLS = 0).
- Etiqueta "Publicidad" visible; nunca encima de botones ni antes del primer bloque de contenido; nunca entre una frase y la lista que presenta.
- Máximo 2 anuncios dentro del texto y 1 lateral en computadora.

## Pendientes y mejoras futuras

- **Modo claro opcional.** La ambientación es oscura por diseño; un tema claro para quienes lo prefieren se puede agregar redefiniendo los tokens bajo `prefers-color-scheme: light`.
- **Pruebas con personas reales.** Las pruebas automáticas cubren lo técnico; conviene observar a 5 personas del público (jugadores de 15 a 25 años) usando el sitio en sus celulares: es lo que más problemas revela con menos esfuerzo.
- **Medir con datos.** Con GA4 y Search Console se pueden ver qué artículos retienen y dónde abandonan, y ajustar el contenido con eso.
