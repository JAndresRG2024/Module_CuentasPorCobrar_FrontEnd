const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://module-cuentasporcobrar-api.onrender.com/api/pagos'
    : 'http://localhost:3000/api/pagos';

export const getPagos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener pagos');
  return res.json();
};

export const getPagoById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el pago');
  return res.json();
};

export const createPago = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear pago');
  return res.json();
};

export const updatePago = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return res.json();
};

export const deletePago = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.status !== 200) throw new Error('Error al eliminar pago');
};

export const getPagoDetalle = async (id_pago, id_detalle) => {
  const res = await fetch(`${API_URL}/${id_pago}/detalles/${id_detalle}`);
  if (!res.ok) throw new Error('Error al obtener el detalle de pago');
  return res.json();
};

export const createPagoDetalle = async (id_pago, data) => {
  const res = await fetch(`${API_URL}/${id_pago}/detalles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear detalle de pago');
  return res.json();
};

export const updatePagoDetalle = async (id_pago, id_detalle, data) => {
  const res = await fetch(`${API_URL}/${id_pago}/detalles/${id_detalle}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar detalle de pago');
  return res.json();
};

export const deletePagoDetalle = async (id_pago, id_detalle) => {
  const res = await fetch(`${API_URL}/${id_pago}/detalles/${id_detalle}`, {
    method: 'DELETE',
  });
  if (res.status !== 200) throw new Error('Error al eliminar detalle de pago');
  return res.json();
};