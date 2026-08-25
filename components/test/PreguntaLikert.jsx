'use client'

export default function PreguntaLikert({pregunta, respuesta, onResponder}) {  
  return (
    <div>      
      {[1,2,3,4,5].map((e) => <button key={e} onClick={() => onResponder(pregunta.id, e)}>{e}</button>)}
      <p>Tu respuesta: {respuesta}</p>    
    </div>
  )
}