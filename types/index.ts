// Types for SurangaTours app

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  imageUrl: string;
  description?: string;
}

export interface Destination {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  destination?: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  imageUrl: string;
  rating?: number;
}