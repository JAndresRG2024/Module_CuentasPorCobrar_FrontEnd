import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

function CuentaBancariaList({ cuentas, onEdit, onDelete }) {
  const columns = useMemo(
    () => [
      {
        id: 'acciones',
        header: 'Acciones',
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => onEdit(row.original)}
            >
              <i className="bi bi-pencil-square"></i> Editar
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(row.original.id_cuenta)}
            >
              <i className="bi bi-trash"></i> Eliminar
            </button>
          </div>
        ),
      },
      { accessorKey: 'id_cuenta', header: 'ID' },
      { accessorKey: 'nombre_cuenta', header: 'Nombre' },
      { accessorKey: 'entidad_bancaria', header: 'Entidad' },
      { accessorKey: 'descripcion', header: 'Descripción' },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => (
          <span className={`badge ${cell.getValue() ? 'bg-success' : 'bg-secondary'}`}>
            {cell.getValue() ? 'Activo' : 'Inactivo'}
          </span>
        ),
        filterFn: 'equals',
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={cuentas}
      enableColumnFilters
      enableGlobalFilter
      enableSorting
      initialState={{
        pagination: { pageIndex: 0, pageSize: 10 },
      }}
      muiToolbarAlertBannerProps={{
        color: 'info',
        children: `Total: ${cuentas.length}`,
      }}
    />
  );
}

export default CuentaBancariaList;
