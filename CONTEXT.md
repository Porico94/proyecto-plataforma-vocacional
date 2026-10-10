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

```
/app
  /page.js → ✅ Landing COMPLETA (Fases 4-9). Solo renderiza el Hero (`ComoFunciona`/`CtaFinal` construidos pero desconectados de la landing por decisión de Pool, revisión diferida indefinidamente). Header sin link de navegación por ancla. Contraste AA verificado. Foco de teclado visible cubierto por test. CTA del Hero (`<a href="/test">`) con microinteracción de hover (`::before` decorativo + `scale`/`shadow`), `motion-safe:` aplicado al `scale`. (Fase 9) Transición corregida a `before:transition-[scale,box-shadow]`. `metadata` de la página: title "Orientame.pe — Encuentra tu carrera con criterio" (sin tilde, a propósito) y description sin promesa de "datos de mercado laboral".
  /layout.js → ✅ Completo: fuentes Literata (`--font-voz`) y Karla (`--font-cuerpo`) vía `next/font/google`, `lang="es"`. (Fase 9) `metadata` global con `robots: { index: false }` (aplica a todo el sitio mientras sea privado) y title por defecto "Encuentra tu carrera compatible".
  /globals.css → ✅ Completo: tokens de marca en `@theme` (noche/papel/amanecer/musgo/texto-claro/texto-oscuro, fuentes voz/cuerpo). Sin modo claro/oscuro automático. El warning de editor "Unknown at rule @theme" es falso positivo.
  /perfil/page.jsx → ✅ Funcionalmente completo. ⚠️ Sin estilos Tailwind (pendiente). Revisar qué pide hoy (el mockup antiguo pedía región, ver Dudas).
  /test/page.jsx → 🔶 Fase 4 en curso, sin estilos Tailwind todavía. Hecho, probado a mano, con lint y subido a GitHub:
    1. Pantalla de carga con `cargandoDatos` (inicia en `true`, pasa a `false` al final del `useEffect`; el `if (cargandoDatos) return ...` va DESPUÉS de todos los hooks).
    2. `etapas` con `reduce` FUERA del componente, agrupando `preguntas.json` por `dimension` → `[{dimension, inicio, fin}]`. Resultado real: personalidad 0-24, riasec 25-42, aptitudes 43-54, inteligencias_multiples 55-70, valores 71-76.
    3. `nombresAmigables` e `introEtapas` como objetos literales fuera del componente (datos fijos). `introEtapas[dimension] = { mide, comoResponder }` para las 5 dimensiones, incluida `personalidad`.
    4. Derivados dentro del componente (dependen de `currentIndex`): `etapaActual`, `numeroEtapa`, `numeroPreguntaEnEtapa`, `totalPreguntasEnEtapa`, `etapaSiguiente = etapas[numeroEtapa]`, `esIntroInicial = mostrandoIntro && currentIndex === 0`, `etapaIntro = esIntroInicial ? etapaActual : etapaSiguiente`, y la función `estadoDeEtapa(etapa)` → 'hecha' | 'actual' | 'pendiente'. (Renombrados en P3 desde `preguntaEnEtapa` y `totalEnEtapa`: confirmar commit, ver Dudas.)
    5. Sendero de progreso: `<ol>` recorrido con `etapas.map`, `key={etapa.dimension}`, `aria-current="step"` solo en la parada actual (`undefined` en las demás) y un `<span className="sr-only">` con el estado. Texto aún sin estilos.
    6. Pantallas de intro con el estado `mostrandoIntro`: el ternario REEMPLAZA a la pregunta (se ocultan Anterior/Siguiente mientras se ve). Intro inicial: se activa en el `useEffect` si el índice restaurado es 0; "Continuar" NO mueve el índice. Intro de transición: `handleSiguiente` la activa cuando `currentIndex === etapaActual.fin` y no es la última pregunta, SIN avanzar el índice; "Continuar" avanza `currentIndex + 1`.
    7. `setearIndice(indice)` centraliza cambiar el índice y guardarlo en `storage`.
    8. Textos temporales en el JSX de la intro ("Terminaste el bloque …", "El nuevo bloque es …"): copy definitivo pendiente.
    Falta: etiquetas de la escala en `PreguntaLikert`, estilos Tailwind con tokens de marca (pregunta, sendero, intros, botones), y los detalles de Dudas.
  /resultado/page.jsx → ✅ Completo (Parte 14): `<ConsejoVocacional/>` integrado, `obtenerTop10Carreras` conectado. Estilos Tailwind pendientes. Feature en cola, después de Test.
/components
  /landing/
    ComoFunciona.jsx → 🔶 Construido, NO renderizado en `page.js`. Decisión de reintegrarlo diferida indefinidamente.
    CtaFinal.jsx → 🔶 Construido, NO renderizado. Misma decisión diferida.
  /test/
    PreguntaLikert.jsx → ✅ Completo. ⚠️ Pendiente: no indica qué significan los extremos de la escala 1-5. Cada pregunta likert ya trae `escala.etiquetas` en el JSON (5 textos, de "Totalmente en desacuerdo" a "Totalmente de acuerdo"): probablemente basta mostrarlas, sin tocar datos.
    PreguntaOpciones.jsx → ✅ Completo
  /resultado/
    ConsejoVocacional.jsx → ✅ Contenido y estructura completos. Estilos Tailwind pendientes.
  /ui/ → vacío, pendiente
/lib
  /storage.js → ✅ Completo
  /scoring/
    engine.ts, recomendacion.ts, normalizar.ts, constants.ts, types.ts → ✅ Completos
/data
  preguntas.json → ✅ 77 preguntas, 5 dimensiones activas, agrupadas (contiguas) en este orden: personalidad 25 (índices 0-24), riasec 18 (25-42), aptitudes 12 (43-54), inteligencias_multiples 16 (55-70), valores 6 (71-76). Tipos: solo `aptitudes` es `aptitud` (4 opciones, UNA `respuestaCorrecta`, subdimensiones verbal/numérica/espacial/lógica); el resto `likert` con escala de acuerdo (5 etiquetas). `riasec`: 3 frases por cada interés R, I, A, S, E, C. `inteligencias_multiples`: 2 frases por cada una de 8 inteligencias. `valores`: 1 frase por valor (impacto social, creatividad, autonomía, reconocimiento, trabajo en equipo, sostenibilidad). Personalidad: cinco rasgos, con frases invertidas. `apt-espacial-02` y `apt-espacial-03` reemplazadas en P3 por versiones sin ambigüedad.
  carreras.json → 🔶 46 entradas. Array plano; `riasec`/`aptitudes`/`personalidad` como objetos `{subdimension: numero}` (Grupo A), `inteligencias_multiples`/`valores` como arrays de strings (Grupo B), más `universidades`, `sectoresEmpleo`. Campo opcional `notaCobertura` en 19/46 entradas. `sectoresEmpleo` es puramente informativo.
/tests
  landing.spec.js → ✅ 7 tests en 5 grupos (semántica h1 único, teclado Tab → CTA + anillo, responsive sin desborde, hover/reduced-motion solo escritorio, navegación CTA → `/test`). 2 proyectos → 14 tests: 12 pasan + 2 omitidos a propósito (hover en móvil). Verificado verde tras el fix de Fase 9.
/playwright.config.js → ✅ `testDir: './tests'`, `baseURL: http://localhost:3000` (fijo), `webServer` con `npm run dev` + `reuseExistingServer: !process.env.CI`, reporter html, proyectos `chromium` (Desktop Chrome) y `Mobile Chrome` (Pixel 5).
/public
```

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
  - **Tailwind v4 aplica `scale-[...]` con la propiedad CSS `scale`, no con `transform`:** la clase de transición debe nombrar `scale` (`transition-[scale,box-shadow]`). Verificado a mano en producción.
  - **Qué significa "estática" en `next build`:** el HTML se genera una sola vez, en el build, y se sirve igual a todos. `/test`, `/resultado` y `/perfil` salen estáticas porque el cálculo personalizado ocurre en el navegador dentro de `useEffect` (lectura de `storage.js`).
  - **(Test) Dónde corre cada código:** el cuerpo del componente corre en Node (durante `next build`) Y en el navegador; el `useEffect` corre SOLO en el navegador y DESPUÉS de que React pintó el render. Por eso leer `sessionStorage` como valor inicial (`useState(storage.get(...))`) rompe el build (`sessionStorage is not defined`), y se lee dentro de `useEffect`. Además evita el hydration mismatch. Llamar a un `set...` en el cuerpo del componente, sin efecto, da "Too many re-renders".
  - **(Test) Ciclo de vida del componente (repaso P3):** el módulo se carga una vez (imports → hoisting → `etapas`, `nombresAmigables`, `introEtapas` se calculan una sola vez). `TestVocacional` NO se ejecuta al cargar: la llama React cada vez que cambia un estado, y cada llamada es un contexto nuevo con variables nuevas (nada "se modifica": se recalcula todo). Primer render: valores iniciales de `useState`, `useEffect` solo se anota, se devuelve "Cargando...". Después corre el efecto, los `set...` se agrupan y producen UN segundo render con los datos restaurados. Hoisting: `import` primero, `function` completa, `var` como `undefined`, `const`/`let` registrados sin inicializar (zona muerta); una arrow function en un `const` NO se registra completa.
  - **(Test) Pantalla de carga al restaurar progreso:** `cargandoDatos` inicia en `true` y pasa a `false` al final del `useEffect`. Retorno anticipado después de todos los hooks. Se descartaron esqueleto y contenedor vacío. Los `set...` del efecto se aplican juntos antes de que `cargandoDatos` pase a `false`, por eso no hay parpadeo de la pregunta antes de la intro.
  - **(Test) Qué va dentro y qué fuera del componente:** FUERA lo que solo depende de datos fijos del módulo (`etapas`, `nombresAmigables`, `introEtapas`): se calcula una vez. DENTRO lo que depende de estado (`etapaActual`, `numeroEtapa`, `etapaSiguiente`, `esIntroInicial`, `estadoDeEtapa`...). `currentIndex` no existe fuera del componente. Si `etapas` dependiera de una prop, iría dentro (conecta con `useMemo`, tema futuro).
  - **(Test) `etapas` se deriva de `preguntas.json`, no se escribe a mano:** rangos fijos con índices se desfasarían en silencio al agregar/quitar preguntas. Condición: las preguntas de una misma dimensión deben quedar contiguas en el JSON. Los objetos se pasan por referencia: `find` devuelve el mismo objeto que está en el array, por eso `indexOf(etapaActual)` funciona (`indexOf` compara con `===`, que en objetos es identidad de referencia; devuelve la posición o `-1`).
  - **(Test) `etapaSiguiente = etapas[numeroEtapa]`:** `numeroEtapa` es el índice de la etapa actual + 1, que coincide con el índice de la siguiente. En la última etapa da `undefined`, sin romper nada porque solo se usa en la intro de transición, que no aparece tras la última pregunta.
  - **(Test) Mapa de datos fijos = objeto literal, no `reduce`:** `reduce` sirve para acumular/transformar; para texto fijo basta un literal. Las claves sin comillas valen si son identificadores válidos. Se accede con corchetes cuando la clave está en una variable (`introEtapas[etapaIntro.dimension]`, no `introEtapas.dimension`). El caso borde (dimensión sin nombre) se resuelve donde se USA, con `??`.
  - **(Test) Sendero de progreso:** sendero del mockup "La Ruta" (paradas hecha/actual/pendiente, una por dimensión), no una barra simple. Investigación: una barra constante no reduce el abandono de forma significativa (meta-análisis de 32 experimentos); importa la duración prometida honesta y los hitos por etapas. `aria-current="step"` solo en la parada actual; se ve en DevTools → Accessibility. Estado de cada parada: hecha si `currentIndex > fin`, actual si `currentIndex >= inicio`, si no pendiente. `estadoDeEtapa` recibe UNA etapa y se llama una vez por etapa dentro del `.map`. `key` es una etiqueta interna de React, no aparece en el HTML.
  - **(Test) Niveles del sendero:** básico = sendero + etiqueta + contador (HECHO, sin estilos); medio = pantallas de intro entre etapas (HECHO); extra (opcional, al final del feature) = fondo que pasa de `noche` hacia `amanecer` según avanza (verificar contraste AA en cada tramo en Fase 6; animarlo en Fase 7).
  - **(Test) Pantallas de intro (decisión de Pool):** la pantalla entre etapas cierra la que terminó y ABRE la siguiente (qué mide y cómo se responde); un solo bloque de JSX que lee de `introEtapas[etapaIntro.dimension]`. El texto explica siempre la etapa que está por EMPEZAR: en transición = `etapaSiguiente`; en la intro inicial = `etapaActual`. La intro inicial se vuelve a ver al recargar en la pregunta 1. **`mostrandoIntro` NO se guarda en storage** (solo `currentIndex` y `respuestas` sobreviven a la recarga): si el estudiante recarga viendo el cierre de la etapa 1 (índice 24 guardado), ve la pregunta 25 de 25 con su respuesta ya marcada, no el cierre; al pulsar Siguiente el cierre reaparece. No se pierde nada. Al volver a la pregunta 1 con "Anterior" no se muestra la intro (solo al cargar).
  - **(Test) No guardar en estado lo que se puede calcular:** `esIntroInicial` y `etapaIntro` se derivan de `mostrandoIntro` y `currentIndex`; un segundo `useState` duplicaría información que puede contradecirse.
  - **(Test) Contenido de `introEtapas` verificado contra `preguntas.json`:** `mide` nombra solo lo que miden las subdimensiones reales; `comoResponder` debe coincidir con lo que el estudiante ve. `aptitudes` NO es autoevaluación: es un test de rendimiento con respuesta correcta, y el formato cambia DOS veces (entra a opciones al comenzar aptitudes y vuelve a escala al comenzar inteligencias múltiples): ambos intros deben avisarlo.
  - **(Test) Lecciones de React:** `const` tiene alcance de bloque (lo que usan varias partes se declara en el cuerpo del componente); React no puede dibujar un objeto como hijo; cada rama de un ternario debe ser UN elemento (fragmento `<>...</>`); `&&` para mostrar/ocultar (cortocircuito: si la izquierda es falsa no evalúa la derecha y React no dibuja `false`), ternario para elegir entre dos, `??` solo para `null`/`undefined`; `undefined` en un atributo hace que React no lo escriba; `.map` devuelve un array de elementos que React sabe dibujar.
  - **(Test) `handleSiguiente` — 4 casos:** sin responder (error + `return`); pregunta normal (`setearIndice(+1)`); última de etapa (`setMostrandoIntro(true)` + `return`, índice sin mover); última del test (`router.push('/resultado')`). Los `return` evitan que tras mostrar la intro el código siga y avance el índice. `setearIndice` cambia el estado Y guarda en storage.
  - **Mockup original "La Ruta" (HTML de chats iniciales) — solo referencia, desactualizado:** usa 106 preguntas y 9 paradas (hoy 77 y 5), un tipo "elección forzada" que no existe y mide restricciones eliminadas, pide región en el perfil, otra identidad (Clash Display/Sora, azul/dorado/turquesa, toggle claro/oscuro) y dice 33 carreras (hoy 46). Se aprovecha: sendero lateral/horizontal, likert tipo altímetro con etiquetas de extremos, enfoque de "reto" para aptitudes.
  - **`robots: { index: false }` va en `layout.js` (aplica a todo el sitio), no en `page.jsx`.** Es un pedido de cortesía a buscadores, no seguridad. Se quita al abrir el proyecto al público.
  - **Vercel:** cada push a `main` dispara deploy a producción; si el build falla, Vercel mantiene la última versión buena; push a otras ramas generan URL de preview. Se conectó con permiso "Only select repositories" en la GitHub App. `npm run build` y `npm run lint` se corren en local antes de desplegar (el build ya no ejecuta ESLint por defecto).
  - **CI con GitHub Actions + Playwright se pospone hasta el feature Test** (tendrá flujos con estado). GitHub Actions es stack nuevo: estudiarlo primero en el proyecto de Aprendizaje.
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
    - **Para la Fase 8 del Test:** `aria-current="step"` se puede probar con `toHaveAttribute('aria-current', 'step')`; flujos con estado: recarga en pregunta 1 (intro inicial), recarga en otras preguntas, recarga en el índice 24 (debe verse la pregunta 25, no el cierre), paso de etapa 1 a 2 ("Continuar" debe llevar a la pregunta 26, no a la 27).
  - Se mantienen las decisiones de Parte 13-14: motor dividido en Grupo A/B, top 10 fijo, cálculos costosos en `useEffect`+estado propio.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: **Test**
- Fase actual: **Fase 4 (Diseño UI) — en curso.** Sendero e intros entre etapas hechos en lógica y sin estilos. Falta cerrarla (etiquetas de escala, estilos con tokens de marca, detalles de Dudas) antes de pasar a la Fase 5.
- En lo que se trabajó en la última sesión (Test, Fase 4, Parte 3 — chat `Test · F4 · P3 — repaso del flujo del test render a render`): sesión de **repaso, sin código nuevo de funcionalidad**.
  - Confirmado que `apt-espacial-02` y `apt-espacial-03` ya fueron reemplazadas.
  - Renombres en `page.jsx`: `preguntaEnEtapa` → `numeroPreguntaEnEtapa` y `totalEnEtapa` → `totalPreguntasEnEtapa`; texto de la intro "Bloque: …" → "El nuevo bloque es …".
  - Repaso completo, con tabla de valores a mano, del flujo del archivo: carga del módulo (hoisting, `etapas`), primer render ("Cargando..."), `useEffect` y segundo render (intro inicial), `.map` del sendero (con los 5 estados), `&&` en "Terminaste el bloque…", lectura de `introEtapas[etapaIntro.dimension]`, `handleContinuar` y `handleSiguiente` (casos y valores de cada condicional).
  - **Checkpoint:** Pool explicó con sus palabras el flujo de "Continuar" → pregunta 1 → "Siguiente" (índice 0 → 1) sin errores. La pregunta de entrevista (recarga con el cierre de etapa 1 en pantalla, índice 24) se respondió mal al principio (dijo que se ve el cierre); quedó corregida y explicada (ver decisión de intros), pero conviene que la responda él mismo con sus palabras al abrir el siguiente chat.
  - Conceptos que costaron y conviene repasar en entrevista: cómo `&&` corta la evaluación (confundió `!esIntroInicial` en el primer render); que React re-llama al componente y no "modifica" variables; qué se guarda en storage y qué no; alcance (scope) de `const`; por qué React no dibuja un objeto como hijo; `&&` vs `??` vs ternario; derivar vs duplicar estado; `reduce` con array como valor inicial y objetos por referencia.

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
- Antes de cada deploy: `npm run build` + `npm run lint` + `npx playwright test` en local.
- Si una tecnología es nueva (señal de stack nuevo), se estudia primero en el proyecto de Aprendizaje: aplica a GitHub Actions antes de montar CI.
- Las preguntas de una misma dimensión deben estar contiguas en `preguntas.json`; el progreso del test se calcula por etapas (una por dimensión) derivadas de ese archivo, nunca con rangos escritos a mano.
- Todo cálculo que dependa de `sessionStorage`/`localStorage` va dentro de `useEffect`, nunca en el valor inicial de `useState` ni en el cuerpo del componente.
- Un retorno anticipado en un componente va siempre después de todos los hooks.
- No se guarda en `useState` lo que se puede calcular a partir de otro estado o de datos fijos.
- Los textos de `introEtapas` se verifican contra `preguntas.json`: `mide` solo nombra lo que miden las subdimensiones reales, y `comoResponder` coincide con lo que el estudiante ve en pantalla (tipo de pregunta y etiquetas de la escala). Si cambian las preguntas o la escala, se revisan los textos.
- Toda pregunta de `aptitudes` debe tener UNA respuesta correcta inequívoca (puntúan con `respuestaCorrecta`); una pregunta ambigua castiga a quien razona bien. Antes de agregar una, comprobarla a mano.
- Nombres de chats: `Feature · F# · P# — tema corto` (ej. `Test · F4 · P3 — repaso del flujo del test render a render`); para trabajo fuera del ciclo, prefijo de área (`Carreras · …`, `Motor · …`, `Aprendizaje · …`). Al "cerramos sesión", Claude propone el nombre exacto del siguiente chat.
- **(NUEVO) Método de repaso de código:** Pool aprende mejor viendo el código ejecutarse paso a paso: rastreo línea por línea con el valor de cada variable por render (tabla de valores en una hoja). Al repasar o explicar código, Claude usa ese formato (render 1, render 2…, valores de cada variable y de cada condicional), en vez de solo resúmenes del mapa general.
- **(NUEVO) Vocabulario preciso al explicar:** JavaScript es el lenguaje, V8 el motor, VSC solo el editor; un componente no "se ejecuta al cargar" sino que React lo llama en cada render.
- Se mantienen las reglas de Parte 13-14: comparación estudiante↔carrera dividida en dos grupos; un solo `<h1>` por página; toda dimensión del test debe tener razón de uso clara.

## Próximo paso concreto

Abrir un chat nuevo llamado **`Test · F4 · P4 — etiquetas de escala y estilos`**, pegar este CONTEXT.md y escribir "inicio sesión". Al inicio (2 minutos): responder con tus palabras la pregunta de entrevista pendiente — si el estudiante recarga mientras ve el cierre de la etapa 1, ¿qué ve y por qué no se pierde nada? (pista: qué se guarda en storage y qué no). Después, continuar la Fase 4 del feature Test: **mostrar las `escala.etiquetas` del JSON en `PreguntaLikert.jsx`** (lógica, sin tocar datos) y luego empezar los estilos Tailwind con tokens de marca (pregunta, sendero, intros, botones).

## Dudas o problemas pendientes

- **Confirmar el commit de los renombres de P3** (`preguntaEnEtapa` → `numeroPreguntaEnEtapa`, `totalEnEtapa` → `totalPreguntasEnEtapa`, texto "El nuevo bloque es …"): correr `npm run lint` y hacer `refactor(test): renombrar variables de etapa` si aún no está. Confirmar también el commit `fix(data): reformular preguntas espaciales ambiguas`. Al probar, reiniciar el storage (una respuesta guardada de `apt-espacial-03` con opciones viejas no coincidiría con las nuevas).
- **Decisión pendiente en `introEtapas.aptitudes.comoResponder`:** hoy dice solo "Cambia el formato, solo una pregunta es correcta." Decidir si se pide "sin calculadora" (afecta qué tan justo es el resultado) y que avise también que es un test de rendimiento, no autoevaluación. Verificar que los textos de `introEtapas` finales (con la voz de Pool) sigan la regla de negocio.
- Copy temporal de la intro en el JSX ("Terminaste el bloque …", "El nuevo bloque es …"): redactar definitivo; decidir si "Continuar" se llama distinto en la intro inicial.
- **Sendero durante la intro de transición:** el índice no avanza, así que marca como "actual" la etapa que se acaba de terminar mientras se ve la intro de la siguiente. Evaluar en la parte de estilos/Fase 6.
- El `<li>` del sendero aún no tiene `?? 'Etapa sin nombre'` (si se agrega una dimensión sin nombre, la parada quedaría vacía; en la rama de la pregunta sí está).
- **Fase 6 (accesibilidad) del Test:** mover el foco a la pantalla de intro cuando aparece (el botón "Siguiente" desaparece del DOM y el foco del teclado se pierde); `role="alert"` para el mensaje de error; evitar la redundancia del `sr-only` en la parada actual (ya la cubre `aria-current`).
- **Alternativa de diseño para evaluar solo si los beta testers encuentran confuso el flujo:** mostrar la intro siempre que `currentIndex === etapaActual.inicio` (desaparecen `etapaSiguiente` y el caso especial del índice 0), a costa de que al recargar en la primera pregunta de cualquier etapa se vuelva a ver su intro.
- **Posible refactor futuro (solo si sigue costando leerlo):** `page.jsx` concentra datos, estado, derivados, handlers y dos pantallas. Evaluar separar la intro y el sendero en componentes (`/components/test/`) al hacer los estilos Tailwind, para que el archivo no crezca más.
- **Riesgo anotado para Fase 8 (Testing con estado):** si el índice guardado en storage queda fuera de rango (p. ej. se quitan preguntas del JSON con un test a medias), `preguntaActual` y `etapaActual` serían `undefined` y la página se rompería. Decidir cómo validar/resetear el índice guardado.
- Decidir si `/perfil` sigue pidiendo región: el mockup antiguo la usaba para ajustar carreras, pero las restricciones personales fueron eliminadas del algoritmo. Definir qué pide hoy esa página (nombre para el PDF, etc.).
- Estilos Tailwind pendientes de `/perfil/page.jsx` (la página donde el estudiante pone su nombre).
- Nivel extra del sendero (fondo `noche` → `amanecer`): pendiente para el final del feature (contraste en Fase 6, animación en Fase 7).
- `next/font` es stack nuevo para Pool — pendiente de estudio aislado en el proyecto de Aprendizaje, junto con Tailwind v4, generación de PDF y **GitHub Actions** (necesario antes de montar CI en la Fase 8 del feature Test).
- Opcional: quitar el bloque duplicado `# Playwright` de `.gitignore` (commit `chore: dedupe gitignore`) y, si algún día se crea `.env.example`, agregar `!.env.example` porque `.env*` también lo ignora.
- Opcional: `title.template` en `layout.js` para que todas las páginas lleven la marca en el título (hoy el title por defecto no la incluye).
- Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida.
- Aplicar los tokens de identidad visual a los estilos Tailwind pendientes de `ConsejoVocacional.jsx`, el bloque de carreras recomendadas en `resultado/page.jsx`, y el sendero y las pantallas de intro del test.
- Exploración pendiente, solo por curiosidad de Pool: layout de hero a dos columnas con elemento visual a la derecha — si se concreta, reabre Fase 4 para el hero (y los tests de Fase 8 del Hero deberán revisarse).
- ¿Se reintegran `ComoFunciona.jsx` y `CtaFinal.jsx` a la landing, o se quedan fuera del MVP de forma permanente? Decisión diferida indefinidamente.
- Número real de "10 minutos" para completar el test nunca fue medido — la investigación indica que una duración prometida que no se cumple perjudica; cronometrar las 77 preguntas antes de publicar cualquier cifra (en la landing o en el test).
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
