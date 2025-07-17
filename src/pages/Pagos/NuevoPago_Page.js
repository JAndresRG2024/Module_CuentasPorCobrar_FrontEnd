import React from "react";
import { useNavigate } from "react-router-dom";
import { createPago, createPagoDetalle } from "../../services/Pagos/pagos_Service";
import { getCuentas } from "../../services/Cuentas_Bancarias/cuentas_Bancarias_Service";
import { getClientes } from "../../services/externos/clientes_Service";
import { getFacturasPorCliente } from "../../services/externos/facturas_Service";
import { getAllDetalles } from '../../services/Pagos/pagos_Service';


function NuevoPagoPage() {
  const [form, setForm] = React.useState({
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
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
  const [clientes, setClientes] = React.useState([]);
  const [facturas, setFacturas] = React.useState([]);
  const [todosDetalles, setTodosDetalles] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
    getClientes().then(setClientes).catch(() => setClientes([]));
  }, []);

  React.useEffect(() => {
    getAllDetalles().then(setTodosDetalles).catch(() => setTodosDetalles([]));
  }, []);

  React.useEffect(() => {
    if (form.id_cliente) {
      getFacturasPorCliente(form.id_cliente)
        .then(setFacturas)
        .catch(() => setFacturas([]));
    } else {
      setFacturas([]);
    }
  }, [form.id_cliente]);

  const getPendiente = (id_factura, excludeIdDetalle = null, montoActual = 0) => {
    const factura = facturas.find(f => String(f.id_factura) === String(id_factura));
    const montoTotal = factura ? Number(factura.monto_total) : 0;
    const pagosPrevios = [
      ...todosDetalles.filter(d => String(d.id_factura) === String(id_factura)),
      ...detalles.filter(d =>
        String(d.id_factura) === String(id_factura) &&
        (excludeIdDetalle === null || String(d.id_detalle) !== String(excludeIdDetalle))
      )
    ];
    const pagadoPrevio = pagosPrevios.reduce((sum, d) => sum + Number(d.monto_pagado), 0);
    return (montoTotal - pagadoPrevio - Number(montoActual || 0)).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Si cambia el cliente, limpiar detalles y facturas seleccionadas
    if (name === "id_cliente") {
      setDetalles([]);
      setDetalleForm({ id_factura: "", monto_pagado: "" });
    }
  };


  // Detalle handlers
  const handleDetalleChange = e => {
    const { name, value } = e.target;
    if (name === "monto_pagado") {
      const montoTotal = facturas.find(f => String(f.id_factura) === String(detalleForm.id_factura))?.monto_total ?? 0;
      // Usa todosDetalles para sumar todos los pagos previos de esa factura, excepto el que se está editando
      const pagadoPrevio = todosDetalles
        .filter(d => String(d.id_factura) === String(detalleForm.id_factura) && d.id_detalle !== editingDetalle?.id_detalle)
        .reduce((sum, d) => sum + Number(d.monto_pagado), 0);
      let max = montoTotal - pagadoPrevio;
      if (max < 0) max = 0;
      if (Number(value) > max) {
        setDetalleForm(prev => ({ ...prev, [name]: max }));
        return;
      }
      if (Number(value) < 0) {
        setDetalleForm(prev => ({ ...prev, [name]: 0 }));
        return;
      }
    }
    setDetalleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDetalle = () => {
    setEditingDetalle(true);
    setDetalleForm({
      id_factura: "",
      monto_pagado: "",
    });
  };


  const handleSaveDetalle = async () => {
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
    // Refrescar facturas disponibles
    if (form.id_cliente) {
      const nuevasFacturas = await getFacturasPorCliente(form.id_cliente);
      setFacturas(nuevasFacturas);
    }
  };

  const handleEditDetalle = (detalle) => {
    setEditingDetalle(detalle.id_detalle);
    setDetalleForm({
      id_factura: detalle.id_factura,
      monto_pagado: detalle.monto_pagado,
    });
  };

  const handleUpdateDetalle = async () => {
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
    // Refrescar facturas disponibles
    if (form.id_cliente) {
      const nuevasFacturas = await getFacturasPorCliente(form.id_cliente);
      setFacturas(nuevasFacturas);
    }
  };

  const handleDeleteDetalle = async (id_detalle) => {
    if (window.confirm("¿Eliminar este detalle?")) {
      setDetalles((prev) => prev.filter((d) => d.id_detalle !== id_detalle));
      // Refrescar facturas disponibles
      if (form.id_cliente) {
        const nuevasFacturas = await getFacturasPorCliente(form.id_cliente);
        setFacturas(nuevasFacturas);
      }
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
                cuentas
                  .filter(cuenta => cuenta.estado === true)
                  .map((cuenta) => (
                    <option key={cuenta.id_cuenta} value={cuenta.id_cuenta}>
                      {cuenta.id_cuenta} - {cuenta.nombre_cuenta} - {cuenta.entidad_bancaria}
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
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre} {cliente.apellido} ({cliente.id_cliente})
                </option>
              ))}
            </select>
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
                  <th>Factura</th>
                  <th>Monto Pagado</th>
                  <th>Pendiente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((det) =>
                  editingDetalle === det.id_detalle ? (
                    <tr key={det.id_detalle}>
                      <td>
                        <select
                          name="id_factura"
                          value={detalleForm.id_factura}
                          onChange={handleDetalleChange}
                          className="form-control form-control-sm"
                          required
                        >
                          <option value="">Seleccione factura</option>
                          {facturas.map((fact) => (
                            <option key={fact.id_factura || fact.numero_factura || fact.monto_total}
                              value={fact.id_factura || fact.numero_factura || fact.monto_total}>
                              {fact.id_factura || fact.numero_factura || fact.monto_total}
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
                        />
                      </td>
                      <td>
                        {getPendiente(detalleForm.id_factura, det.id_detalle, detalleForm.monto_pagado)}
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
                        {getPendiente(det.id_factura, det.id_detalle, det.monto_pagado)}
                      </td>
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
                      <select
                        name="id_factura"
                        value={detalleForm.id_factura}
                        onChange={handleDetalleChange}
                        className="form-control form-control-sm"
                        required
                      >
                        <option value="">Seleccione factura</option>
                        {facturas.map((fact) => (
                          <option key={fact.id_factura || fact.numero_factura || fact.monto_total}
                            value={fact.id_factura || fact.numero_factura || fact.monto_total}>
                            {fact.id_factura || fact.numero_factura || fact.monto_total}
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
                      />
                    </td>
                    <td>
                      {getPendiente(detalleForm.id_factura, null, detalleForm.monto_pagado)}
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