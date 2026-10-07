'use client'

import preguntas from '@/data/preguntas.json';
import {useEffect, useState} from 'react';
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
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. No hay respuestas correctas, responde como eres, no como crees que deberías ser. Algunas frases suenan negativas; respóndelas igual con sinceridad.',
  },
  riasec: {
    mide: 'Aquí vemos qué tipo de actividades te atraen: trabajar con las manos, investigar, crear, ayudar, liderar u organizar.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Piensa en lo que te gusta hacer, no en lo que se te da bien.',
  },
  aptitudes: {
    mide: 'Aquí vemos cómo resuelves problemas con palabras, números, figuras y lógica.',    
    comoResponder: 'Cambia el formato, solo una pregunta es correcta.',
  },
  inteligencias_multiples: {
    mide: 'Aquí vemos en qué áreas sientes más facilidad natural: lógica, palabras, espacio, movimiento, música, personas, tu mundo interior y la naturaleza.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Ya no hay respuestas correctas, importa cómo te ves tú.',
  },
  valores: {
    mide: 'Aquí vemos qué buscas en tu futuro trabajo: ayudar a otros, crear, decidir con libertad, ser reconocido, trabajar en equipo o cuidar el ambiente.',
    comoResponder: 'Indica qué tan de acuerdo estás con cada frase. Piensa en lo que te importa a ti, no en lo que esté de moda ni en lo que otros esperan.',
  },
};

export default function TestVocacional() {
  const router = useRouter();
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mostrandoIntro, setMostrandoIntro] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const indiceGuardado = storage.get(storage.keys.INDICE) || 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(indiceGuardado);
    setMostrandoIntro(indiceGuardado === 0);
    setRespuestas(storage.get(storage.keys.RESPUESTAS) || {});
    setCargandoDatos(false);
  }, []);

  const preguntaActual = preguntas[currentIndex];
  const etapaActual = etapas.find((etapa) => etapa.inicio <= currentIndex && etapa.fin >= currentIndex);

  const numeroEtapa = etapas.indexOf(etapaActual) + 1;
  const preguntaEnEtapa = currentIndex - etapaActual.inicio + 1;
  const totalEnEtapa = etapaActual.fin - etapaActual.inicio + 1;
  const etapaSiguiente = etapas[numeroEtapa];

  const esIntroInicial = mostrandoIntro && currentIndex === 0;
  const etapaIntro = esIntroInicial ? etapaActual : etapaSiguiente;

  const estadoDeEtapa = (etapa) => {
    if (currentIndex > etapa.fin) return 'hecha';
    if (currentIndex >= etapa.inicio) return 'actual';
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
      setError('Debes responder la pregunta antes de continuar');
      return;
    }
    setError('');

    const terminoEtapa = currentIndex === etapaActual.fin;
    const esUltimaPregunta = currentIndex === preguntas.length - 1;

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
    // En la intro inicial el índice se queda en 0: solo se pasa de la intro a la pregunta 1.
    if (!esIntroInicial) setearIndice(currentIndex + 1);
    setMostrandoIntro(false);
  };

  const handleResponder = (preguntaId, valor) => {
    const nuevaRespuesta = {...respuestas, [preguntaId]: valor};
    setRespuestas(nuevaRespuesta);
    storage.set(storage.keys.RESPUESTAS, nuevaRespuesta);
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
    <div>
      <ol>
        {etapas.map((etapa) => {
          const estado = estadoDeEtapa(etapa);
          return (
            <li key={etapa.dimension} aria-current={estado === 'actual' ? 'step' : undefined}>
              {nombresAmigables[etapa.dimension]}
              <span className="sr-only"> ({estado})</span>
            </li>
          );
        })}
      </ol>
      {mostrandoIntro ? (
        <>
          {!esIntroInicial && <p>Terminaste el bloque {nombresAmigables[etapaActual.dimension]}</p>}
          <p>Bloque: {nombresAmigables[etapaIntro.dimension]}</p>
          <p>{introEtapas[etapaIntro.dimension].mide}</p>
          <p>{introEtapas[etapaIntro.dimension].comoResponder}</p>
          <button onClick={handleContinuar}>Continuar</button>
        </>
      ) : (
        <>
          <p>{nombresAmigables[etapaActual.dimension] ?? 'Etapa sin nombre'}</p>
          <p>Etapa {numeroEtapa} de {etapas.length}</p>
          <p>Pregunta {preguntaEnEtapa} de {totalEnEtapa}</p>
          <p>{preguntaActual.texto}</p>
          {campoPregunta}
          <p>{error}</p>
          {currentIndex > 0 && <button onClick={handleAnterior}>Anterior</button>}
          <button onClick={handleSiguiente}>
            {currentIndex < preguntas.length - 1 ? 'Siguiente' : 'Ver resultado'}
          </button>
        </>
      )}
    </div>
  );
}
