import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Instance axios avec URL de base
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur : ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// Véhicules
export const getVehicles = () => api.get('/vehicles');
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// Positions
export const addPosition = (data) => api.post('/positions', data);
export const getAllLastPositions = () => api.get('/positions/all/last');
export const getPositionHistory = (vehicleId) =>
  api.get(`/positions/${vehicleId}/history`);
export const getVehiclesInRadius = (lat, lng, radius) =>
  api.get(`/positions/search/radius?latitude=${lat}&longitude=${lng}&radius=${radius}`);
export const getNearestVehicle = (lat, lng) =>
  api.get(`/positions/search/nearest?latitude=${lat}&longitude=${lng}`);

export default api;