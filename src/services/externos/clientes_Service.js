import { fetchConToken } from '../../utils/fetchcontoken';
const API_URL_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getClientes = async () => {
  const res = await fetchConToken(`${API_URL_BASE}/clientes`);
  if (!res.ok) throw new Error('Error al obtener clientes');
  return res.json();
};