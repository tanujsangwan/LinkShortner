import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const createLink = async (originalUrl, alias) => {
  const response = await api.post('/links', { originalUrl, alias });
  return response.data;
};

export const getLinks = async () => {
  const response = await api.get('/links');
  return response.data;
};

export const getAnalytics = async (alias) => {
  const response = await api.get(`/analytics/${alias}`);
  return response.data;
};

export const getQrUrl = (alias) => {
  return `${BASE_URL}/api/qr/${alias}`;
};

export const deleteLink = async (alias) => {
  const response = await api.delete(`/links/${alias}`);
  return response.data;
};

// Helper to build the public short URL
export const getShortUrl = (alias) => {
  return `${BASE_URL}/${alias}`;
};

export { BASE_URL };
