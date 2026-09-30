import { test, expect } from '@playwright/test';

test.describe('Landing: estructura semántica', () => {
  test('tiene un único h1 visible', async ({ page }) => {
    await page.goto('/');

    const h1 = page.getByRole('heading', { level: 1 });

    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
  });
});

test.describe('Landing: navegación por teclado', () => {
  test('Tab lleva el foco al CTA y muestra el anillo', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');

    const cta = page.getByRole('link', { name: /Empieza tu test/i });

    await expect(cta).toBeFocused();
    await expect(cta).not.toHaveCSS('box-shadow', 'none');
  });
});

test.describe('Landing: responsive', () => {
  test('no genera scroll horizontal', async ({ page }) => {
    await page.goto('/');

    const desborde = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );

    expect(desborde).toBeLessThanOrEqual(0);
  });

  test('el CTA queda dentro del viewport', async ({ page }) => {
    await page.goto('/');

    const cta = page.getByRole('link', { name: /empieza tu test/i });
    const caja = await cta.boundingBox();
    const viewport = page.viewportSize();

    expect(caja).not.toBeNull();
    expect(caja.x).toBeGreaterThanOrEqual(0);
    expect(caja.x + caja.width).toBeLessThanOrEqual(viewport.width);
  });
});

test.describe('Landing: hover y reduced-motion', () => {
  test.skip(({ isMobile }) => isMobile, 'El hover no aplica en táctil');

  const escalaDelFondo = (cta) =>
    cta.evaluate((el) => getComputedStyle(el, '::before').scale);

  test('con movimiento normal, el hover escala el fondo', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /empieza tu test/i });

    await cta.hover();

    await expect.poll(() => escalaDelFondo(cta)).toBe('1.04');
  });

  test('con reduced-motion, el hover no escala', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const cta = page.getByRole('link', { name: /empieza tu test/i });

    await cta.hover();

    await expect.poll(() => escalaDelFondo(cta)).toBe('none');
  });
});

test('el CTA lleva a /test', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /empieza tu test/i }).click();

  await expect(page).toHaveURL('/test');  
});