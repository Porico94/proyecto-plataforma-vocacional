export const storage = {
  keys: {
    PERFIL: 'perfil',
    RESPUESTAS: 'respuestas',
    INDICE: 'indice',
  },
  set(key, value) {
    if (typeof window === 'undefined') return;
    const jsonValue = JSON.stringify(value);
    sessionStorage.setItem(key, jsonValue);
  },
  get(key) {
    if (typeof window === 'undefined') return null;
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove(key) {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};