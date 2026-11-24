import { z } from 'zod';

export const nombreSchema = z
  .string()
  .trim()
  .max(60, { error: 'El tamaño del nombre es demasiado largo' })
  .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ’' .-]*$/, { error: 'Estás usando caracteres no permitidos' });

export function validarNombre(texto) {
  const resultado = nombreSchema.safeParse(texto.replace(/\s+/g, ' '));
  if (resultado.success) {
    return { valido: true, nombre: resultado.data };
  }
  return { valido: false, error: resultado.error.issues[0].message };
}