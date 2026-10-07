import { expect, test } from './fixtures';

test('la navegación lleva a cada sección y marca la sección actual', async ({ page, isMobile }) => {
  test.skip(isMobile, 'En celular la navegación está en la barra inferior (ver prueba de celular).');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  for (const name of ['Juegos', 'Equipo', 'Creadores', 'Noticias', 'Virales', 'Herramientas']) {
    await nav.getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(nav.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
  }
});

test('una guía marca "Juegos" como sección actual y tiene migas de pan', async ({ page, isMobile }) => {
  await page.goto('/juegos/minecraft/diamantes-minecraft/');
  const crumbs = page.getByRole('navigation', { name: 'Migas de pan' });
  await expect(crumbs.getByRole('link')).toHaveText(['Inicio', 'Juegos', 'Minecraft']);
  if (!isMobile) {
    await expect(
      page.getByRole('navigation', { name: 'Secciones' }).getByRole('link', { name: 'Juegos' }),
    ).toHaveAttribute('aria-current', 'page');
  }
});

test('en celular, la barra inferior y el menú funcionan', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Solo en celular.');
  await page.goto('/');
  const tabbar = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(tabbar).toBeVisible();
  await expect(tabbar.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');

  await tabbar.getByRole('button', { name: 'Menú' }).click();
  const menu = page.getByRole('dialog', { name: 'Menú' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  await tabbar.getByRole('button', { name: 'Menú' }).click();
  await menu.getByRole('link', { name: /Noticias/ }).click();
  await expect(page).toHaveURL(/\/noticias\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Noticias');
});

test('el enlace "Ir al contenido" lleva al contenido principal', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Navegación con teclado.');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Ir al contenido' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#contenido$/);
});

test('el atajo "/" enfoca el buscador', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Atajo de teclado.');
  await page.goto('/');
  await page.keyboard.press('/');
  await expect(page.getByRole('combobox', { name: /Buscar en/ })).toBeFocused();
});
