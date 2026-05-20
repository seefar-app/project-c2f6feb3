import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
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

const mapDatabasePropertyToProperty = (dbProperty: any): Property => ({
  id: dbProperty.id,
  title: dbProperty.title,
  description: dbProperty.description,
  type: dbProperty.type,
  price: Number(dbProperty.price),
  currency: dbProperty.currency,
  bedrooms: dbProperty.bedrooms,
  bathrooms: dbProperty.bathrooms,
  area: Number(dbProperty.area),
  address: dbProperty.address,
  wilaya: dbProperty.wilaya,
  commune: dbProperty.commune,
  latitude: Number(dbProperty.latitude),
  longitude: Number(dbProperty.longitude),
  images: dbProperty.images || [],
  amenities: dbProperty.amenities || [],
  status: dbProperty.status,
  agentId: dbProperty.agentId,
  createdAt: new Date(dbProperty.created_at),
  updatedAt: new Date(dbProperty.updated_at),
  isVerified: dbProperty.isVerified,
  views: dbProperty.views,
});

const mapDatabaseAgentToAgent = (dbAgent: any, user: any): Agent => ({
  id: dbAgent.id,
  userId: dbAgent.userId,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    location: user.location,
    wilaya: user.wilaya,
    createdAt: new Date(user.created_at),
  },
  license: dbAgent.license,
  verificationStatus: dbAgent.verificationStatus,
  rating: Number(dbAgent.rating),
  reviewCount: dbAgent.reviewCount,
  totalListings: dbAgent.totalListings,
  bio: dbAgent.bio,
  specializations: dbAgent.specializations || [],
  responseTime: dbAgent.responseTime,
  languages: dbAgent.languages || [],
});

const mapDatabaseCategoryToCategory = (dbCategory: any): PropertyCategory => ({
  id: dbCategory.id,
  name: dbCategory.name,
  nameAr: dbCategory.nameAr,
  nameFr: dbCategory.nameFr,
  icon: dbCategory.icon,
  type: dbCategory.type,
});

export const useStore = create<StoreState>((set, get) => ({
  properties: [],
  featuredProperties: [],
  agents: [],
  favorites: [],
  conversations: [],
  appointments: [],
  reviews: [],
  categories: [],
  searchFilters: {},
  isLoading: false,
  error: null,

  fetchProperties: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');
      
      if (propertiesError) throw propertiesError;
      
      const properties = (propertiesData || []).map(mapDatabasePropertyToProperty);
      const featured = properties.filter(p => p.isVerified && p.views > 150);
      
      set({ 
        properties, 
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
      
      const { data: propertyData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const property = mapDatabasePropertyToProperty(propertyData);
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
      
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (agentError) throw agentError;
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', agentData.userId)
        .single();
      
      if (userError) throw userError;
      
      const agent = mapDatabaseAgentToAgent(agentData, userData);
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
      
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');
      
      if (filters.query) {
        const q = filters.query.toLowerCase();
        query = query.or(
          `title.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%,wilaya.ilike.%${q}%`
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        query = query.in('type', filters.type);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters.minBedrooms) {
        query = query.gte('bedrooms', filters.minBedrooms);
      }
      
      if (filters.wilaya) {
        query = query.eq('wilaya', filters.wilaya);
      }
      
      const { data: resultsData, error } = await query;
      
      if (error) throw error;
      
      const results = (resultsData || []).map(mapDatabasePropertyToProperty);
      set({ isLoading: false });
      return results;
    } catch (error) {
      set({ error: 'Search failed', isLoading: false });
      return [];
    }
  },

  toggleFavorite: async (propertyId: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        set({ error: 'User not authenticated' });
        return;
      }
      
      const { favorites } = get();
      const existingFavorite = favorites.find(f => f.propertyId === propertyId);
      
      if (existingFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id);
        
        if (error) throw error;
        
        set({ favorites: favorites.filter(f => f.id !== existingFavorite.id) });
      } else {
        const { data: propertyData } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();
        
        const { data: newFavoriteData, error } = await supabase
          .from('favorites')
          .insert([{ userId, propertyId }])
          .select()
          .single();
        
        if (error) throw error;
        
        const newFavorite: Favorite = {
          id: newFavoriteData.id,
          userId: newFavoriteData.userId,
          propertyId: newFavoriteData.propertyId,
          property: propertyData ? mapDatabasePropertyToProperty(propertyData) : undefined,
          createdAt: new Date(newFavoriteData.created_at),
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
      const { data: sessionData } = await supabase.auth.getSession();
      const senderId = sessionData?.session?.user?.id;
      
      if (!senderId) {
        set({ error: 'User not authenticated' });
        return;
      }
      
      const { data: conversationData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (convError) throw convError;
      
      const receiverId = conversationData.participants.find((p: string) => p !== senderId);
      
      if (!receiverId) {
        set({ error: 'Invalid conversation' });
        return;
      }
      
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert([{
          conversationId,
          senderId,
          receiverId,
          content,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const { conversations } = get();
      const updatedConversations = conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              id: messageData.id,
              conversationId: messageData.conversationId,
              senderId: messageData.senderId,
              receiverId: messageData.receiverId,
              content: messageData.content,
              timestamp: new Date(messageData.timestamp),
              read: messageData.read,
            },
            updatedAt: new Date(messageData.timestamp),
          };
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
      set({ isLoading: true, error: null });
      
      const { data: sessionData } = await supabase.auth.getSession();
      const buyerId = sessionData?.session?.user?.id;
      
      if (!buyerId) {
        set({ error: 'User not authenticated', isLoading: false });
        return;
      }
      
      const { data: propertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .insert([{
          buyerId,
          agentId,
          propertyId,
          scheduledTime: scheduledTime.toISOString(),
          status: 'pending',
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const newAppointment: Appointment = {
        id: appointmentData.id,
        buyerId: appointmentData.buyerId,
        agentId: appointmentData.agentId,
        propertyId: appointmentData.propertyId,
        property: propertyData ? mapDatabasePropertyToProperty(propertyData) : undefined,
        scheduledTime: new Date(appointmentData.scheduledTime),
        status: appointmentData.status,
        notes: appointmentData.notes,
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