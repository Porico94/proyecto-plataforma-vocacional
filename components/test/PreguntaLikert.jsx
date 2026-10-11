'use client'

export default function PreguntaLikert({pregunta, respuesta, onResponder}) {
  return (
    <div>
      {pregunta.escala.etiquetas.map((etiqueta,index) => {
        const valor = pregunta.escala.min + index;
        return (
          <button
            key={etiqueta}
            aria-pressed={valor === respuesta}
            onClick={() => onResponder(pregunta.id, valor)}
          >
            {valor}-{etiqueta}
          </button>
        )
      })}      
    </div>
  )
}