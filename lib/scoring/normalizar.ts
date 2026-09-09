import {ESCALA_DESTINO} from './constants';

export const normalizarScore = (score: number, min: number, max: number, contexto?: string): number => {
  if (max <= min) {
    throw new Error(`Escala inválida (min: ${min}, max: ${max})${contexto ? ` en: ${contexto}` : ''}`);
  }
  return ((score - min) / (max - min)) * ESCALA_DESTINO;
}
