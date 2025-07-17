import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Welcome() {
  const { usuario, permisos } = useAuth();

  // Solo admin puede ver botón de bancos
  const esAdmin = usuario?.nombre_rol === 'Admin' || usuario?.nombre_rol === 'Admin CC';
  // Solo si tiene permiso "Pagos"
  const tienePermisoPagos = permisos.some(p => p.nombre_permiso === 'Pagos' && p.estado);
  const tienePermisoReportes = permisos.some(p => p.nombre_permiso === 'Reportes' && p.estado);
  return (
    <div className="text-center mt-5">
      <h1 className="mb-4">Bienvenido</h1>
      <p className="mb-4">
        Este sistema te permite gestionar tus cuentas por cobrar de manera sencilla y eficiente.<br />
        Usa el menú o las opciones rápidas para comenzar.
      </p>
      <img
        src="/images/imagen1.jpeg"
        alt="Bienvenida"
        style={{ maxWidth: '350px', width: '100%', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
        className="mb-4"
      />

      <div className="row justify-content-center mt-4">
        {esAdmin && (
          <div className="col-md-3 mb-3">
            <Link to="/cuentas-bancarias" className="btn btn-outline-primary btn-lg w-100">
              <i className="bi bi-bank2 me-2"></i>
              Cuentas Bancarias
            </Link>
          </div>
        )}
        {tienePermisoPagos && (
          <div className="col-md-3 mb-3">
            <Link to="/pagos" className="btn btn-outline-success btn-lg w-100">
              <i className="bi bi-cash-coin me-2"></i>
              Pagos
            </Link>
          </div>
        )}
        {tienePermisoReportes && (
          <div className="col-md-3 mb-3">
            <Link to="/reportes" className="btn btn-outline-success btn-lg w-100">
              <i className="bi bi-cash-coin me-2"></i>
              Reportes
            </Link>
          </div>
        )}
      </div>

      <footer className="mt-5 text-muted">
        <small>Versión 1.0 &middot; Soporte: soporte@tusistema.com</small>
      </footer>
    </div>
  );
}

export default Welcome;