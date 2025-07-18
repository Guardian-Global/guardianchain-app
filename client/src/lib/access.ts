// Access & quota logic based on user tier (from Supabase metadata)

import { TIERS, TierName, TierConfig } from './tiers';

export function getUserTier(user: any): TierConfig {
  const role: TierName = (user?.tier as TierName) || 'Explorer';
  return TIERS.find(t => t.name === role) || TIERS[0];
}

export function getRemainingMints(user: any): number {
  // Returns how many mints this user has left this month (uses supabase metadata)
  const tier = getUserTier(user);
  return (user?.capsuleMintCredits ?? tier.capsuleMints);
}

export function canMintCapsule(user: any): boolean {
  return getRemainingMints(user) > 0;
}

export function addMintsOnRenewal(user: any): number {
  // Called on Stripe/Supabase webhook event, adds bundle to existing credits
  const tier = getUserTier(user);
  return (user?.capsuleMintCredits ?? 0) + tier.capsuleMints;
}