'use client'

import preguntas from '@/data/preguntas.json';
import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';

export default function Test() {
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

  return (
    <div>
      <p>{preguntaActual.tipo}</p>
      <p>Pregunta {currentIndex+1} de {preguntas.length}</p>
      <p>{preguntaActual.texto}</p>
      {[1,2,3,4,5].map((e) => <button key={e} onClick={() => handleResponder(preguntaActual.id, e)}>{e}</button>)}
      <button onClick={handleNext}>Siguiente</button>
      <p>Tu respuesta: {respuestas[preguntaActual.id]}</p>
    </div>
  )
}