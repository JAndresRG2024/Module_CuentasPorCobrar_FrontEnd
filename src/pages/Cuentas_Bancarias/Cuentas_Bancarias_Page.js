// src/pages/Cuentas_Bancarias/Cuentas_Bancarias_Page.js
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import CuentaBancariaList from '../../components/Cuentas_Bancarias/Cuenta_Bancaria_List';
import CuentaBancariaForm from '../../components/Cuentas_Bancarias/Cuenta_Bancaria_Form';
import {
  getCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} from '../../services/Cuentas_Bancarias/cuentas_Bancarias_Service';
import 'bootstrap/dist/css/bootstrap.min.css';


// 🔹 Página de listado de cuentas
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


// 🔹 Página para crear una nueva cuenta
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


// 🔹 Página para editar una cuenta existente
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


// 🔹 Página principal de rutas
function CuentasBancariasPage() {
  return (
    <Routes>
      <Route path="/" element={<CuentasListPage />} />
      <Route path="nueva" element={<NuevaCuentaPage />} />
      <Route path="editar/:id" element={<EditarCuentaPage />} />
    </Routes>
  );
}

export default CuentasBancariasPage;