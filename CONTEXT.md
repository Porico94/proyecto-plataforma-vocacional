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
/page.js → ✅ Landing COMPLETA (Fases 4-9). Solo renderiza el Hero (`ComoFunciona`/`CtaFinal` construidos pero desconectados de la landing por decisión de Pool, revisión diferida indefinidamente). Header sin link de navegación por ancla. Contraste AA verificado. Foco de teclado visible cubierto por test. CTA del Hero (`<a href="/test">`) con microinteracción de hover (`::before` decorativo + `scale`/`shadow`), `motion-safe:` aplicado al `scale`. **(Fase 9) Transición corregida a `before:transition-[scale,box-shadow]`** (antes decía `transform` y el escalado saltaba). `metadata` de la página: title "Orientame.pe — Encuentra tu carrera con criterio" (sin tilde, a propósito) y description sin promesa de "datos de mercado laboral".
/layout.js → ✅ Completo: fuentes Literata (`--font-voz`) y Karla (`--font-cuerpo`) vía `next/font/google`, `lang="es"`. **(Fase 9) `metadata` global con `robots: { index: false }`** (aplica a todo el sitio mientras sea privado) y title por defecto "Encuentra tu carrera compatible".
/globals.css → ✅ Completo: tokens de marca en `@theme` (noche/papel/amanecer/musgo/texto-claro/texto-oscuro, fuentes voz/cuerpo). Sin modo claro/oscuro automático. El warning de editor "Unknown at rule @theme" es falso positivo.
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo (estilos Tailwind pendientes) — **próximo feature**, ciclo Fase 4-9 completo
/resultado/page.jsx → ✅ Completo (Parte 14): `<ConsejoVocacional/>` integrado, `obtenerTop10Carreras` conectado. Estilos Tailwind pendientes. Feature en cola, después de Test.
/components
/landing/
ComoFunciona.jsx → 🔶 Construido, NO renderizado en `page.js`. Decisión de reintegrarlo diferida indefinidamente.
CtaFinal.jsx → 🔶 Construido, NO renderizado. Misma decisión diferida.
/test/
PreguntaLikert.jsx → ✅ Completo. ⚠️ Pendiente: no indica qué significan los extremos de la escala 1-5. Se resuelve al abrir el ciclo del feature Test.
PreguntaOpciones.jsx → ✅ Completo
/resultado/
ConsejoVocacional.jsx → ✅ Contenido y estructura completos. Estilos Tailwind pendientes.
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts, recomendacion.ts, normalizar.ts, constants.ts, types.ts → ✅ Completos
/data
preguntas.json → ✅ 77 preguntas, 5 dimensiones activas (`personalidad` 25, `riasec` 18, `inteligencias_multiples` 16, `aptitudes` 12, `valores` 6).
carreras.json → 🔶 46 entradas. Array plano; `riasec`/`aptitudes`/`personalidad` como objetos `{subdimension: numero}` (Grupo A), `inteligencias_multiples`/`valores` como arrays de strings (Grupo B), más `universidades`, `sectoresEmpleo`. Campo opcional `notaCobertura` en 19/46 entradas. `sectoresEmpleo` es puramente informativo.
/tests
landing.spec.js → ✅ 7 tests en 5 grupos (semántica h1 único, teclado Tab → CTA + anillo, responsive sin desborde, hover/reduced-motion solo escritorio, navegación CTA → `/test`). 2 proyectos → 14 tests: 12 pasan + 2 omitidos a propósito (hover en móvil). Verificado verde tras el fix de Fase 9.
/playwright.config.js → ✅ `testDir: './tests'`, `baseURL: http://localhost:3000` (fijo), `webServer` con `npm run dev` + `reuseExistingServer: !process.env.CI`, reporter html, proyectos `chromium` (Desktop Chrome) y `Mobile Chrome` (Pixel 5).
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (en uso desde Fase 8), **Vercel (desplegado desde Fase 9: https://proyecto-plataforma-vocacional.vercel.app)**. Sin Auth.js ni PostgreSQL/Prisma en el MVP. Repo de GitHub **público**.
- **Identidad visual de marca (Parte 15):**
  - Nombre: **Oriéntame.pe** (en la landing, título y logo se escriben "Orientame" sin tilde por decisión de Pool, por la URL/dominio).
  - Paleta: `noche` #14171F, `papel` #E8E2D3, `amanecer` #D9A441, `musgo` #5B8C7B, `texto-claro` #F2EFE6, `texto-oscuro` #1E2027.
  - Tipografía: **Literata** (`--font-voz`) para titulares; **Karla** (`--font-cuerpo`) para cuerpo.
  - Regla de contraste de botones: el color del CTA se adapta al fondo de su sección.
- Decisiones técnicas importantes y por qué:
  - **Tailwind v4 no usa `tailwind.config.js`** — el tema vive en `globals.css` dentro de `@theme`.
  - **Sin modo claro/oscuro automático** — decisión de marca fija.
  - **`next/font` es stack nuevo para Pool** — pendiente de estudio aislado en el proyecto de Aprendizaje.
  - **Patrón "container": ancho de sección vs. ancho de contenido.**
  - **Un solo `<h1>` por página con jerarquía semántica real.**
  - **Listas reales (`<ul>`/`<li>`) para contenido enumerado.**
  - **Jerarquía visual de CTA principal.**
  - **Ritmo de fondo entre secciones:** alternar `noche`/`papel` en secciones consecutivas (aplica a Test/Resultado).
  - **Redundancia de copy entre secciones:** revisar qué ya dice cada sección antes de escribir la siguiente.
  - **Foco de teclado:** en CTAs sobre fondo sólido: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-acento] focus-visible:ring-offset-2 focus-visible:ring-offset-[color-fondo-sección]`. `ring-2`/`ring-offset-2` definen el grosor; las clases de color solas no producen anillo.
  - **Método de verificación de contraste:** para texto con opacidad Tailwind, mezclar texto y fondo por canal RGB (opacidad×texto + (1-opacidad)×fondo) y evaluar ese color contra WCAG AA (4.5:1 normal, 3:1 grande) en WebAIM.
  - **Microinteracción hover sin blur de texto (Fase 7):** nunca `transform`/`scale` directo sobre un elemento con texto; usar un `::before` decorativo (`relative isolate` en el padre, `before:absolute before:inset-0 before:-z-10`) que lleva fondo/shadow y recibe el `scale`. Motivo: `transform` promueve el elemento a capa GPU y el texto pierde subpíxeles (borroso).
  - **`motion-safe:` solo envuelve movimiento/tamaño:** el `scale` va en `motion-safe:hover:before:scale-[...]`; el `box-shadow` queda fuera.
  - **Tailwind v4 y `hover:` en móvil:** el variant `hover:` solo se activa bajo `@media (hover: hover) and (pointer: fine)`.
  - **(NUEVO, Fase 9) Tailwind v4 aplica `scale-[...]` con la propiedad CSS `scale`, no con `transform`:** la clase de transición debe nombrar `scale` (`transition-[scale,box-shadow]`); si solo dice `transform`, el escalado salta de golpe. Verificado a mano en producción.
  - **(NUEVO, Fase 9) Qué significa "estática" en `next build`:** el HTML se genera una sola vez, en el build, y se sirve igual a todos. `/test`, `/resultado` y `/perfil` salen estáticas porque el cálculo personalizado ocurre en el navegador dentro de `useEffect` (lectura de `storage.js`). Leer `sessionStorage`/`localStorage` durante el render fallaría en el build (esas APIs no existen en Node).
  - **(NUEVO, Fase 9) Vercel:** cada push a `main` dispara deploy a producción; si el build falla, Vercel mantiene la última versión buena; push a otras ramas generan URL de preview. Se conectó con permiso "Only select repositories" en la GitHub App. `npm run build` y `npm run lint` se corren en local antes de desplegar (el build ya no ejecuta ESLint por defecto).
  - **(NUEVO, Fase 9) `robots: { index: false }` va en `layout.js` (aplica a todo el sitio), no en `page.jsx`.** Es un pedido de cortesía a buscadores, no seguridad: quien tenga el link entra. Se quita al abrir el proyecto al público.
  - **(NUEVO, Fase 9) CI con GitHub Actions + Playwright se pospone hasta el feature Test** (tendrá flujos con estado). GitHub Actions es stack nuevo: estudiarlo primero en el proyecto de Aprendizaje.
  - **Decisiones de testing con Playwright (Fase 8):**
    - `getByRole` sobre `locator('h1')`: prueba lo que percibe un lector de pantalla; ignora elementos ocultos; `level` busca el nivel calculado.
    - Locators estrictos: más de un match lanza _strict mode violation_; se afina con `name` o regiones, `.first()`/`.nth()` solo explícito.
    - `keyboard.press('Tab')` en vez de `focus()`: prueba que el usuario llega al elemento en el orden real.
    - Anillo de foco: `not.toHaveCSS('box-shadow', 'none')` (prueba que existe algún anillo, no que su color sea correcto).
    - `page.evaluate` para medir lo que ningún locator expresa (`scrollWidth - clientWidth`; `getComputedStyle(el, '::before').scale`).
    - Dos proyectos (escritorio + Pixel 5): el desborde con `w-[600px]` solo falló en móvil.
    - `test.skip(({ isMobile }) => isMobile)` para tests de hover.
    - `page.emulateMedia({ reducedMotion: 'reduce' })` antes de `goto`.
    - Aserciones web-first (`await expect(locator)…`, `expect.poll`, `toHaveURL`) reintentan hasta 5 s; `expect(valor).toBe()` es síncrono y evalúa una vez.
    - **Regla de calidad: todo test se hace fallar a propósito (prueba de mutación) antes de darse por bueno.**
    - No se prueba automatizado: color correcto del anillo, "se ve bonito", fluidez de la animación (revisión visual manual).
    - Tests ≠ CI/CD: hoy se corren a mano con `npx playwright test`. Apuntar los tests a la URL de producción requeriría que `baseURL` lea una variable de entorno (mejora para cuando se monte CI).
    - `.gitignore`: deben estar `/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`.
  - Se mantienen las decisiones de Parte 13-14: motor dividido en Grupo A/B, top 10 fijo, cálculos costosos en `useEffect`+estado propio.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: **Test** (por abrir)
- Fase actual: **Fase 4 (Diseño UI) — pendiente de iniciar.** Landing cerrada: Fases 4-9 completas.
- En lo que se trabajó en la última sesión (Landing, Fase 9):
  - `npm run build` y `npm run lint` limpios en local (7/7 páginas estáticas, sin warnings). Revisión de `.gitignore` y de archivos sensibles: sin `.env` ni claves versionadas.
  - Pool tuvo dudas con Vercel y consideró Render, pero decidió mantener Vercel; el bloqueo era solo dar permiso al repo en la GitHub App. Deploy exitoso y verificado a mano en producción (fuentes, CTA, responsive, teclado, celular real).
  - Fix `before:transition-[scale,box-shadow]` (hipótesis del `scale` confirmada: saltaba). `robots` movido a `layout.js`. Description corregida para no prometer "datos reales de mercado laboral".
  - Tests de Playwright verdes tras el cambio (12 pasan, 2 omitidos).
  - Checkpoint de comprensión superado. Preguntas de entrevista (estática vs. dinámica, `noindex` vs. proteger acceso, push roto en Vercel): respondidas bien en conceptos. **Pendiente de reforzar:** escribir el ejemplo de código que rompe el build (leer `sessionStorage` suelto en el cuerpo del componente) y su corrección con `useState` + `useEffect`; también la precisión de que "estática" = HTML generado una vez en el build, no en cada visita.

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación — Parte 11.
- [x] Redacción e implementación de `ConsejoVocacional.jsx` — Parte 11.
- [x] Integración de `<ConsejoVocacional/>` en `resultado/page.jsx` — Parte 12.
- [x] Eliminación de `motivaciones`/`estilo_aprendizaje`; renombre de claves de `carreras.json` — Parte 13.
- [x] Motor de recomendación completo (`recomendacion.ts`) — Parte 13.
- [x] Conexión de `obtenerTop10Carreras` en `resultado/page.jsx` — Parte 14.
- [x] Identidad visual de marca definida (Oriéntame.pe: paleta, tipografía) — Parte 15.
- [x] Landing page — Fase 4 (Diseño UI) y Fase 5 (Desarrollo) — Parte 15.
- [x] Landing page — Fase 6 (Responsive + Accesibilidad) — Fase 6, Partes 1 y 2.
- [x] Landing page — Fase 7 (Animaciones): microinteracción de hover en el CTA — Fase 7.
- [x] Landing page — Fase 8 (Testing): Playwright, 7 tests × 2 proyectos — Fase 8.
- [x] **Landing page — Fase 9 (Deploy) COMPLETA: desplegada en Vercel (https://proyecto-plataforma-vocacional.vercel.app), feature Landing cerrado — Fase 9, Parte 1.**

## Reglas de negocio definidas

- La comunicación pública del proyecto (landing, copy) evita marketing comparativo o defensivo frente a competidores. El foco debe estar siempre en ayudar al estudiante.
- Tono de voz: directo y sin rodeos ("cero floro"), sin mensajes largos, poéticos o reflexivos.
- El color de los CTAs se decide por contraste contra el fondo local de su sección.
- Patrón de ancho: secciones full-bleed (`w-full`) + contenedor interno con `max-w`.
- Secciones consecutivas no deben compartir el mismo color de fondo sin separación — se alterna `noche`/`papel`.
- Cualquier afirmación en el copy o en el metadata sobre "datos reales" o metodología debe verificarse contra lo que el motor realmente usa en el score (hoy no usa mercado laboral).
- `ComoFunciona.jsx` puede incluir un mensaje breve de confianza/diferenciación (sin nombrar competidores), aunque hoy no está en uso.
- El deploy de un feature NO implica lanzamiento público — el proyecto sigue privado hasta que Pool decida compartir el link. Mientras tanto, el sitio lleva `noindex`.
- Cualquier microinteracción de hover sobre un elemento con texto sigue el patrón `::before` documentado — nunca se anima el texto directamente.
- Todo test nuevo se hace fallar a propósito antes de darse por bueno.
- Cada feature con UI incluye, en su Fase 8, como mínimo: estructura semántica, navegación por teclado y responsive en los dos proyectos; el feature Test sumará flujos con estado.
- **(NUEVO)** Antes de cada deploy: `npm run build` + `npm run lint` + `npx playwright test` en local.
- **(NUEVO)** Si una tecnología es nueva (señal de stack nuevo), se estudia primero en el proyecto de Aprendizaje: aplica a GitHub Actions antes de montar CI.
- Se mantienen las reglas de Parte 13-14: comparación estudiante↔carrera dividida en dos grupos; un solo `<h1>` por página; toda dimensión del test debe tener razón de uso clara.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión". Empezar el ciclo del feature **Test** por la **Fase 4 (Diseño UI)**: definir el diseño del flujo de 77 preguntas (sendero de progreso visual, cómo se muestra `PreguntaLikert`/`PreguntaOpciones`, indicar el significado de los extremos de la escala 1-5, aplicar los tokens de marca y el ritmo de fondo `noche`/`papel`). Al inicio de la sesión, retomar en 5 minutos la pregunta de entrevista pendiente (ejemplo de código del build roto por leer `sessionStorage` en el render y su corrección).

## Dudas o problemas pendientes

- `next/font` es stack nuevo para Pool — pendiente de estudio aislado en el proyecto de Aprendizaje, junto con Tailwind v4, generación de PDF y **GitHub Actions** (necesario antes de montar CI en la Fase 8 del feature Test).
- Pregunta de entrevista pendiente: escribir el ejemplo de código que rompe el build por leer `sessionStorage` durante el render y su corrección con `useState` + `useEffect`.
- Opcional: quitar el bloque duplicado `# Playwright` de `.gitignore` (commit `chore: dedupe gitignore`) y, si algún día se crea `.env.example`, agregar `!.env.example` porque `.env*` también lo ignora.
- Opcional: `title.template` en `layout.js` para que todas las páginas lleven la marca en el título (hoy el title por defecto no la incluye).
- `PreguntaLikert.jsx` no indica el significado de los extremos de la escala 1-5 — se resuelve en Fase 4 del feature Test.
- Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida.
- Aplicar los tokens de identidad visual a los estilos Tailwind pendientes de `ConsejoVocacional.jsx`, el bloque de carreras recomendadas en `resultado/page.jsx`, y el sendero de progreso visual del test.
- Exploración pendiente, solo por curiosidad de Pool: layout de hero a dos columnas con elemento visual a la derecha — si se concreta, reabre Fase 4 para el hero (y los tests de Fase 8 del Hero deberán revisarse).
- ¿Se reintegran `ComoFunciona.jsx` y `CtaFinal.jsx` a la landing, o se quedan fuera del MVP de forma permanente? Decisión diferida indefinidamente.
- Número real de "10 minutos" para completar el test nunca fue medido — si se reintegra `CtaFinal.jsx`, cronometrar las 77 preguntas antes de publicar la cifra.
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
