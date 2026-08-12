'use client'

import preguntas from '@/data/preguntas.json';
import {useState} from 'react';

export default function Test() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  const preguntaActual = preguntas[currentIndex];

  const handleNext = () => {
    if (currentIndex < preguntas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('Test completado');
    }
  };

  const handleResponder = (preguntaId, valor) => {
    setRespuestas((prev) => ({...prev, [preguntaId]: valor}));
    console.log(`Respuesta para la pregunta ${preguntaId}: ${valor}`);
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