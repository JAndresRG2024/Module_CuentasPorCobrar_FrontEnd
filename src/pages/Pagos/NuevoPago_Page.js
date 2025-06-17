import React from "react";
import { useNavigate } from "react-router-dom";
import { createPago, createPagoDetalle } from "../../services/Pagos/pagos_Service";
import { getCuentas } from "../../services/Cuentas_Bancarias/cuentas_Bancarias_Service";

function NuevoPagoPage() {
  const [form, setForm] = React.useState({
    descripcion: "",
    fecha: "",
    id_cuenta: "",
    id_cliente: "",
    pdf_generado: false,
  });

  const [detalles, setDetalles] = React.useState([]);
  const [editingDetalle, setEditingDetalle] = React.useState(false);
  const [detalleForm, setDetalleForm] = React.useState({
    id_factura: "",
    monto_pagado: "",
  });

  const [cuentas, setCuentas] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Detalle handlers
  const handleDetalleChange = (e) => {
    const { name, value } = e.target;
    setDetalleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDetalle = () => {
    setEditingDetalle(true);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
    });
  };

  const handleSaveDetalle = () => {
    if (!detalleForm.id_factura || !detalleForm.monto_pagado) {
      alert("Completa todos los campos del detalle");
      return;
    }
    setDetalles((prev) => [
      ...prev,
      { ...detalleForm, id_detalle: Date.now() },
    ]);
    setEditingDetalle(false);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
    });
  };

  const handleEditDetalle = (detalle) => {
    setEditingDetalle(detalle.id_detalle);
    setDetalleForm({
      id_factura: detalle.id_factura,
      monto_pagado: detalle.monto_pagado,
    });
  };

  const handleUpdateDetalle = () => {
    setDetalles((prev) =>
      prev.map((d) =>
        d.id_detalle === editingDetalle
          ? { ...detalleForm, id_detalle: d.id_detalle }
          : d
      )
    );
    setEditingDetalle(false);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
    });
  };

  const handleDeleteDetalle = (id_detalle) => {
    if (window.confirm("¿Eliminar este detalle?")) {
      setDetalles((prev) => prev.filter((d) => d.id_detalle !== id_detalle));
    }
  };

  const handleCancelDetalle = () => {
    setEditingDetalle(false);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (detalles.length === 0) {
      alert("Agrega al menos un detalle de pago.");
      return;
    }

    try {
      // 1. Crear el pago principal
      const pagoCreado = await createPago(form);

      // 2. Crear los detalles usando el id_pago retornado
      for (const detalle of detalles) {
        await createPagoDetalle(pagoCreado.id_pago, {
          id_factura: detalle.id_factura,
          monto_pagado: detalle.monto_pagado,
        });
      }

      navigate("/pagos");
    } catch (err) {
      alert("Error al crear pago y sus detalles");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Pago</h2>
      <div className="card p-4 shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              name="descripcion"
              placeholder="Descripción del pago"
              value={form.descripcion}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Cuenta</label>
            <select
              className="form-select"
              name="id_cuenta"
              value={form.id_cuenta}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </div>
          {/* Detalles */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Detalles del pago:</strong>
              {!editingDetalle && (
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleCreateDetalle}
                >
                  + Agregar Detalle
                </button>
              )}
            </div>
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>ID Factura</th>
                  <th>Monto Pagado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((det) =>
                  editingDetalle === det.id_detalle ? (
                    <tr key={det.id_detalle}>
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
                          type="button"
                          className="btn btn-sm btn-primary me-2"
                          onClick={handleUpdateDetalle}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={handleCancelDetalle}
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={det.id_detalle}>
                      <td>{det.id_factura}</td>
                      <td>{det.monto_pagado}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditDetalle(det)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteDetalle(det.id_detalle)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {editingDetalle === true && (
                  <tr>
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
                        type="button"
                        className="btn btn-sm btn-primary me-2"
                        onClick={handleSaveDetalle}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelDetalle}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {detalles.length === 0 && !editingDetalle && (
              <div className="text-muted">Sin detalles</div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-success me-2"
            disabled={editingDetalle}
          >
            Crear
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/pagos")}
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}

export default NuevoPagoPage;