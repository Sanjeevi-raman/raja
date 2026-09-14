import { supabase } from './supabase';

export async function testSupabase() {
  if (!supabase) {
    return false;
  }
  console.log('Supabase client initialized:', !!supabase);
  return true;
}