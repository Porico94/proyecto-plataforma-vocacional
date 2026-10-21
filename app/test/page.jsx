'use client'

import preguntas from '@/data/preguntas.json';
import {useEffect, useState, useRef} from 'react';
import {storage} from '@/lib/storage';
import {useRouter} from 'next/navigation';
import PreguntaLikert from '@/components/test/PreguntaLikert';
import PreguntaOpciones from '@/components/test/PreguntaOpciones';

const etapas = preguntas.reduce((acc, pregunta, indice) => {
  const ultima = acc[acc.length - 1];
  if (!ultima || ultima.dimension !== pregunta.dimension) {
    acc.push({dimension: pregunta.dimension, inicio: indice, fin: indice});
  } else {
    ultima.fin = indice;
  }
  return acc;
}, []);

const nombresAmigables = {
  personalidad: '¿Cómo eres?',
  riasec: '¿Qué te atrae?',
  aptitudes: 'Tus habilidades',
  inteligencias_multiples: '¿Cómo piensas mejor?',
  valores: 'Lo que valoras',
};

const introEtapas = {
  personalidad: {
    mide: 'Aquí vemos cómo eres en tu día a día: tu curiosidad, tu orden, cómo te relacionas con otros y cómo manejas la presión.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Responde como eres actualmente, no como te gustaría ser.',
  },
  riasec: {
    mide: 'Aquí vemos qué tipo de actividades te atraen: trabajar con las manos, investigar, crear, ayudar, liderar u organizar.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Piensa en cuánto te atrae cada actividad, no en qué tan bien se te da.',
  },
  aptitudes: {
    mide: 'Aquí vemos cómo resuelves problemas con palabras, números, figuras y lógica.',    
    comoResponder: 'Ojo: aquí el formato cambia. Cada pregunta tiene una sola respuesta correcta. Lee con calma y elige la opción que consideres acertada.',
  },
  inteligencias_multiples: {
    mide: 'Aquí vemos en qué áreas sientes más facilidad natural: lógica, palabras, espacio, movimiento, música, personas, tu mundo interior y la naturaleza.',
    comoResponder: 'Vuelve la escala anterior, no hay respuestas correctas. Indica qué tan de acuerdo estás con cada frase según lo que se te hace más fácil o natural.',
  },
  valores: {
    mide: 'Aquí vemos qué buscas en tu futuro trabajo: ayudar a otros, crear, decidir con libertad, ser reconocido, trabajar en equipo o cuidar el ambiente.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Piensa en lo que de verdad te importa para tu futuro, no en las modas ni en lo que otros esperan de ti.',
  },
};

const estilosParada = {
  hecha: 'border-amanecer bg-amanecer text-texto-oscuro',
  actual: 'border-amanecer text-amanecer ring-3 ring-amanecer/30',
  pendiente: 'border-texto-claro/50 text-texto-claro/70',
};

export default function TestVocacional() {
  const router = useRouter();
  const miRef = useRef(null);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mostrandoIntro, setMostrandoIntro] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);

  useEffect(() => {
    const guardado = storage.get(storage.keys.INDICE);
    const indiceGuardado =
      Number.isInteger(guardado) && guardado >= 0 && guardado < preguntas.length
        ? guardado
        : 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(indiceGuardado);
    setMostrandoIntro(indiceGuardado === 0);
    setRespuestas(storage.get(storage.keys.RESPUESTAS) || {});
    setCargandoDatos(false);
  }, []);

  useEffect(() => {
    miRef.current?.focus();
  }, [mostrandoIntro, currentIndex]);

  const preguntaActual = preguntas[currentIndex];
  const etapaActual = etapas.find((etapa) => etapa.inicio <= currentIndex && etapa.fin >= currentIndex);

  const numeroEtapa = etapas.indexOf(etapaActual) + 1;
  const numeroPreguntaEnEtapa = currentIndex - etapaActual.inicio + 1;
  const totalPreguntasEnEtapa = etapaActual.fin - etapaActual.inicio + 1;
  const etapaSiguiente = etapas[numeroEtapa];
  const esUltimaPregunta = currentIndex === preguntas.length - 1;

  const esIntroInicial = mostrandoIntro && currentIndex === 0;
  const etapaIntro = esIntroInicial ? etapaActual : etapaSiguiente;

  const esIntroTransicion = mostrandoIntro && !esIntroInicial;
  const indiceSendero = esIntroTransicion ? currentIndex + 1 : currentIndex;

  const estadoDeEtapa = (etapa) => {
    if (indiceSendero > etapa.fin) return 'hecha';
    if (indiceSendero >= etapa.inicio) return 'actual';
    return 'pendiente';
  };

  const setearIndice = (indice) => {
    setCurrentIndex(indice);
    storage.set(storage.keys.INDICE, indice);
  };

  const handleAnterior = () => {
    if (currentIndex > 0) {
      const nuevoIndice = currentIndex - 1;
      setearIndice(nuevoIndice);
      setError('');
    }
  };

  const handleSiguiente = () => {
    if (respuestas[preguntaActual.id] === undefined) {
      setError('Selecciona una respuesta para poder continuar.');
      setIntentosFallidos(intentosFallidos + 1);
      return;
    }
    setError('');

    const terminoEtapa = currentIndex === etapaActual.fin;
    

    if (terminoEtapa && !esUltimaPregunta) {
      setMostrandoIntro(true);
      return;
    }

    if (!esUltimaPregunta) {
      const nuevoIndice = currentIndex + 1;
      setearIndice(nuevoIndice);
    } else {
      router.push('/resultado');
    }
  };

  const handleContinuar = () => {
    if (!esIntroInicial) setearIndice(currentIndex + 1);
    setMostrandoIntro(false);
  };

  const handleResponder = (preguntaId, valor) => {
    const nuevaRespuesta = {...respuestas, [preguntaId]: valor};
    setRespuestas(nuevaRespuesta);
    storage.set(storage.keys.RESPUESTAS, nuevaRespuesta);
    setError('');
  };

  let campoPregunta;

  if (preguntaActual.tipo === 'likert') {
    campoPregunta = <PreguntaLikert pregunta={preguntaActual} respuesta={respuestas[preguntaActual.id]} onResponder={handleResponder} />;
  } else if (preguntaActual.tipo === 'aptitud') {
    campoPregunta = <PreguntaOpciones pregunta={preguntaActual} respuesta={respuestas[preguntaActual.id]} onResponder={handleResponder} />;
  } else {
    campoPregunta = <p>Tipo de pregunta desconocido {preguntaActual.tipo}</p>;
  }

  if (cargandoDatos) {return <p>Cargando...</p>;}
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <ol className="mb-6 flex items-center">
        {etapas.map((etapa, index) => {
          const estado = estadoDeEtapa(etapa);
          return (
            <li
              key={etapa.dimension}
              aria-current={estado === 'actual' ? 'step' : undefined}
              className={index === 0 ? 'flex items-center' : 'flex flex-1 items-center'}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`h-0.5 flex-1 ${estado === 'pendiente' ? 'bg-texto-claro/35' : 'bg-amanecer'}`}
                />
              )}
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium ${estilosParada[estado]}`}
              >
                {estado === 'hecha' ? '✓' : index + 1}
              </span>
              <span className="sr-only">
                {nombresAmigables[etapa.dimension] ?? 'Etapa sin nombre'} ({estado})
              </span>
            </li>
          );
        })}
      </ol>
      {mostrandoIntro ? (
        <>
          {!esIntroInicial && (
            <p className="font-medium text-amanecer">
              <span aria-hidden="true">✓ </span>
              Terminaste el bloque: {nombresAmigables[etapaActual.dimension]}
            </p>
          )}
          <h2 ref={miRef} tabIndex={-1} className="mt-3 font-voz text-2xl leading-snug font-medium text-texto-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-4 focus-visible:ring-offset-noche rounded-md">
            Nuevo bloque: {nombresAmigables[etapaIntro.dimension]}
          </h2>
          <p className="mt-3 leading-relaxed text-texto-claro">
            {introEtapas[etapaIntro.dimension].mide}
          </p>
          <div className="mt-4 rounded-lg border-2 border-l-4 border-texto-claro/50 border-l-amanecer px-4 py-3">
            <p className="mb-1 text-sm font-medium text-amanecer">Cómo responder</p>
            <p className="leading-relaxed text-texto-claro">
              {introEtapas[etapaIntro.dimension].comoResponder}
            </p>
          </div>
          <button
            className="mt-6 flex w-full items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 bg-amanecer border-amanecer text-texto-oscuro font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
            onClick={handleContinuar}
          >
            Continuar
            <span aria-hidden="true">→</span>
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-amanecer">
            Etapa {numeroEtapa} de {etapas.length} · {nombresAmigables[etapaActual.dimension] ?? 'Etapa sin nombre'}
          </p>
          <p className="mt-1 text-sm text-texto-claro/80">
            Pregunta {numeroPreguntaEnEtapa} de {totalPreguntasEnEtapa}
          </p>
          <h2 ref={miRef} tabIndex={-1} className="mt-4 mb-6 font-voz text-2xl leading-snug font-medium text-texto-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-4 focus-visible:ring-offset-noche rounded-md">
            {preguntaActual.texto}
          </h2>
          {campoPregunta}
          {error && (
            <p key={intentosFallidos} role="alert" className="mt-4 font-medium text-error">
              <span aria-hidden="true">⚠ </span>
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-2 justify-end">
            {currentIndex > 0 && <button
              className="flex basis-1/2 items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 border-texto-claro/50 text-texto-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
              onClick={handleAnterior}
              >
                <span aria-hidden="true">←</span>
                Anterior
              </button>}
            <button
              className="flex basis-1/2 items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 bg-amanecer border-amanecer text-texto-oscuro font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
              onClick={handleSiguiente}
            >
              {esUltimaPregunta ? 'Ver resultado' : 'Siguiente'}
              {!esUltimaPregunta && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
