import React from "react";
import PagoDetalleTable from "./pagoDetalle_Table"; // Asegúrate de importar el componente

function PagoForm({
  form,
  onChange,
  onSubmit,
  editando,
  onCancel,
  cuentas,
  detalles,
  editingDetalle,
  detalleForm,
  handleDetalleChange,
  handleEditDetalle,
  handleDeleteDetalle,
  handleSaveDetalle,
  setEditingDetalle,
  handleCreateDetalle,
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
          value={form.fecha}
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
        <label className="form-label">ID Cliente</label>
        <input
          type="number"
          className="form-control"
          name="id_cliente"
          placeholder="ID del cliente"
          value={form.id_cliente}
          onChange={onChange}
          required
        />
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
        />
      </div>
      <button
        type="submit"
        className="btn btn-success me-2"
        disabled={!!editingDetalle} // Deshabilita si hay un detalle en edición
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