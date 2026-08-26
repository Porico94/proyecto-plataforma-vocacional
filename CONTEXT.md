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
engine.ts → vacío, pendiente (siguiente feature)
types.ts → vacío, pendiente
/data
preguntas.json → ✅ 106 preguntas reales, cargado y validado (3 tipos confirmados: likert, aptitud, eleccion_forzada)
carreras.json → ✅ 33 carreras reales, cargado
/public

- Stack confirmado para este proyecto: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript solo en `/lib/scoring` (aún no iniciado), JS en el resto de la UI, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP. React Compiler: desactivado por decisión. Node local: v20.17.0.
- Decisiones técnicas importantes y por qué:
  - Sin registro/login en el MVP; TypeScript limitado a `/lib/scoring`; sin base de datos en el MVP.
  - Persistencia vía `sessionStorage` con helper `lib/storage.js` (privacidad en computadoras compartidas de colegio).
  - Patrón de sincronización estado↔sessionStorage: variable local construida una vez, usada tanto para `setState` como para `storage.set`.
  - Lectura inicial desde sessionStorage en `useEffect` vacío, para evitar mismatch de hidratación SSR/cliente.
  - Arquitectura de componentes de pregunta: `test/page.jsx` es el orquestador único — mantiene `currentIndex`, `respuestas` y `error` como estado, y decide qué componente hijo renderizar con `if/else if` sobre `let campoPregunta`. Los componentes hijos NO tienen estado propio — reciben `pregunta`, `respuesta` (valor ya extraído) y `onResponder`, y solo capturan/muestran, nunca califican.
  - Reuso de componente por forma de dato, no por significado psicométrico: `aptitud` y `eleccion_forzada` comparten `PreguntaOpciones.jsx` porque tienen la misma forma en el JSON, aunque miden cosas distintas — la diferencia real se resuelve solo en el motor de scoring.
  - **Validación de "Siguiente" (Fase 5 — Parte 3, nueva decisión):** Opción A elegida — el botón permanece clickeable (nunca `disabled`); al hacer click, `handleSiguiente` valida contra `respuestas[preguntaActual.id]`. Si es `undefined`, hace `setError('mensaje')` y `return` temprano (guard clause), sin tocar `currentIndex`. Si hay respuesta, hace `setError('')` antes de avanzar. Se prefirió sobre `disabled` porque un botón deshabilitado no comunica _por qué_ está bloqueado a tecnologías asistivas; el patrón clickeable + validación sí permite dar feedback explícito.
  - **Botón "Anterior" (Fase 5 — Parte 3):** Se oculta por completo con `{currentIndex > 0 && <button>...}` en vez de mostrarse `disabled` en la primera pregunta — se consideró un caso conceptualmente distinto al de "Siguiente": no hay nada que el usuario deba corregir para "desbloquearlo", simplemente la acción no aplica en `currentIndex === 0`. `handleAnterior` decrementa `currentIndex`, actualiza `storage` y también hace `setError('')`, para evitar que un mensaje de error de la pregunta anterior quede visible al navegar a una pregunta distinta (regla general: el error solo debe seguir vivo si sigue siendo relevante al contexto actual; cualquier navegación lo limpia).
  - ⚠️ Stack nuevo detectado, pendiente de aprender en proyecto de Estudio antes de aplicarlo aquí: generación de PDF (jsPDF / @react-pdf/renderer); fundamentos de scoring psicométrico (inversión de ítems likert, agregación por subdimensión, normalización entre escalas distintas) antes de escribir `/lib/scoring/engine.ts`.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Test vocacional (flujo completo: preguntas → resultado → descarga PDF)
- Fase actual: Desarrollo (Fase 5) — Parte 3 cerrada, Parte 4 por iniciar
- En lo que estaba trabajando (Parte 3, ✅ cerrada):
  - Validación de input en `handleSiguiente`: bloqueo por click (no `disabled`) + mensaje inline (`error` en estado, mostrado con `<p>{error}</p>`) + limpieza de error al corregir o al navegar.
  - Botón "Anterior": oculto condicionalmente con `&&`, con su propio `handleAnterior` (mismo patrón estructural que `handleSiguiente`, sin validación de respuesta porque no aplica).
  - `test/page.jsx` queda funcionalmente completo para la navegación de preguntas (sin estilos, eso se deja para el cierre de todas las pantallas del test juntas).
- ❌ Pendiente (Parte 4, próxima):
  - Estudio aislado de scoring psicométrico (fundamentos: inversión de ítems likert, agregación por subdimensión, normalización entre escalas) en proyecto de Estudio, antes o en paralelo a iniciar `/lib/scoring/engine.ts`.
  - Implementación de `/lib/scoring/engine.ts`: lógica de scoring distinta para `likert` (agregación con inversión), `aptitud` (comparación contra `respuestaCorrecta`) y `eleccion_forzada` (filtro/peso, sin puntaje numérico).
  - Aún sin resolver: sendero de progreso visual y estilos Tailwind del test (se aplican al final, junto con `resultado/page.jsx`).

## Features completados ✅

(ninguno completo al 100% todavía — "Test vocacional" sigue en curso, Fase 5 avanzada; la pantalla de preguntas [`test/page.jsx`] ya está cerrada como sub-hito funcional)

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

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 4: estudio de fundamentos de scoring psicométrico e inicio de `/lib/scoring/engine.ts`.

## Dudas o problemas pendientes

- Definir si el estudio del motor de scoring se hace en un proyecto de Estudio aparte antes de tocar `engine.ts` en este proyecto, o si se estudia y aplica en paralelo — pendiente de decidir al abrir la Parte 4.
- Aún sin resolver el diseño visual del sendero de progreso del test (se decidirá en la fase de estilos, junto con `resultado/page.jsx`).
