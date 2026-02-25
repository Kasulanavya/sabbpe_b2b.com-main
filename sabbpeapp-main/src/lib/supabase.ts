// src/lib/supabase.ts - Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Your Supabase project credentials (from Vite env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Runtime checks to surface misconfiguration early during development
if (import.meta.env.DEV) {
    if (!supabaseUrl) console.error('Missing VITE_SUPABASE_URL in .env.local');
    if (!supabaseAnonKey || supabaseAnonKey === 'REPLACE_WITH_PROJECT_ANON_KEY')
        console.error('Missing or placeholder VITE_SUPABASE_ANON_KEY in .env.local — do NOT use the service role key');
}

// Create the Supabase client with TypeScript types
export const supabase = createClient < Database > (supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Optional: Helper functions for common operations
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Export types for use in components
export type { Database } from './database.types';