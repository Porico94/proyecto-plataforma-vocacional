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