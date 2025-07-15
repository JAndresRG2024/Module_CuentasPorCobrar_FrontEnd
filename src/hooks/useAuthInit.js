import { useEffect } from 'react';

export function useAuthInit() {
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    console.log('usuarioGuardado:', usuarioGuardado);

    if (!usuarioGuardado) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log('URL token:', token);

      if (token) {
        fetch('https://aplicacion-de-seguridad-v2.onrender.com/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            console.log('API response status:', res.status);
            return res.json();
          })
          .then(usuarioJson => {
            console.log('usuarioJson recibido:', usuarioJson);
            if (usuarioJson && usuarioJson.token) {
              localStorage.setItem('usuario', JSON.stringify(usuarioJson));
              console.log('Usuario guardado en localStorage');
            } else {
              console.log('No se recibió un usuario válido, no se guarda nada');
            }
            window.location.replace(window.location.pathname); // Limpia el token del URL
          })
          .catch((err) => {
            console.log('Error en fetch:', err);
          });
      } else {
        console.log('No se encontró token en el URL');
      }
    } else {
      console.log('Ya existe usuario en localStorage, no se hace nada');
    }
  }, []);
}