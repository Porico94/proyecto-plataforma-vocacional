import { Pregunta } from './types';

const scoreEngineLikert = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  
  const resultadoAgrupado: Record<string, {suma: number, count: number}> = preguntas.filter((pregunta) => pregunta.tipo === 'likert').reduce((acc: Record<string, {suma: number, count: number}>, pregunta) => {
    
    const respuestaInvertida: number = pregunta.escala!.max + pregunta.escala!.min - (respuestas[pregunta.id] as number);
    const valorRespuesta: number = pregunta.invertida ? respuestaInvertida : (respuestas[pregunta.id] as number);

    if(!acc[pregunta.subdimension]) {
      acc[pregunta.subdimension] = {
        suma: valorRespuesta,
        count: 1
      }
    } else {
      acc[pregunta.subdimension].suma += valorRespuesta;
      acc[pregunta.subdimension].count += 1;
    }
    return acc;
  }, {});
  
  const resultado: Record<string, number> = Object.entries(resultadoAgrupado).reduce((acc: Record<string, number>, [subdimension, {suma, count}]) => {
    acc[subdimension] = suma / count;
    return acc;
  }, {});
 

  return resultado;
};

const scoreEngineAptitud = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  const resultadoAgrupado: Record<string, {aciertos: number, count: number}> = preguntas.filter((pregunta) => pregunta.tipo === 'aptitud').reduce((acc: Record<string, {aciertos: number, count: number}>, pregunta) => {
    
    const valorRespuesta: number = pregunta.respuestaCorrecta === (respuestas[pregunta.id] as string) ? 1 : 0;

    if(!acc[pregunta.subdimension]) {
      acc[pregunta.subdimension] = {
        aciertos: valorRespuesta,
        count: 1
      }
    } else {
      acc[pregunta.subdimension].aciertos += valorRespuesta;
      acc[pregunta.subdimension].count += 1;
    }
    return acc;
  }, {});

  const resultado: Record<string, number> = Object.entries(resultadoAgrupado).reduce((acc: Record<string, number>, [subdimension, {aciertos, count}]) => {
    acc[subdimension] = aciertos / count;
    return acc;
  }, {});
 

  return resultado;
};

const scoreEngineEleccionForzada = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  
  const resultado: Record<string, string> = preguntas.filter((pregunta) => pregunta.tipo === 'eleccion_forzada').reduce((acc: Record<string, string>, pregunta) => {
    acc[pregunta.subdimension] = respuestas[pregunta.id] as string;
    return acc;
  }, {});

  return resultado;
};

const scoreEnginePerfil = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  const resultadoLikert = scoreEngineLikert(preguntas, respuestas);
  const resultadoAptitud = scoreEngineAptitud(preguntas, respuestas);
  const resultadoEleccionForzada = scoreEngineEleccionForzada(preguntas, respuestas);
  
  return {
    ...resultadoLikert,
    ...resultadoAptitud,
    ...resultadoEleccionForzada
  };
};

export {scoreEngineLikert, scoreEngineAptitud, scoreEngineEleccionForzada, scoreEnginePerfil};