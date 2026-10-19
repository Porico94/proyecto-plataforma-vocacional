  'use client'

  import {useEffect, useState} from 'react';
  import {storage} from '@/lib/storage';
  import preguntas from '@/data/preguntas.json';
  import carreras from '@/data/carreras.json';
  import ConsejoVocacional from '@/components/resultado/ConsejoVocacional';
  import {scoreEnginePerfil} from '@/lib/scoring/engine';
  import {obtenerTop10Carreras} from '@/lib/scoring/recomendacion';
  import {primeraPreguntaSinResponder} from '@/lib/progreso';
  import {useRouter} from 'next/navigation';

  export default function Resultado() {
    const router = useRouter();
    const [resultado, setResultado] = useState(null);
    const [top10, setTop10] = useState(null);
    const [indicePendiente, setIndicePendiente] = useState(null);

    useEffect(() => {      
      const respuestas = storage.get(storage.keys.RESPUESTAS) || {};
      const pendiente = primeraPreguntaSinResponder(preguntas, respuestas);
      if (pendiente !== -1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIndicePendiente(pendiente);
        return;
      }
      const resultadoCalculado = scoreEnginePerfil(preguntas, respuestas);
      const top10Calculado = obtenerTop10Carreras(resultadoCalculado, carreras);
      
      setResultado(resultadoCalculado);     
      setTop10(top10Calculado);
    }, []);

    const handleIrAlTest = () => {
      storage.set(storage.keys.INDICE, indicePendiente);
      router.push('/test');
    };

    const handleReiniciar = () => {
      storage.remove(storage.keys.RESPUESTAS);
      storage.remove(storage.keys.INDICE);
      router.push('/test');      
    };

    if (indicePendiente !== null) {
      return (
        <div>
          <h1>Falta completar la pregunta N° {indicePendiente + 1}</h1>
          <button onClick={handleIrAlTest}>Ir al test</button>
        </div>
      );
    } 

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
          <button onClick={handleReiniciar}>Reiniciar test</button>
        </div>
      );
    }
  }