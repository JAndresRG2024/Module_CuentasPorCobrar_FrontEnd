import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CuentasBancariasPage from './pages/Cuentas_Bancarias/Cuentas_Bancarias_Page';
import PagosPage from './pages/Pagos/pagos_Page';
import Navbar from './components/Navbar'; // ✅ Importamos el nuevo componente
import Welcome from './pages/Layouts/Welcome';

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar global visible en todas las páginas */}

      <div className="container mt-4">
        <Routes>
          <Route path="/cuentas-bancarias/*" element={<CuentasBancariasPage />} />
          <Route path="/pagos/*" element={<PagosPage />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;