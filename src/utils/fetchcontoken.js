export const fetchConToken = async (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem('usuario'))?.token;
  console.log('🔐 Token utilizado:', token || 'No hay token disponible');
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, { ...options, headers });
};
