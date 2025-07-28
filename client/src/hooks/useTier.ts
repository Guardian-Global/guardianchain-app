import { useState, useEffect } from "react";
import { getTierById, type Tier } from "@/lib/roles";
import { type UserProfile } from "@/lib/access";

/**
 * Mock user data for development - replace with actual user context
 */
const mockUserProfile: UserProfile = {
  id: "user-123",
  tierId: "explorer",
  mintsThisPeriod: 1,
  periodStartDate: new Date().toISOString(),
  gttBalance: 150.75,
  totalYieldEarned: 45.25,
  subscriptionStatus: "active",
  subscriptionEndDate: new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
};

/**
 * Hook for managing user tier information and access
 */
export function useTier(userId?: string) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);

        // TODO: Replace with actual API call to fetch user profile
        // const response = await fetch(`/api/users/${userId}/profile`);
        // const profile = await response.json();

        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
        setUserProfile(mockUserProfile);
      } catch (err) {
        setError("Failed to fetch user profile");
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserProfile();
    } else {
      // Set mock data for development when no userId provided
      setUserProfile(mockUserProfile);
      setLoading(false);
    }
  }, [userId]);

  const tier = userProfile ? getTierById(userProfile.tierId) : null;

  /**
   * Update user tier (after successful upgrade)
   */
  const updateTier = async (newTierId: string) => {
    if (!userProfile) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/users/${userProfile.id}/tier`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ tierId: newTierId })
      // });

      setUserProfile((prev) => (prev ? { ...prev, tierId: newTierId } : null));
    } catch (err) {
      setError("Failed to update tier");
      console.error("Error updating tier:", err);
    }
  };

  /**
   * Increment mint count (after successful capsule creation)
   */
  const incrementMintCount = async () => {
    if (!userProfile) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/users/${userProfile.id}/mints`, {
      //   method: 'POST'
      // });

      setUserProfile((prev) =>
        prev ? { ...prev, mintsThisPeriod: prev.mintsThisPeriod + 1 } : null
      );
    } catch (err) {
      setError("Failed to update mint count");
      console.error("Error updating mint count:", err);
    }
  };

  /**
   * Update GTT balance
   */
  const updateGTTBalance = async (newBalance: number) => {
    if (!userProfile) return;

    setUserProfile((prev) =>
      prev ? { ...prev, gttBalance: newBalance } : null
    );
  };

  /**
   * Refresh user profile data
   */
  const refreshProfile = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      // TODO: Implement actual refresh logic
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError("Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    tier,
    loading,
    error,
    updateTier,
    incrementMintCount,
    updateGTTBalance,
    refreshProfile,

    // Computed values for convenience
    isSubscribed:
      userProfile?.subscriptionStatus === "active" ||
      userProfile?.subscriptionStatus === "trialing",
    isPaidTier: tier ? tier.priceUSD > 0 : false,
    hasGTT: (userProfile?.gttBalance || 0) > 0,
  };
}
