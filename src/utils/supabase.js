import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client only if both URL and key are provided
// Otherwise, export null and storage.js will use localStorage fallback
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase not configured. Using localStorage fallback. To enable Supabase, create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

