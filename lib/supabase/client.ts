// Centralized Supabase client configuration with proper error handling
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Check both environment contexts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Silent fail - no warnings in production
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Server-side doesn't need session persistence
        autoRefreshToken: false,
      },
      global: {
        headers: {
          "x-application": "guardianchain-platform",
        },
      },
    });

    return supabaseInstance;
  } catch (error) {
    // Silent fail in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to initialize Supabase client:", error);
    }
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Health check function
export async function checkSupabaseHealth(): Promise<{
  configured: boolean;
  connected: boolean;
  error?: string;
}> {
  const client = getSupabaseClient();

  if (!client) {
    return {
      configured: false,
      connected: false,
      error: "Supabase not configured",
    };
  }

  try {
    // Simple connection test
    const { data, error } = await client
      .from("sessions")
      .select("count")
      .limit(1);

    return {
      configured: true,
      connected: true,
      error: error?.message,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: (error as Error).message,
    };
  }
}
