import React, { useEffect, useState } from 'react';
import CuentaBancariaList from '../components/Cuenta_Bancaria_List';
import CuentaBancariaForm from '../components/Cuenta_Bancaria_Form';
import {
  getCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} from '../services/cuentas_Bancarias_Service';

const initialForm = {
  nombre_cuenta: '',
  entidad_bancaria: '',
  descripcion: '',
  estado: true,
};

function CuentasBancariasPage() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  // Obtener cuentas
  const fetchCuentas = () => {
    getCuentas()
      .then(data => setCuentas(data))
      .catch(() => setCuentas([]));
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Crear o actualizar cuenta
  const handleSubmit = e => {
    e.preventDefault();
    const action = editId
      ? updateCuenta(editId, form)
      : createCuenta(form);

    action
      .then(() => {
        setForm(initialForm);
        setEditId(null);
        fetchCuentas();
      })
      .catch(() => alert('Error al guardar'));
  };

  // Editar cuenta
  const handleEdit = cuenta => {
    setForm({
      nombre_cuenta: cuenta.nombre_cuenta,
      entidad_bancaria: cuenta.entidad_bancaria,
      descripcion: cuenta.descripcion,
      estado: cuenta.estado
    });
    setEditId(cuenta.id_cuenta);
  };

  // Eliminar cuenta
  const handleDelete = id => {
    if (!window.confirm('¿Eliminar cuenta?')) return;
    deleteCuenta(id)
      .then(() => fetchCuentas())
      .catch(() => alert('Error al eliminar'));
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditId(null);
    setForm(initialForm);
  };

  return (
    <div>
      <h1>Cuentas Bancarias</h1>
      <CuentaBancariaForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editando={!!editId}
        onCancel={handleCancel}
      />
      <CuentaBancariaList
        cuentas={cuentas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default CuentasBancariasPage;