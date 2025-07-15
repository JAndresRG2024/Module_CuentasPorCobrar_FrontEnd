import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (process.env.NODE_ENV === 'development') {
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMiwidXN1YXJpbyI6InBhYmxpbjcxNyIsIm5vbWJyZSI6IlBhYmxvIEppbWVuZXoiLCJub21icmVfcm9sIjoiQ29icmFkb3IiLCJpYXQiOjE3NTI2MDY3MTUsImV4cCI6MTc1MjYxMzkxNX0.rrLfZceZc9peVwpj3tHYbY4RMtxBAAwNdVtyOZ_pUpQ';
  const port = process.env.PORT || 3000;
  console.log('\n🔗 Prueba rápida con token:');
  console.log(`  http://localhost:${port}?token=${testToken}\n`);
}