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

- Estructura de carpetas:
  /app
  /page.jsx → Landing (explica la plataforma, botón "Empezar test")
  /test/page.jsx → Flujo del test (todas las preguntas/dimensiones)
  /resultado/page.jsx → Muestra el resultado + botón de descarga PDF
  /components
  /test/ → Componentes de preguntas, barra de progreso, etc.
  /resultado/ → Componentes de visualización del resultado
  /ui/ → Componentes reutilizables (botones, cards)
  /lib
  /scoring/ → Motor de recomendación (TypeScript)
  engine.ts → Lógica de cálculo del perfil vocacional
  types.ts → Tipos de preguntas, dimensiones, resultado
  /data/
  preguntas.json → Banco de preguntas por dimensión (106 preguntas, definido y archivado ✅)
  carreras.json → Dataset de carreras (Perú) con sus atributos (33 carreras, definido y archivado ✅)
  /public

- Stack confirmado para este proyecto: Next.js (App Router), Tailwind CSS, React Hook Form + Zod, TypeScript en `/lib/scoring` (lógica de negocio) y JS en el resto de la UI para el MVP, Playwright, Vercel. Sin Auth.js ni PostgreSQL/Prisma en el MVP (se incorporan en post-MVP). Dataset de carreras como JSON estático mantenido a mano.
- Decisiones técnicas importantes y por qué:
  - Sin registro/login en el MVP: proyecto de portafolio/ayuda sin fines de negocio, para un grupo cerrado de beta testers; evita fricción para adolescentes. Feedback se recoge vía formulario externo simple (no requiere cuenta).
  - TypeScript limitado a `/lib/scoring`: es la lógica de negocio central del proyecto (motor de recomendación), coherente con la regla base de introducir TS donde hay lógica de negocio.
  - Sin base de datos en el MVP: no hay persistencia que gestionar aún (sin usuarios ni historial); se introduce PostgreSQL + Prisma en post-MVP cuando haya login y datos que guardar.
  - Post-MVP planificado: login + persistencia de resultados (para poder analizar feedback y datos de cada usuario), integración de mercado laboral peruano, análisis de foros con IA.
  - ⚠️ Stack nuevo detectado: generación de PDF (ej. jsPDF, @react-pdf/renderer) — el creador no tiene experiencia previa con esto; debe aprenderlo primero en su proyecto de Estudio antes de aplicarlo aquí.

## Feature actual (Bloque B — cambia en cada ciclo)

- Feature: Test vocacional (flujo completo: preguntas → resultado → descarga PDF)
- Fase actual: Diseño UI (Fase 4) — por iniciar
- En lo que estaba trabajando: Se completó y archivó todo el contenido base del feature antes de entrar a Diseño UI:
  - `carreras.json`: 33 carreras (14 universitarias + 10 técnicas tradicionales + 9 tecnológicas/tendencias emergentes: Desarrollo de Software, Ciencia de Datos, Ciberseguridad, Diseño UX/UI, Marketing Digital, Ing. Ambiental, Ing. de Minas/Geología, Gestión RRHH, Logística y Comercio Exterior). Cada carrera con atributos: riasec, aptitudesRequeridas, inteligenciasClave, rasgosFavorables, valoresAsociados, estiloVida, duracionAnios, costoAproximadoRango (categórico), disponibilidadPeru.
  - `preguntas.json`: 106 preguntas repartidas en 9 dimensiones (Personalidad 25, RIASEC 18, Aptitudes 12, Inteligencias múltiples 16, Valores 8, Motivaciones 8, Estilo de aprendizaje 8, Estilo de vida 6, Restricciones personales 5). Tres tipos de pregunta: `likert` (autopercepción, 1-5), `aptitud` (opción múltiple con respuesta correcta), `eleccion_forzada` (preferencia práctica/datos de restricción).
  - Ambos archivos validados (JSON válido, sin IDs duplicados, conteos correctos) y entregados al usuario para incorporar a `/data/`.
  - Próximo paso dentro del ciclo: iniciar Fase 4 (Diseño UI) del flujo `/test/page.jsx`.

## Features completados ✅

(ninguno aún — el feature "Test vocacional" sigue en curso, en Fase 4 de su ciclo)

## Reglas de negocio definidas

- El resultado del test no debe tratarse como definitivo/fijo de por vida — las restricciones personales (tiempo, economía) pueden cambiar, lo cual es relevante para cuando exista la opción de re-tomar el test en el futuro (post-MVP).
- El dataset de carreras usa rangos de costo categóricos (bajo/medio/alto), no montos exactos en soles, para evitar generar ansiedad o descarte prematuro en el estudiante — se espera que confirme costos reales directamente con cada institución.
- El campo `disponibilidadPeru` de cada carrera (regiones donde se dicta, o "nacional") se usa junto con la dimensión de "restricciones personales" del test para ajustar la recomendación según viabilidad geográfica real del estudiante, no solo afinidad de perfil.
- Las preguntas de tipo `aptitud` (aptitudes cognitivas) miden habilidad real mediante ejercicios con respuesta correcta, a diferencia del resto de dimensiones que son autopercepción tipo `likert` — el motor de scoring debe tratarlas con lógicas de cálculo distintas.

## Próximo paso concreto

Abrir un chat nuevo dentro del proyecto, pegar este CONTEXT.md y escribir "inicio sesión" para comenzar la Fase 4 (Diseño UI) del feature "Test vocacional": diseñar la interfaz del flujo `/test/page.jsx` (preguntas, barra de progreso, transición entre tipos de pregunta likert/aptitud/eleccion_forzada).

## Dudas o problemas pendientes

- Ninguna pendiente por ahora — el dataset de carreras y el banco de preguntas quedaron resueltos y cerrados en esta sesión.
