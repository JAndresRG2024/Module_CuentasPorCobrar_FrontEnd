import React from 'react';

function CuentaBancariaList({ cuentas, onEdit, onDelete }) {
  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Entidad</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cuentas.map(cuenta => (
          <tr key={cuenta.id_cuenta}>
            <td>{cuenta.id_cuenta}</td>
            <td>{cuenta.nombre_cuenta}</td>
            <td>{cuenta.entidad_bancaria}</td>
            <td>{cuenta.descripcion}</td>
            <td>
              <span className={`badge ${cuenta.estado ? 'bg-success' : 'bg-secondary'}`}>
                {cuenta.estado ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td className="text-center">
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => onEdit(cuenta)}
                title="Editar"
              >
                <i className="bi bi-pencil-square"></i> Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(cuenta.id_cuenta)}
                title="Eliminar"
              >
                <i className="bi bi-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CuentaBancariaList;