const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_SERVER_SECRET_KEY') {
  console.warn('⚠️ Supabase environment variables (SUPABASE_URL, SUPABASE_SECRET_KEY) are missing or using placeholder. Supabase-specific operations will fall back to MongoDB.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
  }
}

module.exports = supabase;