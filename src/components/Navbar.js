// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { usuario, permisos } = useAuth();

  const esAdmin = usuario?.nombre_rol === 'Admin' || usuario?.nombre_rol === 'Admin CC';
  const tienePermisoPagos = permisos.some(p => p.nombre_permiso === 'Pagos' && p.estado);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
      <span className="navbar-brand fw-bold">💰 CxC App</span>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {esAdmin && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/cuentas-bancarias">
                Cuentas Bancarias
              </NavLink>
            </li>
          )}
          {tienePermisoPagos && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/pagos">
                Pagos
              </NavLink>
            </li>
          )}
          {/* Ejemplo para otros módulos:
          {tienePermisoClientes && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/clientes">
                Clientes
              </NavLink>
            </li>
          )}
          */}
        </ul>
        <div className="d-flex align-items-center ms-auto">
          {usuario && (
            <span className="navbar-text text-light fw-semibold">
              <i className="bi bi-person-circle me-2"></i>
              {usuario.nombre} ({usuario.nombre_rol})
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
