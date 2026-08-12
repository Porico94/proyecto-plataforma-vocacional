export const storage = {
  keys:{
    PERFIL: 'perfil',
  },
  set(key, value) {
    const jsonValue = JSON.stringify(value);
    sessionStorage.setItem(key, jsonValue);
  },
  get(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
};