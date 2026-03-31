import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here';

// Browser client (uses anon key, respects RLS)
export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Server client (uses service role key, bypasses RLS)
export const supabaseAdmin: SupabaseClient = isConfigured && supabaseServiceKey && supabaseServiceKey !== 'your_service_role_key_here'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export const isSupabaseConfigured = isConfigured;
