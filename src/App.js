import React, { useEffect, useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/saludo')
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(() => setMensaje('Error al conectar con la API'));
  }, []);

  return (
    <div className="App">
      <h1>Prueba de conexión con la API</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;