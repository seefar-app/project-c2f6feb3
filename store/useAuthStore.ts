import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: User['role'];
    bio?: string;
    location?: string;
    wilaya?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const mapDatabaseUserToUser = (dbUser: any): User => ({
  id: dbUser.id,
  name: dbUser.name || '',
  email: dbUser.email || '',
  phone: dbUser.phone || '',
  role: dbUser.role || 'buyer',
  profileImage: dbUser.profileImage || '',
  bio: dbUser.bio || '',
  location: dbUser.location || '',
  wilaya: dbUser.wilaya || '',
  createdAt: dbUser.created_at ? new Date(dbUser.created_at) : new Date(),
});

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, authError: null });

      if (!email || !password) {
        set({
          authError: 'Please fill in all required fields.',
          isLoading: false,
        });
        return false;
      }

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        let friendlyMessage = 'Incorrect email or password. Please try again.';
        if (authError.message.includes('Invalid login credentials')) {
          friendlyMessage = 'Incorrect email or password. Please try again.';
        } else if (authError.message.includes('Email not confirmed')) {
          friendlyMessage = 'Please verify your email before logging in.';
        }
        set({ authError: friendlyMessage, isLoading: false });
        return false;
      }

      if (!authData.user) {
        set({
          authError: 'Login failed. Please try again.',
          isLoading: false,
        });
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        set({
          authError: 'Failed to load user profile. Please try again.',
          isLoading: false,
        });
        return false;
      }

      const user = mapDatabaseUserToUser(profile);
      set({ user, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    } catch (error: any) {
      set({
        authError: 'Login failed. Please try again.',
        isLoading: false,
      });
      return false;
    }
  },

  signup: async (data) => {
    try {
      set({ isLoading: true, authError: null });

      if (!data.email || !data.password || !data.name) {
        set({
          authError: 'Please fill in all required fields.',
          isLoading: false,
        });
        return false;
      }

      if (data.password.length < 6) {
        set({
          authError: 'Password must be at least 6 characters.',
          isLoading: false,
        });
        return false;
      }

      const { data: authData, error: signupError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
              phone: data.phone || '',
              role: data.role,
              bio: data.bio || '',
              location: data.location || '',
              wilaya: data.wilaya || '',
            },
          },
        });

      if (signupError) {
        let friendlyMessage = 'Signup failed. Please try again.';
        if (
          signupError.message.includes('already registered') ||
          signupError.message.includes('User already exists')
        ) {
          friendlyMessage =
            'An account with this email already exists.';
        } else if (signupError.message.includes('Password')) {
          friendlyMessage = 'Password does not meet requirements.';
        }
        set({ authError: friendlyMessage, isLoading: false });
        return false;
      }

      if (!authData.user) {
        set({
          authError: 'Signup failed. Please try again.',
          isLoading: false,
        });
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        set({
          authError: 'Failed to load user profile. Please try again.',
          isLoading: false,
        });
        return false;
      }

      const user = mapDatabaseUserToUser(profile);
      set({ user, isAuthenticated: true, isLoading: false, authError: null });
      return true;
    } catch (error: any) {
      set({
        authError: 'Signup failed. Please try again.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: null,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (profileError || !profile) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      const user = mapDatabaseUserToUser(profile);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ isLoading: true });

      const updatePayload: any = {};
      if (updates.name !== undefined) updatePayload.name = updates.name;
      if (updates.phone !== undefined) updatePayload.phone = updates.phone;
      if (updates.bio !== undefined) updatePayload.bio = updates.bio;
      if (updates.location !== undefined)
        updatePayload.location = updates.location;
      if (updates.wilaya !== undefined) updatePayload.wilaya = updates.wilaya;
      if (updates.profileImage !== undefined)
        updatePayload.profileImage = updates.profileImage;

      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError || !updatedProfile) {
        set({ isLoading: false });
        return;
      }

      const updatedUser = mapDatabaseUserToUser(updatedProfile);
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ authError: null }),
}));