import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas en navegador contra el sitio construido (`npm run build` antes),
 * tal como lo verá la gente: con el índice de búsqueda y la CSP reales.
 */
const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-EC',
    timezoneId: 'America/Guayaquil',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // --ignore-lock mantiene el servidor en primer plano: Astro 7 lo manda a segundo plano
    // cuando detecta que lo ejecuta un agente, y Playwright lo tomaría como que terminó.
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
