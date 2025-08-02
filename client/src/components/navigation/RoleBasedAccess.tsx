import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserRole {
  tier: 'EXPLORER' | 'SEEKER' | 'CREATOR' | 'SOVEREIGN' | 'ADMIN';
  permissions: string[];
  isAdmin?: boolean;
  isDaoMember?: boolean;
  isValidator?: boolean;
}

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requiredTiers?: string[];
  requiredPermissions?: string[];
  adminOnly?: boolean;
  daoOnly?: boolean;
  validatorOnly?: boolean;
  fallback?: React.ReactNode;
}

export function RoleBasedAccess({ 
  children, 
  requiredTiers = [],
  requiredPermissions = [],
  adminOnly = false,
  daoOnly = false,
  validatorOnly = false,
  fallback = null 
}: RoleBasedAccessProps) {
  const { user } = useAuth();
  
  if (!user) return fallback;

  const userRole = getUserRole(user);
  
  // Check admin access
  if (adminOnly && !userRole.isAdmin) {
    return fallback;
  }

  // Check DAO member access
  if (daoOnly && !userRole.isDaoMember) {
    return fallback;
  }

  // Check validator access
  if (validatorOnly && !userRole.isValidator) {
    return fallback;
  }

  // Check tier access
  if (requiredTiers.length > 0 && !requiredTiers.includes(userRole.tier)) {
    return fallback;
  }

  // Check permission access
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission => 
      userRole.permissions.includes(permission)
    );
    if (!hasPermission) {
      return fallback;
    }
  }

  return <>{children}</>;
}

function getUserRole(user: any): UserRole {
  const tier = user.tier || 'EXPLORER';
  const isAdmin = user.email === 'admin@guardianchain.app' || tier === 'ADMIN';
  const isDaoMember = ['CREATOR', 'SOVEREIGN', 'ADMIN'].includes(tier);
  const isValidator = user.isValidator || tier === 'SOVEREIGN' || isAdmin;

  // Define permissions based on tier
  const permissions = getPermissionsForTier(tier);

  return {
    tier,
    permissions,
    isAdmin,
    isDaoMember,
    isValidator
  };
}

function getPermissionsForTier(tier: string): string[] {
  const basePermissions = ['view_capsules', 'create_basic_capsule'];
  
  switch (tier) {
    case 'EXPLORER':
      return [...basePermissions];
    
    case 'SEEKER':
      return [...basePermissions, 'create_advanced_capsule', 'view_analytics'];
    
    case 'CREATOR':
      return [...basePermissions, 'create_advanced_capsule', 'view_analytics', 
              'create_eternal_contract', 'participate_dao', 'mint_nft'];
    
    case 'SOVEREIGN':
      return [...basePermissions, 'create_advanced_capsule', 'view_analytics',
              'create_eternal_contract', 'participate_dao', 'mint_nft',
              'validate_capsules', 'access_validator_tools', 'unlimited_capsules'];
    
    case 'ADMIN':
      return ['*']; // All permissions
    
    default:
      return basePermissions;
  }
}

// Hook for checking permissions
export function usePermissions() {
  const { user } = useAuth();
  
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userRole = getUserRole(user);
    return userRole.permissions.includes('*') || userRole.permissions.includes(permission);
  };

  const hasTier = (tier: string): boolean => {
    if (!user) return false;
    
    const tierHierarchy = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN', 'ADMIN'];
    const userTierIndex = tierHierarchy.indexOf((user as any).tier || 'EXPLORER');
    const requiredTierIndex = tierHierarchy.indexOf(tier);
    
    return userTierIndex >= requiredTierIndex;
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    return getUserRole(user).isAdmin || false;
  };

  const isDaoMember = (): boolean => {
    if (!user) return false;
    return getUserRole(user).isDaoMember || false;
  };

  const isValidator = (): boolean => {
    if (!user) return false;
    return getUserRole(user).isValidator || false;
  };

  return {
    hasPermission,
    hasTier,
    isAdmin,
    isDaoMember,
    isValidator,
    userRole: user ? getUserRole(user) : null
  };
}