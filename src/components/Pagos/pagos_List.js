import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { generarPDFPago } from '../../services/Pagos/pagos_Service';
import { getClientes } from '../../services/externos/clientes_Service';

function PagoList({ pagos, onEdit, onDelete, onPdfGenerated }) {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch(() => setClientes([]));
  }, []);

  const getNombreCliente = useCallback(
    (id_cliente) => {
      const cliente = clientes.find(c => String(c.id_cliente) === String(id_cliente));
      return cliente ? `${cliente.nombre} ${cliente.apellido}` : id_cliente;
    },
    [clientes]
  );

  const handleImprimirPDF = useCallback(
    async (pago) => {
      if (window.confirm("¿Desea generar e imprimir el PDF de este pago?")) {
        try {
          await generarPDFPago(pago.id_pago);
          if (onPdfGenerated) onPdfGenerated();
        } catch (err) {
          alert("Error al generar PDF: " + (err.message || err));
        }
      }
    },
    [onPdfGenerated]
  );

   const columns = useMemo(() => [
    {
      id: 'acciones',
      header: 'Acciones',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const pago = row.original;
        return (
          <div className="text-center">
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
          </div>
        );
      },
    },
    { accessorKey: 'id_pago', header: 'ID' },
    { accessorKey: 'numero_pago', header: 'Número' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      filterFn: 'equals',
    },
    { accessorKey: 'id_cuenta', header: 'Cuenta' },
    {
      accessorKey: 'id_cliente',
      header: 'Cliente',
      Cell: ({ cell }) => getNombreCliente(cell.getValue()),
    },
    {
      accessorKey: 'pdf_generado',
      header: 'PDF',
      Cell: ({ cell }) => (
        <span
          className={`badge ${cell.getValue() ? 'bg-success' : 'bg-secondary'}`}
        >
          {cell.getValue() ? 'Sí' : 'No'}
        </span>
      ),
      filterFn: 'equals',
    },
  ], [onEdit, onDelete, handleImprimirPDF, getNombreCliente]);

  return (
    <MaterialReactTable
      columns={columns}
      data={pagos}
      enableColumnFilters
      enableGlobalFilter
      enableSorting
      initialState={{
        pagination: { pageIndex: 0, pageSize: 10 },
      }}
      muiToolbarAlertBannerProps={{
        color: 'info',
        children: `Total: ${pagos.length}`,
      }}
    />
  );
}

export default PagoList;
