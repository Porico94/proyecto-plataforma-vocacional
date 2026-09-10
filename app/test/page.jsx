'use client'

import preguntas from '@/data/preguntas.json';
import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';
import {useRouter} from 'next/navigation';
import PreguntaLikert from '@/components/test/PreguntaLikert';
import PreguntaOpciones from '@/components/test/PreguntaOpciones';

export default function TestVocacional() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(storage.get(storage.keys.INDICE) || 0);
    setRespuestas(storage.get(storage.keys.RESPUESTAS) || {});
  }, []);

  const preguntaActual = preguntas[currentIndex];

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
      console.log('Test completado');
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

  return (
    <div>
      <p>{preguntaActual.tipo}</p>
      <p>Pregunta {currentIndex+1} de {preguntas.length}</p>
      <p>{preguntaActual.texto}</p>
      {campoPregunta}
      <p>{error}</p>
      {currentIndex > 0 && <button onClick={handleAnterior}>Anterior</button>}
      <button onClick={handleSiguiente}> {currentIndex < preguntas.length - 1 ? 'Siguiente' : 'Ver resultado'}</button>
    </div>
  )
}