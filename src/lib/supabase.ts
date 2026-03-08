import { createClient } from '@supabase/supabase-js';

// Lovable Cloud provides these automatically
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
