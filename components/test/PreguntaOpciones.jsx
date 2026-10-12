'use client'

export default function PreguntaOpciones({pregunta, respuesta, onResponder}) {  
  return (
    <div className="flex flex-col gap-2">      
      {pregunta.opciones.map((e) => {
        const valorSeleccionado = e === respuesta;
        return (
          <button
            key={e}
            aria-pressed={valorSeleccionado}
            onClick={() => onResponder(pregunta.id, e)}
            className="flex w-full min-h-11.5 items-center gap-3 rounded-lg border-2 border-texto-claro/50 px-3 text-left text-texto-claro aria-pressed:border-amanecer aria-pressed:bg-amanecer aria-pressed:font-medium aria-pressed:text-texto-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"  
          >            
            <span
              aria-hidden="true"
              className="flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 border-texto-claro/50 group-aria-pressed:border-texto-oscuro"
            >
              {valorSeleccionado && <span className="h-2.5 w-2.5 rounded-full bg-texto-oscuro" />}
            </span>
            <span className="flex-1">{e}</span>
          </button>
        )}
      )}
    </div>
  )
}