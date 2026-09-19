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
/page.js → Landing (pendiente de personalizar — aquí se definirá la identidad visual de marca del proyecto)
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo
/resultado/page.jsx → ✅ Completo (Parte 14): `<ConsejoVocacional/>` integrado, `obtenerTop10Carreras` conectado, debug reemplazado por lista real de carreras recomendadas con desglose por dimensión. Estilos Tailwind bloqueados hasta definir identidad visual.
/components
/test/
PreguntaLikert.jsx → ✅ Completo. ⚠️ Detectado en Parte 14: no indica al estudiante qué significan los extremos de la escala 1-5 — pendiente para ciclo de Responsive+Accesibilidad.
PreguntaOpciones.jsx → ✅ Completo
/resultado/
ConsejoVocacional.jsx → ✅ Contenido y estructura completos. PENDIENTE: estilos Tailwind (bloqueado por identidad visual).
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo (perfil del estudiante desde respuestas)
recomendacion.ts → ✅ Completo — motor de comparación estudiante↔carreras, conectado a la UI en Parte 14.
normalizar.ts → ✅ Completo
constants.ts → ✅ Completo
types.ts → ✅ Completo
/data
preguntas.json → ✅ 77 preguntas, 5 dimensiones activas (`personalidad` 25, `riasec` 18, `inteligencias_multiples` 16, `aptitudes` 12, `valores` 6).
carreras.json → 🔶 46 entradas. Array plano de objetos; cada carrera tiene `riasec`/`aptitudes`/`personalidad` como objetos `{subdimension: numero}` (Grupo A), `inteligencias_multiples`/`valores` como arrays de strings (Grupo B), más `universidades`, `sectoresEmpleo` (informativos, no usados en el motor de recomendación). Campo opcional `notaCobertura` en 19/46 entradas.
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- Decisiones técnicas importantes y por qué (se mantienen las de Parte 12-13, se agregan):
  - **(NUEVO — Parte 14) `resultado/page.jsx` calcula `resultado` y `top10` dentro del mismo `useEffect` con `[]`**, cada uno en su propio `useState`. Dos razones distintas y complementarias: (1) separación de responsabilidades — `recomendacion.ts` es lógica de negocio pura sin dependencias de React, testeable de forma aislada; (2) optimización de render — calcular `obtenerTop10Carreras` (que recorre 46 carreras con distancia euclidiana por dimensión) dentro del cuerpo del componente en vez de en el efecto obligaría a recalcularlo en cada render, no solo cuando los datos de entrada cambian.
  - **(NUEVO — Parte 14) Desglose por dimensión en la UI** se renderiza con un `.map()` anidado sobre `Object.entries(carrera.porDimension)` dentro de cada `<li>` de carrera — mismo patrón que usa `calcularPorDimension` internamente en `recomendacion.ts`, aplicado ahora del lado de presentación.
  - Se mantienen las decisiones de Parte 13: motor dividido en Grupo A (distancia euclidiana) y Grupo B (promedio invertido), conversión a porcentaje, top 10 fijo.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9, renombre de claves en Parte 13 — ver arriba).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Resultado del test — carreras recomendadas — Fase 5 (Desarrollo) cerrada, Fase 4 (Diseño UI) bloqueada
- Fase actual: Entre ciclos — Parte 14 cerrada, lógica de `resultado/page.jsx` completa. Siguiente feature natural aún por decidir (ver Próximo paso concreto).
- En lo que se trabajó en Parte 14 (sesión de hoy):
  - Se conectó `obtenerTop10Carreras` dentro de `resultado/page.jsx`: import de `carreras.json` y de la función desde `recomendacion.ts`, cálculo de `top10Calculado` en el mismo `useEffect` que `resultadoCalculado`, guardado en estado propio `top10`.
  - Se reemplazó el debug `JSON.stringify` por estructura semántica: `<section>` con `<h2>`, lista de carreras (`<h3>` + `.total.toFixed(1)}%`) y desglose por dimensión anidado (`<ul>` de `Object.entries(carrera.porDimension)`).
  - Se corrigieron dos bugs de la primera versión del código de Pool: import apuntando a `recomendaciones` (plural) en vez de `recomendacion` (singular); jerarquía de headings rota (`<h1>` repetido 10 veces dentro del `.map()`, corregido a `<h3>`).
  - Checkpoint de comprensión cerrado exitosamente: Pool distinguió correctamente useEffect (necesario por SSR/hydration — storage no existe en servidor), useState+useEffect para top10 (evita recalcular `obtenerTop10Carreras` en cada render), y separación de responsabilidades (`recomendacion.ts` como lógica de negocio pura, testeable sin React) como decisiones de capas distintas, no la misma.
  - Preguntas técnicas de entrevista respondidas correctamente: por qué `Object.values()` y no `Object.entries()` en el promedio de `calcularCompatibilidadCarrera`; por qué un tercer cálculo derivado de `resultado` iría en el mismo `useEffect` con `[]` en vez de uno nuevo con `[resultado]`, dado que `resultado` no cambia tras el cálculo inicial.
  - Se detectó (fuera de alcance de esta parte, anotado para después): `PreguntaLikert.jsx` no indica al estudiante el significado de los extremos de la escala 1-5 — decisión tomada de resolverlo en el ciclo de Responsive+Accesibilidad del feature del test, no ahora.
- ❌ Pendiente (continúa en la próxima sesión):
  - Definir identidad visual de marca del proyecto (paleta, tipografía) — probablemente al iniciar la Landing. Desbloquea estilos de `ConsejoVocacional.jsx` y del bloque de carreras recomendadas ya conectado.
  - Sendero de progreso visual y estilos Tailwind del test.
  - Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida.
  - Mejora de accesibilidad pendiente en `PreguntaLikert.jsx`: indicar significado de los extremos de la escala 1-5 (ver Dudas pendientes).
  - Seguir agregando carreras según prioridad (ver lista abajo).
  - Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer).
  - Estudio aislado de Tailwind CSS en el proyecto de Aprendizaje.

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación; simplificación de `engine.ts`/`types.ts` — Parte 11.
- [x] Redacción e implementación del componente `ConsejoVocacional.jsx` (contenido y estructura semántica) — Parte 11.
- [x] Integración de `<ConsejoVocacional/>` en `resultado/page.jsx` — Parte 12.
- [x] Eliminación de `motivaciones` y `estilo_aprendizaje` de `preguntas.json`; renombre de claves de `carreras.json` para coincidir con `resultado` — Parte 13.
- [x] Motor de recomendación completo (`recomendacion.ts`): distancia euclidiana (Grupo A), compatibilidad categórica (Grupo B), combinación por carrera, conversión a %, y top 10 — Parte 13.
- [x] Conexión de `obtenerTop10Carreras` en `resultado/page.jsx`: debug reemplazado por UI semántica real con desglose por dimensión — Parte 14.

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas, se agregan:)

- **(NUEVO — Parte 14) Cálculos costosos y derivados de datos externos (storage, fetch, etc.) van en `useEffect` + estado propio; cálculos triviales sobre estado que ya se tiene pueden ir directo en el cuerpo del render.** Regla general de React adoptada tras el checkpoint de esta parte.
- **(NUEVO — Parte 14) Un solo `<h1>` por página; el resto de headings desciende en orden (`h2` → `h3`...) según jerarquía real de contenido**, incluso dentro de listas generadas con `.map()`.
- Se mantienen las reglas de Parte 13: comparación estudiante↔carrera dividida en dos grupos según forma del dato; toda dimensión del test debe tener razón de uso clara dentro del MVP; se muestran las 10 carreras de mayor compatibilidad con desglose por dimensión.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión". Definir con Pool cuál es el siguiente feature: probablemente **Fase 4 (Diseño UI) de la Landing**, ya que definir la identidad visual de marca ahí desbloquea los estilos pendientes de `ConsejoVocacional.jsx` y del bloque de carreras recomendadas. Alternativa: cerrar primero el texto fijo pendiente sobre esfuerzo individual en `resultado/page.jsx` antes de saltar a Landing.

## Dudas o problemas pendientes

- **Identidad visual de marca aún sin definir** — bloquea estilos Tailwind de `ConsejoVocacional.jsx` y del bloque de carreras recomendadas (ya conectado funcionalmente). Se resolverá probablemente en el ciclo de la Landing.
- **(NUEVO — Parte 14) `PreguntaLikert.jsx` no indica al estudiante el significado de los extremos de la escala 1-5** (ej. 1 = muy en desacuerdo, 5 = muy de acuerdo). Detectado por Pool al probar el flujo completo. Resolución diferida al ciclo de Responsive+Accesibilidad del feature del test (no se modifica un feature ya cerrado fuera de su propio ciclo).
- **Idea futura (post-MVP):** `ConsejoVocacional` dismissible con retraso inicial + imagen motivacional — requiere su propio ciclo Fase 4-7 completo.
- **Idea futura (post-MVP):** modos de test "normal" vs. "preciso" — el modo preciso reintroduciría preguntas de dimensiones descartadas (`motivaciones`, `estilo_aprendizaje`) para mayor precisión.
- **Idea futura (post-MVP):** reemplazar el "top 10 fijo" de carreras recomendadas por un umbral mínimo de compatibilidad, para evitar mostrar carreras poco compatibles solo por completar el número.
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
- Diseño del sistema de filtros post-MVP para `ritmo_trabajo`, `esfuerzo_fisico` y `disponibilidad_viajar` — vivirán como controles de filtro en `resultado/page.jsx`, mecánica exacta aún no diseñada. Fuera de alcance hasta después del MVP.
- Diseño visual del sendero de progreso del test, ni la UI real de `resultado/page.jsx` — estructura semántica ya lista, solo falta estilo.
