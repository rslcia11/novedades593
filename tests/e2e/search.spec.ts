import { expect, test } from './fixtures';

test('el buscador de la portada sugiere resultados y se navega con el teclado', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('combobox', { name: /Buscar en/ });
  await input.fill('diamantes');
  const options = page.getByRole('listbox', { name: 'Sugerencias' }).getByRole('option');
  await expect(options.first()).toBeVisible();
  await expect(options.first()).toContainText(/diamantes/i);

  await input.press('ArrowDown');
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await input.press('Escape');
  await expect(page.getByRole('listbox', { name: 'Sugerencias' })).toBeHidden();
});

test('enviar el formulario abre la página de resultados', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: /Buscar en/ }).fill('roblox');
  await page.getByRole('button', { name: 'Buscar', exact: true }).click();
  await expect(page).toHaveURL(/\/buscar\/\?q=roblox$/);
  await expect(page.getByRole('status')).toContainText('resultados para "roblox"');
  await expect(page.locator('.hit').first()).toBeVisible();
  await expect(page.locator('.hit mark').first()).toBeVisible();
});

test('la página de resultados encuentra herramientas', async ({ page }) => {
  await page.goto('/buscar/?q=calculadora');
  await expect(page.locator('.hit[href="/herramientas/diamantes/"]')).toContainText(
    'Calculadora de diamantes',
  );
});

test('una búsqueda sin resultados lo dice claramente', async ({ page }) => {
  await page.goto('/buscar/?q=zzzxxyy');
  await expect(page.getByRole('status')).toHaveText('0 resultados para "zzzxxyy"');
  await expect(page.getByText('No encontramos nada')).toBeVisible();
});

test('sin búsqueda, la página propone ejemplos', async ({ page }) => {
  await page.goto('/buscar/');
  await page.getByRole('link', { name: 'roblox', exact: true }).click();
  await expect(page).toHaveURL(/\/buscar\/\?q=roblox$/);
  await expect(page.locator('.hit').first()).toBeVisible();
});
