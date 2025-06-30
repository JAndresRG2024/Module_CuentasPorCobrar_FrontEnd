import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDetalles } from "../../services/Pagos/pagos_Service";
import { deletePagoDetalle } from "../../services/Pagos/pagos_Service";


function DetallesListPage() {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllDetalles()
      .then(setDetalles)
      .catch(() => setDetalles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Todos los Detalles de Pagos</h2>
      <button
        className="btn btn-success mb-3"
  onClick={() => navigate("/pagos-detalle/nuevo-detalle")}
      >
        Nuevo Detalle de Pago
      </button>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="table table-bordered">
         <thead>
            <tr>
              <th>ID Detalle</th>
              <th>ID Pago</th>
              <th>ID Factura</th>
              <th>Monto Pagado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length > 0 ? (
              detalles.map((det) => (
                <tr key={det.id_detalle}>
                  <td>{det.id_detalle}</td>
                  <td>{det.id_pago}</td>
                  <td>{det.id_factura}</td>
                  <td>{det.monto_pagado}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/pagos-detalle/editar/${det.id_detalle}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("¿Eliminar este detalle?")) {
                          await deletePagoDetalle(det.id_detalle);
                          setDetalles((prev) => prev.filter((d) => d.id_detalle !== det.id_detalle));
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-muted">
                  Sin detalles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DetallesListPage;