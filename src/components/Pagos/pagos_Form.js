import React from "react";
import PagoDetalleTable from "./pagoDetalle_Table";

function PagoForm({
  form,
  onChange,
  onSubmit,
  editando,
  onCancel,
  cuentas,
  detalles,
  clientes,
  editingDetalle,
  detalleForm,
  handleDetalleChange,
  handleEditDetalle,
  handleDeleteDetalle,
  handleSaveDetalle,
  setEditingDetalle,
  handleCreateDetalle,
  facturas,
  todosDetalles
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input
          type="text"
          className="form-control"
          name="descripcion"
          placeholder="Descripción del pago"
          value={form.descripcion}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          name="fecha"
          value={form.fecha ? form.fecha.substring(0, 10) : ''}
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Cuenta</label>
        <select
          className="form-select"
          name="id_cuenta"
          value={form.id_cuenta}
          onChange={onChange}
          required
        >
          <option value="">Seleccione una cuenta</option>
          {cuentas &&
            cuentas.map((cuenta) => (
              <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
                {cuenta.id_cuenta}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Cliente</label>
        <select
          className="form-select"
          name="id_cliente"
          value={form.id_cliente}
          onChange={onChange}
          required
          disabled={editando} // <-- deshabilita en edición
        >
          <option value="">Seleccione un cliente</option>
          {clientes && clientes.map((cliente) => (
            <option key={cliente.id_cliente} value={cliente.id_cliente}>
              {cliente.nombre} {cliente.apellido} ({cliente.id_cliente})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <PagoDetalleTable
          detalles={detalles}
          editingDetalle={editingDetalle}
          detalleForm={detalleForm}
          handleDetalleChange={handleDetalleChange}
          handleEditDetalle={handleEditDetalle}
          handleDeleteDetalle={handleDeleteDetalle}
          handleSaveDetalle={handleSaveDetalle}
          setEditingDetalle={setEditingDetalle}
          handleCreateDetalle={handleCreateDetalle}
          id_pago={form.id_pago || null}
          facturas={facturas || []}
          todosDetalles={todosDetalles}

        />
      </div>
      <button
        type="submit"
        className="btn btn-success me-2"
        disabled={!!editingDetalle}
      >
        {editando ? "Actualizar" : "Crear"}
      </button>
      {onCancel && (
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Volver
        </button>
      )}
    </form>
  );
}

export default PagoForm;