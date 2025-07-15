import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PrivateRoute({ children, roles = [], permisos = [] }) {
  const { usuario, permisos: userPermisos } = useAuth();

  const tieneRol = roles.length === 0 || roles.includes(usuario?.nombre_rol);
  const tienePermiso = permisos.length === 0 || permisos.some(permiso =>
    userPermisos.some(p => p.nombre_permiso === permiso && p.estado)
  );

  if (!tieneRol || !tienePermiso) {
    return <Navigate to="/" />;
  }
  return children;
}