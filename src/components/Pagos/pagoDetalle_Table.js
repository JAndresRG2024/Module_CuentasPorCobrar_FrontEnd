import React from 'react';

function PagoDetalleTable({
  detalles,
  editingDetalle,
  detalleForm,
  handleDetalleChange,
  handleEditDetalle,
  handleDeleteDetalle,
  handleSaveDetalle,
  setEditingDetalle,
  handleCreateDetalle,
  id_pago
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Detalles del pago:</strong>
        <button
          className="btn btn-sm btn-success"
          onClick={() => handleCreateDetalle(id_pago)}
        >
          + Agregar Detalle
        </button>
      </div>
      {Array.isArray(detalles) && detalles.length > 0 ? (
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>ID Factura</th>
              <th>Monto Pagado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map(det => (
              editingDetalle &&
              editingDetalle.id_pago === id_pago &&
              editingDetalle.id_detalle === det.id_detalle ? (
                <tr key={det.id_detalle}>
                  <td>{det.id_detalle}</td>
                  <td>
                    <input
                      type="number"
                      name="id_factura"
                      value={detalleForm.id_factura}
                      onChange={handleDetalleChange}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="monto_pagado"
                      value={detalleForm.monto_pagado}
                      onChange={handleDetalleChange}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleSaveDetalle(id_pago)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingDetalle(null)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={det.id_detalle}>
                  <td>{det.id_detalle}</td>
                  <td>{det.id_factura}</td>
                  <td>{det.monto_pagado}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditDetalle(id_pago, det)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteDetalle(id_pago, det.id_detalle)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            ))}
            {/* Fila para crear nuevo detalle */}
            {editingDetalle &&
              editingDetalle.id_pago === id_pago &&
              editingDetalle.id_detalle === null && (
                <tr>
                  <td>Nuevo</td>
                  <td>
                    <input
                      type="number"
                      name="id_factura"
                      value={detalleForm.id_factura}
                      onChange={handleDetalleChange}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="monto_pagado"
                      value={detalleForm.monto_pagado}
                      onChange={handleDetalleChange}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleSaveDetalle(id_pago)}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingDetalle(null)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      ) : (
        <div className="text-muted">Sin detalles</div>
      )}
    </div>
  );
}

export default PagoDetalleTable;