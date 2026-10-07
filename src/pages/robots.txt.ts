import type { APIRoute } from 'astro';
import { PUBLIC_SITE_INDEXABLE } from 'astro:env/server';
import { buildRobotsTxt } from '@/lib/robots';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Falta `site` en astro.config.ts.');
  return new Response(buildRobotsTxt({ site, indexable: PUBLIC_SITE_INDEXABLE }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
