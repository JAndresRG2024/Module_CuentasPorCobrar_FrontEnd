import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CuentasBancariasPage from './pages/Cuentas_Bancarias/Cuentas_Bancarias_Page';
import PagosPage from './pages/Pagos/pagos_Page';
import Navbar from './components/Navbar';
import ReporteEstadoCuenta from './pages/Reportes/reporte_page';
import Welcome from './pages/Layouts/Welcome';
import { PrivateRoute } from './components/PrivateRoute';
import { useAuthInit } from './hooks/useAuthInit';
import Login from './pages/Login';

function App() {
  useAuthInit();
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/cuentas-bancarias/*"
            element={
              <PrivateRoute roles={['Admin', 'Admin CC']}>
                <CuentasBancariasPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pagos/*"
            element={
              <PrivateRoute permisos={['Pagos']}>
                <PagosPage />
              </PrivateRoute>
            }
          />
           <Route
            path="/reportes"
            element={
              <ReporteEstadoCuenta />
            }/>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;