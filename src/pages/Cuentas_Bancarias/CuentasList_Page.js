import React from 'react';
import { useNavigate } from 'react-router-dom';
import CuentaBancariaList from '../../components/Cuentas_Bancarias/Cuenta_Bancaria_List';
import { getCuentas, deleteCuenta } from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';

function CuentasListPage() {
  const [cuentas, setCuentas] = React.useState([]);
  const navigate = useNavigate();

  const cargarCuentas = () => {
    getCuentas()
      .then(setCuentas)
      .catch(() => {
        alert('Error al cargar cuentas');
        setCuentas([]);
      });
  };

  React.useEffect(() => {
    cargarCuentas();
  }, []);

  const handleEdit = (cuenta) => navigate(`/cuentas-bancarias/editar/${cuenta.id_cuenta}`);
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar cuenta bancaria?')) {
      deleteCuenta(id)
        .then(() => {
          setCuentas(prev => prev.filter(c => c.id_cuenta !== id));
        })
        .catch(() => alert('Error al eliminar cuenta'));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Cuentas Bancarias</h2>
        <button className="btn btn-primary" onClick={() => navigate('/cuentas-bancarias/nueva')}>
          <i className="bi bi-plus-lg"></i> Nueva Cuenta
        </button>
      </div>
      <div className="card p-3 shadow">
        <CuentaBancariaList cuentas={cuentas} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default CuentasListPage;