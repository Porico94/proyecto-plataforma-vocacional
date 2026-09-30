# CONTEXT.md — Plataforma de Orientación Vocacional

## Definición del proyecto (Fase 1 — fija, no cambia)

- Problema que resuelve: Los estudiantes de secundaria en Perú (15-18 años) eligen carrera técnica o universitaria sin criterio real, guiados por marketing/moda, sin considerar mercado laboral, aptitudes reales ni factores personales — lo que puede traducirse en años y dinero perdidos (caso real: el creador estudió Ingeniería Mecatrónica en 2011 guiado por marketing, sin encontrar mercado laboral al graduarse).
- Para quién es: Estudiantes peruanos de colegio a punto de decidir carrera técnica o universitaria. Caso semilla: un familiar del creador. Objetivo final: todos los estudiantes del Perú.
- Propuesta de valor: A diferencia del test vocacional típico (percibido como poco objetivo), esta plataforma combina múltiples dimensiones psicométricas + datos reales de mercado laboral peruano + experiencias reales de profesionales (foros), para dar una recomendación con criterio, no genérica.
- MVP (alcance inicial): Test completo (personalidad, RIASEC, aptitudes cognitivas, inteligencias múltiples, valores) → motor de recomendación contra dataset estático de carreras → resultado descargable en PDF. Sin registro/login. Usuarios: grupo cerrado de beta testers.
- Qué NO incluye el MVP: Registro/login/autenticación, persistencia de resultados en base de datos, integración de datos de mercado laboral **en tiempo real**, análisis de foros con IA, apertura a público general, restricciones personales como input del algoritmo (eliminado del proyecto por completo), filtros de estilo de vida (post-MVP), dimensiones `motivaciones` y `estilo_aprendizaje` (eliminadas del test).
- Objetivos corto/mediano plazo:
  - Corto plazo: MVP funcional de punta a punta para que el familiar del creador y 3-5 beta testers más lo prueben y den feedback real.
  - Mediano plazo: Iterar el motor de recomendación según feedback recibido, luego iniciar primer feature post-MVP (probablemente mercado laboral, o sistema de filtros de estilo de vida). El catálogo de `carreras.json` seguirá creciendo post-MVP.

## Investigación (Fase 2 — fija, no cambia)

- Competidores/referencias analizados: Ponte en Carrera (MTPE/Minedu), Mi Carrera (Ministerio de Trabajo), tests de universidades privadas (UCV/ISIL/UPN), EstudiaPerú, TestVocacional.app.
- Lo bueno (para aprender): Combinar varias metodologías psicométricas en un solo perfil da más solidez que un test único. Integrar datos reales de mercado laboral aporta valor concreto. Sin registro / fricción mínima al inicio mejora la conversión. Resultado descargable como alternativa a cuentas de usuario.
- Lo malo (para evitar): Fragmentar el test en varias pruebas sueltas y desconectadas. Sesgo de negocio disfrazado de orientación objetiva (universidades privadas). Profundidad sacrificada por velocidad. UX anticuada en plataformas del Estado.
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales como parte del algoritmo (descartado como input del score, ver Reglas de negocio). Ninguna combina test multidimensional completo + mercado laboral peruano + experiencias reales de profesionales, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas (actualizada):

/app
/page.js → ✅ Fase 6 (Responsive + Accesibilidad), Fase 7 (Animaciones) y Fase 8 (Testing) COMPLETAS. Solo renderiza el Hero (imports de `ComoFunciona`/`CtaFinal` ya limpiados — componentes construidos pero desconectados de la landing por decisión de Pool, revisión diferida indefinidamente, sin imagen decidida aún). Header sin link de navegación por ancla. Contraste verificado (texto-claro/70 y /60 sobre bg-noche pasan AA con margen, sin cambios necesarios). Foco de teclado visible implementado y cubierto por test. CTA del Hero (`<a href="/test">` vía enlace) con microinteracción de hover (`::before` decorativo + `scale`/`shadow`), `motion-safe:` aplicado correctamente al `scale` — `prefers-reduced-motion` funcional y cubierto por test.
/layout.js → ✅ Completo: fuentes Literata (`--font-voz`) y Karla (`--font-cuerpo`) cargadas vía `next/font/google`, `lang="es"`, metadata con nombre de marca.
/globals.css → ✅ Completo: tokens de marca en `@theme` (colores noche/papel/amanecer/musgo/texto-claro/texto-oscuro, fuentes voz/cuerpo), reemplazando el scaffold default de Next (sin modo claro/oscuro automático, no aplica al proyecto). Nota: el warning de editor "Unknown at rule @theme" es falso positivo, no bloquea el build.
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo (estilos Tailwind pendientes) — próximo feature en la cola, ciclo Fase 4-9 completo pendiente
/resultado/page.jsx → ✅ Completo (Parte 14): `<ConsejoVocacional/>` integrado, `obtenerTop10Carreras` conectado. Estilos Tailwind pendientes. Feature en cola, después de Test.
/components
/landing/
ComoFunciona.jsx → 🔶 Contenido/estilos diseñados en Fase 6 - Parte 2 (mensaje de confianza "Preguntas dinámicas y directas..."). Construido pero NO importado/renderizado en `page.js` actualmente. Decisión de reintegrarlo diferida indefinidamente.
CtaFinal.jsx → 🔶 Contraste y tamaño de botón corregidos en Fase 6 - Parte 2. Construido pero NO importado/renderizado en `page.js` actualmente. Misma decisión diferida.
/test/
PreguntaLikert.jsx → ✅ Completo. ⚠️ Pendiente (fuera de este feature): no indica al estudiante qué significan los extremos de la escala 1-5. Se resuelve al abrir el ciclo Fase 4-9 del feature Test.
PreguntaOpciones.jsx → ✅ Completo
/resultado/
ConsejoVocacional.jsx → ✅ Contenido y estructura completos. Estilos Tailwind pendientes de aplicar.
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo
recomendacion.ts → ✅ Completo
normalizar.ts → ✅ Completo
constants.ts → ✅ Completo
types.ts → ✅ Completo
/data
preguntas.json → ✅ 77 preguntas, 5 dimensiones activas (`personalidad` 25, `riasec` 18, `inteligencias_multiples` 16, `aptitudes` 12, `valores` 6).
carreras.json → 🔶 46 entradas. Array plano de objetos; cada carrera tiene `riasec`/`aptitudes`/`personalidad` como objetos `{subdimension: numero}` (Grupo A), `inteligencias_multiples`/`valores` como arrays de strings (Grupo B), más `universidades`, `sectoresEmpleo`. Campo opcional `notaCobertura` en 19/46 entradas. `sectoresEmpleo` es puramente informativo — no se usa en el score ni se muestra aún en el resultado.
/tests
landing.spec.js → ✅ (NUEVO, Fase 8) 7 tests en 5 grupos: estructura semántica (h1 único), navegación por teclado (Tab → CTA + anillo), responsive (sin scroll horizontal, CTA dentro del viewport), hover/reduced-motion (2 tests, solo escritorio), navegación del CTA a `/test`. Corren en 2 proyectos → 14 tests, 12 pasan + 2 omitidos a propósito (hover en móvil).
/playwright.config.js → ✅ (NUEVO, Fase 8) `testDir: './tests'`, `baseURL: http://localhost:3000`, `webServer` con `npm run dev` + `reuseExistingServer: !process.env.CI`, reporter html, 2 proyectos: `chromium` (`Desktop Chrome`) y `Mobile Chrome` (`Pixel 5`).
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, **Playwright (configurado y en uso desde Fase 8; Pool ya lo había aprendido en el proyecto de Aprendizaje)**, Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- **Identidad visual de marca (Parte 15):**
  - Nombre: **Oriéntame.pe**
  - Paleta: `noche` #14171F (fondo base), `papel` #E8E2D3 (superficie clara alterna), `amanecer` #D9A441 (acento primario/CTA sobre fondo oscuro), `musgo` #5B8C7B (acento secundario/detalle), `texto-claro` #F2EFE6, `texto-oscuro` #1E2027.
  - Tipografía: **Literata** (serif, `--font-voz`) para titulares/voz editorial; **Karla** (sans, `--font-cuerpo`) para cuerpo de texto.
  - Regla de contraste de botones: el color del CTA se adapta al fondo de su propia sección — no es una regla fija de "siempre un color", sino de contraste local.
- Decisiones técnicas importantes y por qué:
  - **Tailwind v4 no usa `tailwind.config.js`** — toda la configuración de tema vive en `globals.css` dentro de un bloque `@theme`.
  - **Sin modo claro/oscuro automático por `prefers-color-scheme`** — decisión de marca fija.
  - **`next/font` es stack nuevo para Pool** — pendiente de estudio aislado en el proyecto de Aprendizaje.
  - **Patrón "container": ancho de sección vs. ancho de contenido.**
  - **Un solo `<h1>` por página con jerarquía semántica real.**
  - **Listas reales (`<ul>`/`<li>`) para contenido enumerado.**
  - **Jerarquía visual de CTA principal.**
  - **Ritmo de fondo entre secciones:** alternar `noche`/`papel` en secciones consecutivas para evitar fusión visual (aplica cuando haya más de una sección — hoy la landing es solo Hero, pero la regla queda para Test/Resultado).
  - **Redundancia de copy entre secciones:** revisar qué ya dice cada sección antes de escribir la siguiente.
  - **Foco de teclado:** patrón estándar para CTAs sobre fondo de color sólido: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-acento] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-fondo-sección]` — el `ring-offset` debe ser del color de fondo de la sección, no un valor genérico. `ring-2`/`ring-offset-2` definen el **grosor** (sin ellos el `box-shadow` computado es `none`); las clases de color solas no producen anillo.
  - **Método de verificación de contraste:** para texto con opacidad Tailwind (`/70`, `/60`), calcular primero el color resultante de mezclar texto y fondo (opacidad×texto + (1-opacidad)×fondo, por canal RGB), y evaluar ese color contra WCAG AA (4.5:1 texto normal, 3:1 texto grande) en WebAIM Contrast Checker.
  - **Patrón de microinteracción hover sin blur de texto (Fase 7):** nunca aplicar `transform`/`scale` directamente a un elemento que contiene texto — usar un `::before` decorativo (`before:content-['']`, `before:absolute before:inset-0 before:-z-10`, `relative isolate` en el padre) que lleva fondo/shadow y recibe el `scale`. Motivo: `transform`/`will-change: transform` promueve el elemento a capa GPU y el texto pasa de subpíxeles a escala de grises (borroso).
  - **`motion-safe:` solo envuelve movimiento/tamaño (Fase 7):** el `scale` va dentro de `motion-safe:hover:before:scale-[...]`; el `box-shadow` queda fuera porque `prefers-reduced-motion` cubre movimiento/posición, no cambios estáticos como color o sombra.
  - **Tailwind v4 y `hover:` en móvil (Fase 7):** el variant `hover:` solo se activa bajo `@media (hover: hover) and (pointer: fine)` por defecto.
  - **(NUEVO, Fase 8) Decisiones de testing con Playwright:**
    - **`getByRole` sobre `locator('h1')`:** prueba lo que percibe un lector de pantalla (rol implícito/explícito + nombre accesible), no solo la etiqueta. `getByRole` ignora elementos ocultos por defecto. `level` busca el nivel de encabezado calculado (h1=1… o `aria-level`), no el nombre de la etiqueta.
    - **Locators estrictos:** si un locator resuelve a más de un elemento, Playwright lanza _strict mode violation_ en vez de elegir uno. Se arregla afinando (`name`, buscar dentro de una región), y `.first()`/`.nth()` solo de forma explícita.
    - **`keyboard.press('Tab')` en vez de `focus()`:** `focus()` prueba que el elemento _puede_ tener foco; `Tab` prueba que el usuario _llega_ a él en el orden real, y `:focus-visible` se comporta como con teclado real.
    - **El anillo de foco se verifica con `not.toHaveCSS('box-shadow', 'none')`** (Tailwind implementa `ring` con `box-shadow`). Prueba que existe _algún_ anillo, no que su color sea correcto (eso es revisión visual).
    - **`page.evaluate`** para medir lo que ningún locator expresa (`scrollWidth - clientWidth` para desborde horizontal; `getComputedStyle(el, '::before').scale` para el pseudo-elemento del patrón anti-blur). Tailwind v4 implementa `scale-[…]` con la propiedad CSS `scale`, no con `transform`.
    - **Dos proyectos (escritorio + Pixel 5):** el mismo test se adapta vía `page.viewportSize()`; el desborde provocado con `w-[600px]` solo falló en móvil, demostrando el valor de tener ambos.
    - **`test.skip(({ isMobile }) => isMobile)`** para los tests de hover: el proyecto táctil nunca activa `hover:` en Tailwind v4.
    - **`page.emulateMedia({ reducedMotion: 'reduce' })` antes de `goto`** para que la página nazca con la preferencia.
    - **Aserciones _web-first_ (`await expect(locator)…`, `expect.poll`, `toHaveURL`) reintentan** hasta cumplirse o vencer el timeout (5 s); `expect(valor).toBe()` es síncrono y evalúa una sola vez. Por eso no se usan esperas manuales.
    - **Regla de calidad: todo test se hace fallar a propósito (prueba de mutación) antes de darse por bueno.** Hecho en Fase 8: quitar `ring-2`/`ring-offset-2` → falla teclado; `w-[600px]` → falla responsive solo en móvil; quitar `motion-safe:` → falla reduced-motion.
    - **Qué NO se prueba automatizado:** color correcto del anillo, "se ve bonito", fluidez de la animación — siguen siendo revisión visual manual. Criterio general: se prueba lo que un error pasa desapercibido y afecta a usuarios reales, no decisiones de diseño.
    - **Tests ≠ CI/CD:** hoy se corren a mano con `npx playwright test`. CI (GitHub Actions corriendo los tests en cada push/PR) y CD (Vercel) son pasos posteriores; la config ya tiene las piezas (`process.env.CI`, `retries`, `forbidOnly`).
    - **`.gitignore`:** deben estar `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`.
  - Se mantienen las decisiones de Parte 13-14: motor dividido en Grupo A/B, top 10 fijo, cálculos costosos en `useEffect`+estado propio.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: **Landing page**
- Fase actual: **Fase 8 (Testing) — ✅ COMPLETA.** Siguiente: Fase 9 (Deploy/Merge).
- En lo que se trabajó en esta sesión (Fase 8):
  - Playwright instalado y configurado (`playwright.config.js` con `webServer`, `baseURL`, proyectos `chromium` y `Mobile Chrome`/Pixel 5). Aclarado el modelo mental de config: todo cuelga de un único objeto en `defineConfig({...})`; `use` raíz y `use` de proyecto se combinan; `devices['Mobile Chrome']` no existe (el preset es `'Pixel 5'`; spread de `undefined` no da error y deja un proyecto "móvil" sin emulación).
  - Tests escritos y verificados con fallo provocado: semántica (h1 único), teclado (Tab → CTA + anillo), responsive (2 tests), hover/reduced-motion (2 tests), navegación del CTA a `/test`.
  - Checkpoints de comprensión superados. Preguntas de entrevista hechas (strict mode, `toBe` vs aserciones web-first, test de navegación). Punto a reforzar: dar el ejemplo concreto de código además de la idea.
  - Commits de la fase: `test: add Playwright config and landing semantic/keyboard tests`, `test: add responsive landing tests for horizontal overflow`, `test: add hover and prefers-reduced-motion tests for hero CTA`, `test: add CTA navigation test to landing` (este último pendiente de confirmar que corre verde antes de pushear).

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación — Parte 11.
- [x] Redacción e implementación de `ConsejoVocacional.jsx` — Parte 11.
- [x] Integración de `<ConsejoVocacional/>` en `resultado/page.jsx` — Parte 12.
- [x] Eliminación de `motivaciones`/`estilo_aprendizaje`; renombre de claves de `carreras.json` — Parte 13.
- [x] Motor de recomendación completo (`recomendacion.ts`) — Parte 13.
- [x] Conexión de `obtenerTop10Carreras` en `resultado/page.jsx` — Parte 14.
- [x] Identidad visual de marca definida (Oriéntame.pe: paleta, tipografía) — Parte 15.
- [x] Landing page — Fase 4 (Diseño UI) y Fase 5 (Desarrollo) completas — Parte 15.
- [x] Landing page — Fase 6 (Responsive + Accesibilidad) COMPLETA — Fase 6, Partes 1 y 2.
- [x] Landing page — Fase 7 (Animaciones) COMPLETA: microinteracción de hover en el CTA con patrón `::before` + `motion-safe:` — Fase 7, Parte 1.
- [x] **Landing page — Fase 8 (Testing) COMPLETA**: Playwright configurado, 7 tests × 2 proyectos (12 pasan, 2 omitidos a propósito), todos verificados con fallo provocado — Fase 8, Parte 1.

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas, se agregan:)

- La comunicación pública del proyecto (landing, copy) evita marketing comparativo o defensivo frente a competidores. El foco debe estar siempre en ayudar al estudiante.
- Tono de voz del proyecto: directo y sin rodeos ("cero floro"), sin mensajes largos, poéticos o reflexivos.
- El color de los CTAs se decide por contraste contra el fondo local de su sección, no por una regla fija de color único en todo el sitio.
- Patrón de ancho: secciones full-bleed (`w-full` sin límite) + contenedor interno con `max-w` para el contenido de texto.
- Secciones consecutivas no deben compartir el mismo color de fondo sin un elemento de separación — se prefiere alternar `noche`/`papel`.
- Cualquier afirmación en el copy sobre "datos reales" o metodología debe verificarse contra lo que el motor de recomendación realmente usa en el score.
- `ComoFunciona.jsx` puede incluir un mensaje breve de confianza/diferenciación (sin nombrar competidores) — reemplaza la decisión de "Sin sección de Diferenciación" de Parte 15, aunque hoy no está en uso.
- El deploy (Fase 9) de un feature NO implica lanzamiento público — el proyecto sigue privado hasta que Pool decida compartir el link, alineado con la regla de MVP de "sin apertura a público general".
- Cualquier microinteracción de hover sobre un elemento con texto sigue el patrón `::before` documentado en Decisiones técnicas — no se anima el texto directamente, nunca.
- **(NUEVO)** Todo test nuevo se hace fallar a propósito antes de darse por bueno (prueba de mutación). Un test que nunca se vio fallar no cuenta como protección.
- **(NUEVO)** Cada feature con UI incluye, en su Fase 8, como mínimo: estructura semántica, navegación por teclado y responsive en los dos proyectos (escritorio + móvil); el feature Test sumará flujos con estado.
- Se mantienen las reglas de Parte 13-14: comparación estudiante↔carrera dividida en dos grupos; un solo `<h1>` por página; toda dimensión del test debe tener razón de uso clara.

## Próximo paso concreto

Antes de abrir el chat: correr `npx playwright test` (esperado: 14 tests, 12 pasados, 2 omitidos), hacer el commit del test de navegación del CTA (`test: add CTA navigation test to landing`) y subir todo con push. Luego abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión". Empezar **Fase 9 (Deploy/Merge)** del feature Landing: decidir si Vercel se conecta ahora al repo y si vale la pena configurar CI (GitHub Actions corriendo Playwright) o dejarlo hasta el feature Test, que tendrá flujos con estado; recordar que el deploy no implica lanzamiento público. Después se abre el ciclo Fase 4-9 completo para el feature **Test**.

## Dudas o problemas pendientes

- `next/font` es stack nuevo para Pool — pendiente su estudio aislado en el proyecto de Aprendizaje, junto con Tailwind v4 y generación de PDF.
- **(NUEVO)** Hipótesis sin verificar: el CTA usa `before:transition-[transform,box-shadow]`, pero Tailwind v4 aplica `scale-[…]` con la propiedad CSS `scale`, no `transform`; si es así, la transición no cubre el escalado y este saltaría en vez de animarse. Verificar a mano al pasar el mouse; si se siente instantáneo, cambiar la transición para incluir `scale`.
- `PreguntaLikert.jsx` no indica al estudiante el significado de los extremos de la escala 1-5 — se resuelve al abrir el ciclo Fase 4-9 del feature Test.
- Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida.
- Aplicar los tokens de identidad visual a los estilos Tailwind pendientes de `ConsejoVocacional.jsx`, el bloque de carreras recomendadas en `resultado/page.jsx`, y el sendero de progreso visual del test.
- Exploración pendiente, solo por curiosidad de Pool: layout de hero a dos columnas con elemento visual a la derecha — si se concreta, reabre Fase 4 para el hero específicamente (y los tests de Fase 8 del Hero deberán revisarse).
- ¿Se reintegran `ComoFunciona.jsx` y `CtaFinal.jsx` a la landing, o se quedan fuera del MVP de forma permanente? Decisión diferida indefinidamente.
- Número real de "10 minutos" para completar el test nunca fue medido — placeholder sin verificar. Si se reintegra `CtaFinal.jsx`, cronometrar las 77 preguntas antes de publicar la cifra.
- **Idea futura (post-MVP):** `ConsejoVocacional` dismissible con retraso inicial + imagen motivacional.
- **Idea futura (post-MVP):** modos de test "normal" vs. "preciso".
- **Idea futura (post-MVP):** reemplazar el "top 10 fijo" por un umbral mínimo de compatibilidad.
- **Idea futura (post-MVP):** click en una carrera del resultado para ver más información, incluyendo `sectoresEmpleo`.
- **Carreras candidatas restantes para seguir agregando:**
  - Comunicación Audiovisual / Ciencias de la Comunicación
  - Gestión de Recursos Humanos
  - Logística y Comercio Exterior
  - Marketing Digital _(verificar si tiene el mismo problema que UI/UX antes de asumir que es carrera completa)_
  - Ingeniería Química
  - Agronomía / Ingeniería Agronómica
  - Medicina Veterinaria
  - Farmacia y Bioquímica
  - Trabajo Social
  - Turismo y Hotelería
  - Relaciones Internacionales / Ciencias Políticas
  - Traducción e Interpretación
  - Publicidad
- Diseño del sistema de filtros post-MVP para `ritmo_trabajo`, `esfuerzo_fisico` y `disponibilidad_viajar` — fuera de alcance hasta después del MVP.
