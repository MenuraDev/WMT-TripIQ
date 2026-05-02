// ============================================
// TripIQ - Driver Authentication Context
// ============================================

import { driverAuthAPI } from '@/services/driverAuthAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Extending base user type or creating a driver specific one based on the backend model
interface DriverUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  role: string;
  available: boolean;
}

interface DriverAuthContextType {
  driver: DriverUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, licenseNumber: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshDriver: () => Promise<void>;
}

const DriverAuthContext = createContext<DriverAuthContextType | undefined>(undefined);

export function DriverAuthProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<DriverUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load driver from storage on app start
  useEffect(() => {
    loadStoredDriver();
  }, []);

  const loadStoredDriver = async () => {
    try {
      const storedDriver = await AsyncStorage.getItem('driver');
      const token = await AsyncStorage.getItem('driverToken');

      if (storedDriver && token) {
        setDriver(JSON.parse(storedDriver));
      }
    } catch (error) {
      console.error('Error loading stored driver:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await driverAuthAPI.login(email, password);
      setDriver(response.driver);
      await AsyncStorage.setItem('driver', JSON.stringify(response.driver));
      await AsyncStorage.setItem('driverToken', response.token);
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, licenseNumber: string, phone?: string) => {
    try {
      const response = await driverAuthAPI.register({ name, email, password, licenseNumber, phone });
      setDriver(response.driver);
      await AsyncStorage.setItem('driver', JSON.stringify(response.driver));
      await AsyncStorage.setItem('driverToken', response.token);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    setDriver(null);
    await AsyncStorage.removeItem('driver');
    await AsyncStorage.removeItem('driverToken');
  };

  const refreshDriver = async () => {
    try {
      const token = await AsyncStorage.getItem('driverToken');
      if (!token) return;
      const response = await driverAuthAPI.getCurrentDriver(token);
      setDriver(response.driver);
      await AsyncStorage.setItem('driver', JSON.stringify(response.driver));
    } catch (error) {
      console.error('Error refreshing driver:', error);
    }
  };

  const value: DriverAuthContextType = {
    driver,
    isLoading,
    isAuthenticated: !!driver,
    login,
    register,
    logout,
    refreshDriver,
  };

  return <DriverAuthContext.Provider value={value}>{children}</DriverAuthContext.Provider>;
}

export function useDriverAuth() {
  const context = useContext(DriverAuthContext);
  if (context === undefined) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return context;
}
