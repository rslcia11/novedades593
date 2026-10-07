import { expect, test } from './fixtures';

test.describe('calculadora de diamantes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/herramientas/diamantes/');
  });

  test('calcula diamantes y dólares mientras se escribe', async ({ page }) => {
    const input = page.getByLabel('Monedas que te regalaron');
    await expect(page.locator('[data-diamonds]')).toHaveText('10.000');
    await expect(page.locator('[data-usd]')).toContainText('50,00');

    await input.fill('3000');
    await expect(page.locator('[data-diamonds]')).toHaveText('1.500');
    await expect(page.locator('[data-usd]')).toContainText('7,50');

    await input.fill('');
    await expect(page.locator('[data-diamonds]')).toHaveText('0');
  });

  test('los valores rápidos llenan el campo', async ({ page }) => {
    await page
      .getByRole('group', { name: 'Valores rápidos' })
      .getByRole('button', { name: '100.000' })
      .click();
    await expect(page.getByLabel('Monedas que te regalaron')).toHaveValue('100000');
    await expect(page.locator('[data-usd]')).toContainText('250,00');
  });

  test('el modo batalla suma puntos, cambia quién gana y se reinicia', async ({ page }) => {
    const status = page.locator('[data-status]');
    await expect(status).toHaveText('ganando');
    await expect(page.locator('[data-gap]')).toContainText('6,50');
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /al rival/ }).click();
    await expect(page.locator('[data-rival]')).toHaveText('12.800');
    await expect(status).toHaveText('perdiendo');
    await page.getByRole('button', { name: 'Reiniciar' }).click();
    await expect(page.locator('[data-rival]')).toHaveText('9.800');
    await expect(status).toHaveText('ganando');
  });
});

test('el generador de nombres actualiza todos los estilos y copia el elegido', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/herramientas/nombres/');
  await page.getByLabel('Escribe tu nombre').fill('Yeri');
  const bold = page.locator('[data-style="negrita"]');
  await expect(bold.locator('[data-output]')).toHaveText('𝗬𝗲𝗿𝗶');
  await expect(page.locator('[data-style="corchetes"] [data-output]')).toHaveText('『Yeri』');
  await bold.getByRole('button', { name: 'Copiar estilo Negrita' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('𝗬𝗲𝗿𝗶');

  await page.getByLabel('Escribe tu nombre').fill('');
  await expect(bold.locator('[data-output]')).toHaveText('𝗚𝗮𝗺𝗲𝗿𝟱𝟵𝟯');
});

test('el recomendador de celular cambia según juego y presupuesto', async ({ page }) => {
  await page.goto('/herramientas/celular/');
  await expect(page.locator('[data-tier]')).toHaveText('Gama media');
  await page.getByRole('button', { name: 'Minecraft' }).click();
  await page.getByRole('button', { name: 'Menos de $150' }).click();
  await expect(page.getByRole('button', { name: 'Minecraft' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Free Fire' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-tier]')).toHaveText('Gama de entrada');
  await expect(page.locator('[data-advice]')).toContainText('Minecraft corre en gráficos bajos');
  await page.getByRole('link', { name: 'Ver los modelos que probamos' }).click();
  await expect(page).toHaveURL(/\/equipo\/celulares-free-fire\/$/);
});

test('la cuenta regresiva de GTA VI muestra números reales', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-07T12:30:00-05:00'));
  await page.goto('/juegos/gta6/');
  const timer = page.getByRole('timer').first();
  await expect(timer.locator('[data-unit="days"]')).toHaveText('42');
  await expect(timer.locator('[data-unit="hours"]')).toHaveText('11');
  await expect(timer.locator('[data-unit="minutes"]')).toHaveText('30');
});

test('los filtros de un juego muestran solo los artículos de esa etiqueta', async ({ page }) => {
  await page.goto('/juegos/roblox/');
  const rows = page.locator('#game-list [data-article]');
  const total = await rows.count();
  await page
    .getByRole('group', { name: 'Filtrar artículos' })
    .getByRole('button', { name: 'Seguridad' })
    .click();
  const visible = page.locator('#game-list [data-article]:visible');
  await expect(visible).not.toHaveCount(total);
  for (const tag of await visible.evaluateAll((els) => els.map((e) => e.getAttribute('data-tag')))) {
    expect(tag).toBe('Seguridad');
  }
  await page.getByRole('button', { name: 'Todo' }).click();
  await expect(page.locator('#game-list [data-article]:visible')).toHaveCount(total);
});
