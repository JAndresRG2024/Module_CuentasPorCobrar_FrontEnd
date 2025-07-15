// src/hooks/useAuthInit.js
import { useEffect } from 'react';

const andres = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo0LCJ1c3VhcmlvIjoiYW5hbGlzdGEiLCJub21icmUiOiJBbmRyZXMgUmluY29uIiwibm9tYnJlX3JvbCI6IkFkbWluIENDIiwiaWF0IjoxNzUyNjA2MjYxLCJleHAiOjE3NTI2MTM0NjF9.DEpdeXRT73xr3kaMz2PjmIoS1E-P4h2uBszEYwOeAF8",
  "usuario": {
    "id_usuario": 4,
    "usuario": "analista",
    "nombre": "Andres Rincon",
    "nombre_rol": "Admin CC"
  },
  "permisos": [
    {
      "id_permiso": 3,
      "nombre_permiso": "Pagos",
      "descripcion": "CRUD",
      "url_permiso": "http://localhost:3000",
      "estado": true,
      "id_modulo": "CC"
    },
    {
      "id_permiso": 14,
      "nombre_permiso": "Bancos",
      "descripcion": "CRUD",
      "url_permiso": "local",
      "estado": true,
      "id_modulo": "CC"
    }
  ]
};
const pablin = {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMiwidXN1YXJpbyI6InBhYmxpbjcxNyIsIm5vbWJyZSI6IlBhYmxvIEppbWVuZXoiLCJub21icmVfcm9sIjoiQ29icmFkb3IiLCJpYXQiOjE3NTI2MDY3MTUsImV4cCI6MTc1MjYxMzkxNX0.rrLfZceZc9peVwpj3tHYbY4RMtxBAAwNdVtyOZ_pUpQ",
    "usuario": {
        "id_usuario": 12,
        "usuario": "pablin717",
        "nombre": "Pablo Jimenez",
        "nombre_rol": "Cobrador"
    },
    "permisos": [
        {
            "id_permiso": 3,
            "nombre_permiso": "Pagos",
            "descripcion": "CRUD",
            "url_permiso": "http://localhost:3000",
            "estado": true,
            "id_modulo": "CC"
        }
    ]
}

export function useAuthInit() {
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if(andres.token === pablin.token) {
      
    }
    if (!usuarioGuardado) {
      // Busca el token en el URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        // Llama a la API de seguridad para obtener usuario y permisos
        fetch('https://aplicacion-de-seguridad-v2.onrender.com/api/usuario-info', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(usuarioJson => {
            localStorage.setItem('usuario', JSON.stringify(usuarioJson));
            window.location.replace(window.location.pathname); // Limpia el token del URL
          })
          .catch(() => {
            localStorage.setItem('usuario', JSON.stringify(pablin));
            window.location.replace(window.location.pathname); // Limpia el token del URL
          });
      } else {
        localStorage.setItem('usuario', JSON.stringify(pablin));
      }
    }
  }, []);
}