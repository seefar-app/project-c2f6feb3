import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://jlupgripsfplcotphhag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdXBncmlwc2ZwbGNvdHBoaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDkxNjgsImV4cCI6MjA5NDgyNTE2OH0.aJfSh1K7w5jYKjkmSz_zqsR15rbzQRhPTMvbOtyShTs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
