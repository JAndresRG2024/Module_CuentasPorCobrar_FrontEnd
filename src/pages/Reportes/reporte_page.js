import React, { useEffect, useState } from "react";
import { getClientesDeudores } from '../../services/Reportes/Reporte_Service';

function ReporteEstadoCuenta() {
  const [deudores, setDeudores] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);

useEffect(() => {
  getClientesDeudores()
    .then(data => {
      console.log("Deudores recibidos:", data);
      setDeudores(data);
    })
    .catch(() => setDeudores([]));
}, []);

  return (
    <div className="container mt-4">
      <h2>Estado de Cuenta del Cliente</h2>
      <div className="mb-3">
        <label>Selecciona un cliente:</label>
        <select
          className="form-select"
          value={selectedCliente?.id_cliente ? String(selectedCliente.id_cliente) : ""}
          onChange={e => {
            const id = e.target.value;
            setSelectedCliente(deudores.find(c => String(c.id_cliente) === id));
          }}
        >
          <option value="">-- Selecciona --</option>
          {deudores.map(c => (
            <option key={c.id_cliente} value={String(c.id_cliente)}>
              {c.nombre || c.nombre_cliente} {c.apellido}
            </option>
          ))}
        </select>
      </div>
      {selectedCliente && (
        <div className="card p-4">
          <h4>
            {selectedCliente.nombre} {selectedCliente.apellido}
          </h4>
          <p><strong>Total Deuda:</strong> ${selectedCliente.total_deuda}</p>
          <h5>Facturas Pendientes</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID Factura</th>
                <th>Monto Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {selectedCliente.facturas_pendientes.map(f => (
                <tr key={f.id_factura}>
                  <td>{f.id_factura}</td>
                  <td>${f.monto_pendiente}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h5 className="mt-4">Pagos Realizados</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID Pago</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>ID Factura</th>
                <th>Monto Pagado</th>
              </tr>
            </thead>
            <tbody>
              {selectedCliente.pagos_realizados && selectedCliente.pagos_realizados.length > 0 ? (
                selectedCliente.pagos_realizados.map(pago =>
                  pago.detalles.map(detalle => (
                    <tr key={detalle.id_detalle}>
                      <td>{pago.id_pago}</td>
                      <td>{new Date(pago.fecha).toLocaleDateString()}</td>
                      <td>{pago.descripcion}</td>
                      <td>{detalle.id_factura}</td>
                      <td>${detalle.monto_pagado}</td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted">Sin pagos realizados</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Apartado de facturas pagadas totalmente */}
    <h5 className="mt-4">Facturas Pagadas Totalmente</h5>
    <table className="table">
      <thead>
        <tr>
          <th>ID Factura</th>
          <th>Monto Pagado</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          // Obtener IDs de facturas pendientes
          const pendientesIds = selectedCliente.facturas_pendientes.map(f => f.id_factura);
          // Agrupar pagos por factura
          const pagosPorFactura = {};
          selectedCliente.pagos_realizados?.forEach(pago => {
            pago.detalles.forEach(detalle => {
              if (!pagosPorFactura[detalle.id_factura]) pagosPorFactura[detalle.id_factura] = 0;
              pagosPorFactura[detalle.id_factura] += Number(detalle.monto_pagado);
            });
          });
          // Mostrar facturas pagadas totalmente (no están en pendientes y tienen pagos)
          const pagadas = Object.entries(pagosPorFactura)
            .filter(([id_factura]) => !pendientesIds.includes(Number(id_factura)))
            .map(([id_factura, monto_pagado]) => ({ id_factura, monto_pagado }));

          return pagadas.length > 0 ? (
            pagadas.map(f => (
              <tr key={f.id_factura}>
                <td>{f.id_factura}</td>
                <td>${f.monto_pagado}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-muted">Sin facturas pagadas totalmente</td>
            </tr>
          );
        })()}
      </tbody>
    </table>
          <div className="alert alert-info mt-3">
            <strong>Saldo del Cliente:</strong> ${selectedCliente.total_deuda}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReporteEstadoCuenta;