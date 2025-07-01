import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PagoForm from '../../components/Pagos/pagos_Form';
import { updatePago, getPagoById } from '../../services/Pagos/pagos_Service';
import { getCuentas } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';
import {
  createPagoDetalle,
} from '../../services/Pagos/pagos_Service';
import {
  updatePagoDetalle,
} from '../../services/Pagos/pagos_Service';
import {
  deletePagoDetalle,
} from '../../services/Pagos/pagos_Service';
import {
  getClientes,
} from '../../services/externos/clientes_Service';
import { getFacturasPorCliente } from '../../services/externos/facturas_Service';
import { getAllDetalles } from '../../services/Pagos/pagos_Service';


function EditarPagoPage() {
  const { id } = useParams();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cuentas, setCuentas] = React.useState([]);
  const [clientes, setClientes] = React.useState([]);
  const [detalles, setDetalles] = React.useState([]);
  const [editingDetalle, setEditingDetalle] = React.useState(null);
  const [detalleForm, setDetalleForm] = React.useState({ id_factura: '', monto_pagado: '' });
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
        // Obtener facturas del cliente relacionado al pago
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

  // Handlers para detalles
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
  setEditingDetalle('new'); // o true, o null, pero usa un valor PRIMITIVO
  setDetalleForm({ id_factura: '', monto_pagado: '' });
};

const handleEditDetalle = (id_pago, detalle) => {
  setEditingDetalle(detalle.id_detalle);
  setDetalleForm({
    id_factura: detalle.id_factura,
    monto_pagado: detalle.monto_pagado,
  });
};

  const handleSaveDetalle = async (id_pago) => {
    try {
      console.log('Guardando detalle:', { id_pago, detalleForm, editingDetalle });
      if (!detalleForm.id_factura || !detalleForm.monto_pagado) {
        alert('Debe seleccionar una factura y un monto válido');
        return;
      }
      if (editingDetalle.id_detalle) {
        await updatePagoDetalle(editingDetalle.id_detalle, {
          ...detalleForm,
          id_pago: form.id_pago, // <--- agrega id_pago
        });
      } else {
        await createPagoDetalle(id_pago, detalleForm);
      }
      const updated = await getPagoById(id);
      setDetalles(updated.detalles || []);
      setEditingDetalle(null);
      setDetalleForm({ id_factura: '', monto_pagado: '' });
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
          detalleForm={detalleForm}
          handleDetalleChange={handleDetalleChange}
          handleEditDetalle={handleEditDetalle}
          handleDeleteDetalle={handleDeleteDetalle}
          handleSaveDetalle={handleSaveDetalle}
          setEditingDetalle={setEditingDetalle}
          handleCreateDetalle={handleCreateDetalle}
          facturas={facturas}
          todosDetalles={todosDetalles}

        />
      </div>
    </div>
  );
}
export default EditarPagoPage;