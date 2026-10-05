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

  export default function TestVocacional() {
    const router = useRouter();
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentIndex(storage.get(storage.keys.INDICE) || 0);
      setRespuestas(storage.get(storage.keys.RESPUESTAS) || {});
      setCargandoDatos(false);
    }, []);

    const preguntaActual = preguntas[currentIndex];
    const etapaActual = etapas.find((etapa) => etapa.inicio <= currentIndex && etapa.fin >= currentIndex);

    const numeroEtapa = etapas.indexOf(etapaActual) + 1;
    const preguntaEnEtapa = currentIndex - etapaActual.inicio + 1;
    const totalEnEtapa = etapaActual.fin - etapaActual.inicio + 1;

    const estadoDeEtapa = (etapa) => {
      if (currentIndex > etapa.fin) return 'hecha';
      if (currentIndex >= etapa.inicio) return 'actual';
      return 'pendiente';
    };

    const handleAnterior = () => {
      if (currentIndex > 0) {
        const nuevoIndice = currentIndex - 1;
        setCurrentIndex(nuevoIndice);
        storage.set(storage.keys.INDICE, nuevoIndice);
        setError('');
      }
    };

    const handleSiguiente = () => {
      if (respuestas[preguntaActual.id] === undefined) {
        setError('Debes responder la pregunta antes de continuar');
        return;
      }
      
      setError('');

      if (currentIndex < preguntas.length - 1) {
        const nuevoIndice = currentIndex + 1;
        setCurrentIndex(nuevoIndice);
        storage.set(storage.keys.INDICE, nuevoIndice);
      } else {
        router.push('/resultado');
      }
    };

    const handleResponder = (preguntaId, valor) => {
      const nuevaRespuesta = {...respuestas, [preguntaId]: valor};
      setRespuestas(nuevaRespuesta);
      storage.set(storage.keys.RESPUESTAS, nuevaRespuesta);
    };

    let campoPregunta;

    if (preguntaActual.tipo === 'likert') {
      campoPregunta = <PreguntaLikert pregunta={preguntaActual} respuesta={respuestas[preguntaActual.id]} onResponder={handleResponder} />        
    } else if (preguntaActual.tipo === 'aptitud') {
      campoPregunta = <PreguntaOpciones pregunta={preguntaActual} respuesta={respuestas[preguntaActual.id]} onResponder={handleResponder} />
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
        <p>{nombresAmigables[etapaActual.dimension] ?? 'Etapa sin nombre'}</p>
        <p>Etapa {numeroEtapa} de {etapas.length}</p>
        <p>Pregunta {preguntaEnEtapa} de {totalEnEtapa}</p>
        <p>{preguntaActual.texto}</p>      
        {campoPregunta}
        <p>{error}</p>
        {currentIndex > 0 && <button onClick={handleAnterior}>Anterior</button>}
        <button onClick={handleSiguiente}> {currentIndex < preguntas.length - 1 ? 'Siguiente' : 'Ver resultado'}</button>
      </div>
    )
  }