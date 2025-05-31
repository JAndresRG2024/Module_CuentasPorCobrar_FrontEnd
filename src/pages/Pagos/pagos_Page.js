import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PagosListPage from './PagosList_Page';
import NuevoPagoPage from './NuevoPago_Page';
import EditarPagoPage from './EditarPago_Page';

function PagosPage() {
  return (
    <Routes>
      <Route path="/" element={<PagosListPage />} />
      <Route path="nuevo" element={<NuevoPagoPage />} />
      <Route path="editar/:id" element={<EditarPagoPage />} />
    </Routes>
  );
}

export default PagosPage;