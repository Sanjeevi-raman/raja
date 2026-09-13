import { supabase } from './supabase';

export async function testSupabase() {
  console.log('Supabase client initialized:', !!supabase);

  return !!supabase;
}