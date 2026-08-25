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
  /test/page.jsx → 🔄 En progreso (Fase 5) — orquestador de los 3 tipos de pregunta, sin estilos ni botón "Anterior" todavía
  /resultado/page.jsx → vacío, pendiente
  /components
  /test/
  PreguntaLikert.jsx → ✅ Completo y probado
  PreguntaOpciones.jsx → ✅ Completo y probado (reusado para tipos `aptitud` y `eleccion_forzada`)
  /resultado/ → vacío, pendiente
  /ui/ → vacío, pendiente
  /lib
  /storage.js → ✅ Completo
  /scoring/
  engine.ts → vacío, pendiente
  types.ts → vacío, pendiente
  /data
  preguntas.json → ✅ 106 preguntas reales, cargado y validado (3 tipos confirmados: likert, aptitud, eleccion_forzada)
  carreras.json → ✅ 33 carreras reales, cargado
  /public

- Stack confirmado para este proyecto: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript solo en `/lib/scoring` (aún no iniciado), JS en el resto de la UI, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP. React Compiler: desactivado por decisión. Node local: v20.17.0.
- Decisiones técnicas importantes y por qué:
  - Sin registro/login en el MVP; TypeScript limitado a `/lib/scoring`; sin base de datos en el MVP (ver sesiones anteriores para detalle completo).
  - Persistencia vía `sessionStorage` con helper `lib/storage.js` (privacidad en computadoras compartidas de colegio).
  - Patrón de sincronización estado↔sessionStorage: variable local construida una vez, usada tanto para `setState` como para `storage.set`.
  - Lectura inicial desde sessionStorage en `useEffect` vacío, para evitar mismatch de hidratación SSR/cliente.
  - **Arquitectura de componentes de pregunta (Fase 5 — Parte 2, nueva decisión):** `test/page.jsx` es el orquestador único — mantiene `currentIndex` y `respuestas` como estado, y decide qué componente hijo renderizar con un `if/else if` (usando `let campoPregunta` declarada fuera de los condicionales, reasignada dentro, con un solo `return` al final). Los componentes hijos (`PreguntaLikert`, `PreguntaOpciones`) NO tienen estado propio — reciben `pregunta` (objeto resuelto), `respuesta` (valor ya extraído, no el objeto completo), y `onResponder` (callback), y solo capturan/muestran, nunca califican.
  - **Reuso de componente por forma de dato, no por significado psicométrico:** `aptitud` y `eleccion_forzada` comparten el mismo componente `PreguntaOpciones.jsx` porque tienen la misma forma en el JSON (array `opciones` de texto, sin escala numérica) — a pesar de que conceptualmente miden cosas distintas (habilidad real vs. preferencia). La diferencia real entre ambas (que `aptitud` tiene `respuestaCorrecta` y debe calificarse) se resuelve exclusivamente en el motor de scoring, nunca en la UI.
  - ⚠️ Stack nuevo detectado, pendiente de aprender en proyecto de Estudio antes de aplicarlo aquí: generación de PDF (jsPDF / @react-pdf/renderer); fundamentos de scoring psicométrico (inversión de ítems likert, agregación por subdimensión, normalización entre escalas distintas) antes de escribir `/lib/scoring/engine.ts`.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Test vocacional (flujo completo: preguntas → resultado → descarga PDF)
- Fase actual: Desarrollo (Fase 5) — Parte 2 cerrada, Parte 3 por iniciar
- En lo que estaba trabajando (Parte 2, ✅ cerrada):
  - `PreguntaLikert.jsx`: ✅ Completo, probado en navegador. Recibe `pregunta`, `respuesta`, `onResponder`; renderiza 5 botones fijos (1-5); guarda el número elegido.
  - `PreguntaOpciones.jsx`: ✅ Completo, probado en navegador. Mismo contrato de props; recorre `pregunta.opciones` (array dinámico) con `.map()`; guarda el texto de la opción elegida. Usado para `aptitud` y `eleccion_forzada`.
  - `test/page.jsx`: ✅ Soporta los 3 tipos de pregunta con lógica condicional (`if/else if` sobre `preguntaActual.tipo`), delegando el renderizado a los componentes hijos correspondientes. Navegación, persistencia y captura de respuestas siguen funcionando igual que antes del refactor, ahora validado también para `aptitud` y `eleccion_forzada`.
  - Errores corregidos durante el ciclo (para referencia futura, patrones repetibles): mismatch entre nombre de función exportada y nombre de import (mayúscula/minúscula); pasar el objeto `respuestas` completo al hijo en vez del valor ya extraído; `return` dentro de un `if` cortando la ejecución de toda la función en vez de solo el bloque; variable declarada con `const` dentro de un bloque `{ }` sin scope fuera de él; condición de `if` comparando contra un valor (`'opciones'`) que no existe en los datos reales.
- ❌ Pendiente (Parte 3, próxima):
  - Botón "Anterior" (solo existe "Siguiente" por ahora).
  - Validación de input: qué pasa si el estudiante avanza sin elegir ninguna opción (pregunta abierta desde esta sesión, aún sin resolver).
  - Sendero de progreso visual y estilos Tailwind (paleta dorado/teal, tipografías) — se aplican al final, a todas las pantallas del test juntas.
  - Estudio aislado de scoring psicométrico (prompt ya generado en sesión anterior) antes de iniciar `/lib/scoring/engine.ts`.

## Features completados ✅

(ninguno completo al 100% todavía — "Test vocacional" sigue en curso, Fase 5 avanzada; los 3 tipos de pregunta en UI ya están cerrados como sub-hito)

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

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 3: agregar botón "Anterior" en `test/page.jsx` y resolver la validación de "avanzar sin responder" (decidir si se bloquea el botón "Siguiente" o se permite y se maneja al final del test).

## Dudas o problemas pendientes

- ¿Bloquear "Siguiente" si no hay respuesta, o permitir avanzar y marcar preguntas sin responder al final? — decisión de UX pendiente para Parte 3.
- Definir si el estudio del motor de scoring (prompt ya generado) se hace antes o después de cerrar toda la UI (botón Anterior + validación + estilos) — el usuario tiende a preferir cerrar todo el ciclo de UI primero.
