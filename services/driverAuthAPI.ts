import { Platform } from 'react-native';

// Explicitly using your computer's local IP address (192.168.1.60) so that your
// phone (via Expo Go) can connect to the backend server running on your computer.
const HOST = '192.168.1.60';
const API_BASE_URL = `http://${HOST}:5000/api/driver-auth`;

export const driverAuthAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  register: async (data: { name: string; email: string; password: string; phone?: string; licenseNumber: string }) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  getCurrentDriver: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current driver');
    }

    return response.json();
  },
};
