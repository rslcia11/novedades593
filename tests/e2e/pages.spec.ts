import AxeBuilder from '@axe-core/playwright';
import { KEY_PAGES, expect, test } from './fixtures';

test.describe('todas las plantillas', () => {
  for (const path of KEY_PAGES) {
    test(`${path} carga bien, con SEO básico y sin problemas de accesibilidad`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{30,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', 'es');

      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const block of jsonLd) expect(() => JSON.parse(block)).not.toThrow();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'la página no debe desbordarse hacia los lados').toBeLessThanOrEqual(0);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
    });
  }
});

test.describe('página de error', () => {
  // El navegador registra el 404 del propio documento: es justo lo que se prueba.
  test.use({ allowedConsoleErrors: [/status of 404/] });

  test('una URL que no existe muestra la página 404', async ({ page }) => {
    const response = await page.goto('/no-existe-esta-pagina/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esa página');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test('mientras el sitio no se publica, nada se indexa', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toBe('User-agent: *\nDisallow: /\n');
});

test('los archivos para Google y lectores de RSS existen y son válidos', async ({ request }) => {
  for (const path of ['/sitemap-index.xml', '/sitemap-0.xml', '/rss.xml', '/news-sitemap.xml']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text(), path).toMatch(/^<\?xml/);
  }
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  expect(sitemap).toContain('/juegos/minecraft/diamantes-minecraft/');
  expect(sitemap).not.toContain('/buscar/');
});
