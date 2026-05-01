// services/api.ts
import { Booking, Trip, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://172.20.10.4:5000/api'; // ← CHANGE TO YOUR PC IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
};

// ==================== USER APIs ====================
export const userAPI = {
  getProfile: async (): Promise<User> => (await api.get('/users/profile')).data.user,
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/users/profile', data);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  },
  deleteAccount: async () => api.delete('/users/profile'),
};

// ==================== TRIP APIs ====================
export const tripAPI = {
  getAllTrips: async (): Promise<Trip[]> => (await api.get('/trips')).data.trips,
  getTripById: async (id: string): Promise<Trip> => (await api.get(`/trips/${id}`)).data.trip,
};

// ==================== BOOKING APIs ====================
export const bookingAPI = {
  getMyBookings: async (): Promise<Booking[]> => (await api.get('/bookings/my')).data.bookings,
  createBooking: async (data: { tripId: string; numberOfTravelers: number }) =>
    (await api.post('/bookings', data)).data.booking,
  cancelBooking: async (id: string) => (await api.patch(`/bookings/${id}/cancel`)).data.booking,
};

export default api;