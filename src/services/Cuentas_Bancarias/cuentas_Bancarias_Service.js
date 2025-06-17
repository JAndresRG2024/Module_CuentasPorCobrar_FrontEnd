const API_URL_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const API_URL = `${API_URL_BASE}/cuentas`;

export const getCuentas = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener cuentas');
  return res.json();
};

export const createCuenta = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear cuenta');
  return res.json();
};

export const updateCuenta = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar cuenta');
  return res.json();
};

export const deleteCuenta = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.status !== 204) throw new Error('Error al eliminar cuenta');
};