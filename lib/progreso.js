export function primeraPreguntaSinResponder(preguntas, respuestas) {
  return preguntas.findIndex((pregunta) => respuestas[pregunta.id] === undefined);  
}