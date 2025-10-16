import { API_CONFIG } from '../config/config.js';

const withBaseUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

export const login = async ({ usuario, password }) => {
  const response = await fetch(withBaseUrl(API_CONFIG.ENDPOINTS.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ usuario, password })
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
};

export const syncFichas = async (fichas = []) => {
  const response = await fetch(withBaseUrl(API_CONFIG.ENDPOINTS.SYNC), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fichas })
  });

  if (!response.ok) {
    throw new Error('No se pudo sincronizar');
  }

  return response.json();
};

export const fetchFichas = async () => {
  const response = await fetch(withBaseUrl(API_CONFIG.ENDPOINTS.FICHAS));
  if (!response.ok) {
    throw new Error('No se pudo obtener la información de fichas');
  }
  return response.json();
};
