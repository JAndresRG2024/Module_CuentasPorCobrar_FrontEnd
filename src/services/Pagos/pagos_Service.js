import { fetchConToken } from '../../utils/fetchcontoken';
const API_URL_BASE =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const API_URL = `${API_URL_BASE}/pagos`;

export const getPagos = async () => {
  const res = await fetchConToken(API_URL);
  if (!res.ok) throw new Error('Error al obtener pagos');
  return res.json();
};

export const getPagoById = async (id) => {
  const res = await fetchConToken(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el pago');
  return res.json();
};

export const createPago = async (data) => {
  const res = await fetchConToken(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear pago');
  return res.json();
};

export const updatePago = async (id, data) => {
  const res = await fetchConToken(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return res.json();
};

export const deletePago = async (id) => {
  const res = await fetchConToken(`${API_URL}/${id}`, { method: 'DELETE' });
  if (res.status !== 200) throw new Error('Error al eliminar pago');
};

export const getPagoDetalle = async (id_detalle) => {
  const res = await fetchConToken(`${API_URL_BASE}/pagos-detalle/${id_detalle}`);
  if (!res.ok) throw new Error('Error al obtener el detalle de pago');
  return res.json();
};

export const createPagoDetalle = async (id_pago, data) => {
  // id_pago se envía en el body
  const res = await fetchConToken(`${API_URL_BASE}/pagos-detalle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, id_pago }),
  });
  if (!res.ok) throw new Error('Error al crear detalle de pago');
  return res.json();
};

export const updatePagoDetalle = async (id_detalle, data) => {
  const res = await fetchConToken(`${API_URL_BASE}/pagos-detalle/${id_detalle}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar detalle de pago');
  return res.json();
};

export const deletePagoDetalle = async (id_detalle) => {
  const res = await fetchConToken(`${API_URL_BASE}/pagos-detalle/${id_detalle}`, {
    method: 'DELETE',
  });
  if (res.status !== 200) throw new Error('Error al eliminar detalle de pago');
  return res.json();
};

export const getAllDetalles = async () => {
  const res = await fetchConToken(`${API_URL_BASE}/pagos-detalle`);
  if (!res.ok) throw new Error('Error al obtener detalles');
  return res.json();
};

export async function generarPDFPago(id_pago) {
  const res = await fetchConToken(`${API_URL}/${id_pago}/generar-pdf`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Error al generar PDF desde el servidor');

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `pago_${id_pago}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
  alert('✅ PDF generado y descargado correctamente');
}

export async function generarReportePagos() {
  const res = await fetchConToken(`${API_URL}/reporte/general`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al generar el reporte PDF desde service');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte_pagos.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove(); // Usa el mismo método que en generarPDFPago
  window.URL.revokeObjectURL(url);
  alert('✅ Reporte PDF generado y descargado correctamente');
}
