/**
 * Genera las portadas de los artículos en src/assets/covers/<artículo>.png (1600×900).
 * Astro las optimiza después (AVIF/WebP, varios tamaños) y arma la imagen para redes.
 *
 * Uso:
 *   node scripts/covers/generate.mjs               todas
 *   node scripts/covers/generate.mjs slug1 slug2   solo esas
 *   node scripts/covers/generate.mjs --sheet       además, una hoja de contacto para revisarlas
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import * as kit from './kit.mjs';
import { SCENES, compose } from './scenes.mjs';

const OUT = new URL('../../src/assets/covers/', import.meta.url);
const args = process.argv.slice(2);
const sheet = args.includes('--sheet');
const slugs = args.filter((a) => !a.startsWith('--'));
const targets = slugs.length > 0 ? slugs : Object.keys(SCENES);

await mkdir(OUT, { recursive: true });
const rendered = [];
for (const slug of targets) {
  const png = await sharp(Buffer.from(compose(slug, kit)))
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  await writeFile(new URL(`${slug}.png`, OUT), png);
  rendered.push({ slug, png });
  console.log(`✓ ${slug} (${Math.round(png.length / 1024)} KB)`);
}

if (sheet) {
  const thumbW = 400;
  const thumbH = 225;
  const cols = 4;
  const rows = Math.ceil(rendered.length / cols);
  const tiles = await Promise.all(
    rendered.map(async ({ png }, i) => ({
      input: await sharp(png).resize(thumbW, thumbH).toBuffer(),
      left: (i % cols) * thumbW,
      top: Math.floor(i / cols) * thumbH,
    })),
  );
  const path = process.env['SHEET_PATH'] ?? 'covers-sheet.png';
  await sharp({ create: { width: cols * thumbW, height: rows * thumbH, channels: 3, background: '#000' } })
    .composite(tiles)
    .png()
    .toFile(path);
  console.log(`Hoja de contacto: ${path}`);
}
