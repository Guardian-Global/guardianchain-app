// Unified role checking and access control for Replit Auth integration
export type UserTier = 'guest' | 'pro' | 'admin';
export type FeatureAccess = 'vault' | 'view-only' | 'veritas' | 'create' | 'mint' | 'view-dashboard' | 'everything';

export const accessMap: Record<UserTier, FeatureAccess[]> = {
  guest: ['vault', 'view-only'],
  pro: ['veritas', 'create', 'mint', 'view-dashboard', 'vault', 'view-only'],
  admin: ['everything']
};

export const routeAccessMap: Record<string, FeatureAccess> = {
  '/veritas-seal': 'veritas',
  '/truth-bounty': 'veritas',
  '/truth-redemption': 'veritas',
  '/conspiracy-capsule': 'veritas',
  '/create-capsule': 'create',
  '/dashboard': 'view-dashboard',
  '/admin': 'everything',
  '/command': 'everything',
  '/vault': 'vault'
};

export function checkAccess(route: string, userTier: UserTier = 'guest'): boolean {
  const requiredAccess = routeAccessMap[route];
  
  if (!requiredAccess) {
    return true; // Public routes
  }
  
  if (userTier === 'admin') {
    return true; // Admin has access to everything
  }
  
  const userPermissions = accessMap[userTier] || [];
  return userPermissions.includes(requiredAccess);
}

export function getUserTierFromMetadata(user: any): UserTier {
  // Extract tier from Replit user metadata
  if (user?.metadata?.tier) {
    return user.metadata.tier as UserTier;
  }
  
  // Fallback to role-based detection
  if (user?.role === 'admin' || user?.isAdmin) {
    return 'admin';
  }
  
  if (user?.subscription || user?.isPro) {
    return 'pro';
  }
  
  return 'guest';
}

export function getRedirectRouteForTier(tier: UserTier): string {
  switch (tier) {
    case 'guest':
      return '/vault';
    case 'pro':
      return '/dashboard';
    case 'admin':
      return '/command';
    default:
      return '/vault';
  }
}

export function getUpgradeMessage(tier: UserTier, requiredFeature: FeatureAccess): string {
  if (tier === 'guest') {
    return 'Upgrade to Pro to access Veritas tools and advanced features';
  }
  
  if (tier === 'pro' && requiredFeature === 'everything') {
    return 'Admin access required for this feature';
  }
  
  return 'Upgrade required to access this feature';
}