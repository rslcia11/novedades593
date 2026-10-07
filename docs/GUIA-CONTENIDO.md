# Guía para escribir contenido

Todo el contenido vive en `src/content/`. Cada vez que se construye el sitio, Astro revisa cada archivo: si a una nota le falta un dato obligatorio, si un relacionado apunta a una nota que no existe o si un juego no existe, **el build falla y dice exactamente qué corregir**. Así nunca se publica algo roto.

## Crear un artículo

1. Crea un archivo en la carpeta de su sección: `src/content/articles/<sección>/<nombre-del-archivo>.mdx`.
2. El **nombre del archivo es la URL**: corto, en minúsculas, con guiones y sin tildes (`codigos-roblox.mdx`).
3. Arriba va la ficha (frontmatter) entre `---`; abajo, el texto.

```mdx
---
title: 'Cómo hacer un portal al Nether paso a paso'
description: 'Cuánta obsidiana necesitas, cómo encenderlo y qué llevar en tu primer viaje.'
summary: 'Necesitas 10 bloques de obsidiana para un marco de 4 × 5 y un mechero de pedernal.'
section: juegos
game: minecraft
tag: 'Exploración'
type: guia
author: redaccion
publishedAt: 2026-10-03T10:00:00-05:00
updatedAt: 2026-10-07T09:00:00-05:00
featured: false
cover:
  label: 'Nether'
  tone: inverse
related:
  - diamantes-minecraft
sources:
  - name: 'Notas oficiales de Minecraft'
    url: https://www.minecraft.net/
---

Texto del artículo...
```

### Datos de la ficha

| Campo         | Obligatorio | Qué es                                                                                                          |
| ------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `title`       | Sí          | Título (10 a 110 caracteres). Dice lo que hay adentro: **nada de clickbait**                                    |
| `description` | Sí          | Entradilla (30 a 200). Aparece bajo el título, en tarjetas y en Google                                          |
| `summary`     | No          | "Respuesta corta": lo que la persona vino a buscar, en dos líneas                                               |
| `section`     | Sí          | `juegos`, `equipo`, `creadores`, `noticias` o `virales`                                                         |
| `game`        | En `juegos` | id del juego en `games.yaml` (`minecraft`, `roblox`, `gta6`, `freefire`, `fortnite`)                            |
| `tag`         | Si hay juego | Filtro de la página del juego. Tiene que estar en los `tags` de ese juego                                      |
| `type`        | Sí          | `guia`, `codigos`, `comparativa`, `creador`, `noticia` (solo en noticias) o `viral` (solo en virales)            |
| `author`      | Sí          | id en `authors.yaml` (`yeri-loco` o `redaccion`). Firma quien escribió de verdad el artículo                    |
| `publishedAt` | Sí          | Fecha y hora de publicación, con zona de Ecuador (`-05:00`)                                                      |
| `updatedAt`   | No          | Última actualización. Se muestra como "Actualizado el…". Úsala cuando cambies algo de verdad                     |
| `featured`    | No          | `true` para que aparezca en "Lo más leído"                                                                      |
| `affiliate`   | No          | `true` si tiene enlaces de afiliado: muestra el aviso automáticamente                                           |
| `cover`       | Sí          | `label` (texto de la portada, máx. 14 caracteres) y `tone` (`accent`, `inverse`, `soft`, `grid`). Ver imágenes  |
| `video`       | En virales  | `duration: '0:42'` y, opcional, `embedUrl` del reproductor oficial                                              |
| `related`     | No          | Hasta 6 nombres de archivo de artículos relacionados                                                            |
| `sources`     | No          | Fuentes: `name` y, si existe, `url`                                                                             |
| `draft`       | No          | `true` para que se vea en `npm run dev` pero no se publique                                                     |

### Imágenes de portada

Cada artículo lleva una portada ilustrada de 1600×900 con el estilo de la Dimensión 593. Las portadas se dibujan con código (SVG) para que todas sean originales y coherentes:

1. Agrega la escena del artículo en `scripts/covers/scenes.mjs`, con la clave igual al nombre del archivo. Combina los objetos de `scripts/covers/props.mjs` (gema, celular, micrófono, escudo, trofeo…) o crea uno nuevo ahí.
2. Genera la imagen: `npm run covers -- nombre-del-articulo` (sin nombre, regenera todas).
3. Revisa el resultado en `src/assets/covers/nombre-del-articulo.png`.
4. Agrégala a la ficha del artículo:

```yaml
cover:
  label: 'Nether'
  tone: inverse
  image: ../../../assets/covers/portal-nether.png
  alt: 'Ilustración de un marco de bloques oscuros con un remolino morado en el centro'
  caption: 'Ilustración: entretenimiento593'
```

Reglas de las portadas, basadas en lo que funciona en Google Discover y en redes:

- **Un solo sujeto grande y centrado.** Discover recorta los bordes según el dispositivo.
- **Fondo oscuro y sujeto brillante.** El contraste es lo que más llama la atención.
- **Sin texto dentro de la imagen.** El título ya está en la página y el texto se corta al recortar.
- **Nada de logos, personajes ni capturas de marcas ajenas.** Solo objetos genéricos dibujados por nosotros.
- **`alt` obligatorio**, describiendo la ilustración.

Astro convierte la imagen a AVIF y WebP en varios tamaños, y genera la versión de 1200×630 para redes sociales. Si algún día usas una captura propia del juego, guárdala en `src/assets/covers/` con al menos 1200 px de ancho. **Nunca** uses fotos descargadas de redes sociales.

## Escribir el texto

Markdown normal: párrafos, `## Títulos` (arman el índice automático), listas y tablas.

```markdown
## Qué necesitas

| Material  | Cantidad |
| --------- | -------- |
| Obsidiana | 10       |
```

**Los anuncios se insertan solos** después del segundo bloque y a mitad del artículo. No hay que ponerlos a mano.

### Componentes disponibles

Se usan directamente, sin importar nada.

```mdx
<Steps>
  <Step title="Consigue 10 de obsidiana.">Necesitas pico de diamante.</Step>
  <Step title="Arma el marco de 4 × 5.">Las esquinas no hacen falta.</Step>
</Steps>

<Facts>
  <Fact value="Y -59">la capa con más diamantes</Fact>
</Facts>

<Box title="Errores comunes">

- Picar diamantes con pico de piedra.
- Cavar recto hacia abajo.

</Box>

<Tip>Anota las coordenadas de tu portal antes de cruzar.</Tip>

<Picks>
  <Pick
    badge="La mejor calidad-precio"
    name="Modelo X"
    price="$220 – $280"
    specs={['8 GB RAM', '120 Hz']}
    pros={['Fluido en gráficos altos']}
    cons={['Se calienta']}
    url="https://enlace-de-afiliado"
  />
</Picks>

<Countdown game="gta6" />
<DiamondCalculator />
<NameGenerator />
```

Ojo con `<Box>`: deja una línea en blanco después de abrirlo y antes de cerrarlo para que la lista se vea bien.

## Cómo escribir para que se lea (y pague)

- **Responde en las primeras líneas.** La "Respuesta corta" (`summary`) da lo que la persona vino a buscar; el resto amplía.
- **Frases cortas, tú y español neutro.** Así se entiende en todo Latinoamérica.
- **Escanea fácil:** títulos `##` cada pocas líneas, pasos numerados, tablas y recuadros.
- **Enlaza otras guías del sitio** donde ayuden de verdad. Cada página extra que lee alguien suma.
- **Cita la fuente oficial de cada dato** y, si un número no es oficial, dilo.
- **Nada de relleno.** Si un dato no está confirmado, no lo inventes: escribe "todavía no está anunciado".

## Reglas editoriales (obligatorias)

1. Titular que dice lo que pasó. **Prohibido el clickbait.**
2. Fuente citada en cada dato.
3. Autor real y fecha visible.
4. Imágenes propias, con licencia o embeds oficiales.
5. Polémicas: con fuente, sin insultos y con derecho a réplica.
6. La IA ayuda a investigar; **la nota la escribe y la firma una persona.**
7. Nunca pedir clics en los anuncios, ni en broma.

## Antes de publicar

```bash
npm run dev      # revisar cómo se ve
npm run verify   # todas las revisiones (lo mismo que corre la CI)
```
