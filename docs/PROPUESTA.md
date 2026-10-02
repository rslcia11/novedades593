# Novedades593: investigación y propuesta

> Versión 1 · 2 de octubre de 2026 · Estado: **propuesta, sin desarrollo todavía**
> Base: lo aprendido en `rslcia11/monetizacion-web` (Kriterio) + investigación de mercado de septiembre/octubre 2026.
>
> **Actualización:** las secciones y la estrategia de RPM se ajustaron al público real del creador en [`ESTRATEGIA-AUDIENCIA.md`](ESTRATEGIA-AUDIENCIA.md). Donde los dos documentos difieran, manda ese.

---

## 0. Resumen en 30 segundos

1. **La idea funciona, pero no como "un sitio más de AdSense".** Un portal de noticias de gaming, deportes, farándula e influencers en español para Ecuador/LATAM tiene **RPM bajo** (lo dice tu propio plan de Kriterio: gaming 0.6x, deportes 0.9x, y LATAM paga 50–80 % menos que EE. UU.). Se gana por **volumen + venta directa**, no por valor por visita.
2. **El activo real es el creador de contenido.** Él trae lo que a un sitio nuevo le cuesta un año conseguir: audiencia, marcas locales que ya le pagan y tráfico social desde el día 1. El sitio debe diseñarse **para convertir a sus seguidores en lectores recurrentes** y **para venderle espacios a sus marcas**.
3. **Por eso Google Ad Manager (GAM) sí tiene sentido aquí, pero en la fase 2.** GAM no paga más por sí solo; su ventaja es que permite **servir campañas directas** (marcas que le pagan al creador) y llenar el resto con AdSense/AdX. Fase 1 = AdSense para aprobar y medir.
4. **Tecnología:** mantener lo que ya dominas (Astro + Cloudflare, Core Web Vitals en 100) pero **cambiar de "MDX en Git" a un CMS headless**, porque un sitio de noticias publica varias veces al día y lo harán personas que no son programadores.
5. **Riesgos que pueden matar el proyecto** (y que se evitan con reglas desde el día 1): tráfico inválido (fans haciendo clic en anuncios), derechos de autor (fotos de Instagram, videos de goles), titulares clickbait, contenido masivo con IA y difamación en farándula.

---

## 1. Qué aprendimos de Kriterio y qué cambia

| Tema | Kriterio (dev tools, EN) | Novedades593 (noticias, ES) |
|---|---|---|
| Fuente de tráfico | Búsqueda orgánica (long-tail, KD < 20) | **Google Discover + redes del creador + Google News + búsqueda de tendencia** |
| Vida de un artículo | Años (evergreen) | Horas o días (noticia) + algunas piezas evergreen |
| Frecuencia | Pocos artículos, muy trabajados | **3–10 por día** |
| Quién publica | Tú, en MDX vía Git | Redactores y el creador, desde un panel web |
| RPM esperado | Alto ($25–$65, EE. UU.) | **Bajo** (ver §3) |
| Monetización | AdSense | AdSense → **Ad Manager + campañas directas** + patrocinios |
| Lo que se reutiliza | — | Diseño editorial, rendimiento, CSP/headers, controles de calidad en el build, reglas de colocación de anuncios, páginas legales, `ads.txt`, OG con Satori |

**Lección que se mantiene:** "decisiones con datos". **Lección que se rompe:** en Kriterio descartamos gaming y "sitios de todo un poco" para *búsqueda orgánica*. Un medio de noticias es multitemático por naturaleza y Google lo acepta, **siempre que tenga identidad editorial, autores reales y secciones con masa**. Por eso proponemos empezar con pocas secciones (ver §5).

---

## 2. El mercado y cómo se mueve el tráfico de noticias en 2026

### 2.1 Google Discover es el motor (y es volátil)
- Discover ya representa **~67,5 % del tráfico de Google** que reciben los medios de noticias.
- **Febrero 2026:** primer *core update* exclusivo de Discover. Prioriza **relevancia local, autoridad temática y calidad**. Para un medio ecuatoriano esto es **una oportunidad**: Google favorece editores locales para su audiencia local.
- **Agosto 2026:** Google lanzó el botón embebible **"Preferred Sources"** (fuente preferida). Un usuario que marca el sitio como preferido tiene ~2× más probabilidad de hacer clic en él en Top Stories, AI Overviews y Discover. **Con la audiencia del creador, este botón es oro**: hay que pedirle a sus seguidores que nos marquen como fuente preferida.
- **Riesgo:** Google está agrupando noticias similares bajo un **resumen con IA** en Discover → menos clics para notas genéricas. Ganan las **exclusivas, el ángulo propio y la voz del creador**, no reescribir la nota de otro medio.
- **Septiembre 2026:** spam update global en curso (todas las lenguas). Refuerza que no se puede escalar con contenido de relleno.

**Requisitos técnicos de Discover que el sitio cumplirá desde el día 1:** imágenes grandes (≥1200 px de ancho, 16:9), `max-image-preview:large`, título honesto (sin clickbait), fecha visible, autor con perfil, datos estructurados `NewsArticle`, Core Web Vitals buenos.

### 2.2 Redes del creador (tráfico propio)
- Es el único tráfico que **no depende de Google**. Lo ideal: cada video/historia del creador lleva a una nota ampliada en el sitio ("el chisme completo está en…", "la tabla completa está en…").
- Se mide con UTM por red (TikTok, Instagram, YouTube, Facebook, WhatsApp).
- Canal de WhatsApp / Telegram del sitio para recurrencia (en Ecuador, WhatsApp es el canal más fuerte).

### 2.3 Búsqueda de tendencia y evergreen
- Noticias de tendencia: "resultado Barcelona vs Emelec", "códigos de Free Fire hoy", "quién es X influencer".
- Piezas evergreen que sí posicionan y pagan mejor: **guías de juegos** ("cómo conseguir X en Fortnite"), **calendarios** (LigaPro, Eliminatorias, lanzamientos de juegos del mes), **fichas** (perfil de influencers/jugadores). Estas sostienen el tráfico cuando Discover baja.

---

## 3. Los números (honestos)

### 3.1 RPM esperado
| Dato | Valor | Fuente |
|---|---|---|
| Mediana RPM creadores LATAM (YouTube, referencia de mercado) | ~$0,30 | dynamoi.com (79 mercados, 2026) |
| Sitios de noticias/entretenimiento | suelen quedar **< $2 RPM** por baja intención de compra | adstimate / panstag 2026 |
| Gaming vs promedio | 0,6x | plan de Kriterio (Adstimate 2026) |
| Deportes vs promedio | 0,9x | plan de Kriterio (Adstimate 2026) |
| Tráfico fuera de EE. UU./UK/CA/AU | 50–80 % menos RPM | plan de Kriterio (ToolSignal) |

> Ojo: no hay datos públicos confiables de RPM web solo para Ecuador. Trabajaremos con un **rango de $0,50–$2,00 por 1.000 páginas vistas** para AdSense y lo reemplazaremos por el dato real en el primer mes.

### 3.2 Escenarios (solo AdSense/programático)
| Páginas vistas / mes | RPM $0,50 | RPM $1,00 | RPM $2,00 |
|---|---|---|---|
| 100.000 | $50 | $100 | $200 |
| 500.000 | $250 | $500 | $1.000 |
| 2.000.000 | $1.000 | $2.000 | $4.000 |
| 5.000.000 | $2.500 | $5.000 | $10.000 |

**Conclusión de senior:** con solo AdSense, un medio LATAM necesita millones de páginas vistas para ser un negocio. Por eso el modelo tiene que ser **mixto**:

### 3.3 Modelo de ingresos propuesto
| Fuente | Cuándo | Por qué |
|---|---|---|
| **AdSense** | Mes 1 | Aprobación, datos reales de RPM, cero ventas |
| **Campañas directas vía Ad Manager** (marcas locales del creador: telcos, bancos, bebidas, delivery, tiendas gamer) | Mes 2–3 | Un banner patrocinado por una marca local se cobra por semana/mes o CPM fijo, **muchas veces por encima del programático LATAM**. GAM permite servirlo, medir impresiones/clics y entregar reportes al cliente. AdSense rellena lo no vendido |
| **Notas patrocinadas / branded content** (marcadas como "Patrocinado", `rel="sponsored"`) | Mes 2+ | Paquete "video del creador + nota en el sitio" se vende mejor que cualquiera de los dos solos |
| **Afiliados** (Amazon, tiendas de gaming, recargas de juegos, merch) | Mes 3+ | Guías de compra gamer y "mejores X" |
| **Socio MCM / header bidding** (AdX + Prebid) | Cuando haya volumen | Muchos socios piden 25.000–100.000 páginas vistas/mes (Raptive 25k, Playwire 50k, PubGalaxy 100k). Suben el RPM programático |

---

## 4. AdSense vs Ad Manager: recomendación

| | AdSense | Google Ad Manager |
|---|---|---|
| Qué es | Red de anuncios: Google vende todo | Ad server: tú decides qué se muestra (directo, AdSense, AdX, otras redes) |
| Dificultad | Baja | Media/alta (pedidos, líneas, prioridades, creatividades) |
| Requisito | Aprobación de AdSense | Cuenta GAM gratuita (necesita AdSense vinculado) o acceso vía socio MCM |
| Campañas directas de marcas | ❌ | ✅ |
| Reportes para anunciantes | ❌ | ✅ |
| Cuándo | Fase 1 | Fase 2 (cuando haya la primera marca dispuesta a pagar) |

**Plan:**
1. **Fase 1:** AdSense con unidades manuales (como en Kriterio), anuncios automáticos desactivados al inicio para controlar Core Web Vitals.
2. **Fase 2:** Ad Manager con **los mismos espacios** (el código ya debe estar preparado para cambiar de AdSense a GPT sin rediseñar). Prioridad de líneas: Patrocinio directo > Estándar directo > AdSense/AdX como relleno.
3. **Fase 3:** socio MCM o Prebid cuando haya volumen.

**Arquitectura de anuncios (reutilizando `ads.ts` de Kriterio):** un componente `<AdSlot placement="...">` con proveedor configurable (`adsense` | `gam`), alto reservado para CLS = 0, *lazy-load* bajo el pliegue, y validación de IDs en el build.

**Espacios propuestos:**
| Espacio | Dónde | Tamaños |
|---|---|---|
| `top` | Bajo el header (no encima del titular) | 728×90 / 970×250 desktop · 320×100 móvil |
| `in-article-1..3` | Cada ~4 párrafos, nunca antes del primer párrafo | 300×250 / 336×280 / fluid |
| `sidebar-sticky` | Desktop | 300×600 |
| `feed` | Cada 6 tarjetas en portada y secciones | 300×250 / fluid |
| `anchor` (opcional) | Móvil, anuncio ancla de Google | Gestionado por Google |
| `patrocinio-seccion` | "Deportes presentado por [marca]" | Solo venta directa |

Reglas heredadas de Kriterio: etiqueta "Publicidad", espacio libre alrededor, nunca pegado a botones, sin intersticiales propios, máximo de anuncios por nota.

---

## 5. Producto: secciones y formato editorial

### 5.1 Secciones (empezar con 4, no con 10)
| Sección | Contenido | Formatos que funcionan |
|---|---|---|
| **Gaming** | Lanzamientos, Free Fire/Fortnite/FIFA/LoL, códigos, eventos, esports LATAM | Guías, "códigos de hoy" (actualizable), listas |
| **Deportes** | LigaPro, Selección (La Tri), fútbol internacional con ángulo ecuatoriano | Previa/resultado, tablas, calendario |
| **Farándula** | Celebridades ecuatorianas y latinas, TV | Nota corta con fuente, galerías propias |
| **Influencers** | Creadores ecuatorianos/latam, polémicas, colaboraciones, ranking | Perfil evergreen ("quién es…"), nota de tendencia |

Se agregan secciones (Tecnología, Cine/Series, Música) solo cuando las 4 primeras tengan masa (≥20–25 notas cada una), igual que la regla de Kriterio.

### 5.2 Lo que nos diferencia (y protege de los resúmenes con IA de Google)
- **La voz del creador:** columna/opinión firmada, "lo que dijo en su live", reacciones.
- **Exclusivas locales:** entrevistas, eventos en Ecuador, fuentes propias.
- **Utilidad:** tablas de posiciones, calendarios, códigos, guías: cosas que la gente vuelve a buscar.

### 5.3 Estándar editorial mínimo (obligatorio)
1. Titular que dice lo que pasó; **prohibido el clickbait** (política de AdSense de contenido engañoso y requisito de Discover).
2. Fuente citada y enlazada en cada dato (declaración, post original embebido).
3. Autor real con perfil, fecha de publicación y de actualización.
4. Imágenes: propias, de agencias con licencia o **embeds oficiales** (Instagram/TikTok/X/YouTube). **Nunca descargar y re-subir fotos de redes.**
5. Deportes: **nada de clips de partidos** sin derechos (riesgo de copyright y de suspensión de AdSense).
6. Farándula: no publicar rumores sin fuente; derecho a réplica; ojo con menores de edad y temas de salud.
7. IA solo como asistente (investigar, corregir, resumir declaraciones); **la nota la escribe y la firma una persona.**

---

## 6. Tecnología recomendada

### 6.1 Requisitos que cambian respecto a Kriterio
- Publicación varias veces al día, desde el celular si hace falta, por personas no técnicas.
- Una nota debe estar en línea **en segundos**, no esperar un build de todo el sitio.
- Roles: redactor, editor, admin; borradores, programación de publicación, notas destacadas.
- Sitemaps de noticias (`news-sitemap.xml`) actualizados al instante.

### 6.2 Opciones evaluadas
| Opción | Pros | Contras | Veredicto |
|---|---|---|---|
| **A. Astro (SSR) + CMS headless + Cloudflare** | Reutiliza Kriterio, rendimiento top (mejor CWV = mejor viewability = mejor RPM), sin servidor que mantener, seguro | Hay que construir el panel de integración y el caché | ✅ **Recomendada** |
| B. WordPress clásico (tema ligero + plugins) | Rápido de lanzar, redactores lo conocen, plugins para todo | Mantenimiento, seguridad, plugins pesados, CWV más difíciles, no reutiliza tu stack | Plan B si hay apuro extremo |
| C. Next.js + CMS | Ecosistema grande | Más pesado, no reutiliza lo que ya tienes, sin ventaja real aquí | ❌ |
| D. Seguir con MDX en Git (como Kriterio) | Cero costo | Inviable para 5–10 notas diarias de no programadores | ❌ |

### 6.3 Stack propuesto (opción A)
| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **Astro** en modo servidor (SSR) con islas mínimas | Ya lo dominas; HTML casi sin JS |
| Hosting | **Cloudflare Workers** + caché en el edge | Igual que Kriterio; las páginas se cachean y se purgan al publicar |
| CMS | **Sanity** (hospedado, plan gratuito para empezar, editor en tiempo real, móvil) · alternativa self-hosted: **Payload CMS** | Panel para redactores sin mantener servidor; webhooks al publicar |
| Imágenes | CDN de imágenes del CMS / Cloudflare Images, AVIF/WebP, 1200 px+ | Discover y LCP |
| Búsqueda | Pagefind no sirve para contenido que cambia cada hora → búsqueda del CMS (GROQ) o Algolia/Typesense más adelante | — |
| Publicación al instante | Webhook del CMS → purga de caché de Cloudflare + ping de sitemaps | La nota sale en segundos |
| SEO | `NewsArticle`, `BreadcrumbList`, `Organization`, `Person`; sitemap general + **news sitemap**; RSS por sección; `max-image-preview:large` | Google News / Discover |
| Anuncios | `AdSlot` con proveedor AdSense o GAM (GPT), CMP certificado por Google para consentimiento | Cambiar de fase sin rediseñar |
| Analítica | GA4 + Search Console + reportes de AdSense/GAM; Cloudflare Web Analytics | Medir RPM por sección y fuente de tráfico |
| Redes | OG automáticos con Satori (como Kriterio), botón "Preferred Sources", botón de canal de WhatsApp | Recurrencia |
| Seguridad | Headers/CSP de Kriterio adaptados a los dominios de anuncios | — |

**Costo estimado de arranque:** dominio (~$15–40/año) + Cloudflare Workers ($0–5/mes) + Sanity plan gratuito. Lo caro no es la tecnología: es **la redacción**.

---

## 7. Riesgos y cómo los controlamos

| Riesgo | Impacto | Control |
|---|---|---|
| **Tráfico inválido**: fans del creador hacen clic en anuncios "para apoyarlo" | **Suspensión de AdSense de por vida** | El creador **nunca** pide clics en anuncios ni menciona los anuncios. Monitorear CTR por fuente; si se dispara, investigar |
| Copyright (fotos de redes, clips deportivos, música) | Retiro de anuncios, DMCA, suspensión | Embeds oficiales, imágenes propias o con licencia, sin clips de partidos |
| Clickbait / titulares engañosos | Política de AdSense + caída en Discover | Regla editorial §5.3 |
| Contenido masivo con IA | Spam update, caída de tráfico | IA solo como asistente; autor real |
| Difamación en farándula | Demandas | Fuente obligatoria, derecho a réplica, revisión editorial |
| Dependencia de Discover | Tráfico que cae 50 % de un día para otro | Diversificar: redes del creador, WhatsApp, evergreen, búsqueda |
| Comprar tráfico barato | Tráfico inválido | No comprar tráfico, nunca |

---

## 8. Hoja de ruta

| Fase | Duración | Entregables |
|---|---|---|
| **0. Validación** | 1 semana | Aprobar esta propuesta y la maqueta con el creador. Definir nombre/dominio, secciones, quién escribe y cuántas notas/día |
| **1. MVP** | 3–4 semanas | Sitio con 4 secciones, CMS, portada, sección, nota, autor, búsqueda, legales, SEO de noticias, AdSense listo pero apagado |
| **2. Carga inicial** | 2–3 semanas (en paralelo) | 30–50 notas de calidad + 10–15 evergreen (guías, perfiles, calendarios) |
| **3. Lanzamiento** | — | Search Console, sitemaps, solicitud de AdSense, Publisher Center de Google News, el creador empuja desde sus redes |
| **4. Monetización 2** | Mes 2–3 | Ad Manager + primer kit de medios (media kit) para marcas del creador |
| **5. Escala** | Mes 4+ | Socio MCM/header bidding, más redactores, nuevas secciones |

---

## 9. Lo que necesito que definas con el creador

1. **¿De qué es su contenido y en qué redes?** (seguidores, país de la audiencia, edad). Define qué sección pesa más.
2. **¿Ya tiene marcas que le pagan?** Si sí, Ad Manager entra antes.
3. **¿Quién escribe?** ¿Él, un equipo, tú? ¿Cuántas notas al día son realistas?
4. **Audiencia:** ¿solo Ecuador o Ecuador + LATAM + latinos en EE. UU./España? (los latinos en EE. UU. y España pagan mucho mejor RPM).
5. **Marca:** ¿"Novedades593" es el nombre final o usamos uno ligado al creador?
6. **Modelo de sociedad:** cómo se reparten ingresos de anuncios vs patrocinios (mejor dejarlo escrito antes de lanzar).

---

## Fuentes

- Plan e investigación de Kriterio: `rslcia11/monetizacion-web/articulos/plan-sitio-adsense.md`
- RPM LATAM: [dynamoi.com, YouTube AdSense RPM, 79 mercados 2026](https://dynamoi.com/data/youtube-adsense-rpm), [Adstimate, RPM por país 2026](https://adstimate.com/blog/adsense-rpm-by-country.html), [Panstag, caída de RPM 2026](https://www.panstag.com/2026/08/adsense-rpm-dropped-small-blogger-fix.html), [Fluxnote, CPM LATAM 2026](https://fluxnote.io/guides/youtube-cpm-latin-america-by-country)
- Discover: [Proceed Innovative, update de febrero 2026](https://www.proceedinnovative.com/blog/googles-february-2026-discover-update/), [ALM Corp, datos del update de Discover](https://almcorp.com/blog/google-discover-core-update-february-2026-local-publishers-data/), [Press Gazette, cambios de IA en Discover](https://pressgazette.co.uk/platforms/google-ai-changes-could-deal-further-blow-to-publisher-discover-traffic/)
- Preferred Sources: [TechCrunch, 20 ago 2026](https://techcrunch.com/2026/08/20/google-gives-publishers-a-new-way-to-fight-ai-driven-traffic-losses/), [Techweez](https://techweez.com/2026/08/21/google-preferred-source-button-publishers/)
- Spam update: [Semrush, spam update septiembre 2026](https://www.semrush.com/blog/google-spam-update-september-2026/)
- Ad Manager / MCM: [Google, políticas de socios de Ad Manager](https://support.google.com/publisherpolicies/answer/9059370), [Adsclap, mejores socios MCM 2026](https://adsclap.com/best-google-mcm-partners), [Publift, qué es MCM](https://www.publift.com/blog/google-mcm-multiple-customer-management)
- AdSense: [requisitos de elegibilidad](https://support.google.com/adsense/answer/9724), [políticas del programa](https://support.google.com/adsense/answer/48182)
