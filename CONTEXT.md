# CONTEXT.md — Plataforma de Orientación Vocacional

## Definición del proyecto (Fase 1 — fija, no cambia)

- Problema que resuelve: Los estudiantes de secundaria en Perú (15-18 años) eligen carrera técnica o universitaria sin criterio real, guiados por marketing/moda, sin considerar mercado laboral, aptitudes reales ni factores personales — lo que puede traducirse en años y dinero perdidos (caso real: el creador estudió Ingeniería Mecatrónica en 2011 guiado por marketing, sin encontrar mercado laboral al graduarse).
- Para quién es: Estudiantes peruanos de colegio a punto de decidir carrera técnica o universitaria. Caso semilla: un familiar del creador. Objetivo final: todos los estudiantes del Perú.
- Propuesta de valor: A diferencia del test vocacional típico (percibido como poco objetivo), esta plataforma combina múltiples dimensiones psicométricas + datos reales de mercado laboral peruano + experiencias reales de profesionales (foros), para dar una recomendación con criterio, no genérica.
- MVP (alcance inicial): Test completo (personalidad, RIASEC, aptitudes cognitivas, inteligencias múltiples, valores, motivaciones, estilo de aprendizaje) → motor de recomendación contra dataset estático de carreras → resultado descargable en PDF. Sin registro/login. Usuarios: grupo cerrado de beta testers.
- Qué NO incluye el MVP: Registro/login/autenticación, persistencia de resultados en base de datos, integración de datos de mercado laboral **en tiempo real**, análisis de foros con IA, apertura a público general, restricciones personales como input del algoritmo (eliminado del proyecto por completo), filtros de estilo de vida (post-MVP).
- Objetivos corto/mediano plazo:
  - Corto plazo: MVP funcional de punta a punta para que el familiar del creador y 3-5 beta testers más lo prueben y den feedback real.
  - Mediano plazo: Iterar el motor de recomendación según feedback recibido, luego iniciar primer feature post-MVP (probablemente mercado laboral, o sistema de filtros de estilo de vida). El catálogo de `carreras.json` seguirá creciendo post-MVP.

## Investigación (Fase 2 — fija, no cambia)

- Competidores/referencias analizados: Ponte en Carrera (MTPE/Minedu), Mi Carrera (Ministerio de Trabajo), tests de universidades privadas (UCV/ISIL/UPN), EstudiaPerú, TestVocacional.app.
- Lo bueno (para aprender): Combinar varias metodologías psicométricas en un solo perfil da más solidez que un test único. Integrar datos reales de mercado laboral aporta valor concreto. Sin registro / fricción mínima al inicio mejora la conversión. Resultado descargable como alternativa a cuentas de usuario.
- Lo malo (para evitar): Fragmentar el test en varias pruebas sueltas y desconectadas. Sesgo de negocio disfrazado de orientación objetiva (universidades privadas). Profundidad sacrificada por velocidad. UX anticuada en plataformas del Estado.
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales como parte del algoritmo (nota Parte 11: se investigó a fondo esta idea propia y se descartó como input del _score_ de vocación, ver Reglas de negocio). Ninguna combina test multidimensional completo + mercado laboral peruano + experiencias reales de profesionales, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas (actualizada):

/app
/page.js → Landing (pendiente de personalizar)
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo (Parte 11: sin cambios de lógica, solo consume preguntas.json ya reducido)
/resultado/page.jsx → 🔶 En progreso: conectado a scoreEnginePerfil, renderiza debug (JSON.stringify). PENDIENTE: integrar <ConsejoVocacional/> antes del renderizado de carreras recomendadas; UI real y estilos Tailwind.
/components
/test/
PreguntaLikert.jsx → ✅ Completo
PreguntaOpciones.jsx → ✅ Completo (Parte 11: confirmado que NO es código muerto — sigue siendo el componente de las 12 preguntas de tipo aptitud, que comparten forma opciones: string[] con las extintas eleccion_forzada)
/resultado/
ConsejoVocacional.jsx → ✅ Nuevo (Parte 11): componente sin props, HTML semántico (section/p/ul/li/strong), consejo genérico sobre estabilidad económica. Sin estilos Tailwind aún. PENDIENTE: importar e integrar en resultado/page.jsx.
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo (Parte 11): scoreEngineEleccionForzada eliminado (sin preguntas de ese tipo en el dataset). Solo scoreEngineLikert, scoreEngineAptitud, scoreEnginePerfil (ya no mezcla eleccion_forzada).
normalizar.ts → ✅ Sin cambios en Parte 11.
constants.ts → ✅ Sin cambios en Parte 11.
types.ts → ✅ Modificado (Parte 11): tipo de Pregunta reducido a 'likert' | 'aptitud' (antes incluía 'eleccion_forzada'). Previene en tiempo de compilación que se reintroduzca ese tipo por error.
/data
preguntas.json → ✅ 93 preguntas (reducidas de 104 en Parte 11). Dimensiones activas: personalidad, riasec, aptitudes, inteligencias_multiples, valores (6 subdimensiones), motivaciones, estilo_aprendizaje. Eliminadas por completo: restricciones_personales y estilo_vida (ver Reglas de negocio para detalle de motivo y subdimensiones). 0 preguntas de tipo eleccion_forzada.
carreras.json → 🔶 En crecimiento continuo (46 entradas confirmadas a la fecha, sin cambios en Parte 11).
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- Decisiones técnicas importantes y por qué (se mantienen las de Parte 10, se agregan):
  - **(NUEVO — Parte 11) `restricciones_personales` eliminada del proyecto por completo, no solo del MVP.** No se retoma ni como filtro post-MVP. Motivo: el objetivo del proyecto es mostrar todas las carreras vocacionalmente compatibles; factores como distancia, economía o familia son evadibles (becas, etc.) y no deben excluir carreras de la vista del estudiante bajo ninguna circunstancia.
  - **(NUEVO — Parte 11) `estilo_vida` eliminada del flujo actual del test/engine, pero no del proyecto.** De sus 6 subdimensiones originales: `entorno_trabajo`, `trabajo_equipo` y `horario` se descartaron por completo (la variabilidad depende del puesto/empleador, no de la carrera — sin valor discriminativo real). `ritmo_trabajo`, `esfuerzo_fisico` y `disponibilidad_viajar` se posponen para post-MVP como **filtros aplicados sobre el ranking ya calculado**, no como preguntas dentro del score de vocación — el dato sigue siendo útil para el estudiante, solo cambia de rol (deja de competir por peso en el matching).
  - **(NUEVO — Parte 11) Tipo de pregunta `eleccion_forzada` eliminado por completo** (de `types.ts`, `engine.ts` y `preguntas.json`) al quedar sin ninguna pregunta asociada tras eliminar las dos dimensiones que lo usaban exclusivamente.
  - **(NUEVO — Parte 11) `PreguntaOpciones.jsx` se mantiene sin cambios**, confirmado que sigue siendo necesario para renderizar las preguntas de tipo `aptitud` (comparten la misma forma `opciones: string[]` que tenían las de `eleccion_forzada`).
  - **(NUEVO — Parte 11) Bloque de texto fijo del resultado implementado como componente propio (`ConsejoVocacional.jsx`)**, no como texto inline en `resultado/page.jsx`, para mantener el archivo ordenado y permitir modificarlo de forma aislada. Sin props porque el contenido es genérico, no personalizado por perfil del estudiante.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios desde Parte 9 — ver sesiones previas).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Bloque de texto fijo / consejo vocacional en resultado — Fase 4 (Diseño UI / contenido) cerrada, Fase 5 (Desarrollo) parcialmente cerrada
- Fase actual: Desarrollo (Fase 5) — Parte 11 cerrada
- En lo que se trabajó en Parte 11 (sesión de hoy):
  - Se resolvió, sin necesidad de implementar lógica de comparación categórica, el pendiente de Parte 10 sobre `estilo_vida` y `restricciones_personales`: ambas dimensiones se sacaron de competir por peso en el score de vocación (una eliminada del todo, otra pospuesta como filtro post-MVP).
  - `preguntas.json` reducido de 104 a 93 preguntas; `engine.ts` y `types.ts` simplificados en consecuencia (sin `scoreEngineEleccionForzada`, sin tipo `'eleccion_forzada'`).
  - Se verificó `test/page.jsx` y `PreguntaOpciones.jsx`: sin residuos de código muerto relacionados a `eleccion_forzada`.
  - Se redactó y estructuró el consejo vocacional genérico sobre estabilidad económica (tono cercano/mentor), implementado como componente `ConsejoVocacional.jsx` con HTML semántico (`section`, `p`, `ul`/`li`, `strong`), sin estilos Tailwind todavía.
  - Mensajes de commit acordados (dos commits separados, push aún no confirmado como hecho):
    - `refactor(test): eliminar dimensiones restricciones_personales y estilo_vida`
    - `feat(resultado): crear componente ConsejoVocacional`
- ❌ Pendiente (continúa en la próxima sesión — Parte 12):
  - Confirmar push de los dos commits de Parte 11.
  - Integrar `<ConsejoVocacional/>` en `resultado/page.jsx`, justo antes del renderizado de las carreras recomendadas (posición ya acordada).
  - Aplicar estilos Tailwind a `ConsejoVocacional.jsx` (Fase 6 del ciclo de este mini-feature).
  - Diseño real de `resultado/page.jsx` (reemplazar debug `JSON.stringify` por UI real de carreras recomendadas).
  - Sendero de progreso visual y estilos Tailwind del test.
  - Seguir agregando carreras según prioridad (ver lista abajo).
  - Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer).
  - Reforzar en repaso: por qué `normalizarScore` en `scoreEngineAptitud` no necesita el parámetro `contexto` (valores `0`/`1` son literales fijos en código, nunca pueden llegar corruptos desde `preguntas.json`); y en qué momento del ciclo de desarrollo actúa el chequeo de tipos de TypeScript (tiempo de compilación/editor, no en runtime frente al estudiante).

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación; simplificación de `engine.ts`/`types.ts` (sin `eleccion_forzada`) — Parte 11.
- [x] Redacción e implementación del componente `ConsejoVocacional.jsx` (contenido y estructura semántica) — Parte 11. Pendiente: integración visual en `resultado/page.jsx` y estilos.

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas — normalización de escalas, campo `sectoresEmpleo`, `notaCobertura`, prohibición de sesgos sociales, verificación de nomenclatura, arquitectura técnica/universitaria resuelta, fuentes confiables, no bootcamps sin programa formal, flujo manual de `carreras.json`, escala destino 9, manejo de errores fail-loud, separación constante/lógica — y se agregan:)

- **(NUEVO — Parte 11) `restricciones_personales` no debe influir nunca en qué carreras se muestran al estudiante**, ni como score ni como filtro futuro. Motivo de fondo: contradice el objetivo central del proyecto (mostrar todo lo vocacionalmente compatible); los factores que mide (economía, distancia, familia) son evadibles (becas, etc.) y no deben usarse como criterio de exclusión.
- **(NUEVO — Parte 11) Criterio para decidir si una subdimensión de estilo de vida es válida para matching:** la variabilidad debe ser inherente a la naturaleza de la carrera, no depender del puesto/sector/empleador específico. Si casi todas las carreras admiten todas las opciones de una pregunta (ej. remoto/oficina/campo), la pregunta no discrimina y no aporta valor — candidata a eliminar o mover fuera del score.
- **(NUEVO — Parte 11) Dato "pospuesto" ≠ dato "eliminado".** Una subdimensión pospuesta (como las 3 de `estilo_vida` para filtros post-MVP) se saca del test y del engine en su totalidad hasta que tenga un rol definido — no se deja en el dataset "por si acaso" ignorada en el engine, porque eso le hace perder tiempo al estudiante respondiendo algo que no se usa para nada.
- **(NUEVO — Parte 11) Commits separados por naturaleza del cambio:** un refactor de dominio (eliminar dimensiones) y un feature nuevo (componente de UI) van en commits distintos, aunque se hayan hecho en la misma sesión.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 12: integrar `<ConsejoVocacional/>` en `resultado/page.jsx` (antes del listado de carreras) y aplicar estilos Tailwind al componente.

## Dudas o problemas pendientes

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
- Diseño del sistema de filtros post-MVP para `ritmo_trabajo`, `esfuerzo_fisico` y `disponibilidad_viajar` — decidido que vivirán como controles de filtro en `resultado/page.jsx` (no como preguntas del test), pero mecánica exacta aún no diseñada. Explícitamente fuera de alcance hasta después del MVP.
- Diseño visual del sendero de progreso del test, ni la UI real de `resultado/page.jsx` — pendiente.
- Estilos Tailwind de `ConsejoVocacional.jsx` — pendiente, próxima sesión.
- Confirmar que el push de los dos commits de Parte 11 se hizo correctamente.
