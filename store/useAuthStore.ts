import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: User['role']) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Karim Benali',
    email: 'karim@example.com',
    phone: '+213 555 123 456',
    role: 'buyer',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Looking for my dream home in Algiers',
    location: 'Alger',
    wilaya: 'Alger',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'agent-001',
    name: 'Amina Hadj',
    email: 'amina@example.com',
    phone: '+213 555 789 012',
    role: 'agent',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Professional real estate agent with 10+ years experience',
    location: 'Oran',
    wilaya: 'Oran',
    createdAt: new Date('2023-06-20'),
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, authError: null });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        set({ authError: 'Invalid email or password. Try: karim@example.com', isLoading: false });
        return false;
      }
      
      if (password.length < 4) {
        set({ authError: 'Password must be at least 4 characters', isLoading: false });
        return false;
      }
      
      set({ user, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    } catch (error) {
      set({ authError: 'Login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  signup: async (name: string, email: string, password: string, role: User['role']) => {
    try {
      set({ isLoading: true, authError: null });
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        set({ authError: 'An account with this email already exists', isLoading: false });
        return false;
      }
      
      if (password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      const newUser: User = {
        id: Crypto.randomUUID(),
        name,
        email,
        phone: '',
        role,
        createdAt: new Date(),
      };
      
      mockUsers.push(newUser);
      set({ user: newUser, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    } catch (error) {
      set({ authError: 'Signup failed. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ user: null, isAuthenticated: false, isLoading: false, authError: null });
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...updates };
    set({ user: updatedUser, isLoading: false });
  },

  clearError: () => set({ authError: null }),
}));