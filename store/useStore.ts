import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import { 
  Property, 
  Agent, 
  Favorite, 
  Message, 
  Conversation, 
  Appointment,
  Review,
  SearchFilters,
  PropertyCategory 
} from '@/types';

interface StoreState {
  properties: Property[];
  featuredProperties: Property[];
  agents: Agent[];
  favorites: Favorite[];
  conversations: Conversation[];
  appointments: Appointment[];
  reviews: Review[];
  categories: PropertyCategory[];
  searchFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  
  fetchProperties: () => Promise<void>;
  fetchPropertyById: (id: string) => Promise<Property | undefined>;
  fetchAgentById: (id: string) => Promise<Agent | undefined>;
  searchProperties: (filters: SearchFilters) => Promise<Property[]>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  createAppointment: (agentId: string, propertyId: string, scheduledTime: Date) => Promise<void>;
  setSearchFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
}

const mockProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxurious Modern Villa',
    description: 'Stunning 4-bedroom villa with panoramic sea views, private pool, and landscaped gardens. Located in the prestigious Hydra neighborhood.',
    type: 'villa',
    price: 85000000,
    currency: 'DZD',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    address: '12 Rue des Jardins, Hydra',
    wilaya: 'Alger',
    commune: 'Hydra',
    latitude: 36.7538,
    longitude: 3.0588,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
    ],
    amenities: ['Pool', 'Garden', 'Parking', 'Security', 'Air Conditioning'],
    status: 'available',
    agentId: 'agent-001',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
    isVerified: true,
    views: 234,
  },
  {
    id: 'prop-002',
    title: 'Modern Apartment in Oran',
    description: 'Beautiful 3-bedroom apartment with modern finishes, located in the heart of Oran. Close to shopping centers and public transport.',
    type: 'apartment',
    price: 25000000,
    currency: 'DZD',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    address: '45 Boulevard Front de Mer',
    wilaya: 'Oran',
    commune: 'Oran Centre',
    latitude: 35.6969,
    longitude: -0.6331,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['Elevator', 'Parking', 'Air Conditioning', 'Balcony'],
    status: 'available',
    agentId: 'agent-002',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-11-10'),
    isVerified: true,
    views: 189,
  },
  {
    id: 'prop-003',
    title: 'Commercial Space - Prime Location',
    description: 'Prime commercial space in busy shopping area. Ideal for retail, office, or showroom. High foot traffic area.',
    type: 'commercial',
    price: 45000000,
    currency: 'DZD',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    address: '78 Rue Didouche Mourad',
    wilaya: 'Alger',
    commune: 'Alger Centre',
    latitude: 36.7658,
    longitude: 3.0510,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    ],
    amenities: ['Parking', 'Air Conditioning', 'Security', 'Storage'],
    status: 'available',
    agentId: 'agent-001',
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-11-05'),
    isVerified: true,
    views: 312,
  },
  {
    id: 'prop-004',
    title: 'Building Land in Tipaza',
    description: 'Large building plot with beautiful views, perfect for villa construction. All utilities available. Title deed ready.',
    type: 'land',
    price: 15000000,
    currency: 'DZD',
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    address: 'Zone Touristique Tipaza',
    wilaya: 'Tipaza',
    commune: 'Tipaza',
    latitude: 36.5928,
    longitude: 2.4475,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    ],
    amenities: [],
    status: 'available',
    agentId: 'agent-002',
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-10-25'),
    isVerified: false,
    views: 156,
  },
  {
    id: 'prop-005',
    title: 'Cozy F3 Apartment',
    description: 'Well-maintained F3 apartment in quiet residential area. Recently renovated kitchen and bathrooms.',
    type: 'apartment',
    price: 18000000,
    currency: 'DZD',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    address: '23 Cité des Annassers',
    wilaya: 'Alger',
    commune: 'Kouba',
    latitude: 36.7258,
    longitude: 3.0688,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    ],
    amenities: ['Parking', 'Balcony', 'Storage'],
    status: 'available',
    agentId: 'agent-001',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-12'),
    isVerified: true,
    views: 98,
  },
  {
    id: 'prop-006',
    title: 'Seafront Luxury Villa',
    description: 'Exceptional seafront property with direct beach access. Features infinity pool, guest house, and private dock.',
    type: 'villa',
    price: 150000000,
    currency: 'DZD',
    bedrooms: 5,
    bathrooms: 4,
    area: 500,
    address: 'Corniche Ouest',
    wilaya: 'Oran',
    commune: 'Aïn El Turck',
    latitude: 35.7456,
    longitude: -0.7698,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    ],
    amenities: ['Pool', 'Garden', 'Parking', 'Security', 'Air Conditioning', 'Furnished', 'Gym'],
    status: 'available',
    agentId: 'agent-002',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-08'),
    isVerified: true,
    views: 445,
  },
];

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    userId: 'user-agent-001',
    user: {
      id: 'user-agent-001',
      name: 'Amina Hadj',
      email: 'amina@darcom.dz',
      phone: '+213 555 789 012',
      role: 'agent',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Passionate about helping families find their perfect home',
      location: 'Alger',
      wilaya: 'Alger',
      createdAt: new Date('2023-01-15'),
    },
    license: 'AG-DZ-2023-001',
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 127,
    totalListings: 45,
    bio: '10+ years of experience in Algerian real estate market. Specialized in luxury properties and commercial real estate.',
    specializations: ['Luxury Villas', 'Commercial', 'Investment Properties'],
    responseTime: 'Usually responds within 1 hour',
    languages: ['Arabic', 'French', 'English'],
  },
  {
    id: 'agent-002',
    userId: 'user-agent-002',
    user: {
      id: 'user-agent-002',
      name: 'Yacine Boumediene',
      email: 'yacine@darcom.dz',
      phone: '+213 555 456 789',
      role: 'agent',
      profileImage: 'https://randomuser.me/api/portraits/men/52.jpg',
      bio: 'Expert in residential properties across Oran',
      location: 'Oran',
      wilaya: 'Oran',
      createdAt: new Date('2022-06-20'),
    },
    license: 'AG-DZ-2022-015',
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 89,
    totalListings: 32,
    bio: 'Specialized in residential properties in Oran and surrounding areas. First-time buyer friendly!',
    specializations: ['Apartments', 'First-time Buyers', 'Rentals'],
    responseTime: 'Usually responds within 2 hours',
    languages: ['Arabic', 'French'],
  },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participants: ['user-001', 'agent-001'],
    propertyId: 'prop-001',
    property: mockProperties[0],
    lastMessage: {
      id: 'msg-001',
      conversationId: 'conv-001',
      senderId: 'agent-001',
      receiverId: 'user-001',
      content: 'The property is still available! Would you like to schedule a visit?',
      timestamp: new Date('2024-11-15T14:30:00'),
      read: false,
    },
    unreadCount: 1,
    updatedAt: new Date('2024-11-15T14:30:00'),
    agent: mockAgents[0],
  },
  {
    id: 'conv-002',
    participants: ['user-001', 'agent-002'],
    propertyId: 'prop-002',
    property: mockProperties[1],
    lastMessage: {
      id: 'msg-002',
      conversationId: 'conv-002',
      senderId: 'user-001',
      receiverId: 'agent-002',
      content: 'What are the payment options available?',
      timestamp: new Date('2024-11-14T10:15:00'),
      read: true,
    },
    unreadCount: 0,
    updatedAt: new Date('2024-11-14T10:15:00'),
    agent: mockAgents[1],
  },
];

const mockReviews: Review[] = [
  {
    id: 'review-001',
    authorId: 'user-002',
    author: {
      id: 'user-002',
      name: 'Mohammed Kaci',
      email: 'mkaci@example.com',
      phone: '+213 555 111 222',
      role: 'buyer',
      profileImage: 'https://randomuser.me/api/portraits/men/28.jpg',
      createdAt: new Date('2024-01-10'),
    },
    agentId: 'agent-001',
    rating: 5,
    comment: 'Excellent service! Amina helped us find our dream home in just 2 weeks. Very professional and responsive.',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'review-002',
    authorId: 'user-003',
    author: {
      id: 'user-003',
      name: 'Fatima Zohra',
      email: 'fzohra@example.com',
      phone: '+213 555 333 444',
      role: 'buyer',
      profileImage: 'https://randomuser.me/api/portraits/women/35.jpg',
      createdAt: new Date('2024-02-15'),
    },
    agentId: 'agent-001',
    rating: 5,
    comment: 'Very knowledgeable about the Algiers market. Made the entire process smooth and stress-free.',
    createdAt: new Date('2024-09-15'),
  },
];

const categories: PropertyCategory[] = [
  { id: '1', name: 'Apartments', nameAr: 'شقق', nameFr: 'Appartements', icon: 'business', type: 'apartment' },
  { id: '2', name: 'Villas', nameAr: 'فيلات', nameFr: 'Villas', icon: 'home', type: 'villa' },
  { id: '3', name: 'Land', nameAr: 'أراضي', nameFr: 'Terrains', icon: 'map', type: 'land' },
  { id: '4', name: 'Commercial', nameAr: 'تجاري', nameFr: 'Commercial', icon: 'storefront', type: 'commercial' },
];

export const useStore = create<StoreState>((set, get) => ({
  properties: [],
  featuredProperties: [],
  agents: mockAgents,
  favorites: [],
  conversations: mockConversations,
  appointments: [],
  reviews: mockReviews,
  categories,
  searchFilters: {},
  isLoading: false,
  error: null,

  fetchProperties: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const featured = mockProperties.filter(p => p.isVerified && p.views > 150);
      set({ 
        properties: mockProperties, 
        featuredProperties: featured,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to load properties', isLoading: false });
    }
  },

  fetchPropertyById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const property = mockProperties.find(p => p.id === id);
      set({ isLoading: false });
      return property;
    } catch (error) {
      set({ error: 'Failed to load property', isLoading: false });
      return undefined;
    }
  },

  fetchAgentById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const agent = mockAgents.find(a => a.id === id);
      set({ isLoading: false });
      return agent;
    } catch (error) {
      set({ error: 'Failed to load agent', isLoading: false });
      return undefined;
    }
  },

  searchProperties: async (filters: SearchFilters) => {
    try {
      set({ isLoading: true, error: null, searchFilters: filters });
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let results = [...mockProperties];
      
      if (filters.query) {
        const q = filters.query.toLowerCase();
        results = results.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.wilaya.toLowerCase().includes(q)
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        results = results.filter(p => filters.type!.includes(p.type));
      }
      
      if (filters.minPrice) {
        results = results.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice) {
        results = results.filter(p => p.price <= filters.maxPrice!);
      }
      
      if (filters.minBedrooms) {
        results = results.filter(p => p.bedrooms >= filters.minBedrooms!);
      }
      
      if (filters.wilaya) {
        results = results.filter(p => p.wilaya === filters.wilaya);
      }
      
      set({ isLoading: false });
      return results;
    } catch (error) {
      set({ error: 'Search failed', isLoading: false });
      return [];
    }
  },

  toggleFavorite: async (propertyId: string) => {
    try {
      const { favorites } = get();
      const existingIndex = favorites.findIndex(f => f.propertyId === propertyId);
      
      if (existingIndex >= 0) {
        const newFavorites = favorites.filter((_, i) => i !== existingIndex);
        set({ favorites: newFavorites });
      } else {
        const property = mockProperties.find(p => p.id === propertyId);
        const newFavorite: Favorite = {
          id: Crypto.randomUUID(),
          userId: 'user-001',
          propertyId,
          property,
          createdAt: new Date(),
        };
        set({ favorites: [...favorites, newFavorite] });
      }
    } catch (error) {
      set({ error: 'Failed to update favorites' });
    }
  },

  isFavorite: (propertyId: string) => {
    return get().favorites.some(f => f.propertyId === propertyId);
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      const { conversations } = get();
      const newMessage: Message = {
        id: Crypto.randomUUID(),
        conversationId,
        senderId: 'user-001',
        receiverId: 'agent-001',
        content,
        timestamp: new Date(),
        read: false,
      };
      
      const updatedConversations = conversations.map(c => {
        if (c.id === conversationId) {
          return { ...c, lastMessage: newMessage, updatedAt: new Date() };
        }
        return c;
      });
      
      set({ conversations: updatedConversations });
    } catch (error) {
      set({ error: 'Failed to send message' });
    }
  },

  createAppointment: async (agentId: string, propertyId: string, scheduledTime: Date) => {
    try {
      set({ isLoading: true });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const property = mockProperties.find(p => p.id === propertyId);
      const newAppointment: Appointment = {
        id: Crypto.randomUUID(),
        buyerId: 'user-001',
        agentId,
        propertyId,
        property,
        scheduledTime,
        status: 'pending',
      };
      
      set(state => ({ 
        appointments: [...state.appointments, newAppointment],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create appointment', isLoading: false });
    }
  },

  setSearchFilters: (filters: SearchFilters) => {
    set({ searchFilters: filters });
  },

  clearFilters: () => {
    set({ searchFilters: {} });
  },
}));