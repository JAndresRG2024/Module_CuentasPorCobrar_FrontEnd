import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CuentasBancariasPage from './pages/Cuentas_Bancarias/Cuentas_Bancarias_Page';
import PagosPage from './pages/Pagos/pagos_Page';

function App() {
  return (
    <Router>
       <nav>
        <ul>
          <li>
            <Link to="/cuentas-bancarias">Cuentas Bancarias</Link>
          </li>
          <li>
            <Link to="/pagos">Pagos</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/cuentas-bancarias/*" element={<CuentasBancariasPage />} />
        <Route path="/pagos/*" element={<PagosPage />} />
        <Route
          path="/"
          element={
            <div>
              <h1>Bienvenido</h1>
              <p>Selecciona una opción del menú.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;