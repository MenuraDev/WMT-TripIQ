import { Booking, DriverProfile, DriverStats, Review } from '@/types';

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

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
    return this.request<Booking[]>(`/api/bookings/driver/${driverId}`);
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking> {
    return this.request<Booking>(`/api/bookings/status`, {
      method: 'PUT',
      body: JSON.stringify({ bookingId, status }),
    });
  }

  // Get driver stats
  async getDriverStats(driverId: string): Promise<DriverStats> {
    return this.request<DriverStats>(`/api/drivers/${driverId}/stats`);
  }

  // Update driver availability
  async updateDriverAvailability(driverId: string, available: boolean): Promise<void> {
    return this.request<void>(`/api/drivers/${driverId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ available }),
    });
  }

  // Get driver profile
  async getDriverProfile(driverId: string): Promise<DriverProfile> {
    return this.request<DriverProfile>(`/api/drivers/${driverId}`);
  }

  // Get driver reviews
  async getDriverReviews(driverId: string): Promise<Review[]> {
    return this.request<Review[]>(`/api/reviews/driver/${driverId}`);
  }

  // Update driver profile
  async updateDriverProfile(driverId: string, profile: Partial<DriverProfile>): Promise<DriverProfile> {
    return this.request<DriverProfile>(`/api/drivers/${driverId}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }
}

export const apiService = new ApiService();