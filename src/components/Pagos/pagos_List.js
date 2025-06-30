import React from "react";
import { generarPDFPago } from "../../services/Pagos/pagos_Service";

function PagoList({ pagos, onEdit, onDelete, onPdfGenerated }) {
  const handleImprimirPDF = async (pago) => {
    if (window.confirm("¿Desea generar e imprimir el PDF de este pago?")) {
      try {
        const res = await generarPDFPago(pago.id_pago);
        if (res.url_pdf) {
          // Fuerza descarga
          const link = document.createElement("a");
          link.href = res.url_pdf;
          link.download = `pago_${pago.id_pago}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert("PDF generado y descargado.");
        }
        if (onPdfGenerated) onPdfGenerated();
      } catch (err) {
        alert("Error al generar PDF: " + (err.message || err));
      }
    }
  };

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Número</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Cuenta</th>
          <th>Cliente</th>
          <th>PDF</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pagos.map((pago) => (
          <tr key={pago.id_pago}>
            <td>{pago.id_pago}</td>
            <td>{pago.numero_pago}</td>
            <td>{pago.descripcion}</td>
            <td>{new Date(pago.fecha).toLocaleDateString()}</td>
            <td>{pago.id_cuenta}</td>
            <td>{pago.id_cliente}</td>
            <td>
              <span
                className={`badge ${
                  pago.pdf_generado ? "bg-success" : "bg-secondary"
                }`}
              >
                {pago.pdf_generado ? "Sí" : "No"}
              </span>
            </td>
            <td className="text-center">
              {!pago.pdf_generado ? (
                <>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleImprimirPDF(pago)}
                    title="Imprimir PDF"
                  >
                    <i className="bi bi-printer"></i> Imprimir PDF
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(pago)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(pago.id_pago)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </>
              ) : (
                <>
                  <a
                    className="btn btn-sm btn-success me-2"
                    href={`/pdfs/pago_${pago.id_pago}.pdf`}
                    download={`pago_${pago.id_pago}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Descargar PDF"
                  >
                    <i className="bi bi-download"></i> Descargar PDF
                  </a>
                  <span className="text-muted">No editable</span>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PagoList;
