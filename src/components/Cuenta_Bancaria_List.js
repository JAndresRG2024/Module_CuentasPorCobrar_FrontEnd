import React from 'react';

function CuentaBancariaList({ cuentas, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Entidad</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cuentas.map(cuenta => (
          <tr key={cuenta.id_cuenta}>
            <td>{cuenta.id_cuenta}</td>
            <td>{cuenta.nombre_cuenta}</td>
            <td>{cuenta.entidad_bancaria}</td>
            <td>{cuenta.descripcion}</td>
            <td>{cuenta.estado ? 'Activo' : 'Inactivo'}</td>
            <td>
              <button onClick={() => onEdit(cuenta)}>Editar</button>
              <button onClick={() => onDelete(cuenta.id_cuenta)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CuentaBancariaList;