// middleware/withAuthGuard.tsx
// Higher-order component for protecting routes and components

import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useUserTier } from '@/hooks/useUserTier';
import { needsOnboarding } from '@/lib/onboarding';

export interface AuthGuardOptions {
  requireAuth?: boolean;
  requireTier?: 'SEEKER' | 'EXPLORER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  requireOnboarding?: boolean;
  redirectTo?: string;
  fallback?: React.ComponentType;
  allowedRoles?: string[];
}

/**
 * Higher-order component that protects components/pages with authentication
 */
export function withAuthGuard<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: AuthGuardOptions = {}
) {
  const AuthGuardedComponent = (props: T) => {
    const { user, isLoading: authLoading } = useAuth();
    const { tier, isLoading: tierLoading } = useUserTier();
    const [, setLocation] = useLocation();
    const [onboardingNeeded, setOnboardingNeeded] = useState<boolean | null>(null);

    const {
      requireAuth = true,
      requireTier,
      requireOnboarding = false,
      redirectTo = '/auth',
      fallback: Fallback,
      allowedRoles = []
    } = options;

    // Check onboarding status
    useEffect(() => {
      if (user?.email && requireOnboarding) {
        needsOnboarding(user.email).then(setOnboardingNeeded);
      }
    }, [user?.email, requireOnboarding]);

    // Loading states
    if (authLoading || (requireTier && tierLoading) || (requireOnboarding && onboardingNeeded === null)) {
      return <AuthLoadingSpinner />;
    }

    // Authentication check
    if (requireAuth && !user) {
      if (Fallback) {
        return <Fallback />;
      }
      setLocation(redirectTo);
      return null;
    }

    // Tier check
    if (requireTier && tier) {
      const tierHierarchy = ['SEEKER', 'EXPLORER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
      const userTierIndex = tierHierarchy.indexOf(tier);
      const requiredTierIndex = tierHierarchy.indexOf(requireTier);

      if (userTierIndex < requiredTierIndex) {
        return <InsufficientTierAccess requiredTier={requireTier} userTier={tier} />;
      }
    }

    // Onboarding check
    if (requireOnboarding && onboardingNeeded) {
      setLocation('/onboarding');
      return null;
    }

    // Role check
    if (allowedRoles.length > 0 && user) {
      const userRoles = user.app_metadata?.roles || [];
      const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return <InsufficientRoleAccess requiredRoles={allowedRoles} />;
      }
    }

    // All checks passed, render the component
    return <WrappedComponent {...props} />;
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthGuardedComponent;
}

/**
 * React hook for using auth guard logic in functional components
 */
export function useAuthGuard(options: AuthGuardOptions = {}) {
  const { user, isLoading: authLoading } = useAuth();
  const { tier, isLoading: tierLoading } = useUserTier();
  const [, setLocation] = useLocation();
  const [onboardingNeeded, setOnboardingNeeded] = useState<boolean | null>(null);

  const {
    requireAuth = true,
    requireTier,
    requireOnboarding = false,
    redirectTo = '/auth',
    allowedRoles = []
  } = options;

  // Check onboarding status
  useEffect(() => {
    if (user?.email && requireOnboarding) {
      needsOnboarding(user.email).then(setOnboardingNeeded);
    }
  }, [user?.email, requireOnboarding]);

  const isLoading = authLoading || (requireTier && tierLoading) || (requireOnboarding && onboardingNeeded === null);

  const hasAccess = () => {
    // Authentication check
    if (requireAuth && !user) {
      return false;
    }

    // Tier check
    if (requireTier && tier) {
      const tierHierarchy = ['SEEKER', 'EXPLORER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
      const userTierIndex = tierHierarchy.indexOf(tier);
      const requiredTierIndex = tierHierarchy.indexOf(requireTier);

      if (userTierIndex < requiredTierIndex) {
        return false;
      }
    }

    // Onboarding check
    if (requireOnboarding && onboardingNeeded) {
      return false;
    }

    // Role check
    if (allowedRoles.length > 0 && user) {
      const userRoles = user.app_metadata?.roles || [];
      const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return false;
      }
    }

    return true;
  };

  const redirectIfNeeded = () => {
    if (!isLoading && !hasAccess()) {
      if (requireOnboarding && onboardingNeeded) {
        setLocation('/onboarding');
      } else {
        setLocation(redirectTo);
      }
    }
  };

  return {
    hasAccess: hasAccess(),
    isLoading,
    redirectIfNeeded,
    user,
    tier,
    onboardingNeeded
  };
}

/**
 * Route guard component for protecting entire routes
 */
export function RouteGuard({ 
  children, 
  ...options 
}: AuthGuardOptions & { children: React.ReactNode }) {
  const { hasAccess, isLoading, redirectIfNeeded } = useAuthGuard(options);

  useEffect(() => {
    redirectIfNeeded();
  }, [hasAccess, isLoading]);

  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  if (!hasAccess) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
}

/**
 * Component-level guard for protecting specific UI elements
 */
export function ComponentGuard({ 
  children, 
  fallback = null,
  ...options 
}: AuthGuardOptions & { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasAccess, isLoading } = useAuthGuard(options);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 rounded" />;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Loading component
function AuthLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    </div>
  );
}

// Insufficient tier access component
function InsufficientTierAccess({ requiredTier, userTier }: { requiredTier: string; userTier: string }) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md p-6 bg-card rounded-lg border">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Tier Access Required</h2>
        <p className="text-muted-foreground mb-4">
          This feature requires <span className="font-medium text-foreground">{requiredTier}</span> tier access.
          Your current tier: <span className="font-medium text-foreground">{userTier}</span>
        </p>
        <div className="space-y-2">
          <button
            onClick={() => setLocation('/upgrade')}
            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Upgrade Tier
          </button>
          <button
            onClick={() => setLocation('/')}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Insufficient role access component
function InsufficientRoleAccess({ requiredRoles }: { requiredRoles: string[] }) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md p-6 bg-card rounded-lg border">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don't have the required permissions to access this feature.
          Required roles: {requiredRoles.join(', ')}
        </p>
        <button
          onClick={() => setLocation('/')}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

// Convenience exports for common use cases
export const requireAuth = (component: React.ComponentType<any>) => 
  withAuthGuard(component, { requireAuth: true });

export const requireTier = (tier: AuthGuardOptions['requireTier']) => 
  (component: React.ComponentType<any>) => 
    withAuthGuard(component, { requireTier: tier });

export const requireOnboarding = (component: React.ComponentType<any>) => 
  withAuthGuard(component, { requireOnboarding: true });

export const requireAdmin = (component: React.ComponentType<any>) => 
  withAuthGuard(component, { requireTier: 'ADMIN' });