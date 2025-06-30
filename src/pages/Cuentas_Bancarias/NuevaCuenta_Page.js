import React from 'react';
import { useNavigate } from 'react-router-dom';
import CuentaBancariaForm from '../../components/Cuentas_Bancarias/Cuenta_Bancaria_Form';
import { createCuenta } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';

function NuevaCuentaPage() {
  const [form, setForm] = React.useState({
    nombre_cuenta: '',
    entidad_bancaria: '',
    descripcion: '',
    estado: true,
  });
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCuenta(form);
      navigate('/cuentas-bancarias');
    } catch (error) {
      alert('Error al crear cuenta bancaria');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nueva Cuenta Bancaria</h2>
      <div className="card p-4 shadow">
        <CuentaBancariaForm form={form} onChange={handleChange} onSubmit={handleSubmit} editando={false} />
        <button className="btn btn-secondary mt-2" onClick={() => navigate('/cuentas-bancarias')}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default NuevaCuentaPage;