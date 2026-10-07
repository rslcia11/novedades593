/**
 * Content Security Policy del sitio.
 *
 * Astro agrega por su cuenta los hashes de los scripts y estilos que procesa
 * (`script-src` y `style-src`); aquí solo se declaran las fuentes externas permitidas.
 * Docs: https://docs.astro.build/en/reference/configuration-reference/#securitycsp
 *
 * `frame-ancestors` no funciona dentro de una etiqueta <meta>, por eso vive en `public/_headers`.
 */

import type { AstroUserConfig } from 'astro';

type AdsProvider = string;
type CspConfig = Exclude<NonNullable<AstroUserConfig['security']>['csp'], boolean | undefined>;
type CspDirective = NonNullable<CspConfig['directives']>[number];

/** Dominios que usa AdSense para cargar anuncios, medir y mostrar el mensaje de consentimiento. */
const ADSENSE_SCRIPT_HOSTS = [
  'https://pagead2.googlesyndication.com',
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.gstatic.com',
  'https://*.adtrafficquality.google',
  'https://fundingchoicesmessages.google.com',
];

const ADSENSE_FRAME_HOSTS = [
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.google.com',
  'https://*.adtrafficquality.google',
];

const ADSENSE_CONNECT_HOSTS = [
  'https://*.google.com',
  'https://*.googlesyndication.com',
  'https://*.doubleclick.net',
  'https://*.adtrafficquality.google',
];

/** Reproductores oficiales permitidos para clips insertados. */
const EMBED_FRAME_HOSTS = ['https://www.youtube-nocookie.com', 'https://www.tiktok.com'];

/** Fuentes de `script-src`. `wasm-unsafe-eval` lo necesita Pagefind para su buscador en WebAssembly. */
export function scriptSources(provider: AdsProvider): string[] {
  const base = ["'self'", "'wasm-unsafe-eval'"];
  return provider === 'adsense' ? [...base, ...ADSENSE_SCRIPT_HOSTS] : base;
}

/**
 * Fuentes de `style-src`. AdSense inserta estilos en línea en sus anuncios, así que con AdSense
 * activo hay que permitir 'unsafe-inline' (Astro deja de emitir hashes en esa directiva).
 */
export function styleSources(provider: AdsProvider): string[] {
  return provider === 'adsense' ? ["'self'", "'unsafe-inline'"] : ["'self'"];
}

export function buildCspDirectives(provider: AdsProvider): CspDirective[] {
  const ads = provider === 'adsense';
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'self'",
    "font-src 'self'",
    ads ? "img-src 'self' data: https:" : "img-src 'self' data:",
    `connect-src ${["'self'", ...(ads ? ADSENSE_CONNECT_HOSTS : [])].join(' ')}`,
    `frame-src ${[...EMBED_FRAME_HOSTS, ...(ads ? ADSENSE_FRAME_HOSTS : [])].join(' ')}`,
    'upgrade-insecure-requests',
  ];
}
