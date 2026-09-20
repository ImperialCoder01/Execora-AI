import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://btuucgpelprepadqrcbi.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dXVjZ3BlbHByZXBhZHFyY2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4ODgxMTcsImV4cCI6MjEwNTQ2NDExN30.WamSUjk1ZjE2QqLon4claQQYhDhuOAelX36xDJ2sdos';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 20);
}
