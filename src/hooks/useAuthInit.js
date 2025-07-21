import { useEffect } from 'react';

export function useAuthInit() {
  useEffect(() => {
    const API_URL_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');

    if (!usuarioGuardado && tokenGuardado) {
      console.log('🔐 Validando token existente en localStorage...');

      fetch(`${API_URL_BASE}/token/valido`, {
        headers: {
          Authorization: `Bearer ${tokenGuardado}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.usuario) {
            localStorage.setItem('usuario', JSON.stringify({
              ...data.usuario,
              token: tokenGuardado
            }));
            console.log('✅ Token válido. Usuario autenticado y guardado en localStorage');
          } else {
            console.warn('❌ Token inválido. Borrando datos de localStorage...');
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
          }
        })
        .catch(err => {
          console.error('❌ Error al verificar token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        });
    } else if (usuarioGuardado) {
      console.log('✅ Usuario ya está autenticado en localStorage');
    } else {
      console.log('⚠️ No hay token ni usuario en localStorage');
    }
  }, []);
}