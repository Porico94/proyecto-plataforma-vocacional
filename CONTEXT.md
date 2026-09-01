# CONTEXT.md — Plataforma de Orientación Vocacional

## Definición del proyecto (Fase 1 — fija, no cambia)

- Problema que resuelve: Los estudiantes de secundaria en Perú (15-18 años) eligen carrera técnica o universitaria sin criterio real, guiados por marketing/moda, sin considerar mercado laboral, aptitudes reales ni factores personales — lo que puede traducirse en años y dinero perdidos (caso real: el creador estudió Ingeniería Mecatrónica en 2011 guiado por marketing, sin encontrar mercado laboral al graduarse).
- Para quién es: Estudiantes peruanos de colegio a punto de decidir carrera técnica o universitaria. Caso semilla: un familiar del creador. Objetivo final: todos los estudiantes del Perú.
- Propuesta de valor: A diferencia del test vocacional típico (percibido como poco objetivo), esta plataforma combina múltiples dimensiones psicométricas + datos reales de mercado laboral peruano + experiencias reales de profesionales (foros), para dar una recomendación con criterio, no genérica.
- MVP (alcance inicial): Test completo (personalidad, RIASEC, aptitudes cognitivas, inteligencias múltiples, valores, motivaciones, estilo de aprendizaje, preferencias de estilo de vida, restricciones personales) → motor de recomendación contra dataset estático de carreras → resultado descargable en PDF. Sin registro/login. Usuarios: grupo cerrado de beta testers.
- Qué NO incluye el MVP: Registro/login/autenticación, persistencia de resultados en base de datos, integración de datos de mercado laboral en tiempo real, análisis de foros con IA, apertura a público general.
- Objetivos corto/mediano plazo:
  - Corto plazo: MVP funcional de punta a punta (test completo → recomendación → descarga PDF) para que el familiar del creador y 3-5 beta testers más lo prueben y den feedback real.
  - Mediano plazo: Iterar el motor de recomendación según feedback recibido, luego iniciar primer feature post-MVP (probablemente mercado laboral, dado que análisis de foros con IA es más complejo).

## Investigación (Fase 2 — fija, no cambia)

- Competidores/referencias analizados: Ponte en Carrera (MTPE/Minedu), Mi Carrera (Ministerio de Trabajo), tests de universidades privadas (UCV/ISIL/UPN), EstudiaPerú, TestVocacional.app.
- Lo bueno (para aprender): Combinar varias metodologías psicométricas en un solo perfil da más solidez que un test único (TestVocacional.app). Integrar datos reales de mercado laboral aporta valor concreto (Mi Carrera). Sin registro / fricción mínima al inicio mejora la conversión (EstudiaPerú). Resultado descargable como alternativa a cuentas de usuario.
- Lo malo (para evitar): Fragmentar el test en varias pruebas sueltas y desconectadas (Ponte en Carrera). Sesgo de negocio disfrazado de orientación objetiva (universidades privadas). Profundidad sacrificada por velocidad (EstudiaPerú). UX anticuada en plataformas del Estado.
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales (economía familiar, ubicación, tiempo disponible) como parte del algoritmo. Ninguna combina test multidimensional completo + mercado laboral peruano actualizado + experiencias reales de profesionales vía foros, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas (actualizada):

/app
/page.js → Landing (generado por scaffold, pendiente de personalizar)
/perfil/page.jsx → ✅ Completo (Fase 5)
/test/page.jsx → ✅ Completo (Fase 5) — orquestador de los 3 tipos de pregunta, validación de input y navegación Anterior/Siguiente funcionando; sin estilos todavía
/resultado/page.jsx → vacío, pendiente
/components
/test/
PreguntaLikert.jsx → ✅ Completo y probado
PreguntaOpciones.jsx → ✅ Completo y probado (reusado para tipos aptitud y eleccion_forzada)
/resultado/ → vacío, pendiente
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo (Fase 5 — Parte 4): scoreEngineLikert, scoreEngineAptitud, scoreEngineEleccionForzada, scoreEnginePerfil
types.ts → ✅ Completo (Fase 5 — Parte 4): interface Pregunta con campos opcionales por tipo
/data
preguntas.json → ✅ 106 preguntas reales, cargado y validado (3 tipos confirmados: likert, aptitud, eleccion_forzada)
carreras.json → ✅ 33 carreras reales, cargado
/public

- Stack confirmado para este proyecto: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring` (ya iniciado y funcional), JS en el resto de la UI, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP. React Compiler: desactivado por decisión. Node local: v20.17.0.
- Decisiones técnicas importantes y por qué:
  - Sin registro/login en el MVP; TypeScript limitado a `/lib/scoring`; sin base de datos en el MVP.
  - Persistencia vía `sessionStorage` con helper `lib/storage.js` (privacidad en computadoras compartidas de colegio).
  - Patrón de sincronización estado↔sessionStorage: variable local construida una vez, usada tanto para `setState` como para `storage.set`.
  - Lectura inicial desde sessionStorage en `useEffect` vacío, para evitar mismatch de hidratación SSR/cliente.
  - Arquitectura de componentes de pregunta: `test/page.jsx` es el orquestador único — mantiene `currentIndex`, `respuestas` y `error` como estado, y decide qué componente hijo renderizar con `if/else if` sobre `let campoPregunta`. Los componentes hijos NO tienen estado propio — reciben `pregunta`, `respuesta` (valor ya extraído) y `onResponder`, y solo capturan/muestran, nunca califican.
  - Reuso de componente por forma de dato, no por significado psicométrico: `aptitud` y `eleccion_forzada` comparten `PreguntaOpciones.jsx` porque tienen la misma forma en el JSON, aunque miden cosas distintas — la diferencia real se resuelve solo en el motor de scoring.
  - **Validación de "Siguiente" (Fase 5 — Parte 3):** Opción A elegida — el botón permanece clickeable (nunca `disabled`); al hacer click, `handleSiguiente` valida contra `respuestas[preguntaActual.id]`. Si es `undefined`, hace `setError('mensaje')` y `return` temprano (guard clause), sin tocar `currentIndex`. Si hay respuesta, hace `setError('')` antes de avanzar. Se prefirió sobre `disabled` porque un botón deshabilitado no comunica _por qué_ está bloqueado a tecnologías asistivas.
  - **Botón "Anterior" (Fase 5 — Parte 3):** Se oculta por completo con `{currentIndex > 0 && <button>...}` en vez de mostrarse `disabled` en la primera pregunta. `handleAnterior` decrementa `currentIndex`, actualiza `storage` y hace `setError('')`.
  - **Motor de scoring (Fase 5 — Parte 4, nuevo):** `interface Pregunta` en `types.ts` centraliza la forma de una pregunta, con campos específicos por tipo marcados como opcionales (`escala?`, `invertida?`, `opciones?`, `respuestaCorrecta?`), porque una sola pregunta nunca tiene todos los campos a la vez (dependen de `tipo`).
  - **Patrón de dos pasos (reduce doble) para likert y aptitud:** primer `reduce` agrupa por `subdimension` acumulando valores crudos (`{suma, count}` en likert, `{aciertos, count}` en aptitud); un segundo `reduce` sobre `Object.entries(...)` calcula la métrica final (promedio o porcentaje) por subdimensión. Se necesitan dos pasos separados porque el cálculo final requiere haber visto **todas** las preguntas de una subdimensión antes de poder calcularlo — no se puede resolver en una sola pasada.
  - **`eleccion_forzada` usa un solo `reduce`:** no hay agregación matemática (no hay promedio ni porcentaje), solo transcripción directa de la respuesta elegida por subdimensión — por eso no necesita el segundo paso.
  - **Inversión de ítems likert:** se calcula en una única variable (`valorRespuesta`) **antes** del `if/else` de agrupación, usando la fórmula `(min + max) - x`, para no duplicar la lógica del ternario en ambas ramas del if/else.
  - **Tipos TS en `respuestas`:** el objeto real es compartido entre las tres funciones de scoring y mezcla `number` (likert) y `string` (aptitud, eleccion_forzada) según el `id` de pregunta — tipado como `Record<string, number | string>`. Dentro de cada función se usa `as number` o `as string` para afirmar el tipo puntual esperado en ese contexto, ya que TS no puede inferir automáticamente cuál de las dos alternativas del union aplica según el `tipo` de pregunta ya filtrado previamente.
  - **`escala!` (non-null assertion):** usado en `scoreEngineLikert` porque el dataset es estático, propio y ya validado (106 preguntas) — se optó por la afirmación directa en vez de un `if` de validación redundante.
  - **`scoreEnginePerfil`:** función combinadora que ejecuta las tres funciones de scoring y fusiona sus resultados en un solo objeto plano con spread (`{...resultadoLikert, ...resultadoAptitud, ...resultadoEleccionForzada}`), ya que las claves (subdimensiones) no se repiten entre los tres grupos. No hace ningún cálculo propio — solo orquesta y fusiona. **Este perfil combinado es la entrada para un futuro motor de recomendación (no implementado aún) que lo comparará contra `carreras.json`.**
  - ⚠️ Stack nuevo aprendido en proyecto de Estudio antes de aplicarlo aquí: fundamentos de scoring psicométrico (inversión de ítems, agregación por subdimensión) — ya aplicado con éxito. Generación de PDF (jsPDF / @react-pdf/renderer) — pendiente de estudiar.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Test vocacional (flujo completo: preguntas → resultado → descarga PDF)
- Fase actual: Desarrollo (Fase 5) — Parte 4 cerrada, Parte 5 por iniciar
- En lo que estaba trabajando (Parte 4, ✅ cerrada):
  - `types.ts`: `interface Pregunta` completa, con campos comunes obligatorios y campos específicos por tipo marcados opcionales (`?`).
  - `engine.ts`: 4 funciones completas y exportadas — `scoreEngineLikert`, `scoreEngineAptitud`, `scoreEngineEleccionForzada`, `scoreEnginePerfil`. Sin errores de TypeScript.
  - Motor de scoring probado conceptualmente con trace manual (ejemplo de subdimensión `apertura` con ítems invertidos, resultado coherente).
- ❌ Pendiente (Parte 5, próxima):
  - Conectar `scoreEnginePerfil` con datos reales: llamarlo desde donde corresponda (ej. `resultado/page.jsx` o una función intermedia) usando las `respuestas` reales guardadas en `sessionStorage` y las `preguntas` importadas del JSON.
  - Diseñar el **motor de recomendación** (feature nuevo, no iniciado): cómo comparar el perfil combinado (`scoreEnginePerfil`) contra `carreras.json` para generar un ranking de carreras sugeridas. Incluye lógica de ponderación con `disponibilidadPeru` y restricciones personales (ya definida como regla de negocio: pondera/reordena, nunca filtra duro).
  - Aún sin resolver: sendero de progreso visual y estilos Tailwind del test (se aplican al final, junto con `resultado/page.jsx`).
  - Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer) — pendiente, antes de implementar la descarga de resultados.

## Features completados ✅

(ninguno completo al 100% todavía — "Test vocacional" sigue en curso, Fase 5 avanzada; la pantalla de preguntas [`test/page.jsx`] y el motor de scoring [`lib/scoring/engine.ts`] ya están cerrados como sub-hitos funcionales)

## Reglas de negocio definidas

- El resultado del test no debe tratarse como definitivo/fijo de por vida.
- El dataset de carreras usa rangos de costo categóricos (bajo/medio/alto), no montos exactos.
- El campo `disponibilidadPeru` de cada carrera se usa junto con "restricciones personales" para ajustar la recomendación según viabilidad geográfica.
- Las preguntas tipo `aptitud` miden habilidad real (respuesta correcta objetiva) — el motor de scoring debe tratarlas distinto a `likert`. La UI nunca califica, solo captura.
- Las preguntas tipo `eleccion_forzada` no tienen puntaje numérico — su valor se usa como filtro/peso en el motor de recomendación, no se agrega a un perfil psicométrico.
- Los ítems `likert` marcados con `invertida: true` deben invertirse en el scoring (`(min+max) - valor`) antes de agregarse, para consistencia de escala.
- La región de residencia es opcional; si no se indica, no hay ponderación geográfica.
- Las restricciones personales deben ponderar/reordenar el ranking, nunca filtrar duro.
- Las respuestas del test se indexan por `id` de pregunta, nunca por posición/índice del array.
- El botón "Siguiente" nunca se deshabilita (`disabled`); se valida al hacer click, mostrando feedback inline explícito si falta respuesta.
- El botón "Anterior" no se muestra en la primera pregunta (`currentIndex === 0`), en vez de mostrarse deshabilitado.
- Cualquier navegación entre preguntas (Anterior o Siguiente exitoso) limpia el mensaje de error activo, sin importar si la nueva pregunta tiene o no respuesta.
- El motor de scoring nunca decide recomendación de carrera — solo produce un perfil numérico/categórico del usuario (`scoreEnginePerfil`). La comparación contra `carreras.json` es responsabilidad de un motor de recomendación separado, aún no implementado.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 5: conectar `scoreEnginePerfil` con datos reales y comenzar a diseñar el motor de recomendación contra `carreras.json`.

## Dudas o problemas pendientes

- Definir dónde y cuándo se invoca `scoreEnginePerfil` en el flujo real de la app (¿al terminar el test, en `resultado/page.jsx`? ¿en un `useEffect`?).
- Diseñar el algoritmo de comparación perfil-usuario vs. carreras: ¿qué método de similitud o ponderación se usará? Aún no discutido.
- Aún sin resolver el diseño visual del sendero de progreso del test (se decidirá en la fase de estilos, junto con `resultado/page.jsx`).
