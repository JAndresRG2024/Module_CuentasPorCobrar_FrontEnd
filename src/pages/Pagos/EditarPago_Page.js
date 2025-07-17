import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PagoForm from '../../components/Pagos/pagos_Form';
import { updatePago, getPagoById } from '../../services/Pagos/pagos_Service';
import { getCuentas } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';
import {
  createPagoDetalle,
  updatePagoDetalle,
  deletePagoDetalle,
  getAllDetalles
} from '../../services/Pagos/pagos_Service';
import { getClientes } from '../../services/externos/clientes_Service';
import { getFacturasPorCliente } from '../../services/externos/facturas_Service';
import { generarPDFPago } from '../../services/Pagos/pagos_Service';

function EditarPagoPage() {
  const { id } = useParams();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cuentas, setCuentas] = React.useState([]);
  const [clientes, setClientes] = React.useState([]);
  const [detalles, setDetalles] = React.useState([]);
  const [editingDetalle, setEditingDetalle] = React.useState(null);
  const [facturas, setFacturas] = React.useState([]);
  const [todosDetalles, setTodosDetalles] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getAllDetalles().then(setTodosDetalles).catch(() => setTodosDetalles([]));
  }, []);

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
    getClientes().then(setClientes).catch(() => setClientes([]));
  }, []);

  React.useEffect(() => {
    getPagoById(id)
      .then(async data => {
        setForm(data);
        setDetalles(data.detalles || []);
        if (data.id_cliente) {
          try {
            const facturasCliente = await getFacturasPorCliente(data.id_cliente);
            setFacturas(facturasCliente);
          } catch {
            setFacturas([]);
          }
        }
      })
      .catch(() => {
        setForm(null);
        setDetalles([]);
        setFacturas([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mt-4">Cargando...</div>;
  if (!form) return <div className="container mt-4">Pago no encontrado</div>;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImprimirPDF = async (pago) => {
    if (window.confirm("¿Desea generar e imprimir el PDF de este pago?")) {
      try {
        await generarPDFPago(pago.id_pago);
        // Opcional: recargar datos del pago si es necesario
      } catch (err) {
        alert("Error al generar PDF: " + (err.message || err));
      }
    }
  };
  // eliminamos detalleForm porque irá a nivel de fila
  const handleCreateDetalle = () => {
    setEditingDetalle('new');
  };

  const handleEditDetalle = (id_pago, detalle) => {
    setEditingDetalle(detalle.id_detalle);
  };

  const handleSaveDetalle = async (id_pago, detalleData) => {
    try {
      console.log('Guardando detalle:', { id_pago, detalleData });
      if (!detalleData.id_factura || !detalleData.monto_pagado) {
        alert('Debe seleccionar una factura y un monto válido');
        return;
      }
      if (detalleData.id_detalle) {
        await updatePagoDetalle(detalleData.id_detalle, {
          ...detalleData,
          id_pago: form.id_pago
        });
      } else {
        await createPagoDetalle(id_pago, {
          ...detalleData,
          id_pago: form.id_pago
        });
      }
      const updated = await getPagoById(id);
      setDetalles(updated.detalles || []);
      setEditingDetalle(null);
    } catch (err) {
      console.error('Error al guardar detalle:', err);
      alert('Error al guardar detalle');
    }
  };

  const handleDeleteDetalle = async (id_pago, id_detalle) => {
    if (window.confirm('¿Eliminar este detalle?')) {
      try {
        await deletePagoDetalle(id_pago, id_detalle);
        const updated = await getPagoById(id);
        setDetalles(updated.detalles || []);
      } catch (err) {
        alert('Error al eliminar detalle');
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    updatePago(id, form)
      .then(() => navigate('/pagos'))
      .catch(() => alert('Error al actualizar pago'));
  };

  return (
    <div className="container mt-4">
      <h2>Editar Pago</h2>
      <div className="card p-4 shadow">
        <PagoForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editando={true}
          onCancel={() => navigate('/pagos')}
          cuentas={cuentas}
          clientes={clientes}
          detalles={detalles}
          editingDetalle={editingDetalle}
          handleEditDetalle={handleEditDetalle}
          handleDeleteDetalle={handleDeleteDetalle}
          handleSaveDetalle={handleSaveDetalle}
          setEditingDetalle={setEditingDetalle}
          handleCreateDetalle={handleCreateDetalle}
          facturas={facturas}
          todosDetalles={todosDetalles}
          handleImprimirPDF={handleImprimirPDF}
        />
      </div>
    </div>
  );
}

export default EditarPagoPage;
