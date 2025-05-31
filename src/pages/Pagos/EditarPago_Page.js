import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PagoForm from '../../components/Pagos/pagos_Form';
import { updatePago, getPagoById } from '../../services/Pagos/pagos_Service';
import { getCuentas } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';

function EditarPagoPage() {
  const { id } = useParams();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [cuentas, setCuentas] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
  }, []);

  React.useEffect(() => {
    getPagoById(id).then(setForm).catch(() => setForm(null)).finally(() => setLoading(false));
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
        />
      </div>
    </div>
  );
}

export default EditarPagoPage;