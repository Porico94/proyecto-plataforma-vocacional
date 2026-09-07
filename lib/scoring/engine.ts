import { Pregunta } from './types';

const scoreEngineLikert = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  
  const resultadoAgrupado: Record<string, Record<string, {suma: number, count: number}>> = preguntas.filter((pregunta) => pregunta.tipo === 'likert').reduce((acc: Record<string, Record<string, {suma: number, count: number}>>, pregunta) => {
    
    const respuestaInvertida: number = pregunta.escala!.max + pregunta.escala!.min - (respuestas[pregunta.id] as number);
    const valorRespuesta: number = pregunta.invertida ? respuestaInvertida : (respuestas[pregunta.id] as number);

    if(!acc[pregunta.dimension]) {
      acc[pregunta.dimension] = {};
    }

    if(!acc[pregunta.dimension][pregunta.subdimension]) {
      acc[pregunta.dimension][pregunta.subdimension] = {
        suma: valorRespuesta,
        count: 1
      }
    } else {
      acc[pregunta.dimension][pregunta.subdimension].suma += valorRespuesta;
      acc[pregunta.dimension][pregunta.subdimension].count += 1;
    }
  
    return acc;
  }, {});

  const resultado: Record<string, Record<string, number>> = Object.entries(resultadoAgrupado).reduce(
  (acc: Record<string, Record<string, number>>, [dimension, subdimensiones]) => {
    
    acc[dimension] = Object.entries(subdimensiones).reduce(
      (subAcc: Record<string, number>, [subdimension, {suma, count}]) => {
        subAcc[subdimension] = suma / count;
        return subAcc;
      },{});
    return acc;
  },{});

  return resultado;
};

const scoreEngineAptitud = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  const resultadoAgrupado: Record<string, Record<string, {aciertos: number, count: number}>> = preguntas.filter((pregunta) => pregunta.tipo === 'aptitud').reduce((acc: Record<string, Record<string, {aciertos: number, count: number}>>, pregunta) => {
    
    const valorRespuesta: number = pregunta.respuestaCorrecta === (respuestas[pregunta.id] as string) ? 1 : 0;

    if(!acc[pregunta.dimension]) {
      acc[pregunta.dimension] = {};
    }

    if(!acc[pregunta.dimension][pregunta.subdimension]) {
      acc[pregunta.dimension][pregunta.subdimension] = {
        aciertos: valorRespuesta,
        count: 1
      }
    } else {
      acc[pregunta.dimension][pregunta.subdimension].aciertos += valorRespuesta;
      acc[pregunta.dimension][pregunta.subdimension].count += 1;
    }
  
    return acc;
  }, {});

  const resultado: Record<string, Record<string, number>> = Object.entries(resultadoAgrupado).reduce((acc: Record<string, Record<string, number>>, [dimension, subdimensiones]) => {
    acc[dimension] = Object.entries(subdimensiones).reduce(
      (subAcc: Record<string, number>, [subdimension, {aciertos, count}]) => {
        subAcc[subdimension] = aciertos / count;
        return subAcc;
      },{});
    return acc;
  },{});
  return resultado;
};

const scoreEngineEleccionForzada = (preguntas: Pregunta[], respuestas: Record <string, number | string>) => {
  
  const resultado: Record<string, Record<string, string>> = preguntas.filter((pregunta) => pregunta.tipo === 'eleccion_forzada').reduce((acc: Record<string, Record<string, string>>, pregunta) => {
    if(!acc[pregunta.dimension]) {
      acc[pregunta.dimension] = {};
    }

    acc[pregunta.dimension][pregunta.subdimension] = respuestas[pregunta.id] as string;
    
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