// hooks/useUserTier.ts
// Hook for managing user tier information

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export type UserTier = 'SEEKER' | 'EXPLORER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';

export function useUserTier() {
  const { user } = useAuth();

  const {
    data: tier,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-tier', user?.email],
    queryFn: async (): Promise<UserTier | null> => {
      if (!user?.email) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('tier')
        .eq('wallet_address', user.email)
        .single();

      if (error) {
        console.error('❌ Error fetching user tier:', error);
        throw error;
      }

      return data?.tier as UserTier || 'SEEKER';
    },
    enabled: !!user?.email
  });

  const getTierLevel = (userTier: UserTier): number => {
    const tierLevels = {
      'SEEKER': 1,
      'EXPLORER': 2,
      'CREATOR': 3,
      'SOVEREIGN': 4,
      'ADMIN': 5
    };
    return tierLevels[userTier] || 1;
  };

  const canAccessTier = (requiredTier: UserTier): boolean => {
    if (!tier) return false;
    return getTierLevel(tier) >= getTierLevel(requiredTier);
  };

  const getTierFeatures = (userTier: UserTier) => {
    const features = {
      'SEEKER': {
        maxCapsules: 10,
        canCreatePublic: false,
        canMint: false,
        storageLimit: '100MB',
        features: ['Basic vault', 'Private capsules', 'Community access']
      },
      'EXPLORER': {
        maxCapsules: 50,
        canCreatePublic: true,
        canMint: false,
        storageLimit: '500MB',
        features: ['Public capsules', 'Friend sharing', 'Basic analytics']
      },
      'CREATOR': {
        maxCapsules: 200,
        canCreatePublic: true,
        canMint: true,
        storageLimit: '2GB',
        features: ['NFT minting', 'Unlockable capsules', 'Advanced analytics', 'Revenue sharing']
      },
      'SOVEREIGN': {
        maxCapsules: 1000,
        canCreatePublic: true,
        canMint: true,
        storageLimit: '10GB',
        features: ['Premium features', 'Priority support', 'Beta access', 'DAO voting']
      },
      'ADMIN': {
        maxCapsules: Infinity,
        canCreatePublic: true,
        canMint: true,
        storageLimit: 'Unlimited',
        features: ['All features', 'Admin tools', 'System management']
      }
    };

    return features[userTier] || features['SEEKER'];
  };

  return {
    tier,
    isLoading,
    error,
    refetch,
    getTierLevel,
    canAccessTier,
    getTierFeatures
  };
}