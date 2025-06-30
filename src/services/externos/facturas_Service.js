const API_URL_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getFacturasPorCliente = async (id_cliente) => {
  const res = await fetch(`${API_URL_BASE}/facturas/cliente/${id_cliente}`);
  if (!res.ok) throw new Error('Error al obtener facturas');
  return res.json();
};