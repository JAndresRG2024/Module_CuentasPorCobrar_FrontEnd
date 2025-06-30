import React from "react";

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
  id_pago,
  pdf_generado,
  facturas,
  todosDetalles
}) {
  // Helper para obtener el monto total de la factura
  const getMontoTotalFactura = (id_factura) => {
    const factura = facturas?.find(f => String(f.id_factura) === String(id_factura));
    return factura ? Number(factura.monto_total) : 0;
  };

  // Helper para calcular el monto pagado acumulado en una factura, excluyendo un detalle específico si se indica
  const getPagadoPorFactura = (id_factura, excludeIdDetalle = null) => {
  const detallesUnicos = [
    ...(todosDetalles || []),
    ...(detalles || [])
  ].reduce((acc, d) => {
    acc[String(d.id_detalle)] = d;
    return acc;
  }, {});
  return Object.values(detallesUnicos)
    .filter(d =>
      String(d.id_factura) === String(id_factura) &&
      (excludeIdDetalle === null || String(d.id_detalle) !== String(excludeIdDetalle))
    )
    .reduce((sum, d) => sum + Number(d.monto_pagado), 0);
};

  /**
   * Componente fila de edición / creación
   */
  const DetalleEditRow = ({ detalle }) => {
    const montoTotal = getMontoTotalFactura(detalleForm.id_factura);
    const pagadoPrevio = getPagadoPorFactura(detalleForm.id_factura, detalle?.id_detalle);
    const pendiente = montoTotal
      ? (montoTotal - pagadoPrevio - Number(detalleForm.monto_pagado || 0)).toFixed(2)
      : "-";

    return (
      <tr key={detalle?.id_detalle || "nuevo"}>
        <td>{detalle?.id_detalle || "Nuevo"}</td>
        <td>
          <select
            name="id_factura"
            value={detalleForm.id_factura}
            onChange={handleDetalleChange}
            className="form-control form-control-sm"
            required
          >
            <option value="">Seleccione factura</option>
            {facturas?.map(fact => (
              <option key={fact.id_factura} value={fact.id_factura}>
                {fact.id_factura} - {fact.nombre_cliente} - ${fact.monto_total}
              </option>
            ))}
          </select>
        </td>
        <td>
          <input
            type="number"
            name="monto_pagado"
            value={detalleForm.monto_pagado}
            onChange={handleDetalleChange}
            className="form-control form-control-sm"
            min={0}
            max={
              montoTotal
                ? montoTotal - pagadoPrevio >= 0
                  ? montoTotal - pagadoPrevio
                  : 0
                : undefined
            }
          />
        </td>
        <td>{pendiente}</td>
        <td>
          <button
            type="button"
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleSaveDetalle(id_pago)}
          >
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setEditingDetalle(null)}
          >
            Cancelar
          </button>
        </td>
      </tr>
    );
  };

  /**
   * Componente fila en modo lectura
   */
  const DetalleReadOnlyRow = ({ detalle }) => {
    const montoTotal = getMontoTotalFactura(detalle.id_factura);
    const pagadoTotal = getPagadoPorFactura(detalle.id_factura, null);
    const pendiente = montoTotal
    ? (montoTotal - pagadoTotal).toFixed(2)
    : "-";
    return (
      <tr key={detalle.id_detalle}>
        <td>{detalle.id_detalle}</td>
        <td>{detalle.id_factura}</td>
        <td>{detalle.monto_pagado}</td>
        <td>{pendiente}</td>
        {!pdf_generado && (
          <td>
            <button
              type="button"
              className="btn btn-sm btn-warning me-2"
              onClick={() => handleEditDetalle(id_pago, detalle)}
            >
              Editar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteDetalle(id_pago, detalle.id_detalle)}
            >
              Eliminar
            </button>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Detalles del pago:</strong>
        {!pdf_generado && (
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={() => handleCreateDetalle(id_pago)}
          >
            + Agregar Detalle
          </button>
        )}
      </div>

      {Array.isArray(detalles) && detalles.length > 0 ? (
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>ID Detalle</th>
              <th>ID Factura</th>
              <th>Monto Pagado</th>
              <th>Pendiente</th>
              {!pdf_generado && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {detalles.map(detalle => {
              const isEditing = editingDetalle &&
                editingDetalle.id_pago === id_pago &&
                editingDetalle.id_detalle === detalle.id_detalle;

              return isEditing && !pdf_generado
                ? <DetalleEditRow key={detalle.id_detalle} detalle={detalle} />
                : <DetalleReadOnlyRow key={detalle.id_detalle} detalle={detalle} />;
            })}

            {/* Fila de creación de nuevo detalle */}
            {detalles.map(detalle => {
              const isEditing = editingDetalle &&
                editingDetalle.id_pago === id_pago &&
                editingDetalle.id_detalle === detalle.id_detalle;

              return isEditing && !pdf_generado
                ? <DetalleEditRow key={detalle.id_detalle} detalle={detalle} />
                : <DetalleReadOnlyRow key={detalle.id_detalle} detalle={detalle} />;
            })}

            {/* Fila de creación de nuevo detalle */}
            {editingDetalle &&
              editingDetalle.id_pago === id_pago &&
              editingDetalle.id_detalle === null &&
              !pdf_generado && (
                <DetalleEditRow detalle={null} />
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

