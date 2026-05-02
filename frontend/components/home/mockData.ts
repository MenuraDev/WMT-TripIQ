import { Itinerary, Destination, Review, ServiceCard } from '@/types';

export const featuredItineraries: Itinerary[] = [
  {
    id: '1',
    title: 'Cultural Triangle Adventure',
    destination: 'Sigiriya, Polonnaruwa, Anuradhapura',
    duration: '3 Days / 2 Nights',
    price: 45000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=800',
    description: 'Explore ancient cities and UNESCO World Heritage sites',
  },
  {
    id: '2',
    title: 'Hill Country Escape',
    destination: 'Kandy, Nuwara Eliya, Ella',
    duration: '4 Days / 3 Nights',
    price: 55000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1589139269744-d90188a33e60?w=800',
    description: 'Experience cool climate, tea plantations and scenic train rides',
  },
  {
    id: '3',
    title: 'Tropical Beach Paradise',
    destination: 'Mirissa, Unawatuna, Galle',
    duration: '3 Days / 2 Nights',
    price: 38000,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=800',
    description: 'Relax on pristine beaches and enjoy water sports',
  },
  {
    id: '4',
    title: 'Wildlife Safari Experience',
    destination: 'Yala National Park',
    duration: '2 Days / 1 Night',
    price: 32000,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=800',
    description: 'Spot leopards, elephants and exotic birds',
  },
];

export const popularDestinations: Destination[] = [
  {
    id: '1',
    name: 'Sigiriya',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=400',
    description: 'Ancient rock fortress',
  },
  {
    id: '2',
    name: 'Kandy',
    imageUrl: 'https://images.unsplash.com/photo-1589139269744-d90188a33e60?w=400',
    description: 'Cultural capital',
  },
  {
    id: '3',
    name: 'Ella',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=400',
    description: 'Mountain paradise',
  },
  {
    id: '4',
    name: 'Galle',
    imageUrl: 'https://images.unsplash.com/photo-1589139269744-d90188a33e60?w=400',
    description: 'Historic fort city',
  },
  {
    id: '5',
    name: 'Mirissa',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f0d?w=400',
    description: 'Beach haven',
  },
  {
    id: '6',
    name: 'Nuwara Eliya',
    imageUrl: 'https://images.unsplash.com/photo-1589139269744-d90188a33e60?w=400',
    description: 'Little England',
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing experience! The itinerary was perfectly planned and our driver was very professional.',
    date: '2 weeks ago',
    destination: 'Cultural Triangle',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    rating: 5,
    comment: 'Best trip ever! SurangaTours made our Sri Lanka vacation unforgettable.',
    date: '1 month ago',
    destination: 'Hill Country',
  },
  {
    id: '3',
    userName: 'Emma Williams',
    rating: 4,
    comment: 'Great service and beautiful destinations. Highly recommend for first-time visitors.',
    date: '3 weeks ago',
    destination: 'Beach Tour',
  },
];

export const serviceCards: ServiceCard[] = [
  {
    id: '1',
    title: 'Plan Your Trip',
    icon: 'map',
    description: 'Choose from curated itineraries',
  },
  {
    id: '2',
    title: 'Book Vehicle',
    icon: 'car',
    description: 'Comfortable rides with local drivers',
  },
  {
    id: '3',
    title: 'Read Reviews',
    icon: 'star',
    description: 'See what travelers say',
  },
];