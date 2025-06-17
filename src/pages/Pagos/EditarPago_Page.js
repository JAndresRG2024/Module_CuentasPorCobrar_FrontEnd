import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PagoForm from '../../components/Pagos/pagos_Form';
import { updatePago, getPagoById } from '../../services/Pagos/pagos_Service';
import { getCuentas } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';
import {
  createPagoDetalle,} from '../../services/Pagos/pagos_Service';
import {
  updatePagoDetalle,} from '../../services/Pagos/pagos_Service';
import {
  deletePagoDetalle,} from '../../services/Pagos/pagos_Service';

function EditarPagoPage() {
  const { id } = useParams();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cuentas, setCuentas] = React.useState([]);
  const [detalles, setDetalles] = React.useState([]);
  const [editingDetalle, setEditingDetalle] = React.useState(null);
  const [detalleForm, setDetalleForm] = React.useState({ id_factura: '', monto_pagado: '' });
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
  }, []);

  React.useEffect(() => {
    getPagoById(id)
      .then(data => {
        setForm(data);
        setDetalles(data.detalles || []);
      })
      .catch(() => {
        setForm(null);
        setDetalles([]);
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

  // Handlers para detalles
  const handleDetalleChange = e => {
    const { name, value } = e.target;
    setDetalleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDetalle = () => {
    setEditingDetalle({ id_pago: form.id_pago, id_detalle: null });
    setDetalleForm({ id_factura: '', monto_pagado: '' });
  };

  const handleEditDetalle = (id_pago, detalle) => {
    setEditingDetalle({ id_pago, id_detalle: detalle.id_detalle });
    setDetalleForm({
      id_factura: detalle.id_factura,
      monto_pagado: detalle.monto_pagado,
    });
  };

  const handleSaveDetalle = async (id_pago) => {
    try {
      if (editingDetalle.id_detalle) {
        // Actualizar detalle existente
        await updatePagoDetalle(id_pago, editingDetalle.id_detalle, detalleForm);
      } else {
        // Crear nuevo detalle
        await createPagoDetalle(id_pago, detalleForm);
      }
      // Refrescar detalles
      const updated = await getPagoById(id);
      setDetalles(updated.detalles || []);
      setEditingDetalle(null);
      setDetalleForm({ id_factura: '', monto_pagado: '' });
    } catch (err) {
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
          detalles={detalles}
          editingDetalle={editingDetalle}
          detalleForm={detalleForm}
          handleDetalleChange={handleDetalleChange}
          handleEditDetalle={handleEditDetalle}
          handleDeleteDetalle={handleDeleteDetalle}
          handleSaveDetalle={handleSaveDetalle}
          setEditingDetalle={setEditingDetalle}
          handleCreateDetalle={handleCreateDetalle}
        />
      </div>
    </div>
  );
}
export default EditarPagoPage;