import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const preguntas = JSON.parse(readFileSync('data/preguntas.json', 'utf-8'));

test.describe('Recarga en la pregunta 1', () => {
  test('vuelve a mostrar la intro inicial', async ({ page }) => {
    await page.goto('/test');
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toBeVisible();

    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByText('Pregunta 1 de 25')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toBeVisible();
  });  
});

test.describe('Restauración del progreso tras recargar', () => {
  test('tras avanzar y recargar, sigue en la pregunta 2', async ({ page }) => {
    await page.goto('/test');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('label').first().click();
    await expect(page.getByRole('radio').first()).toBeChecked();
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText('Pregunta 2 de 25')).toBeVisible();

    await page.reload();
    await expect(page.getByText('Pregunta 2 de 25')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toHaveCount(0);
  });
});

test.describe('Última pregunta de la etapa 1', () => {
  test('recargar en el índice 24 muestra la pregunta 25, no el cierre', async ({ page }) => {
    await page.goto('/test');

    await page.evaluate(() => {
      sessionStorage.setItem('indice', '24');
    });

    await page.reload();

    await expect(page.getByText('Pregunta 25 de 25')).toBeVisible();
    await expect(page.getByText(/Terminaste el bloque/)).toHaveCount(0);
  });
});

test.describe('Cambio de etapa', () => {
  test('Continuar lleva a la primera pregunta de la etapa 2', async ({ page }) => {
    await page.goto('/test');
    await page.evaluate(() => {
      sessionStorage.setItem('indice', '24');
    });
    await page.reload();

    await page.locator('label').first().click();
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(/Terminaste el bloque/)).toBeVisible();

    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByText('Pregunta 1 de 18')).toBeVisible();
    await expect(page.getByText('Etapa 2 de 5')).toBeVisible();
  });
});

test.describe('Índice guardado inválido', () => {
  for (const valor of ['999', '-3', '2.5']) {
    test(`con índice "${valor}" vuelve a la intro inicial`, async ({ page }) => {
      await page.goto('/test');
      await page.evaluate((v) => {
        sessionStorage.setItem('indice', v);
      }, valor);
      await page.reload();

      await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toBeVisible();
    });
  }
});

test.describe('Resultado con test incompleto', () => {
  test('storage vacío: avisa de la pregunta 1 y lleva al test', async ({ page }) => {
    await page.goto('/resultado');
    await expect(page.getByText(/Falta completar la pregunta N° 1/)).toBeVisible();

    await page.getByRole('button', { name: 'Ir al test' }).click();
    await expect(page).toHaveURL(/\/test$/);
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toBeVisible();
  });
});

test.describe('Resultado con test a medias', () => {
  test('con 30 respuestas, el botón lleva a la pregunta 31', async ({ page }) => {
    const respuestas = Object.fromEntries(
      preguntas.slice(0, 30).map((p) => [p.id, 3])
    );

    await page.goto('/resultado');
    await page.evaluate((r) => {
      sessionStorage.setItem('respuestas', JSON.stringify(r));
    }, respuestas);
    await page.reload();

    await expect(page.getByText(/Falta completar la pregunta N° 31/)).toBeVisible();

    await page.getByRole('button', { name: 'Ir al test' }).click();
    await expect(page).toHaveURL(/\/test$/);
    await expect(page.getByText('Pregunta 6 de 18')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toHaveCount(0);
  });
});

test.describe('Reiniciar test', () => {
  test('con las 77 respuestas se ve el resultado, y Reiniciar deja el test vacío', async ({ page }) => {
    const respuestas = Object.fromEntries(
      preguntas.map((p) => [p.id, p.tipo === 'aptitud' ? p.opciones[0] : 3])
    );

    await page.goto('/resultado');
    await page.evaluate((r) => {      
      sessionStorage.setItem('respuestas', JSON.stringify(r));
      sessionStorage.setItem('indice', '40');
    }, respuestas);
    await page.reload();

    await expect(page.getByText(/Falta completar/)).toHaveCount(0);
    await page.getByRole('button', { name: 'Reiniciar test' }).click();

    await expect(page).toHaveURL(/\/test$/);
    await expect(page.getByRole('heading', { name: /Nuevo bloque/ })).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  });
});

test.describe('Botones y error en el test', () => {
  test('pregunta 1: sin Anterior, y el error aparece y desaparece', async ({ page }) => {
    await page.goto('/test');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await expect(page.getByRole('button', { name: 'Anterior' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.locator('p[role="alert"]')).toBeVisible();

    await page.locator('label').first().click();
    await expect(page.locator('p[role="alert"]')).toHaveCount(0);
  });

  test('última pregunta: Siguiente pasa a Ver resultado', async ({ page }) => {
    const respuestas = Object.fromEntries(
      preguntas.slice(0, 76).map((p) => [p.id, p.tipo === 'aptitud' ? p.opciones[0] : 3])
    );

    await page.goto('/test');
    await page.evaluate((r) => {
      sessionStorage.setItem('respuestas', JSON.stringify(r));
      sessionStorage.setItem('indice', '76');
    }, respuestas);
    await page.reload();

    await expect(page.getByRole('button', { name: 'Ver resultado' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Siguiente' })).toHaveCount(0);
  });
});

test.describe('Foco en el título de cada pantalla', () => {
  test('el foco cae en el h2 al cargar, tras Continuar y tras Siguiente', async ({ page }) => {
    await page.goto('/test');
    const titulo = page.getByRole('heading', { level: 2 });

    await expect(titulo).toBeFocused();

    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByText('Pregunta 1 de 25')).toBeVisible();
    await expect(titulo).toBeFocused();

    await page.locator('label').first().click();    
    await expect(page.getByRole('radio').first()).toBeFocused();
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText('Pregunta 2 de 25')).toBeVisible();
    await expect(titulo).toBeFocused();
  });
});

test.describe('Teclado', () => {
  test('Tab desde la opción elegida llega a Siguiente', async ({ page }) => {
    await page.goto('/test');
    await page.getByRole('button', { name: 'Continuar' }).click();

    await page.locator('label').first().click();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeFocused();
  });

  test('en la pregunta 2, Tab pasa por Anterior y luego Siguiente', async ({ page }) => {
    await page.goto('/test');
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.locator('label').first().click();
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText('Pregunta 2 de 25')).toBeVisible();

    await page.locator('label').first().click();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Anterior' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeFocused();
  });
});

test.describe('Estructura y responsive', () => {
  test('un solo main y un h1 "Test vocacional"', async ({ page }) => {
    await page.goto('/test');
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Test vocacional');
  });

  test('sin desborde horizontal a 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/test');
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByText('Pregunta 1 de 25')).toBeVisible();

    const desborde = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(desborde).toBe(0);
  });
});

test.describe('Sendero de progreso', () => {
  test('en la intro de transición, la etapa 1 está hecha y la 2 es la actual', async ({ page }) => {
    await page.goto('/test');
    await page.evaluate(() => { sessionStorage.setItem('indice', '24'); });
    await page.reload();
    await page.locator('label').first().click();
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(/Terminaste el bloque/)).toBeVisible();
    const paradas = page.getByRole('listitem');
    await expect(paradas.nth(0)).toContainText('(hecha)');
    await expect(paradas.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(paradas.nth(2)).toContainText('(pendiente)');
  });
});

test.describe('Alerta de error', () => {
  test('el error se reinserta en cada intento fallido', async ({ page }) => {
    await page.goto('/test');

    // Pregunta 1 con storage vacío: aparece la intro inicial
    await page.getByRole('button', { name: 'Continuar' }).click();

    // 1.er intento: Siguiente sin responder
    await page.getByRole('button', { name: 'Siguiente' }).click();
    const alerta = page.locator('p[role="alert"]');
    await expect(alerta).toBeVisible();
    await alerta.evaluate((nodo) => { nodo.marca = true; });

    // Comprobamos que la marca quedó puesta (un "no está" solo vale si antes "estaba")
    await expect.poll(() => alerta.evaluate((nodo) => nodo.marca)).toBe(true);

    // 2.º intento: mismo texto de error
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(alerta).toBeVisible();

    // Nodo nuevo = sin marca
    await expect.poll(() => alerta.evaluate((nodo) => nodo.marca)).toBeUndefined();
  });
});