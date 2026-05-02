import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // ← Your current IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH APIs ====================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};

// ==================== USER APIs ====================
export const userAPI = {
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data.user;
  },

  deleteAccount: async () => {
    await api.delete('/users/profile');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
};

// ==================== BOOKING APIs ====================
export const bookingAPI = {
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data.bookings;
  },

  createBooking: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data.booking;
  },

  updateBooking: async (id: string, data: any) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data.booking;
  },

  deleteBooking: async (id: string) => {
    await api.delete(`/bookings/${id}`);
  },

  cancelBooking: async (id: string) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data.booking;
  },
};

export default api;