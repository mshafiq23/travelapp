export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  longDescription: string;
  coverImage: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  tags: string[];
  lat: number;
  lng: number;
  costScore: number; // 1-5
  attractions: { name: string; rating: number; category: string; description: string }[];
}

export interface TourPackage {
  id: string;
  destinationId: string;
  name: string;
  durationDays: number;
  description: string;
  price: number;
  features: string[];
  inclusions: string[];
  rating: number;
  difficulty: 'easy' | 'moderate' | 'demanding';
  maxGroupSize: number;
  image: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  coverImage: string;
  rooms: { type: string; price: number; available: boolean }[];
  lat: number;
  lng: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  classType: 'economy' | 'business' | 'first';
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  itemType: 'tour' | 'hotel' | 'flight' | 'custom_itinerary';
  itemId: string;
  itemName: string;
  startDate: string;
  endDate: string;
  guestsCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  sheetsUrl?: string;
  docsUrl?: string;
  emailSent?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  googleToken?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  diningRecommend: string;
  tips: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  country: string;
  interests: string[];
  budget: string;
  groupSize: number;
  duration: number;
  overview: string;
  dailySchedule: ItineraryDay[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  destinationName: string;
}
