import { expect, test } from './fixtures';

test.describe('artículo de guía', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/juegos/minecraft/diamantes-minecraft/');
  });

  test('muestra título, autor, respuesta corta y fecha', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Cómo encontrar diamantes en Minecraft',
    );
    await expect(page.getByRole('link', { name: 'Redacción entretenimiento593' })).toHaveAttribute(
      'href',
      '/autores/redaccion/',
    );
    await expect(page.getByText('Respuesta corta')).toBeVisible();
    await expect(page.locator('.byline time')).toHaveText('Actualizado el 6 de octubre de 2026');
  });

  test('el índice lleva a cada sección del artículo', async ({ page, isMobile }) => {
    const toc = isMobile
      ? page.locator('details.toc-m')
      : page.getByRole('navigation', { name: 'En esta guía' });
    if (isMobile) await toc.locator('summary').click();
    const links = toc.getByRole('link');
    await expect(links).toHaveCount(3);
    await links.nth(2).click();
    // Los id de los títulos conservan las tildes (github-slugger, el mismo criterio de GitHub).
    await expect.poll(() => decodeURIComponent(page.url())).toMatch(/#método-3-cofres$/);
    await expect(page.getByRole('heading', { name: 'Método 3: cofres' })).toBeInViewport();
  });

  test('inserta como máximo dos anuncios dentro del texto, nunca antes del segundo bloque', async ({
    page,
  }) => {
    const inArticle = page.locator('article [data-ad-placement="in-article"]');
    await expect(inArticle).toHaveCount(2);
    const firstAdIndex = await inArticle
      .first()
      .evaluate((ad) => [...(ad.parentElement?.children ?? [])].indexOf(ad));
    expect(firstAdIndex).toBeGreaterThanOrEqual(3); // respuesta corta + índice + 2 bloques
  });

  test('tiene datos estructurados de artículo y migas de pan', async ({ page }) => {
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
    const types = data['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['Article', 'BreadcrumbList']);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  });

  test('"Sigue con" muestra 3 artículos distintos del actual', async ({ page }) => {
    const related = page.getByRole('region', { name: 'Sigue con' }).getByRole('link');
    await expect(related).toHaveCount(3);
    for (const href of await related.evaluateAll((links) => links.map((l) => l.getAttribute('href')))) {
      expect(href).not.toBe('/juegos/minecraft/diamantes-minecraft/');
    }
  });

  test('"¿Te sirvió?" agradece la respuesta', async ({ page }) => {
    await page.getByRole('button', { name: 'Sí', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Gracias' })).toBeVisible();
  });

  test('compartir por WhatsApp usa la URL canónica', async ({ page }) => {
    const href = await page.getByRole('link', { name: 'Compartir por WhatsApp' }).getAttribute('href');
    expect(decodeURIComponent(href ?? '')).toContain('/juegos/minecraft/diamantes-minecraft/');
  });
});

test('las noticias se marcan como NewsArticle', async ({ page }) => {
  await page.goto('/noticias/gta-6-48-dias/');
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(data['@graph'][0]['@type']).toBe('NewsArticle');
});

test('las comparativas muestran el aviso de afiliados', async ({ page }) => {
  await page.goto('/equipo/celulares-free-fire/');
  await expect(page.getByText('Si compras desde nuestros enlaces')).toBeVisible();
  await expect(page.locator('.pick')).toHaveCount(3);
});

test('los códigos activos se copian y los expirados aparecen tachados', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Permisos de portapapeles de Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/juegos/roblox/codigos-roblox/');
  await expect(page.locator('[data-status="active"] .code')).toHaveCount(5);
  await expect(page.locator('[data-status="expired"] .code.off')).toHaveCount(2);

  const button = page.getByRole('button', { name: 'Copiar código LOBBY593' });
  await button.click();
  await expect(button).toHaveText('Copiado ✓');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('LOBBY593');
});

test('un viral muestra el clip, texto propio y más virales', async ({ page }) => {
  await page.goto('/virales/batalla-ultimo-segundo/');
  await expect(page.getByRole('img', { name: /Clip de 0:42/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Si te gustó, esto te sirve' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Más virales' }).getByRole('listitem')).toHaveCount(4);
});

test('el perfil del creador lista sus artículos', async ({ page }) => {
  await page.goto('/autores/yeri-loco/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Yeri Loco');
  await expect(page.locator('#contenido .row')).toHaveCount(6);
});
