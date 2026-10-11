'use client'

export default function PreguntaLikert({pregunta, respuesta, onResponder}) {
  return (
    <div className="flex flex-col gap-2">
      {pregunta.escala.etiquetas.map((etiqueta,index) => {
        const valor = pregunta.escala.min + index;
        const valorSeleccionado = valor === respuesta;
        return (
          <button
            key={etiqueta}
            aria-pressed={valorSeleccionado}
            onClick={() => onResponder(pregunta.id, valor)}
            className="flex w-full min-h-11.5 items-center gap-3 rounded-lg border-2 border-texto-claro/50 px-3 text-left text-texto-claro aria-pressed:border-amanecer aria-pressed:bg-amanecer aria-pressed:font-medium aria-pressed:text-texto-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
          >
            <span className="font-medium">{valor}</span>
            <span className="flex-1">{etiqueta}</span>
            {valorSeleccionado && <span aria-hidden="true">✓</span>}
          </button>
        )
      })}
    </div>
  )
}