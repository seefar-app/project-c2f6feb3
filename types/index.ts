export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'agent';
  profileImage?: string;
  bio?: string;
  location?: string;
  wilaya?: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'villa' | 'land' | 'commercial';
  price: number;
  currency: 'DZD';
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  wilaya: string;
  commune: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  status: 'available' | 'sold' | 'rented' | 'pending';
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  views: number;
}

export interface Agent {
  id: string;
  userId: string;
  user?: User;
  license?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  reviewCount: number;
  totalListings: number;
  bio?: string;
  specializations: string[];
  responseTime?: string;
  languages: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  propertyId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  property?: Property;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  agent?: Agent;
}

export interface Appointment {
  id: string;
  buyerId: string;
  agentId: string;
  propertyId: string;
  property?: Property;
  scheduledTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Review {
  id: string;
  authorId: string;
  author?: User;
  agentId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SavedSearch {
  id: string;
  userId: string;
  filters: SearchFilters;
  name: string;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  type?: Property['type'][];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minArea?: number;
  maxArea?: number;
  wilaya?: string;
  commune?: string;
  amenities?: string[];
}

export type PropertyCategory = {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  type: Property['type'];
};

export const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 
  'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'El Oued', 'Skikda',
  'Tiaret', 'Béjaïa', 'Tlemcen', 'Ouargla', 'Mostaganem', 'Bordj Bou Arréridj'
];

export const AMENITIES = [
  'Parking', 'Garden', 'Pool', 'Elevator', 'Security', 'Air Conditioning',
  'Heating', 'Furnished', 'Balcony', 'Terrace', 'Storage', 'Gym'
];