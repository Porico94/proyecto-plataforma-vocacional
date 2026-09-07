# CONTEXT.md — Plataforma de Orientación Vocacional

## Definición del proyecto (Fase 1 — fija, no cambia)

- Problema que resuelve: Los estudiantes de secundaria en Perú (15-18 años) eligen carrera técnica o universitaria sin criterio real, guiados por marketing/moda, sin considerar mercado laboral, aptitudes reales ni factores personales — lo que puede traducirse en años y dinero perdidos (caso real: el creador estudió Ingeniería Mecatrónica en 2011 guiado por marketing, sin encontrar mercado laboral al graduarse).
- Para quién es: Estudiantes peruanos de colegio a punto de decidir carrera técnica o universitaria. Caso semilla: un familiar del creador. Objetivo final: todos los estudiantes del Perú.
- Propuesta de valor: A diferencia del test vocacional típico (percibido como poco objetivo), esta plataforma combina múltiples dimensiones psicométricas + datos reales de mercado laboral peruano + experiencias reales de profesionales (foros), para dar una recomendación con criterio, no genérica.
- MVP (alcance inicial): Test completo (personalidad, RIASEC, aptitudes cognitivas, inteligencias múltiples, valores, motivaciones, estilo de aprendizaje, preferencias de estilo de vida, restricciones personales) → motor de recomendación contra dataset estático de carreras → resultado descargable en PDF. Sin registro/login. Usuarios: grupo cerrado de beta testers.
- Qué NO incluye el MVP: Registro/login/autenticación, persistencia de resultados en base de datos, integración de datos de mercado laboral **en tiempo real** (sí se permite investigación puntual y estática para construir el dataset), análisis de foros con IA, apertura a público general.
- Objetivos corto/mediano plazo:
  - Corto plazo: MVP funcional de punta a punta para que el familiar del creador y 3-5 beta testers más lo prueben y den feedback real. **Retrasado conscientemente para reconstruir `carreras.json` con evidencia trazable — decisión del creador, priorizando solidez del dataset sobre velocidad.**
  - Mediano plazo: Iterar el motor de recomendación según feedback recibido, luego iniciar primer feature post-MVP (probablemente mercado laboral).

## Investigación (Fase 2 — fija, no cambia)

- Competidores/referencias analizados: Ponte en Carrera (MTPE/Minedu), Mi Carrera (Ministerio de Trabajo), tests de universidades privadas (UCV/ISIL/UPN), EstudiaPerú, TestVocacional.app.
- Lo bueno (para aprender): Combinar varias metodologías psicométricas en un solo perfil da más solidez que un test único. Integrar datos reales de mercado laboral aporta valor concreto. Sin registro / fricción mínima al inicio mejora la conversión. Resultado descargable como alternativa a cuentas de usuario.
- Lo malo (para evitar): Fragmentar el test en varias pruebas sueltas y desconectadas. Sesgo de negocio disfrazado de orientación objetiva (universidades privadas) — confirmado repetidamente durante la reconstrucción de `carreras.json`: las páginas de universidades son fuente parcial/marketing, útiles solo para evidencia cualitativa, nunca para cifras. Profundidad sacrificada por velocidad. UX anticuada en plataformas del Estado.
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales como parte del algoritmo. Ninguna combina test multidimensional completo + mercado laboral peruano + experiencias reales de profesionales, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas:

/app
/page.js → Landing (pendiente de personalizar)
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo
/resultado/page.jsx → ✅ Completo (Fase 5 — Parte 5); PENDIENTE: agregar bloque de texto fijo (consejo genérico sobre estabilidad laboral/logro económico dependiendo de factores individuales, no del perfil del usuario) — aún sin redactar
/components
/test/
PreguntaLikert.jsx → ✅ Completo
PreguntaOpciones.jsx → ✅ Completo
/resultado/ → vacío, pendiente
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Reestructurado (Parte 6): forma de dos niveles (dimension → subdimension). Pendiente de código: funciones de normalización de escalas.
types.ts → ✅ Completo — PENDIENTE: actualizar tipos para reflejar `duracionAnios` y `vocacionRelacionada` (nuevos en Parte 8).
/data
preguntas.json → ✅ 104 preguntas reales. 9 dimensiones, valores con 6 subdimensiones activas: impacto_social, creatividad, autonomia, reconocimiento, trabajo_en_equipo, sostenibilidad.
carreras.json → ⚠️ EN RECONSTRUCCIÓN — **27 carreras completas** (17 universitarias + 10 técnicas). Ver detalle completo abajo en "Feature actual".
carreras-tecnicas-notas.json → ⚠️ Semilla original de Parte 7, usada como insumo en Parte 8 para investigar y resolver la mayoría de sus casos "sí/no_verificado" pendientes. Con el nuevo esquema `vocacionRelacionada` dentro de `carreras.json`, este archivo va camino a quedar obsoleto — no se ha borrado todavía, pero ya no es la fuente de verdad para las carreras que ya tienen su técnica vinculada directamente en `carreras.json`.
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- Decisiones técnicas importantes y por qué (heredadas de sesiones previas, sin cambios en Parte 8): arquitectura de componentes de pregunta, patrón sincronización estado↔sessionStorage, validación "Siguiente"/"Anterior", motor de scoring de dos niveles, nomenclatura separada entre `preguntas.json` y `carreras.json`, normalización de escalas (fórmulas definidas, código pendiente).
- **(NUEVO — Parte 8) Decisión arquitectónica resuelta: relación técnica-universitaria.** El problema pospuesto desde Parte 7 (cómo modelar y presentar la relación entre una carrera universitaria y su equivalente técnico) se resolvió así:
  - Cada carrera en `carreras.json` es una **entrada independiente** con su propio perfil psicométrico completo (no un array `modalidades[]` anidado), porque la evidencia (ej. SENATI Producción Industrial vs. Ingeniería Industrial) mostró que los perfiles RIASEC realmente difieren entre modalidad técnica y universitaria — anidarlos forzaría al motor de recomendación a promediar o elegir un solo perfil, perdiendo precisión.
  - Dos campos nuevos, aplican a **todas** las entradas (retroactivo, ya migrado a las 27 actuales):
    - `duracionAnios` (número): puramente informativo, **no entra al motor de recomendación** — mismo criterio que `costoAproximadoRango`. Permite al estudiante comparar años de estudio entre rutas.
    - `vocacionRelacionada` (string | null): `id` de la entrada contraparte (universitaria ↔ técnica) de la misma vocación. El vínculo es **bidireccional** — se actualiza en ambos lados cuando existe relación real.
  - Regla de rigor aplicada: **`vocacionRelacionada` solo se llena cuando el mapeo es 1 a 1 razonablemente preciso**, verificado con fuente oficial del instituto/universidad (no agregadores). Si dos vocaciones están relacionadas pero tienen alcance claramente distinto (ver casos abajo), se mantienen como carreras separadas sin forzar el vínculo — se deja en `null` antes que introducir una comparación imprecisa.
  - `carreras-tecnicas-notas.json` queda en camino a obsoleto: su función se está migrando al propio dataset principal.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Reconstrucción de `carreras.json` con evidencia trazable (27/33+ completas, contando universitarias + técnicas) + resolución completa de la arquitectura técnica-vs-universitaria
- Fase actual: Desarrollo (Fase 5) — Parte 8 cerrada, continúa en Parte 9
- En lo que se trabajó en Parte 8 (sesión de hoy):

  **1. Nuevas carreras universitarias reconstruidas con evidencia (8 nuevas):**
  - **Ingeniería Industrial** (5 años) — perfil RIASEC con fuerte componente Investigativo/Emprendedor/Convencional (diseño y mejora de procesos, liderazgo, calidad). 10 universidades verificadas (UNI, PUCP, UPC, U. Lima, UDEP, UNT, UARM, Universidad Autónoma, UPCH, UCSP).
  - **Medicina Humana** (7 años) — se identificó y documentó un dato regulatorio relevante: la Ley 31520 (2023) le quitó a SUNEDU la facultad de licenciar programas de Medicina específicamente, lo que abrió la puerta a nuevas facultades sin el mismo filtro de calidad histórico. Se listaron solo universidades con trayectoria establecida.
  - **Derecho** (5 años) — perfil con `E` (Emprendedor) alto por litigio/negociación/liderazgo. Se corrigió en el camino un error propio: se había puesto `logico-matematica` como inteligencia clave sin evidencia real (la única fuente que lo mencionaba era texto de plantilla genérica); se reemplazó por `intrapersonal` (juicio ético, tema repetido en todos los perfiles de egreso revisados).
  - **Educación** (5 años) — se decidió mantenerla como una sola entrada (no separar por Inicial/Primaria/Secundaria) porque el perfil psicométrico de fondo es el mismo entre especialidades; la diferencia es de contenido/edad, no de tipo de persona.
  - **Ingeniería Ambiental** (5 años) — fuerte presencia de `sostenibilidad` en todos los perfiles revisados (UNI, UPC, Autónoma, UNSA, UNT).
  - **Arquitectura** (5 años) — perfil dominado por `A` (Artístico) en RIASEC; `sostenibilidad` e `impacto_social` aparecen explícitos y repetidos en las fuentes oficiales (UPC, UDEP, UTP).

  **2. Nuevas carreras técnicas reconstruidas y vinculadas (9 nuevas), todas con evidencia de fuente oficial del instituto:**
  - **Ingeniería de Producción Industrial (SENATI)** — 4 años (Escuela Superior, caso híbrido: título de "Ingeniería" desde un instituto, no técnico clásico de 3 años). Vinculada a Ingeniería Industrial.
  - **Auxiliar de Educación** — 3 años vía Institutos Superiores Pedagógicos (ISP) legítimos. Se descubrió y documentó explícitamente que existen también cursos cortos de 6-10 meses en institutos no pedagógicos, señalados por una tesis de la PUCP como formación incompleta — **se excluyen intencionalmente del dataset** por criterio de calidad. Vinculada a Educación.
  - **Tecnologías Ambientales (SENATI)** — 3 años, rol operativo (monitoreo, tratamiento de aguas, gestión de residuos) bajo normativa, sin el componente de liderazgo/diseño estratégico de la universitaria. Vinculada a Ingeniería Ambiental.
  - **Diseño de Interiores** (ISIL, Toulouse Lautrec, Instituto CERTUS, Chio Lecca) — 3 años. **Se decidió NO vincularla a Arquitectura** como técnica equivalente: es una vocación relacionada pero de alcance distinto (espacios interiores, sin diseño estructural/urbanismo). Queda como carrera independiente sin `vocacionRelacionada`.
  - **Administración de Empresas (técnico)** — 3 años, mapeo 1 a 1 limpio (mismo nombre en SENATI/Idat/Cibertec). Vinculada a Administración.
  - **Gestión de la Construcción Civil** (Cibertec) — 2 años (duración corregida desde una fuente oficial directa, no un agregador que decía 3). Vinculada a Ingeniería Civil. Incluye SENCICO (organismo público del sector construcción, clasificado como `particular` por criterio del creador: cobra matrícula y mensualidad).
  - **Contabilidad (técnico)** — 3 años, mapeo 1 a 1 limpio. Vinculada a Contabilidad.
  - **Enfermería Técnica** — 3 años. Se documentó que existen tanto institutos privados (Instituto San Fernando, Idat, Cibertec) como IESTP públicos (Instituto de Educación Superior Tecnológico Público) — reflejado en el dataset con ambos tipos de gestión. Vinculada a Enfermería.
  - **Computación e Informática (técnico)** (Idat/Cibertec) — 2 años. **Corrección importante sobre la nota original de Parte 7:** se pensaba que era más afín a Ingeniería de Sistemas (generalista), pero la investigación de Parte 8 mostró que el currículo real está fuertemente orientado a desarrollo de software (programación, Git, Docker, SQL, apps web/cloud/mobile) — se vinculó a **Ingeniería de Software**, no a Sistemas. Ingeniería de Sistemas queda sin técnica vinculada (`null`).

  **3. Corrección de un error de nomenclatura heredado:** se detectó que ISIL estaba incluido en el listado `universidades[]` de Diseño Gráfico universitaria, cuando en realidad ISIL ofrece Diseño Gráfico como programa técnico de 3 años (no universitario de 5). Se corrigió: ISIL se movió a la nueva entrada `diseno-grafico-tecnico`, junto con Toulouse Lautrec e Instituto Continental (confirmado como "Diseño Gráfico Publicitario", misma vocación con nombre comercial distinto, por decisión del creador).

  **4. Casos donde se decidió conscientemente NO forzar un vínculo `vocacionRelacionada`** (documentado para evitar repetir la investigación sin necesidad, pero dejando la puerta abierta si aparece mejor evidencia):
  - Terapia Ocupacional, Ingeniería Geológica (confirmado "no" en la nota original)
  - Ingeniería Mecatrónica, Psicología (nunca verificado a fondo)
  - Arquitectura ↔ Diseño de Interiores (vocaciones relacionadas pero de alcance distinto)
  - Ingeniería de Sistemas (la técnica más cercana terminó vinculándose a Software, no a Sistemas)

## Features completados ✅

(ninguno al 100% todavía — "Test vocacional" sigue en curso; `test/page.jsx`, `lib/scoring/engine.ts` y `resultado/page.jsx` con datos reales conectados ya cerrados como sub-hitos funcionales; metodología de reconstrucción de `carreras.json` validada y aplicada — 27 carreras completas, incluyendo la primera ronda completa de vínculos técnica-universitaria)

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas — normalización de escalas, estructura `universidades[]`, campo `sectoresEmpleo`, exclusiones verificadas carrera por carrera, eliminación de `estabilidad_laboral`/`logro_economico`, patrón `notaCobertura`, prohibición de codificar sesgos de contratación, verificación obligatoria de nomenclatura — y se agregan:)

- **(NUEVO — Parte 8) Campos `duracionAnios` y `vocacionRelacionada` obligatorios en toda entrada de `carreras.json`.** Ver detalle completo en "Arquitectura y stack" arriba.
- **(NUEVO — Parte 8) Criterio de calidad para técnicas "informales":** cuando una vocación tiene tanto una ruta formal (institutos/ISP reconocidos, duración estándar) como cursos cortos de dudosa calidad (6-10 meses, sin respaldo académico), **el dataset solo modela la ruta formal** — los cursos cortos se excluyen intencionalmente y se documenta la exclusión en `notaCobertura`. Precedente: Auxiliar de Educación.
- **(NUEVO — Parte 8) Criterio de rigor para `vocacionRelacionada`:** el vínculo solo se establece cuando el mapeo entre técnica y universitaria es razonablemente 1 a 1, verificado con fuente oficial. Si dos vocaciones están relacionadas pero tienen alcance claramente distinto (ej. Arquitectura vs. Diseño de Interiores), se mantienen separadas sin vínculo forzado — mismo criterio ya usado en Parte 7 para no fusionar carreras con nombres parecidos.
- **(NUEVO — Parte 8) `tipoGestion: "particular"` aplica también a organismos públicos sectoriales que cobran matrícula/mensualidad** (ej. SENATI, SENCICO) — decisión del creador: el criterio de clasificación es si el estudiante paga, no la naturaleza jurídica de la institución.
- **(NUEVO — Parte 8) Instituciones de educación superior tecnológica pública (IESTP) se clasifican como `tipoGestion: "nacional"`**, distinto de SENATI/SENCICO — reflejan diversidad real del sistema (hay carreras técnicas verdaderamente gratuitas/estatales junto a las de pago).

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 9: continuar la reconstrucción de las carreras universitarias restantes del esqueleto original (Economía, Comunicación Audiovisual, Ingeniería de Minas, Gestión de RRHH, Logística y Comercio Exterior) y las de tendencia emergente (Ciencia de Datos, Ciberseguridad, Diseño UX/UI, Marketing Digital), aplicando la plantilla ya establecida (incluyendo el registro de `duracionAnios` y evaluación honesta de `vocacionRelacionada` para cada una nueva).

## Dudas o problemas pendientes

- Redacción exacta del mensaje genérico fijo sobre estabilidad laboral/logro económico para `resultado/page.jsx` — aún no escrito, solo aprobado el concepto (pendiente desde Parte 7).
- Implementar en código las funciones de normalización de escalas en `/lib/scoring` (pendiente desde Parte 6).
- Diseñar estrategia de comparación para `estilo_vida` y `restricciones_personales` (categóricos) en el motor de recomendación.
- Actualizar `types.ts` en `/lib/scoring` para reflejar los campos nuevos `duracionAnios` y `vocacionRelacionada`.
- Decidir el destino final de `carreras-tecnicas-notas.json` (¿se elimina cuando todas las carreras tengan su `vocacionRelacionada` evaluado, o se conserva como bitácora histórica?).
- Sendero de progreso visual y estilos Tailwind del test; diseño real de `resultado/page.jsx`.
- Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer).
- Diseñar cómo `resultado/page.jsx` presentará al estudiante el par universitaria/técnica cuando ambas existan (ej. "también te podría interesar la ruta técnica de X, más corta") — la arquitectura de datos ya está resuelta, pero la UI/UX de esa presentación sigue sin diseñar.
- Pendiente confirmar mensaje de commit real usado y hacer el push correspondiente (incluye las 16 carreras nuevas de Parte 8: 8 universitarias + 9 técnicas, más las correcciones a Diseño Gráfico y las 11 carreras previas migradas al nuevo esquema).
