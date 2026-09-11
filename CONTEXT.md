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
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales como parte del algoritmo (descartado como input del score, ver Reglas de negocio). Ninguna combina test multidimensional completo + mercado laboral peruano + experiencias reales de profesionales, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas (actualizada):

/app
/page.js → Landing (pendiente de personalizar — aquí se definirá la identidad visual de marca del proyecto, ver Dudas pendientes)
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo
/resultado/page.jsx → 🔶 En progreso (Parte 12): `<ConsejoVocacional/>` integrado en el JSX, dentro de la rama `else` (cuando ya hay `resultado`), envuelto junto con `<h1>` y `<p>` en un único `<div>` raíz. Sigue renderizando debug (`JSON.stringify`). PENDIENTE: estilos Tailwind de `ConsejoVocacional`, y UI real de carreras recomendadas.
/components
/test/
PreguntaLikert.jsx → ✅ Completo
PreguntaOpciones.jsx → ✅ Completo
/resultado/
ConsejoVocacional.jsx → ✅ Contenido y estructura semántica completos (Parte 11). Integrado en `resultado/page.jsx` (Parte 12). PENDIENTE: estilos Tailwind — bloqueado hasta definir identidad visual de marca (ver Dudas pendientes).
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo
normalizar.ts → ✅ Completo
constants.ts → ✅ Completo
types.ts → ✅ Completo
/data
preguntas.json → ✅ 93 preguntas.
carreras.json → 🔶 En crecimiento continuo (46 entradas confirmadas a la fecha, sin cambios en Parte 12).
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- Decisiones técnicas importantes y por qué (se mantienen las de Parte 11, se agregan):
  - **(NUEVO — Parte 12) Alias de importación `@/` confirmado y en uso activo.** Apunta a la raíz del proyecto (`jsconfig.json`/`tsconfig.json`, `paths: {"@/*": ["./*"]}`). Se usa consistentemente en vez de rutas relativas (`../../`) porque no se rompe al mover archivos de carpeta. Regla de extensión: módulos de código (`.js`/`.jsx`/`.ts`/`.tsx`) se importan sin extensión (el bundler los resuelve); archivos de datos crudos (`.json`) sí requieren extensión explícita.
  - **(NUEVO — Parte 12) `<ConsejoVocacional/>` se integró como componente autocerrado**, sin `children` ni props, consistente con su diseño original (contenido genérico, no personalizado). Va dentro del mismo `<div>` raíz que el resto del contenido de la rama `else` de `resultado/page.jsx` (JSX exige un único nodo raíz por `return`).
  - **(NUEVO — Parte 12) Identidad visual de marca (paleta de colores, tipografía) del proyecto completo aún NO está definida.** Se decidió explícitamente que esa decisión no le corresponde a un componente aislado (`ConsejoVocacional`), sino a una fase de diseño más amplia — probablemente al trabajar la Landing (`app/page.js`). Hasta entonces, cualquier estilo Tailwind que se aplique a componentes existentes debe ser neutro/genérico (grises/slate por defecto de Tailwind), sin comprometer una paleta de marca todavía no decidida.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios desde Parte 9 — ver sesiones previas).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Bloque de texto fijo / consejo vocacional en resultado — Fase 4 (Diseño UI / contenido) cerrada, Fase 5 (Desarrollo) en curso
- Fase actual: Desarrollo (Fase 5) — Parte 12 cerrada
- En lo que se trabajó en Parte 12 (sesión de hoy):
  - Se confirmó el push de los dos commits pendientes de Parte 11.
  - Se integró `<ConsejoVocacional/>` en `resultado/page.jsx`: import correcto vía alias `@/components/resultado/ConsejoVocacional`, insertado dentro del único `<div>` raíz de la rama `else` (cuando `resultado` ya existe), antes del `<h1>` y `<p>` de debug. Se corrigió un error de JSX (dos nodos raíz sin envolver) durante el proceso.
  - Se evaluó y **descartó para esta sesión** una idea de mejora (mensaje dismissible con retraso inicial + imagen motivacional) por romper el alcance mínimo de la tarea — documentada como idea futura post-MVP (ver Dudas pendientes).
  - Se evaluó aplicar estilos Tailwind a `ConsejoVocacional.jsx` (siguiente paso planeado de Parte 12), pero se detectó que esta sería **la primera decisión de color/identidad visual de todo el proyecto**. Se decidió posponer la paleta definitiva a una fase más amplia (Landing) y no resolverla hoy sobre un componente aislado. Estilos Tailwind de `ConsejoVocacional` quedan pendientes hasta esa decisión.
- ❌ Pendiente (continúa en la próxima sesión — Parte 13):
  - Definir identidad visual de marca del proyecto (paleta de colores, tipografía) — probablemente al iniciar el trabajo de la Landing (`app/page.js`). Esto desbloquea los estilos Tailwind de `ConsejoVocacional.jsx` y de cualquier otro componente visual pendiente.
  - Aplicar estilos Tailwind a `ConsejoVocacional.jsx` una vez definida la paleta (Fase 6 del ciclo de este mini-feature).
  - Diseño real de `resultado/page.jsx` (reemplazar debug `JSON.stringify` por UI real de carreras recomendadas).
  - Sendero de progreso visual y estilos Tailwind del test.
  - Seguir agregando carreras según prioridad (ver lista abajo).
  - Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer).
  - Estudio aislado de Tailwind CSS en el proyecto de Aprendizaje (nuevo pendiente de Parte 12 — ver nota abajo).

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación; simplificación de `engine.ts`/`types.ts` — Parte 11.
- [x] Redacción e implementación del componente `ConsejoVocacional.jsx` (contenido y estructura semántica) — Parte 11.
- [x] Integración de `<ConsejoVocacional/>` en `resultado/page.jsx` — Parte 12. Pendiente: estilos Tailwind (bloqueado por paleta de marca aún no definida).

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas, se agregan:)

- **(NUEVO — Parte 12) Decisiones de identidad visual (paleta, tipografía) no se toman sobre componentes aislados.** Le corresponden a una fase de diseño amplia que cubra todo el proyecto (Landing u otro punto de entrada equivalente), no a un mini-feature puntual como un aviso o consejo.
- **(NUEVO — Parte 12) Mejoras que agregan estado/interactividad (ej. dismissible, temporizadores, assets nuevos) a un componente ya cerrado en Fase 4 no se implementan inline** — abren su propio ciclo Fase 4-7 y se documentan como idea futura, aunque el cambio "se vea pequeño" a simple vista.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 13: decidir identidad visual de marca (o avanzar con otro pendiente si se prioriza distinto, a confirmar al abrir sesión).

## Dudas o problemas pendientes

- **Identidad visual de marca aún sin definir** — bloquea estilos Tailwind de `ConsejoVocacional.jsx` y de cualquier componente visual futuro. Se resolverá probablemente en el ciclo de la Landing.
- **Idea futura (post-MVP):** `ConsejoVocacional` dismissible con retraso inicial (temporizador antes de mostrar botón de cierre) + imagen motivacional — requiere su propio ciclo Fase 4-7 completo, no es un cambio mínimo. Evaluada y descartada para Parte 12 por alcance.
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
- Diseño visual del sendero de progreso del test, ni la UI real de `resultado/page.jsx` — pendiente.
