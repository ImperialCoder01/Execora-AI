import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseAdminConfigured = Boolean(
  supabaseUrl && 
  supabaseServiceRoleKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
