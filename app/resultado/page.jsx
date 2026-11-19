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
        <main className="mx-auto w-full max-w-2xl px-4 py-8">
          <h1>Falta completar la pregunta N° {indicePendiente + 1}</h1>
          <button onClick={handleIrAlTest}>Ir al test</button>
        </main>
      );
    } 

    if (!resultado) {
      return (
        <main className="mx-auto w-full max-w-2xl px-4 py-8">
          <h1>Cargando resultados...</h1>
        </main>
      );
    } else {
      return (  
        <main className="mx-auto w-full max-w-2xl px-4 py-8">          
          <section>
            <h1 className="mb-8 font-voz text-2xl leading-snug font-medium text-pretty text-texto-claro sm:text-3xl">
              ¡Listo! Estas son las 10 carreras que mejor encajan contigo.
            </h1>            
            <ol className="flex flex-col gap-4">
              {top10.map((carrera, index) => (
                <li key={carrera.carreraId}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-lg text-texto-claro">
                      <span aria-hidden="true">{index + 1}. </span>
                      {carrera.nombre}
                    </p>
                    <p className="text-lg font-medium text-texto-claro">
                      {Math.round(carrera.total)}%
                    </p>
                  </div>
                  <div aria-hidden="true" className="mt-2 h-1.5 rounded-full bg-texto-claro/40">
                    <div
                      className="h-full rounded-full bg-amanecer"
                      style={{ width: `${carrera.total}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <ConsejoVocacional/>
          <button className="flex mt-8 items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 border-texto-claro/50 text-texto-claro touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche transition-[border-color,background-color] duration-150 ease-out hover:border-texto-claro/80 hover:bg-texto-claro/5 active:bg-texto-claro/10"
          onClick={handleReiniciar}>Reiniciar test</button>
        </main>
      );
    }
  }