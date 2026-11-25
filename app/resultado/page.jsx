  'use client'

  import {useEffect, useState, useRef} from 'react';
  import {storage} from '@/lib/storage';
  import preguntas from '@/data/preguntas.json';
  import carreras from '@/data/carreras.json';
  import ConsejoVocacional from '@/components/resultado/ConsejoVocacional';
  import {scoreEnginePerfil} from '@/lib/scoring/engine';
  import {obtenerTop10Carreras} from '@/lib/scoring/recomendacion';
  import {primeraPreguntaSinResponder} from '@/lib/progreso';
  import { validarNombre } from '@/lib/nombre';
  import {useRouter} from 'next/navigation';

  export default function Resultado() {
    const router = useRouter();
    const dialogRef = useRef(null);
    const [nombre, setNombre] = useState('');
    const [errorNombre, setErrorNombre] = useState('');
    const [intentosFallidos, setIntentosFallidos] = useState(0);
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

    const handleAbrirDialogo = () => {
      dialogRef.current.showModal();
    };

    const handleCerrarDialogo = () => {
      dialogRef.current.close();
    };

    const handleDescargar = (evento) => {
      evento.preventDefault();
      const validacion = validarNombre(nombre);
      if (!validacion.valido) {
        setErrorNombre(validacion.error);
        setIntentosFallidos(intentosFallidos + 1);
        return;
      }      
      handleCerrarDialogo();
    };

    const handleDialogoCerrado = () => {
      setErrorNombre('');
      setNombre('');
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
          <div className="mx-auto mt-8 flex flex-col gap-3 sm:max-w-md sm:flex-row">
            <button
              className="relative isolate flex sm:flex-1 items-center justify-center min-h-11.5 rounded-lg border-2 border-transparent px-4 gap-2 text-texto-oscuro font-medium touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche before:absolute before:-inset-0.5 before:-z-10 before:rounded-lg before:bg-amanecer before:content-[''] before:transition-[filter,scale] before:duration-150 before:ease-out hover:before:brightness-110 motion-safe:active:before:scale-[0.97]"
              onClick={handleAbrirDialogo}>
              Guardar en PDF
            </button>
            
            <button
              className="flex sm:flex-1 items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 border-texto-claro/50 text-texto-claro touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche transition-[border-color,background-color] duration-150 ease-out hover:border-texto-claro/80 hover:bg-texto-claro/5 active:bg-texto-claro/10"
              onClick={handleReiniciar}>
              Reiniciar test
            </button>
          </div>
          <dialog
            ref={dialogRef}
            onClose={handleDialogoCerrado}
            className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border-2 border-texto-claro/50 bg-noche p-5 text-texto-claro backdrop:bg-black/65"
          >
            <h2 className="font-voz text-xl font-medium text-pretty">¿Quieres poner tu nombre en el documento PDF?</h2>
            <p id="nombre-ayuda" className="mt-2 text-texto-claro/80">Es opcional. Si lo dejas vacío, el PDF sale sin nombre.</p>

            <form onSubmit={handleDescargar}>
              <label htmlFor="nombre" className="mt-4 block font-medium">Tu nombre</label>
              <input
                id="nombre"
                type="text"
                autoComplete="name"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrorNombre('');
                }}
                aria-invalid={errorNombre !== ''}
                aria-describedby={errorNombre ? 'nombre-ayuda nombre-error' : 'nombre-ayuda'}
                className="mt-2 min-h-11.5 w-full rounded-lg border-2 border-texto-claro/50 bg-transparent px-3 text-texto-claro aria-invalid:border-error focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
              />

              {errorNombre && (
                <p
                  key={intentosFallidos}
                  id="nombre-error"
                  role="alert"
                  className="mt-2 font-medium text-error"
                >
                  <span aria-hidden="true">⚠ </span>
                  {errorNombre}
                </p>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  className="flex basis-1/2 items-center justify-center min-h-11.5 rounded-lg border-2 px-4 gap-2 border-texto-claro/50 text-texto-claro touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche transition-[border-color,background-color] duration-150 ease-out hover:border-texto-claro/80 hover:bg-texto-claro/5 active:bg-texto-claro/10"
                  onClick={handleCerrarDialogo}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="relative isolate flex basis-1/2 items-center justify-center min-h-11.5 rounded-lg border-2 border-transparent px-4 gap-2 text-texto-oscuro font-medium touch-manipulation focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche before:absolute before:-inset-0.5 before:-z-10 before:rounded-lg before:bg-amanecer before:content-[''] before:transition-[filter,scale] before:duration-150 before:ease-out hover:before:brightness-110 motion-safe:active:before:scale-[0.97]"
                >
                  Descargar PDF
                </button>
              </div>
            </form>
          </dialog>
        </main>
      );
    }
  }