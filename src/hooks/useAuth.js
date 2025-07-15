// src/hooks/useAuth.js
export function useAuth() {
  let usuarioData = {};
  try {
    const raw = localStorage.getItem('usuario');
    usuarioData = raw ? JSON.parse(raw) : {};
  } catch {
    usuarioData = {};
  }
  return {
    usuario: usuarioData.usuario,
    permisos: usuarioData.permisos || [],
    token: usuarioData.token
  };
}