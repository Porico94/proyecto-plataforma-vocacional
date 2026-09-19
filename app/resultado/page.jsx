'use client'

import {useEffect, useState} from 'react';
import {storage} from '@/lib/storage';
import preguntas from '@/data/preguntas.json';
import carreras from '@/data/carreras.json';
import ConsejoVocacional from '@/components/resultado/ConsejoVocacional';
import {scoreEnginePerfil} from '@/lib/scoring/engine';
import {obtenerTop10Carreras} from '@/lib/scoring/recomendacion';

export default function Resultado() {
  const [resultado, setResultado] = useState(null);
  const [top10, setTop10] = useState(null);

  useEffect(() => {
    const respuestas = storage.get(storage.keys.RESPUESTAS) || {};
    const resultadoCalculado = scoreEnginePerfil(preguntas, respuestas);
    const top10Calculado = obtenerTop10Carreras(resultadoCalculado, carreras);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResultado(resultadoCalculado);     
    setTop10(top10Calculado);
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
        <section>
          <h2>Carreras recomendadas</h2>
          <ul>
            {top10.map((carrera) => (
              <li key={carrera.carreraId}>
                <h3>{carrera.nombre}</h3>
                <p>Compatibilidad: {carrera.total.toFixed(1)}%</p>
                <ul>
                  {Object.entries(carrera.porDimension).map(([dimension, porcentaje]) => (
                    <li key={dimension}>
                    {dimension}: {porcentaje.toFixed(1)}%
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
}