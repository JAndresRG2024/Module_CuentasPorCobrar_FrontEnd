import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CuentaBancariaForm from '../../components/Cuentas_Bancarias/Cuenta_Bancaria_Form';
import { getCuentas, updateCuenta } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';

function EditarCuentaPage() {
  const { id } = useParams();
  const [form, setForm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    getCuentas()
      .then(data => {
        const cuenta = data.find(c => String(c.id_cuenta) === String(id));
        if (cuenta) setForm(cuenta);
        else alert('Cuenta no encontrada');
      })
      .catch(() => alert('Error al cargar cuentas'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mt-4">Cargando...</div>;
  if (!form) return <div className="container mt-4">Cuenta no encontrada</div>;

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCuenta(id, form);
      navigate('/cuentas-bancarias');
    } catch {
      alert('Error al actualizar cuenta bancaria');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Cuenta Bancaria</h2>
      <div className="card p-4 shadow">
        <CuentaBancariaForm form={form} onChange={handleChange} onSubmit={handleSubmit} editando={true} />
        <button className="btn btn-secondary mt-2" onClick={() => navigate('/cuentas-bancarias')}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default EditarCuentaPage;