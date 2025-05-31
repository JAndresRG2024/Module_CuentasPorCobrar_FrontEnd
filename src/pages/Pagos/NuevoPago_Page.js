import React from 'react';
import { useNavigate } from 'react-router-dom';
import PagoForm from '../../components/Pagos/pagos_Form';
import { createPago } from '../../services/Pagos/pagos_Service';
import { getCuentas } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';

function NuevoPagoPage() {
  const [form, setForm] = React.useState({
    descripcion: '',
    fecha: '',
    id_cuenta: '',
    id_cliente: '',
    pdf_generado: false,
  });
  const [cuentas, setCuentas] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas().then(setCuentas).catch(() => setCuentas([]));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    createPago(form)
      .then(() => navigate('/pagos'))
      .catch(() => alert('Error al crear pago'));
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Pago</h2>
      <div className="card p-4 shadow">
        <PagoForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          editando={false}
          onCancel={() => navigate('/pagos')}
          cuentas={cuentas}
        />
      </div>
    </div>
  );
}

export default NuevoPagoPage;