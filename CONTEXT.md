# CONTEXT.md — Plataforma de Orientación Vocacional

## Definición del proyecto (Fase 1 — fija, no cambia)

- Problema que resuelve: Los estudiantes de secundaria en Perú (15-18 años) eligen carrera técnica o universitaria sin criterio real, guiados por marketing/moda, sin considerar mercado laboral, aptitudes reales ni factores personales — lo que puede traducirse en años y dinero perdidos (caso real: el creador estudió Ingeniería Mecatrónica en 2011 guiado por marketing, sin encontrar mercado laboral al graduarse).
- Para quién es: Estudiantes peruanos de colegio a punto de decidir carrera técnica o universitaria. Caso semilla: un familiar del creador. Objetivo final: todos los estudiantes del Perú.
- Propuesta de valor: A diferencia del test vocacional típico (percibido como poco objetivo), esta plataforma combina múltiples dimensiones psicométricas + datos reales de mercado laboral peruano + experiencias reales de profesionales (foros), para dar una recomendación con criterio, no genérica.
- MVP (alcance inicial): Test completo (personalidad, RIASEC, aptitudes cognitivas, inteligencias múltiples, valores, motivaciones, estilo de aprendizaje, preferencias de estilo de vida, restricciones personales) → motor de recomendación contra dataset estático de carreras → resultado descargable en PDF. Sin registro/login. Usuarios: grupo cerrado de beta testers.
- Qué NO incluye el MVP: Registro/login/autenticación, persistencia de resultados en base de datos, integración de datos de mercado laboral **en tiempo real** (sí se permite investigación puntual y estática para construir el dataset), análisis de foros con IA, apertura a público general.
- Objetivos corto/mediano plazo:
  - Corto plazo: MVP funcional de punta a punta para que el familiar del creador y 3-5 beta testers más lo prueben y den feedback real.
  - Mediano plazo: Iterar el motor de recomendación según feedback recibido, luego iniciar primer feature post-MVP (probablemente mercado laboral). El catálogo de `carreras.json` seguirá creciendo post-MVP con las carreras que falten — no es bloqueante para el lanzamiento del MVP.

## Investigación (Fase 2 — fija, no cambia)

- Competidores/referencias analizados: Ponte en Carrera (MTPE/Minedu), Mi Carrera (Ministerio de Trabajo), tests de universidades privadas (UCV/ISIL/UPN), EstudiaPerú, TestVocacional.app.
- Lo bueno (para aprender): Combinar varias metodologías psicométricas en un solo perfil da más solidez que un test único. Integrar datos reales de mercado laboral aporta valor concreto. Sin registro / fricción mínima al inicio mejora la conversión. Resultado descargable como alternativa a cuentas de usuario.
- Lo malo (para evitar): Fragmentar el test en varias pruebas sueltas y desconectadas. Sesgo de negocio disfrazado de orientación objetiva (universidades privadas) — las páginas de universidades son fuente parcial/marketing, útiles solo para evidencia cualitativa, nunca para cifras. Profundidad sacrificada por velocidad. UX anticuada en plataformas del Estado.
- Oportunidad de diferenciación: Ninguna referencia analizada cubre estilo de vida y restricciones personales como parte del algoritmo. Ninguna combina test multidimensional completo + mercado laboral peruano + experiencias reales de profesionales, en una sola plataforma con UX moderna.

## Arquitectura y stack (Fase 3 — fija salvo cambio de alcance)

- Estructura de carpetas (actualizada):

/app
/page.js → Landing (pendiente de personalizar)
/perfil/page.jsx → ✅ Completo
/test/page.jsx → ✅ Completo
/resultado/page.jsx → ✅ Completo (Fase 5 — Parte 5); PENDIENTE: agregar bloque de texto fijo (consejo genérico sobre estabilidad laboral/logro económico dependiendo de factores individuales, no del perfil del usuario)
/components
/test/
PreguntaLikert.jsx → ✅ Completo
PreguntaOpciones.jsx → ✅ Completo
/resultado/ → vacío, pendiente
/ui/ → vacío, pendiente
/lib
/storage.js → ✅ Completo
/scoring/
engine.ts → ✅ Completo (Parte 10): scoreEngineLikert, scoreEngineAptitud y scoreEngineEleccionForzada devuelven forma de dos niveles (dimension → subdimension). Normalización de escalas integrada y cerrada.
normalizar.ts → ✅ Nuevo (Parte 10): normalizarScore(score, min, max, contexto?), reescalamiento lineal a ESCALA_DESTINO. Incluye guard (max <= min lanza Error con contexto "dimension > subdimension") para evitar inversiones silenciosas de escala.
constants.ts → ✅ Nuevo (Parte 10): ESCALA_DESTINO = 9.
types.ts → ✅ Completo, sin cambios en Parte 10.
/data
preguntas.json → ✅ 104 preguntas reales. 9 dimensiones, valores con 6 subdimensiones activas: impacto_social, creatividad, autonomia, reconocimiento, trabajo_en_equipo, sostenibilidad. Likert confirmado en escala 1-5.
carreras.json → 🔶 EN CRECIMIENTO CONTINUO (46 entradas confirmadas a la fecha, archivo subido y verificado en Parte 10). Cada versión técnica se modela como entrada completa e independiente en el mismo archivo, con su propio perfil psicométrico, vinculada a la universitaria vía el campo `vocacionRelacionada` (bidireccional). Campo `tipo`: `"universitaria"` | `"tecnica"`. Escala confirmada: 0-9 en todos los campos comparables (riasec, aptitudesRequeridas, rasgosFavorables).
/public

- Stack confirmado: Next.js 16.3.0 (App Router, Turbopack), React 19.2.8, Tailwind CSS v4, React Hook Form 7.85 + Zod 4.4 + @hookform/resolvers 5.7, TypeScript en `/lib/scoring`, JS en el resto, ESLint, Playwright (aún no configurado), Vercel (aún no desplegado). Sin Auth.js ni PostgreSQL/Prisma en el MVP.
- Decisiones técnicas importantes y por qué (sin cambios salvo lo agregado):
  - Arquitectura de componentes de pregunta, patrón sincronización estado↔sessionStorage, validación "Siguiente"/"Anterior", motor de scoring de dos niveles, nomenclatura separada entre `preguntas.json` y `carreras.json`.
  - **(NUEVO — Parte 10) Escala destino de normalización: 9, no 10.** Decisión explícita para matchear la escala real de `carreras.json` (0-9, ya con 46 carreras verificadas) en vez de migrar el dataset existente a 0-10. Fórmula: `((score - min) / (max - min)) * 9`, aplicada sobre el promedio final (matemáticamente equivalente a aplicarla antes de promediar, por ser transformación lineal).
  - **(NUEVO — Parte 10) `scoreEngineAptitud` normaliza con `normalizarScore(valor, 0, 1)` en vez de `valor * 9` directo**, por consistencia (DRY): toda normalización pasa por una sola función, aunque el atajo directo hubiera sido matemáticamente equivalente y más corto.
  - **(NUEVO — Parte 10) `scoreEngineLikert` guarda `escalaMin`/`escalaMax` dentro del acumulador del primer `reduce`** (junto a `suma`/`count`), porque en el segundo `reduce` (por `Object.entries`) ya no hay acceso al objeto `Pregunta` original — se asume que todas las preguntas de una misma subdimensión comparten la misma escala (caso real confirmado en `preguntas.json`).
  - **(NUEVO — Parte 10) Guard de escala inválida vive dentro de `normalizarScore`, no en `engine.ts`**, y solo se usa con contexto (`dimension > subdimension`) en `scoreEngineLikert` — en `scoreEngineAptitud` el `min=0, max=1` es literal fijo en código, nunca puede fallar por datos corruptos de `preguntas.json`, así que no aplica pasar contexto ahí.
- **Esquema exacto de cada entrada de `carreras.json`** (sin cambios desde Parte 9):

id, nombre, tipo ("universitaria"|"tecnica"), duracionAnios,
vocacionRelacionada (id de la entrada pareja, o null),
riasec { R, I, A, S, E, C } (escala 0-9),
aptitudesRequeridas { espacial, logica, numerica, verbal } (escala 0-9),
rasgosFavorables { responsabilidad, apertura, estabilidad, extraversion, amabilidad } (escala 0-9),
inteligenciasClave [ ] (subset de: logico-matematica, verbal-linguistica, espacial,
corporal-cinestesica, interpersonal, intrapersonal, naturalista, musical),
valoresAsociados [ ] (subset de las 6 subdimensiones activas de valores),
notaCobertura (opcional, string — solo si es carrera masiva con >10 universidades),
universidades [ { nombre, region, tipoGestion ("nacional"|"particular") } ],
sectoresEmpleo [ ]

- Flujo de trabajo para carreras nuevas (sin cambios desde Parte 9): Claude solo muestra el bloque JSON de la carrera nueva en el chat, Pool lo copia manualmente a su `carreras.json` local. Confirmado en Parte 10 que la copia manual de todo lo generado en Parte 9 se completó correctamente.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Motor de recomendación — normalización de escalas (cerrado) + comparación categórica (próximo)
- Fase actual: Desarrollo (Fase 5) — Parte 10 cerrada
- En lo que se trabajó en Parte 10 (sesión de hoy):
  - Se implementó la normalización de escalas pendiente desde Parte 6: `constants.ts` (ESCALA_DESTINO=9), `normalizar.ts` (normalizarScore con guard defensivo), integración en `engine.ts`.
  - Se confirmó y corrigió una inconsistencia real: la fórmula documentada apuntaba a escala 0-10, pero `carreras.json` usa 0-9. Se resolvió ajustando la fórmula a 9 en vez de migrar las 46 carreras existentes.
  - Se verificó el archivo `carreras.json` subido por Pool: 46 entradas, escala 0-9 confirmada en campos comparables.
  - Pendiente de commit: mensaje acordado, push aún no confirmado como hecho.
- ❌ Pendiente (continúa en la próxima sesión — Parte 11):
  - Diseñar estrategia de comparación para `estilo_vida` y `restricciones_personales` (categóricos) en el motor de recomendación.
  - Redactar e implementar el bloque de texto fijo (consejo genérico sobre estabilidad laboral/logro económico) en `resultado/page.jsx`.
  - Seguir agregando carreras según prioridad (ver lista abajo).
  - Sendero de progreso visual y estilos Tailwind del test; diseño real de `resultado/page.jsx`.
  - Estudio aislado de generación de PDF (jsPDF o @react-pdf/renderer).

## Features completados ✅

- [x] Normalización de escalas en el motor de scoring — Parte 10: `constants.ts`, `normalizar.ts`, integración en `engine.ts` con guard defensivo contra escalas inválidas.
      (pendiente al 100%: "Test vocacional" sigue en curso; `test/page.jsx`, `lib/scoring/engine.ts` y `resultado/page.jsx` con datos reales conectados ya cerrados como sub-hitos funcionales; metodología de reconstrucción de `carreras.json` validada y aplicada, con arquitectura técnica/universitaria ya resuelta)

## Reglas de negocio definidas

(Se mantienen todas las reglas de sesiones previas — normalización de escalas [ahora implementada], campo `sectoresEmpleo`, `notaCobertura` para carreras masivas, prohibición de codificar sesgos sociales, verificación obligatoria de nomenclatura, arquitectura técnica/universitaria resuelta, meta de "33 carreras" descartada, fuentes confiables Tecsup/SENATI/Cibertec, no se agregan bootcamps/certificaciones sin programa formal de 2-3 años, flujo de guardado manual de `carreras.json` — y se agregan:)

- **(NUEVO — Parte 10) Escala destino de normalización confirmada en 9, no 10.** Toda futura pregunta o dato numérico que deba compararse contra `carreras.json` debe normalizarse a este rango usando `normalizarScore` de `lib/scoring/normalizar.ts` — nunca reimplementar la fórmula en otro archivo.
- **(NUEVO — Parte 10) Manejo de errores: fallar rápido y visible, no silencioso.** Cuando un dato de configuración (como `escala.min`/`escala.max` en `preguntas.json`) pudiera estar corrupto y producir un resultado matemáticamente válido pero incorrecto (ej. inversión de escala), se prefiere lanzar una excepción explícita con contexto de debugging, en vez de devolver un número plausible pero equivocado — especialmente mientras el proyecto no tiene tests automatizados.
- **(NUEVO — Parte 10) Separación constante/lógica en `/lib/scoring`:** valores de configuración van en `constants.ts` (sin lógica), funciones puras van en archivos propios como `normalizar.ts` — para facilitar tests unitarios aislados en Fase 8 y evitar que otros módulos (motor de recomendación, `resultado/page.jsx`) tengan que importar todo `engine.ts` para acceder a un valor o función.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para continuar la Fase 5 (Desarrollo) — Parte 11: diseñar la estrategia de comparación categórica (`estilo_vida`, `restricciones_personales`) para el motor de recomendación.

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
- Diseño de la estrategia de comparación para `estilo_vida` (categórico mixto) — aún no discutido en detalle. **Próximo tema de Parte 11.**
- Cómo comparar `restricciones_personales.economia` del usuario contra `universidades[].tipoGestion` de cada carrera dentro del motor de recomendación — mecánica exacta aún no diseñada. **Próximo tema de Parte 11.**
- Redacción exacta del mensaje genérico fijo sobre estabilidad laboral/logro económico para `resultado/page.jsx` — aún no escrito, solo aprobado el concepto.
- Diseño visual del sendero de progreso del test, ni la UI real de `resultado/page.jsx` — pendiente.
- Pendiente confirmar mensaje de commit real (acordado en Parte 10: `feat(scoring): normalizar scores de Likert y Aptitud a escala 0-9`) y hacer el push correspondiente — incluye `constants.ts`, `normalizar.ts`, `engine.ts` modificado, y todas las carreras agregadas en Parte 9 (guardadas por Claude y copiadas manualmente por Pool, confirmado sincronizado en Parte 10).
