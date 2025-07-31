// Optimized utilities for Replit Auth tier management
// Note: Replace with actual Replit Auth when implementing
// import { useAuth } from "@replit/extensions";

// Mock implementation - replace with actual useAuth when ready
function useAuth() {
  // This would be the actual Replit Auth hook
  return {
    user: {
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