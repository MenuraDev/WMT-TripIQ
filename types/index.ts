// ============================================
// TripIQ - TypeScript Types (User Dashboard Focus)
// ============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'driver';
  createdAt: string;
}

export interface Trip {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  imageUrl: string;
  description: string;
  startDate?: string;
  endDate?: string;
  maxPeople?: number;
  status: 'available' | 'full' | 'cancelled';
  createdBy?: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  tripId: string;
  trip?: Trip; // populated
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  numberOfTravelers: number;
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  userName?: string;
  tripId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Destination {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  category: 'beach' | 'hill' | 'cultural' | 'wildlife' | 'city';
  rating: number;
  priceLevel: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any;
}
