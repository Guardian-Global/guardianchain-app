import { checkAccess, getUserTierFromMetadata, getRedirectRouteForTier, type UserTier } from '@/utils/roleCheck';
import { getUserTier } from '@/utils/getUserTier';

export interface RouteGuardResult {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
}

export function routeGuard(
  route: string, 
  user: any, 
  isAuthenticated: boolean = false
): RouteGuardResult {
  
  // Public routes that don't require authentication
  const publicRoutes = ['/vault', '/about', '/contact', '/pricing'];
  if (publicRoutes.includes(route)) {
    return { allowed: true };
  }
  
  // Authentication required routes
  if (!isAuthenticated) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'Authentication required'
    };
  }
  
  const userTier: UserTier = getUserTier(user) as UserTier;
  const hasAccess = checkAccess(route, userTier);
  
  if (!hasAccess) {
    return {
      allowed: false,
      redirectTo: '/upgrade',
      reason: `Insufficient permissions. Required tier for ${route}`
    };
  }
  
  return { allowed: true };
}

export function handleLoginRedirect(user: any): string {
  const userTier: UserTier = getUserTier(user) as UserTier;
  return getRedirectRouteForTier(userTier);
}

export function handleLogoutRedirect(): string {
  return '/vault'; // Public landing page
}

// Hook for protecting routes in components
export function useRouteProtection(route: string, user: any, isAuthenticated: boolean) {
  const guardResult = routeGuard(route, user, isAuthenticated);
  
  if (!guardResult.allowed && guardResult.redirectTo) {
    // Redirect logic - in React Router this would use navigate()
    // For Wouter, we'll use location setter
    setTimeout(() => {
      window.location.href = guardResult.redirectTo!;
    }, 100);
  }
  
  return guardResult;
}