/**
 * Genera los íconos y la imagen por defecto para redes a partir de SVG.
 * Uso: node scripts/generate-brand-assets.mjs  (los archivos quedan en public/ y se versionan)
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const YELLOW = '#FFD100';
const INK = '#111111';
const out = (name) => new URL(`../public/${name}`, import.meta.url);

const icon = (size, radius) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${YELLOW}"/>
  <text x="32" y="42" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="25" text-anchor="middle" fill="${INK}">593</text>
</svg>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <text x="80" y="200" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="96" fill="#FFFFFF" letter-spacing="-3">entretenimiento</text>
  <rect x="80" y="240" width="250" height="124" rx="12" fill="${YELLOW}"/>
  <text x="104" y="336" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="96" fill="${INK}" letter-spacing="-3">593</text>
  <text x="80" y="450" font-family="DejaVu Sans, Arial, sans-serif" font-size="42" fill="#CFCFCF">Guías de juegos y trucos para creadores</text>
  <rect x="0" y="560" width="1200" height="70" fill="${YELLOW}"/>
  <text x="80" y="606" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" font-size="28" fill="${INK}">Hecho en Ecuador para toda Latinoamérica</text>
</svg>`;

const png = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

/** ICO con una imagen PNG adentro (formato válido desde Windows Vista y en todos los navegadores). */
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reservado
  header.writeUInt16LE(1, 2); // tipo: ícono
  header.writeUInt16LE(1, 4); // cantidad de imágenes
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8); // paleta
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); // planos
  header.writeUInt16LE(32, 12); // bits por píxel
  header.writeUInt32LE(pngBuffer.length, 14);
  header.writeUInt32LE(22, 18); // posición de los datos
  return Buffer.concat([header, pngBuffer]);
}

await writeFile(out('apple-touch-icon.png'), await png(icon(180, 0)));
await writeFile(out('icon-192.png'), await png(icon(192, 12)));
await writeFile(out('icon-512.png'), await png(icon(512, 12)));
await writeFile(out('logo.png'), await png(icon(512, 0)));
await writeFile(out('favicon.ico'), pngToIco(await png(icon(32, 12)), 32));
await writeFile(out('og-default.png'), await png(og));
console.log('Listo: íconos y og-default.png en public/');
