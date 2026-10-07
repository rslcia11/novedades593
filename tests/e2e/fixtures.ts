import { test as base, expect } from '@playwright/test';

/**
 * Cada prueba falla si la página registra errores de consola, errores de JavaScript
 * o violaciones de la Content Security Policy.
 */
export const test = base.extend<{ consoleErrors: string[]; allowedConsoleErrors: RegExp[] }>({
  /** Errores esperados en una prueba concreta (por ejemplo, el 404 de la página de error). */
  allowedConsoleErrors: [[], { option: true }],
  consoleErrors: [
    async ({ page, allowedConsoleErrors }, use) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        const text = message.text();
        if (message.type() === 'error' && !allowedConsoleErrors.some((re) => re.test(text)))
          errors.push(text);
      });
      page.on('pageerror', (error) => errors.push(error.message));
      await use(errors);
      expect(errors, 'errores en la consola del navegador').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Páginas representativas de cada plantilla del sitio. */
export const KEY_PAGES = [
  '/',
  '/juegos/',
  '/juegos/roblox/',
  '/juegos/gta6/',
  '/juegos/minecraft/diamantes-minecraft/',
  '/juegos/roblox/codigos-roblox/',
  '/equipo/',
  '/equipo/internet-para-jugar/',
  '/creadores/',
  '/creadores/cuanto-paga-tiktok-live/',
  '/noticias/',
  '/noticias/gta-6-precarga-precio/',
  '/virales/',
  '/herramientas/',
  '/herramientas/diamantes/',
  '/herramientas/nombres/',
  '/herramientas/celular/',
  '/buscar/',
  '/autores/yeri-loco/',
  '/quienes-somos/',
  '/como-trabajamos/',
  '/privacidad/',
  '/anuncia/',
];
