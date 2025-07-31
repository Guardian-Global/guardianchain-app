// Optimized utilities for Replit Auth tier management
import { fetchUserTier } from './assignUserTier';

// Note: Replace with actual Replit Auth when implementing
// import { useAuth } from "@replit/extensions";

// Mock implementation - replace with actual useAuth when ready
function useAuth() {
  // This would be the actual Replit Auth hook
  return {
    user: {
      id: "mock-user-id",
      metadata: {
        tier: "guest" // This would come from real Replit user metadata
      }
    }
  };
}

export function getUserTier(user: any): string {
  if (!user) return "guest";
  return user?.metadata?.tier || "guest";
}

export function useUserTier(): string {
  const { user } = useAuth();
  return getUserTier(user);
}

/**
 * Get user tier with fallback to Replit DB lookup
 */
export async function getUserTierWithFallback(user: any): Promise<string> {
  // First try metadata
  const metadataTier = getUserTier(user);
  if (metadataTier && metadataTier !== "guest") {
    return metadataTier;
  }
  
  // Fallback to Replit DB lookup
  if (user?.id) {
    return await fetchUserTier(user.id);
  }
  
  return "guest";
}