'use client'

import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';
import preguntas from '@/data/preguntas.json';
import ConsejoVocacional from '@/components/resultado/ConsejoVocacional';
import {scoreEnginePerfil} from '@/lib/scoring/engine';

export default function Resultado() {
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const respuestas = storage.get(storage.keys.RESPUESTAS) || {};
    const resultadoCalculado = scoreEnginePerfil(preguntas, respuestas);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResultado(resultadoCalculado);
  }, []);

  if (!resultado) {
    return (
      <div>
        <h1>Cargando resultados...</h1>
      </div>
    );
  } else {
    return (      
      <div>
        <ConsejoVocacional/>
        <h1>Resultado del Test Vocacional</h1>
        <p>Perfil: {JSON.stringify(resultado)}</p>
      </div>
    );
  }
}