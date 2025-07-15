import React, { useState } from 'react';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://aplicacion-de-seguridad-v2.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena, id_modulo: 'CC' })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('usuario', JSON.stringify(data));
        window.location.href = '/';
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="card shadow p-4 mt-5">
              <div className="text-center mb-4">
                <img
                  src="/images/dinero2.jpg"
                  alt="Login"
                  style={{ width: 60, marginBottom: 10, opacity: 0.8 }}
                />
                <h2 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>Iniciar sesión</h2>
                <p className="text-muted mb-0">Accede a Cuentas por Cobrar</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={e => setContrasena(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ingresando...
                    </span>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </form>
              {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
              <div className="text-center text-muted mt-4" style={{ fontSize: 13 }}>
                <i className="bi bi-shield-lock me-1"></i>
                Seguridad garantizada &middot; <span style={{ color: '#007bff' }}>CxC App</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}