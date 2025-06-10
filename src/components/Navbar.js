// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow">
      <span className="navbar-brand fw-bold">💰 CxC App</span>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/cuentas-bancarias">
              Cuentas Bancarias
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/pagos">
              Pagos
            </NavLink>
          </li>
          {/* Links adicionales
          <li className="nav-item">
            <NavLink className="nav-link" to="/clientes">
              Clientes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/reportes">
              Reportes
            </NavLink>
          </li>
          */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
