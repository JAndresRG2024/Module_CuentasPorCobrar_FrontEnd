const API_URL_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getClientesDeudores = async () => {
  const res = await fetch(`${API_URL_BASE}/clientes/deudores`);
  if (!res.ok) throw new Error('Error al obtener clientes deudores');
  return res.json();
};
