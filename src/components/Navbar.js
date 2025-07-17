// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { usuario, permisos } = useAuth();
  const navigate = useNavigate();

  const esAdmin = usuario?.nombre_rol === 'Admin' || usuario?.nombre_rol === 'Admin CC';
  const tienePermisoPagos = permisos.some(p => p.nombre_permiso === 'Pagos' && p.estado);
  const tienePermisoReportes = permisos.some(p => p.nombre_permiso === 'Reportes' && p.estado);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

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
          {tienePermisoReportes && (
          <li className="nav-item">
            <NavLink className="nav-link" to="/reportes">
              Reportes
            </NavLink>
          </li>
    )}
        </ul>
        <div className="d-flex align-items-center ms-auto">
          {usuario && usuario.nombre ? (
            <>
              <span className="navbar-text text-light fw-semibold me-3">
                <i className="bi bi-person-circle me-2"></i>
                {usuario.nombre} ({usuario.nombre_rol})
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink className="btn btn-outline-light" to="/login">
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
