import { Booking, DriverProfile, DriverStats, Review } from '@/types';

const HOST = '192.168.1.60'; // Explicitly using computer's local IP address
const API_BASE_URL = `http://${HOST}:5000`;

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get driver bookings
  async getDriverBookings(driverId: string): Promise<Booking[]> {
    return [
      {
        id: 'b1', customerId: 'c1', pickupLocation: 'Colombo', destination: 'Kandy', 
        date: '2026-05-02', price: 50, status: 'pending'
      }
    ];
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return {
        id: bookingId, customerId: 'c1', pickupLocation: 'Colombo', destination: 'Kandy', 
        date: '2026-05-02', price: 50, status
    };
  }

  // Get driver stats
  async getDriverStats(driverId: string): Promise<DriverStats> {
    return { totalAssigned: 10, pendingRequests: 2, completedTrips: 8 };
  }

  // Update driver availability
  async updateDriverAvailability(driverId: string, available: boolean): Promise<void> {
    return Promise.resolve();
  }

  // Get driver profile
  async getDriverProfile(driverId: string): Promise<DriverProfile> {
    return {
      id: driverId, name: 'Sample Driver', phone: '1234567890', 
      available: true, vehicleModel: 'Toyota Prius', vehiclePlate: 'ABC-1234'
    };
  }

  // Get driver reviews
  async getDriverReviews(driverId: string): Promise<Review[]> {
    return [];
  }

  // Update driver profile
  async updateDriverProfile(driverId: string, profile: Partial<DriverProfile>): Promise<DriverProfile> {
    return {
      id: driverId, name: profile.name || 'Sample Driver', phone: profile.phone || '1234567890', 
      available: profile.available ?? true, vehicleModel: 'Toyota Prius', vehiclePlate: 'ABC-1234'
    };
  }
}

export const apiService = new ApiService();