'use client'

export default function PreguntaLikert({pregunta, respuesta, onResponder}) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2">
      <legend className="sr-only">{pregunta.texto}</legend>
      {pregunta.escala.etiquetas.map((etiqueta, index) => {
        const valor = pregunta.escala.min + index;
        const valorSeleccionado = valor === respuesta;
        return (
          <label
            key={etiqueta}
            className="flex w-full min-h-11.5 cursor-pointer touch-manipulation items-center gap-3 rounded-lg border-2 border-texto-claro/50 px-3 text-left text-texto-claro has-checked:border-amanecer has-checked:bg-amanecer has-checked:font-medium has-checked:text-texto-oscuro has-focus-visible:ring-2 has-focus-visible:ring-amanecer has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-noche
            transition-[border-color,background-color] duration-150 ease-out not-has-checked:hover:border-texto-claro/80 not-has-checked:hover:bg-texto-claro/5 not-has-checked:active:bg-texto-claro/10"
          >
            <input
              type="radio"
              name={pregunta.id}
              value={valor}
              checked={valorSeleccionado}
              onChange={() => onResponder(pregunta.id, valor)}
              className="sr-only"
            />
            <span className="font-medium">{valor}</span>
            <span className="flex-1">{etiqueta}</span>
            {valorSeleccionado && <span aria-hidden="true">✓</span>}
          </label>
        )
      })}
    </fieldset>
  )
}