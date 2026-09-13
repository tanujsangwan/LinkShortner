import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
  return `http://localhost:8080/api/qr/${alias}`;
};

export const deleteLink = async (alias) => {
  const response = await api.delete(`/links/${alias}`);
  return response.data;
};
