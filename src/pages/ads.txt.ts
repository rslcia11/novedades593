/** ads.txt: autoriza a Google a vender los anuncios del sitio. Sin cuenta de AdSense queda vacío. */
import type { APIRoute } from 'astro';
import { PUBLIC_ADSENSE_CLIENT } from 'astro:env/server';
import { adsTxtLine } from '@/config/ads';

export const GET: APIRoute = () =>
  new Response(PUBLIC_ADSENSE_CLIENT ? `${adsTxtLine(PUBLIC_ADSENSE_CLIENT)}\n` : '', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
