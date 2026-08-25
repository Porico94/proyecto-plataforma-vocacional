'use client'

export default function PreguntaOpciones({pregunta, respuesta, onResponder}) {  
  return (
    <div>      
      {pregunta.opciones.map((e) => <button key={e} onClick={() => onResponder(pregunta.id, e)}>{e}</button>)}
        <p>Tu respuesta: {respuesta}</p>
    </div>
  )
}