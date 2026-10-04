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
/perfil/page.jsx → ✅ Funcionalmente completo. ⚠️ Sin estilos Tailwind (pendiente). Revisar qué pide hoy (el mockup antiguo pedía región, ver Dudas).
/test/page.jsx → 🔶 **Fase 4 en curso.** Hecho y subido a GitHub: (1) pantalla de carga con estado `cargandoDatos` (inicia en `true`, pasa a `false` al final del `useEffect` que lee `storage`; `if (cargandoDatos) return ...` va DESPUÉS de todos los hooks); (2) `etapas` calculado con `reduce` **fuera del componente**, agrupando `preguntas.json` por `dimension` → `[{dimension, inicio, fin}]`; (3) dentro del componente: `etapaActual` (`find` con `inicio <= currentIndex && fin >= currentIndex`), `numeroEtapa` (`indexOf(etapaActual) + 1`), `preguntaEnEtapa` (`currentIndex - inicio + 1`), `totalEnEtapa` (`fin - inicio + 1`); el JSX muestra "Etapa X de {etapas.length}" y "Pregunta Y de Z" en texto plano. Falta: mapa de nombres amigables, sendero en JSX, pantallas de cierre, estilos Tailwind.
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
preguntas.json → ✅ 77 preguntas, 5 dimensiones activas, **agrupadas (contiguas) en este orden**: `personalidad` 25 (índices 0-24), `riasec` 18 (25-42), `aptitudes` 12 (43-54), `inteligencias_multiples` 16 (55-70), `valores` 6 (71-76). Tipos: solo `aptitudes` es `aptitud` (opciones); el resto `likert`.
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
  - **Tailwind v4 aplica `scale-[...]` con la propiedad CSS `scale`, no con `transform`:** la clase de transición debe nombrar `scale` (`transition-[scale,box-shadow]`); si solo dice `transform`, el escalado salta de golpe. Verificado a mano en producción.
  - **Qué significa "estática" en `next build`:** el HTML se genera una sola vez, en el build, y se sirve igual a todos. `/test`, `/resultado` y `/perfil` salen estáticas porque el cálculo personalizado ocurre en el navegador dentro de `useEffect` (lectura de `storage.js`).
  - **(NUEVO, Test) Dónde corre cada código:** el cuerpo del componente corre en Node (durante `next build`) Y en el navegador; el `useEffect` corre SOLO en el navegador. Por eso leer `sessionStorage` como valor inicial (`useState(storage.get(...))`) rompe el build (`sessionStorage is not defined`: la API no existe en Node), y se lee dentro de `useEffect`. Además evita el hydration mismatch (el primer render del navegador debe coincidir con el HTML del build). Llamar a un `set...` en el cuerpo del componente, sin efecto, da otro error distinto: "Too many re-renders".
  - **(NUEVO, Test) Pantalla de carga al restaurar progreso:** estado `cargandoDatos` inicia en `true` (lo cierto en el primer render) y pasa a `false` al final del `useEffect`. Se usa retorno anticipado (`if (cargandoDatos) return ...`) colocado **después de todos los hooks** (regla de los hooks: mismo orden en cada render; un retorno antes del `useEffect` dejaría el efecto sin registrar y la pantalla de carga infinita). Se descartaron esqueleto y contenedor vacío.
  - **(NUEVO, Test) `etapas` se deriva de `preguntas.json`, no se escribe a mano:** rangos fijos con índices se desfasarían en silencio al agregar/quitar preguntas. Condición: las preguntas de una misma dimensión deben quedar contiguas en el JSON. Va fuera del componente porque solo depende de datos que no cambian (se calcula una vez al cargar el módulo); `find` y las fórmulas van dentro porque dependen de `currentIndex` (estado). Los objetos se pasan por referencia: `find` devuelve el mismo objeto que está en el array, por eso `indexOf(etapaActual)` funciona.
  - **(NUEVO, Test) Sendero de progreso — decisión:** se usará el sendero del mockup "La Ruta" (paradas hecha/actual/pendiente, una por dimensión, lateral en escritorio y horizontal en móvil), no una barra simple. Hallazgos de investigación: una barra de progreso constante no reduce el abandono de forma significativa (meta-análisis de 32 experimentos); importa que la duración prometida sea honesta y que haya hitos por etapas. Para el sendero: `<ol>` con `aria-current="step"` en la parada actual (los emojis son decorativos); estado de cada parada derivado de `etapas` y `currentIndex` (hecha si `fin < currentIndex`, actual si `currentIndex` cae en el rango, pendiente si `inicio > currentIndex`); mantener el contador "Pregunta Y de Z" dentro de la etapa.
  - **(NUEVO, Test) Niveles del sendero:** básico = sendero + etiqueta de etapa + contador (en curso); medio = pantallas de cierre entre etapas (avisar que la etapa 3, aptitudes, cambia de formato: opciones en vez de escala 1-5); extra (opcional, al final del feature) = fondo que pasa de `noche` hacia `amanecer` según avanza (verificar contraste AA en cada tramo del degradado en Fase 6; animarlo en Fase 7).
  - **(NUEVO, Test) Mockup original "La Ruta" (HTML de chats iniciales) — solo referencia, está desactualizado:** usa 106 preguntas y 9 paradas (hoy 77 y 5), un tipo "elección forzada" que no existe y mide restricciones eliminadas, pide región en el perfil, otra identidad (Clash Display/Sora, azul/dorado/turquesa, toggle claro/oscuro) y dice 33 carreras (hoy 46). Se aprovecha: sendero lateral/horizontal, likert tipo altímetro con etiquetas de extremos, enfoque de "reto" para aptitudes. Nombres amigables a reutilizar: personalidad → "Cómo eres", riasec → "Qué te atrae", aptitudes → "Tus habilidades", inteligencias_multiples → "Cómo piensas mejor", valores → "Lo que valoras".
  - **`robots: { index: false }` va en `layout.js` (aplica a todo el sitio), no en `page.jsx`.** Es un pedido de cortesía a buscadores, no seguridad: quien tenga el link entra. Se quita al abrir el proyecto al público.
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
  - Se mantienen las decisiones de Parte 13-14: motor dividido en Grupo A/B, top 10 fijo, cálculos costosos en `useEffect`+estado propio.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: **Test**
- Fase actual: **Fase 4 (Diseño UI) — en curso.** Falta cerrarla (sendero en JSX, pantallas de cierre, estilos con tokens de marca) antes de pasar a la Fase 5.
- En lo que se trabajó en la última sesión (Test, Fase 4, Parte 1):
  - Pregunta de entrevista pendiente cerrada (leer `sessionStorage` en el render rompe el build; corrección con `useState` + `useEffect`). Pool necesitó repasar el tema; quedó claro con la tabla "qué corre dónde" (cuerpo del componente: Node y navegador; `useEffect`: solo navegador).
  - Pantalla de carga al restaurar el progreso (`cargandoDatos`, retorno anticipado después de los hooks).
  - Cálculo de `etapas` con `reduce` (fuera del componente) y de `etapaActual`, `numeroEtapa`, `preguntaEnEtapa`, `totalEnEtapa` (dentro); el JSX ya muestra "Etapa X de 5" y "Pregunta Y de Z". Probado a mano en el navegador y subido a GitHub.
  - Investigación sobre progreso en cuestionarios largos y decisión de usar el sendero del mockup "La Ruta" (ver Decisiones técnicas).
  - Checkpoint de comprensión: pregunta 1 respondida bien (por qué derivar `etapas` del JSON). Pregunta 2 a medias: Pool dijo que el `reduce` va fuera "porque necesitamos el array completo"; la razón correcta es que solo depende de datos fijos (se calcula una vez) mientras que `find` y las fórmulas dependen de `currentIndex` (estado). **Pendiente de reforzar al inicio de la próxima sesión.**
  - Conceptos que costaron y conviene repasar en entrevista: `reduce` con array como valor inicial, índice `-1` de `acc[acc.length - 1]` en array vacío (`undefined`), objetos por referencia (`ultima.fin = indice` modifica el mismo objeto que está en `acc`), `indexOf` busca el elemento tal cual (objeto completo, no una propiedad).

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
- **(NUEVO)** Las preguntas de una misma dimensión deben estar contiguas en `preguntas.json`; el progreso del test se calcula por etapas (una por dimensión) derivadas de ese archivo, nunca con rangos escritos a mano.
- **(NUEVO)** Todo cálculo que dependa de `sessionStorage`/`localStorage` va dentro de `useEffect`, nunca en el valor inicial de `useState` ni en el cuerpo del componente.
- **(NUEVO)** Un retorno anticipado en un componente va siempre después de todos los hooks.
- Se mantienen las reglas de Parte 13-14: comparación estudiante↔carrera dividida en dos grupos; un solo `<h1>` por página; toda dimensión del test debe tener razón de uso clara.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión". Al inicio, retomar en 5 minutos la pregunta 2 del checkpoint (por qué el `reduce` va fuera del componente y el `find`/fórmulas dentro). Después, continuar la **Fase 4 del feature Test**: crear el mapa de nombres amigables por dimensión (objeto `dimension` → texto, sin índices) y construir el sendero en JSX como `<ol>` con `aria-current="step"` en la parada actual y estado hecha/actual/pendiente derivado de `etapas` y `currentIndex`.

## Dudas o problemas pendientes

- **Riesgo anotado para Fase 8 (Testing con estado):** si el índice guardado en storage queda fuera de rango (p. ej. se quitan preguntas del JSON con un test a medias), `preguntaActual` y `etapaActual` serían `undefined` y la página se rompería. Decidir cómo validar/resetear el índice guardado.
- Decidir si `/perfil` sigue pidiendo región: el mockup antiguo la usaba para ajustar carreras, pero las restricciones personales fueron eliminadas del algoritmo. Definir qué pide hoy esa página (nombre para el PDF, etc.).
- Estilos Tailwind pendientes de `/perfil/page.jsx` (la página donde el estudiante pone su nombre).
- `PreguntaLikert.jsx`: mostrar las `escala.etiquetas` del JSON para que se entiendan los extremos de la escala 1-5 (se resuelve en la Fase 4 del feature Test).
- Pantallas de cierre entre etapas: definir copy breve (tono directo, "cero floro") y avisar el cambio de formato antes de la etapa de aptitudes.
- Nivel extra del sendero (fondo `noche` → `amanecer`): pendiente para el final del feature (contraste en Fase 6, animación en Fase 7).
- `next/font` es stack nuevo para Pool — pendiente de estudio aislado en el proyecto de Aprendizaje, junto con Tailwind v4, generación de PDF y **GitHub Actions** (necesario antes de montar CI en la Fase 8 del feature Test).
- Opcional: quitar el bloque duplicado `# Playwright` de `.gitignore` (commit `chore: dedupe gitignore`) y, si algún día se crea `.env.example`, agregar `!.env.example` porque `.env*` también lo ignora.
- Opcional: `title.template` en `layout.js` para que todas las páginas lleven la marca en el título (hoy el title por defecto no la incluye).
- Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida.
- Aplicar los tokens de identidad visual a los estilos Tailwind pendientes de `ConsejoVocacional.jsx`, el bloque de carreras recomendadas en `resultado/page.jsx`, y el sendero de progreso visual del test.
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