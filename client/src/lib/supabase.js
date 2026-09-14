import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabasePublishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
  !supabasePublishableKey.startsWith('YOUR_')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;