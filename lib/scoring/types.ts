export interface Pregunta {
  id: string;
  dimension: string;
  tipo: 'likert' | 'aptitud';
  subdimension: string;
  texto: string;
  escala?: {
    min: number;
    max: number;
    etiquetas: string[];
  }
  invertida?: boolean;
  opciones?: string[];
  respuestaCorrecta?: string;
}