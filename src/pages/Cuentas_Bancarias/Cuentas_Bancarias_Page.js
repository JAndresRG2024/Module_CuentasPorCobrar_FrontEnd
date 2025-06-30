import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CuentasListPage from './CuentasList_Page';
import NuevaCuentaPage from './NuevaCuenta_Page';
import EditarCuentaPage from './EditarCuenta_Page';

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