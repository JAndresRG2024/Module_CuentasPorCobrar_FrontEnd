import React, { useState } from 'react';
import PagoDetalleTable from './pagoDetalle_Table';
import {
    createPagoDetalle,
    updatePagoDetalle,
    deletePagoDetalle,
    generarPDFPago
} from '../../services/Pagos/pagos_Service';

function PagoList({ pagos, onEdit, onDelete, onPdfGenerated }) {
    const [expanded, setExpanded] = useState({});
    const [editingDetalle, setEditingDetalle] = useState(null);
    const [detalleForm, setDetalleForm] = useState({});

    const toggleExpand = (id_pago) => {
        setExpanded(prev => ({
            ...prev,
            [id_pago]: !prev[id_pago]
        }));
    };

    // Handlers para crear/editar detalle
    const handleDetalleChange = (e) => {
        setDetalleForm({ ...detalleForm, [e.target.name]: e.target.value });
    };

    const handleCreateDetalle = async (id_pago) => {
        setEditingDetalle({ id_pago, id_detalle: null });
        setDetalleForm({ id_factura: '', monto_pagado: '', saldo_anterior: '', saldo_nuevo: '' });
    };

    const handleEditDetalle = (id_pago, detalle) => {
        setEditingDetalle({ id_pago, id_detalle: detalle.id_detalle });
        setDetalleForm({
            id_factura: detalle.id_factura,
            monto_pagado: detalle.monto_pagado,
            saldo_anterior: detalle.saldo_anterior,
            saldo_nuevo: detalle.saldo_nuevo,
        });
    };

    const handleSaveDetalle = async (id_pago) => {
        try {
            if (editingDetalle.id_detalle) {
                await updatePagoDetalle(id_pago, editingDetalle.id_detalle, detalleForm);
            } else {
                await createPagoDetalle(id_pago, detalleForm);
            }
            window.location.reload(); // Recarga para ver los cambios, puedes mejorar esto con un refetch
        } catch (err) {
            alert('Error al guardar detalle');
        }
    };

    const handleDeleteDetalle = async (id_pago, id_detalle) => {
        if (window.confirm('¿Eliminar este detalle?')) {
            try {
                await deletePagoDetalle(id_pago, id_detalle);
                window.location.reload();
            } catch (err) {
                alert('Error al eliminar detalle');
            }
        }
    };
    // Acción para imprimir PDF
    const handleImprimirPDF = async (pago) => {
        if (window.confirm('¿Desea generar e imprimir el PDF de este pago?')) {
            try {
                await generarPDFPago(pago.id_pago); // Llama a tu backend para generar el PDF y marcar como generado
                if (onPdfGenerated) onPdfGenerated(); // Opcional: para refrescar la lista desde el padre
                window.location.reload(); // O mejor, refresca solo los datos
            } catch (err) {
                alert('Error al generar PDF');
            }
        }
    };

    return (
        <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
                <tr>
                    <th></th>
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
                {pagos.map(pago => (
                    <React.Fragment key={pago.id_pago}>
                        <tr>
                            <td>
                                <button
                                    className="btn btn-sm btn-link"
                                    onClick={() => toggleExpand(pago.id_pago)}
                                    aria-label="Ver detalles"
                                >
                                    {expanded[pago.id_pago] ? '▼' : '▶'}
                                </button>
                            </td>
                            <td>{pago.id_pago}</td>
                            <td>{pago.numero_pago}</td>
                            <td>{pago.descripcion}</td>
                            <td>{new Date(pago.fecha).toLocaleDateString()}</td>
                            <td>{pago.id_cuenta}</td>
                            <td>{pago.id_cliente}</td>
                            <td>
                                <span className={`badge ${pago.pdf_generado ? 'bg-success' : 'bg-secondary'}`}>
                                    {pago.pdf_generado ? 'Sí' : 'No'}
                                </span>
                            </td>
                            <td className="text-center">
                                {!pago.pdf_generado && (
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
                                )}
                                {pago.pdf_generado && (
                                    <span className="text-muted">No editable</span>
                                )}
                            </td>
                        </tr>
                        {expanded[pago.id_pago] && (
                            <tr>
                                <td colSpan="9">
                                    <PagoDetalleTable
                                        detalles={pago.detalles}
                                        editingDetalle={editingDetalle}
                                        detalleForm={detalleForm}
                                        handleDetalleChange={handleDetalleChange}
                                        handleEditDetalle={pago.pdf_generado ? undefined : handleEditDetalle}
                                        handleDeleteDetalle={pago.pdf_generado ? undefined : handleDeleteDetalle}
                                        handleSaveDetalle={pago.pdf_generado ? undefined : handleSaveDetalle}
                                        setEditingDetalle={setEditingDetalle}
                                        handleCreateDetalle={pago.pdf_generado ? undefined : handleCreateDetalle}
                                        id_pago={pago.id_pago}
                                        pdf_generado={pago.pdf_generado}
                                    />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}

export default PagoList;