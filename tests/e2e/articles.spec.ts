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
    await expect(links).toHaveCount(6);
    await links.nth(3).click();
    // Los id de los títulos conservan las tildes (github-slugger, el mismo criterio de GitHub).
    await expect.poll(() => decodeURIComponent(page.url())).toMatch(/#método-3-cofres-de-estructuras$/);
    await expect(page.getByRole('heading', { name: 'Método 3: cofres de estructuras' })).toBeInViewport();
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
  await page.goto('/noticias/gta-6-precarga-precio/');
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(data['@graph'][0]['@type']).toBe('NewsArticle');
});

test('cada artículo cita sus fuentes con enlaces', async ({ page }) => {
  await page.goto('/creadores/kick-twitch-tiktok/');
  const sources = page.locator('.sources a');
  expect(await sources.count()).toBeGreaterThanOrEqual(3);
  for (const href of await sources.evaluateAll((links) => links.map((l) => l.getAttribute('href')))) {
    expect(href).toMatch(/^https:\/\//);
  }
  // Los enlaces que abren otra pestaña lo avisan a los lectores de pantalla.
  await expect(sources.first()).toContainText('se abre en otra pestaña');
});

test('la portada del artículo es una imagen optimizada y se usa para redes', async ({ page }) => {
  await page.goto('/juegos/minecraft/diamantes-minecraft/');
  const cover = page.locator('.a-cover img');
  await expect(cover).toHaveAttribute('alt', /diamante/);
  await expect(cover).toHaveAttribute('srcset', /\.webp/);
  expect(await cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogImage).toMatch(/\/_astro\/.+\.jpg$/);
});

test('el botón "Copiar enlace" copia la URL canónica', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/juegos/roblox/codigos-roblox/');
  // Se ubica por su función y no por el texto, que cambia a "Copiado ✓" al hacer clic.
  const button = page.locator('.share [data-copy]');
  await expect(button).toHaveText('Copiar enlace');
  await button.click();
  await expect(button).toHaveText('Copiado ✓');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /\/juegos\/roblox\/codigos-roblox\/$/,
  );
});

test('el perfil de la redacción lista todos sus artículos', async ({ page }) => {
  await page.goto('/autores/redaccion/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Redacción entretenimiento593');
  await expect(page.locator('#contenido .row')).toHaveCount(20);
});

test('un autor sin artículos muestra un mensaje en vez de una lista vacía', async ({ page }) => {
  await page.goto('/autores/yeri-loco/');
  await expect(page.getByText('Todavía no hay artículos firmados')).toBeVisible();
});

test('en celular, las migas de pan no repiten el título del artículo', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Solo en celular.');
  await page.goto('/juegos/minecraft/diamantes-minecraft/');
  const crumbs = page.getByRole('navigation', { name: 'Migas de pan' });
  await expect(crumbs.locator('[aria-current="page"]')).toBeHidden();
  await expect(crumbs.getByRole('link', { name: 'Minecraft' })).toBeVisible();
});
