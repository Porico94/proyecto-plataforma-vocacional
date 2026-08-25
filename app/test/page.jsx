'use client'

import preguntas from '@/data/preguntas.json';
import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';
import PreguntaLikert from '@/components/test/PreguntaLikert';
import PreguntaOpciones from '@/components/test/PreguntaOpciones';

export default function TestVocacional() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(storage.get(storage.keys.INDICE) || 0);
    setRespuestas(storage.get(storage.keys.RESPUESTAS) || {});
  }, []);

  const preguntaActual = preguntas[currentIndex];

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      const nuevoIndice = currentIndex + 1;
      setCurrentIndex(nuevoIndice);
      storage.set(storage.keys.INDICE, nuevoIndice);
    } else {
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
  } else if (preguntaActual.tipo === 'aptitud' || preguntaActual.tipo === 'eleccion_forzada') {
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
      <button onClick={handleNext}>Siguiente</button>
    </div>
  )
}