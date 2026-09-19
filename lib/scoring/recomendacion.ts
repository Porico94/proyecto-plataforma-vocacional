import { normalizarScore } from './normalizar';

const grupoB = ['inteligencias_multiples', 'valores'];

const calcularDistanciaDimension = ( perfilEstudiante: Record<string, number>, perfilCarrera: Record<string, number>): number => {
  const arrayPerfilEstudiante = Object.entries(perfilEstudiante);

  const sumaCuadrados = arrayPerfilEstudiante.reduce((acc, [clave, valor]) => {
    const dif = perfilCarrera[clave] - valor;
    return acc + dif * dif;
  }, 0);

  return normalizarScore(sumaCuadrados, 0, arrayPerfilEstudiante.length * 81);
};

const calcularCompatibilidadCategorica = ( perfilEstudiante: Record<string, number>, subdimensionesRequeridas: string[]): number => {
  const valoresRequeridos = subdimensionesRequeridas.map((nombre) => perfilEstudiante[nombre]);
  const promedio = valoresRequeridos.reduce((acc, valor) => acc + valor, 0) / valoresRequeridos.length;
  return 9 - promedio;
};

const calcularPorDimension = ( resultado: Record<string, Record<string, number>>, carrera: Record<string, any>): Record<string, number> => {
  return Object.entries(resultado).reduce((acc: Record<string, number>, [dimension, perfilDimensionEstudiante]) => {
    if (grupoB.includes(dimension)) {
      acc[dimension] = calcularCompatibilidadCategorica(perfilDimensionEstudiante, carrera[dimension]);
    } else {
      acc[dimension] = calcularDistanciaDimension(perfilDimensionEstudiante, carrera[dimension]);
    }
    return acc;
  }, {});
};

const convertirAPorcentaje = (valor: number): number => {
  return ((9 - valor) / 9) * 100;
};

const calcularCompatibilidadCarrera = ( resultado: Record<string, Record<string, number>>, carrera: Record<string, any>) => {
  const porDimension = calcularPorDimension(resultado, carrera);

  const porDimensionPorcentaje = Object.entries(porDimension).reduce(
    (acc: Record<string, number>, [clave, valor]) => {
      acc[clave] = convertirAPorcentaje(valor);
      return acc;
    },
    {}
  );

  const arrayPorDimension = Object.values(porDimension);
  const promedioFinal = arrayPorDimension.reduce((acc, val) => acc + val, 0) / arrayPorDimension.length;
  const porcentajeFinal = convertirAPorcentaje(promedioFinal);

  return {
    carreraId: carrera.id,
    nombre: carrera.nombre,
    porDimension: porDimensionPorcentaje,
    total: porcentajeFinal,
  };
};

const obtenerTop10Carreras = ( resultado: Record<string, Record<string, number>>, carreras: Record<string, any>[]) => {
  const todas = carreras.map((carrera) => calcularCompatibilidadCarrera(resultado, carrera));
  const ordenadas = todas.sort((a, b) => b.total - a.total);
  return ordenadas.slice(0, 10);
};

export { calcularCompatibilidadCarrera, obtenerTop10Carreras };