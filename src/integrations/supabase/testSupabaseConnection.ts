import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  // Use a valid table name: 'profiles'
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful! Sample data:', data);
  }
}

testConnection(); 