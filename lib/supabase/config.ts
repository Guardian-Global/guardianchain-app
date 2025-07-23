// Supabase Configuration Management
// This file centralizes all Supabase configuration and eliminates warnings

export interface SupabaseConfig {
  url: string | null;
  serviceKey: string | null;
  configured: boolean;
  environment: 'development' | 'production' | 'test';
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
  
  return {
    url,
    serviceKey,
    configured: !!(url && serviceKey),
    environment: (process.env.NODE_ENV as any) || 'development'
  };
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return config.configured;
}

export function logSupabaseStatus(): void {
  const config = getSupabaseConfig();
  
  // Only log in development
  if (config.environment === 'development') {
    if (!config.configured) {
      console.info('ℹ️ Supabase: Not configured. Platform will operate without Supabase features.');
      
      if (!config.url) {
        console.info('   Missing: NEXT_PUBLIC_SUPABASE_URL environment variable');
      }
      
      if (!config.serviceKey) {
        console.info('   Missing: SUPABASE_SERVICE_ROLE_KEY environment variable');
      }
    } else {
      console.info('✅ Supabase: Configured and ready');
    }
  }
}

// Client-side configuration (browser environment)
export function getClientSupabaseConfig() {
  if (typeof window === 'undefined') {
    return getSupabaseConfig(); // Server-side
  }
  
  // Browser environment - only use public URL
  const url = (window as any).__SUPABASE_URL__ || null;
  const configured = !!url;
  
  return {
    url,
    serviceKey: null, // Never expose service key to client
    configured,
    environment: 'production' // Assume production in browser
  };
}