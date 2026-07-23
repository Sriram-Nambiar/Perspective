import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Public Supabase client for browser and client component use.
 * Uses anon key with Row Level Security (RLS) policies.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon key is missing in environment variables.');
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Admin Supabase client for server-side pipeline operations.
 * Uses Service Role key which bypasses Row Level Security (RLS).
 * MUST NEVER BE EXPOSED TO CLIENT BUNDLES.
 */
export function createAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABAE_SERVICE_ROLE_KEY ||
    '';

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
