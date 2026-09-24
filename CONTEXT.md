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
/page.js → 🔶 Fase 6 en progreso (ver abajo). Hero reescrito completo en esta sesión (Fase 6 - Parte 1): estructura, copy y estilos Tailwind ajustados. `<ComoFunciona/>` y `<CtaFinal/>` sin tocar aún en Fase 6 — pendientes para próxima sesión. Sin sección de Diferenciación (descartada, ver Reglas de negocio).
/layout.js → ✅ Completo: fuentes Literata (`--font-voz`) y Karla (`--font-cuerpo`) cargadas vía `next/font/google`, `lang="es"`, metadata con nombre de marca.
/globals.css → ✅ Completo: tokens de marca en `@theme` (colores noche/papel/amanecer/musgo/texto-claro/texto-oscuro, fuentes voz/cuerpo), reemplazando el scaffold default de Next (sin modo claro/oscuro automático, no aplica al proyecto). Nota: el warning de editor "Unknown at rule @theme" es falso positivo, no bloquea el build.
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo (estilos Tailwind pendientes)
/resultado/page.jsx → ✅ Completo (Parte 14): `<ConsejoVocacional/>` integrado, `obtenerTop10Carreras` conectado. Estilos Tailwind pendientes.
/components
/landing/
ComoFunciona.jsx → ✅ Contenido/estructura completos (Parte 15). Pendiente de revisión en Fase 6 (Responsive+A11y) — próxima sesión.
CtaFinal.jsx → ✅ Contenido/estructura completos (Parte 15). Pendiente de revisión en Fase 6 (Responsive+A11y) — próxima sesión, después de ComoFunciona.
/test/
PreguntaLikert.jsx → ✅ Completo. ⚠️ Pendiente (fuera de este feature): no indica al estudiante qué significan los extremos de la escala 1-5.
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
carreras.json → 🔶 46 entradas. Array plano de objetos; cada carrera tiene `riasec`/`aptitudes`/`personalidad` como objetos `{subdimension: numero}` (Grupo A), `inteligencias_multiples`/`valores` como arrays de strings (Grupo B), más `universidades`, `sectoresEmpleo`. Campo opcional `notaCobertura` en 19/46 entradas.
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- **Identidad visual de marca (Parte 15):**
  - Nombre: **Oriéntame.pe**
  - Paleta: `noche` #14171F (fondo base), `papel` #E8E2D3 (superficie clara alterna), `amanecer` #D9A441 (acento primario/CTA sobre fondo oscuro), `musgo` #5B8C7B (acento secundario/detalle), `texto-claro` #F2EFE6, `texto-oscuro` #1E2027.
  - Tipografía: **Literata** (serif, `--font-voz`) para titulares/voz editorial; **Karla** (sans, `--font-cuerpo`) para cuerpo de texto.
  - Regla de contraste de botones: el color del CTA se adapta al fondo de su propia sección — no es una regla fija de "siempre un color", sino de contraste local.
- Decisiones técnicas importantes y por qué (se mantienen las de Parte 12-15, se agregan las de esta sesión — Fase 6 Parte 1):
  - **Tailwind v4 no usa `tailwind.config.js`** — toda la configuración de tema vive en `globals.css` dentro de un bloque `@theme`.
  - **Sin modo claro/oscuro automático por `prefers-color-scheme`** — decisión de marca fija.
  - **`next/font` es stack nuevo para Pool** — pendiente de estudio aislado en el proyecto de Aprendizaje.
  - **Patrón "container": ancho de sección vs. ancho de contenido.** El `<section>` del hero es `w-full` sin límite propio; el contenido (h1/p/lista/botón) vive dentro de un `<div className="max-w-7xl">` interno. Esto permite que el fondo/sección algún día sea full-bleed mientras el texto mantiene un techo de legibilidad. Elegido tras evaluar estadísticas reales de resolución de pantalla (StatCounter, junio 2026): 1920x1080 es la resolución de escritorio dominante (~20% share), mayoría de usuarios en 1920px o menos — monitores ultra anchos (27"-32") son minoría. Mobile genera >60% del tráfico web global vs. ~35% de escritorio, reforzando el enfoque mobile-first de la Fase 6.
  - **Un solo `<h1>` por página con jerarquía semántica real:** un segundo mensaje visual que es parte del mismo titular (no una sección nueva de contenido) va como `<span className="block">` anidado DENTRO del `<h1>`, nunca como `<h2>` ni como elemento hermano suelto — la elección del elemento HTML se basa en el significado del contenido, no en el tamaño visual deseado (el CSS resuelve el tamaño después).
  - **Listas reales (`<ul>`/`<li>`) para contenido enumerado**, no párrafos con saltos de línea — mismo principio: semántica antes que estética, mejora accesibilidad para lectores de pantalla.
  - **Jerarquía visual de CTA principal:** un botón hero debe igualar o superar el tamaño de texto del cuerpo (no ser más chico), con padding generoso — principios aplicados: efecto de aislamiento (von Restorff), contraste de color, Fitts's Law (área clickeable).
  - Se mantienen las decisiones de Parte 13-14: motor dividido en Grupo A/B, top 10 fijo, cálculos costosos en `useEffect`+estado propio.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios de forma desde Parte 9).
- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9).

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: **Landing page**
- Fase actual: **Fase 6 (Responsive + Accesibilidad)** — en progreso, sesión "Fase 6 - Parte 1".
- En lo que se trabajó en esta sesión (Fase 6 - Parte 1):
  - **Hero (`app/page.js`) reescrito completo**, resolviendo los 3 hallazgos de Parte 16:
    1. Alineación hero/header: se quitó `mx-auto` del `<section>` del hero (ya lo había aplicado Pool antes de esta sesión); el desalineamiento visual restante resultó ser causado por `max-w-2xl` comprimiendo el hero en una columna angosta, no por falta de alineación real izquierda.
    2. Decisión de ancho tomada: **Opción B (hero full-bleed)** — `<section>` sin `max-w` propio (`w-full` puro), contenido interno envuelto en `<div className="max-w-7xl">`. Resuelto tras revisar estadísticas reales de resolución de pantalla.
    3. Botón "Empieza tu test": ajustado de `text-sm font-medium px-6 py-3` a `text-base font-semibold px-8 py-4`, aplicando principios de jerarquía visual de CTA.
  - Título dividido en dos ideas de distinto peso (`¿No sabes qué carrera estudiar?` + subtítulo) usando un `<span className="block">` anidado DENTRO del `<h1>` — no un `<h2>` ni elemento hermano (se corrigió un error de anidamiento donde el `span` quedó fuera del `h1` por accidente).
  - Párrafo descriptivo reescrito como lista real (`<ul>`/`<li>` con `list-disc`) — copy final: "Analizamos: Quién eres (personalidad y valores) / Lo que te mueve (intereses y gustos) / En qué destacas (habilidades y aptitudes)" + párrafo de cierre "El resultado: un filtro con carreras a tu medida".
  - Confirmado con Pool: HMR/Fast Refresh de Next.js+Turbopack actualiza el navegador automáticamente al guardar — no hace falta reiniciar `npm run dev` en cada cambio, solo cuando se tocan `next.config.js` o variables de entorno.
  - Exploración de UX: el espacio vacío a la derecha del hero en pantallas anchas se evaluó como válido dado el tono editorial/minimalista de la marca ("cero floro", tipografía Literata) — Pool decidió mantenerlo así por ahora, pero quiere explorar más adelante, solo por curiosidad, una Opción B con elemento visual a la derecha (layout dos columnas) — de concretarse, eso reabriría formalmente la Fase 4 (Diseño UI) para el hero específicamente, fuera del alcance de Fase 6.
  - Motion/hover en el botón (`scale`/`shadow` al hover) explícitamente diferido a Fase 7 (Animaciones), donde se activa la skill `emil-design-eng` — no se toca en Fase 6.

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10.
- [x] Eliminación de `restricciones_personales` y `estilo_vida` del score de vocación — Parte 11.
- [x] Redacción e implementación de `ConsejoVocacional.jsx` — Parte 11.
- [x] Integración de `<ConsejoVocacional/>` en `resultado/page.jsx` — Parte 12.
- [x] Eliminación de `motivaciones`/`estilo_aprendizaje`; renombre de claves de `carreras.json` — Parte 13.
- [x] Motor de recomendación completo (`recomendacion.ts`) — Parte 13.
- [x] Conexión de `obtenerTop10Carreras` en `resultado/page.jsx` — Parte 14.
- [x] Identidad visual de marca definida (Oriéntame.pe: paleta, tipografía) — Parte 15.
- [x] Landing page — Fase 4 (Diseño UI) y Fase 5 (Desarrollo) completas: Hero, ComoFunciona, CtaFinal — Parte 15.
- [x] Hero de la Landing — Fase 6 (Responsive + Accesibilidad) completa: alineación, ancho full-bleed con `max-w-7xl` interno, título en dos niveles semánticos, lista de "Analizamos", CTA con jerarquía visual correcta — Fase 6 Parte 1.

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas, se agregan:)

- La comunicación pública del proyecto (landing, copy) evita marketing comparativo o defensivo frente a competidores. El foco debe estar siempre en ayudar al estudiante.
- Tono de voz del proyecto: directo y sin rodeos ("cero floro"), sin mensajes largos, poéticos o reflexivos.
- El color de los CTAs se decide por contraste contra el fondo local de su sección, no por una regla fija de color único en todo el sitio.
- Patrón de ancho: secciones full-bleed (`w-full` sin límite) + contenedor interno con `max-w` para el contenido de texto, en vez de limitar el ancho de toda la sección.
- Se mantienen las reglas de Parte 13-14: comparación estudiante↔carrera dividida en dos grupos; un solo `<h1>` por página; toda dimensión del test debe tener razón de uso clara.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión". Continuar la Fase 6 (Responsive + Accesibilidad) con `ComoFunciona.jsx` (revisar estructura, estilos Tailwind pendientes de aplicar con los tokens de marca), y si el alcance lo permite en la misma sesión, seguir con `CtaFinal.jsx`. Después de ambos: contraste de color (`texto-claro/70` y `/60` sobre fondo Noche), foco de teclado visible en links/CTAs, y `prefers-reduced-motion` (Fase 7 aún, sin animaciones todavía).

## Dudas o problemas pendientes

- `next/font` es stack nuevo para Pool — pendiente su estudio aislado en el proyecto de Aprendizaje, junto con Tailwind v4 y generación de PDF.
- `PreguntaLikert.jsx` no indica al estudiante el significado de los extremos de la escala 1-5. Resolución diferida al ciclo de Responsive+Accesibilidad del feature del **Test** (ciclo independiente de la Landing).
- Agregar bloque de texto fijo genérico en `resultado/page.jsx` aclarando que el resultado económico depende del esfuerzo individual, no solo de la carrera elegida — pendiente desde Parte 14.
- Aplicar los tokens de identidad visual a los estilos Tailwind pendientes de `ConsejoVocacional.jsx`, el bloque de carreras recomendadas en `resultado/page.jsx`, y el sendero de progreso visual del test.
- **(NUEVO)** Exploración pendiente, solo por curiosidad de Pool: layout de hero a dos columnas con elemento visual a la derecha (Opción B de la discusión de espacio vacío) — si se concreta, reabre Fase 4 (Diseño UI) para el hero específicamente, fuera del alcance actual de Fase 6.
- **Idea futura (post-MVP):** `ConsejoVocacional` dismissible con retraso inicial + imagen motivacional.
- **Idea futura (post-MVP):** modos de test "normal" vs. "preciso".
- **Idea futura (post-MVP):** reemplazar el "top 10 fijo" por un umbral mínimo de compatibilidad.
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
