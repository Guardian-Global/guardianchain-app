import { useState, useEffect } from 'react';
import { onboardUser, getUserTier, updateUserTier, getUserOnboardingStatus } from '@/utils/onboardUser';
import { useUnifiedAuth } from './useUnifiedAuth';

export function useUserTier() {
  const { user, isAuthenticated } = useUnifiedAuth();
  const [tier, setTier] = useState<string>("guest");
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<{
    isOnboarded: boolean;
    onboardDate: string | null;
    tier: string;
  }>({
    isOnboarded: false,
    onboardDate: null,
    tier: "guest"
  });

  useEffect(() => {
    async function initializeUserTier() {
      if (!isAuthenticated || !user) {
        setTier("guest");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get user ID from auth context  
        const userId = user.id || (user as any).sub || user.email;
        if (!userId) {
          console.warn("No user ID available for tier management");
          setTier("guest");
          return;
        }

        // Onboard user if new
        const onboardResult = await onboardUser(userId, user.email);
        
        if (onboardResult.success) {
          setTier(onboardResult.tier || "guest");
          
          // Get full onboarding status
          const status = await getUserOnboardingStatus(userId);
          setOnboardingStatus(status);
        } else {
          console.error("Failed to onboard user:", onboardResult.error);
          setTier("guest");
        }
      } catch (error) {
        console.error("Error initializing user tier:", error);
        setTier("guest");
      } finally {
        setIsLoading(false);
      }
    }

    initializeUserTier();
  }, [isAuthenticated, user]);

  const upgradeTier = async (newTier: "guest" | "explorer" | "pro" | "enterprise") => {
    if (!user) return { success: false, error: "No authenticated user" };

    const userId = user.id || (user as any).sub || user.email;
    if (!userId) return { success: false, error: "No user ID available" };

    try {
      const result = await updateUserTier(userId, newTier);
      if (result.success) {
        setTier(newTier);
        
        // Update onboarding status
        const status = await getUserOnboardingStatus(userId);
        setOnboardingStatus(status);
      }
      return result;
    } catch (error) {
      console.error("Error upgrading tier:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  };

  const refreshTier = async () => {
    if (!user) return;

    const userId = user.id || (user as any).sub || user.email;
    if (!userId) return;

    try {
      const currentTier = await getUserTier(userId);
      setTier(currentTier);
      
      const status = await getUserOnboardingStatus(userId);
      setOnboardingStatus(status);
    } catch (error) {
      console.error("Error refreshing tier:", error);
    }
  };

  // Helper functions for tier checking
  const isGuest = tier === "guest";
  const isExplorer = tier === "explorer";
  const isPro = tier === "pro";
  const isEnterprise = tier === "enterprise";
  const isPremium = tier === "pro" || tier === "enterprise";
  
  // Feature access helpers
  const canCreateCapsules = !isGuest;
  const canAccessVeritasTools = isPremium;
  const canAccessAdvancedAnalytics = isPremium;
  const hasUnlimitedCapsules = isPremium;
  const canEarnGTT = !isGuest;
  
  // GTT earning limits based on tier
  const getGTTLimit = () => {
    switch (tier) {
      case "explorer": return 10;
      case "pro": return 500;
      case "enterprise": return 99999; // Effectively unlimited
      default: return 0;
    }
  };

  return {
    tier,
    isLoading,
    onboardingStatus,
    upgradeTier,
    refreshTier,
    
    // Tier checks
    isGuest,
    isExplorer,
    isPro,
    isEnterprise,
    isPremium,
    
    // Feature access
    canCreateCapsules,
    canAccessVeritasTools,
    canAccessAdvancedAnalytics,
    hasUnlimitedCapsules,
    canEarnGTT,
    gttLimit: getGTTLimit(),
    
    // Tier display helpers
    tierDisplayName: tier.charAt(0).toUpperCase() + tier.slice(1),
    tierColor: tier === "pro" ? "blue" : tier === "enterprise" ? "purple" : tier === "explorer" ? "green" : "gray"
  };
}