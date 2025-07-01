import React from "react";

function PagoDetalleTable({
  detalles,
  editingDetalle,
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
  const getMontoTotalFactura = (id_factura) => {
    const factura = facturas?.find(f => String(f.id_factura) === String(id_factura));
    return factura ? Number(factura.monto_total) : 0;
  };

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
   * Fila de edición con estado interno
   */
  const DetalleEditRow = ({ detalle }) => {
    const [localForm, setLocalForm] = React.useState({
      id_detalle: detalle?.id_detalle || null,
      id_factura: detalle?.id_factura || '',
      monto_pagado: detalle?.monto_pagado || ''
    });

    // Calcular pendiente dinámico
    const montoTotal = getMontoTotalFactura(localForm.id_factura);
    const pagadoPrevio = getPagadoPorFactura(localForm.id_factura, localForm.id_detalle);
    const pendiente = montoTotal
      ? (montoTotal - pagadoPrevio - Number(localForm.monto_pagado || 0)).toFixed(2)
      : "-";

    const handleChange = e => {
      const { name, value } = e.target;

      if (name === "monto_pagado") {
        let monto = Number(value);
        let max = montoTotal - pagadoPrevio;
        if (max < 0) max = 0;
        if (monto > max) monto = max;
        if (monto < 0) monto = 0;
        setLocalForm(prev => ({ ...prev, [name]: monto }));
      } else {
        setLocalForm(prev => ({ ...prev, [name]: value }));
      }
    };

    return (
      <tr key={`edit-${localForm.id_detalle || 'new'}`}>
        <td>{localForm.id_detalle || "Nuevo"}</td>
        <td>
          <select
            name="id_factura"
            value={localForm.id_factura}
            onChange={handleChange}
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
            value={localForm.monto_pagado}
            onChange={handleChange}
            className="form-control form-control-sm"
          />
        </td>
        <td>{pendiente}</td>
        <td>
          <button
            type="button"
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleSaveDetalle(id_pago, localForm)}
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
   * Fila de solo lectura
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
        {!pdf_generado && !editingDetalle && (
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
              const isEditing = editingDetalle === detalle.id_detalle;
              return isEditing && !pdf_generado
                ? <DetalleEditRow key={`edit-${detalle.id_detalle}`} detalle={detalle} />
                : <DetalleReadOnlyRow key={detalle.id_detalle} detalle={detalle} />;
            })}

            {/* fila de nuevo detalle */}
            {editingDetalle === 'new' && !pdf_generado && (
              <DetalleEditRow key="nuevo" detalle={null} />
            )}
          </tbody>
        </table>
      ) : (
        <>
          {editingDetalle === 'new' && !pdf_generado ? (
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
                <DetalleEditRow key="nuevo" detalle={null} />
              </tbody>
            </table>
          ) : (
            <div className="text-muted">Sin detalles</div>
          )}
        </>
      )}
    </div>
  );
}

export default PagoDetalleTable;
