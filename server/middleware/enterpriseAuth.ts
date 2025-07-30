import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request interface for enterprise auth
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        tier: string;
        permissions: string[];
      };
      authLevel?: "PUBLIC" | "AUTHENTICATED" | "ADMIN" | "MASTER";
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "guardian_enterprise_secret_2025";

// Enterprise authentication levels
export const AUTH_LEVELS = {
  PUBLIC: "PUBLIC",
  AUTHENTICATED: "AUTHENTICATED", 
  ADMIN: "ADMIN",
  MASTER: "MASTER"
} as const;

// Enterprise roles with hierarchy
export const ENTERPRISE_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  COMMANDER: "COMMANDER", 
  FOUNDER: "FOUNDER",
  MASTER_ADMIN: "MASTER_ADMIN"
} as const;

// Enterprise tiers with hierarchy
export const ENTERPRISE_TIERS = {
  EXPLORER: "EXPLORER",
  SEEKER: "SEEKER",
  CREATOR: "CREATOR", 
  SOVEREIGN: "SOVEREIGN"
} as const;

// Enterprise permissions registry
export const ENTERPRISE_PERMISSIONS = {
  // User permissions
  "profile.edit": "Edit user profile",
  "capsule.create": "Create truth capsules",
  "capsule.verify": "Verify capsules",
  "capsule.moderate": "Moderate capsules",
  
  // Financial permissions
  "billing.view": "View billing information",
  "billing.manage": "Manage billing and payments",
  "treasury.view": "View treasury data",
  "treasury.manage": "Manage treasury operations",
  
  // Administrative permissions
  "user.view": "View user data",
  "user.manage": "Manage users",
  "system.configure": "Configure system settings",
  "compliance.view": "View compliance data",
  "compliance.manage": "Manage compliance",
  
  // Master permissions
  "*": "All permissions (master admin)"
} as const;

// Role hierarchy mapping
const ROLE_HIERARCHY = {
  [ENTERPRISE_ROLES.USER]: 1,
  [ENTERPRISE_ROLES.ADMIN]: 2,
  [ENTERPRISE_ROLES.COMMANDER]: 3,
  [ENTERPRISE_ROLES.FOUNDER]: 4,
  [ENTERPRISE_ROLES.MASTER_ADMIN]: 5
};

// Tier hierarchy mapping
const TIER_HIERARCHY = {
  [ENTERPRISE_TIERS.EXPLORER]: 1,
  [ENTERPRISE_TIERS.SEEKER]: 2,
  [ENTERPRISE_TIERS.CREATOR]: 3,
  [ENTERPRISE_TIERS.SOVEREIGN]: 4
};

// Default permissions by role
const ROLE_PERMISSIONS = {
  [ENTERPRISE_ROLES.USER]: [
    "profile.edit",
    "capsule.create",
    "capsule.verify",
    "billing.view"
  ],
  [ENTERPRISE_ROLES.ADMIN]: [
    "profile.edit",
    "capsule.create", 
    "capsule.verify",
    "capsule.moderate",
    "billing.view",
    "billing.manage",
    "user.view",
    "user.manage",
    "compliance.view"
  ],
  [ENTERPRISE_ROLES.COMMANDER]: [
    "profile.edit",
    "capsule.create",
    "capsule.verify", 
    "capsule.moderate",
    "billing.view",
    "billing.manage",
    "treasury.view",
    "treasury.manage",
    "user.view",
    "user.manage",
    "system.configure",
    "compliance.view",
    "compliance.manage"
  ],
  [ENTERPRISE_ROLES.FOUNDER]: [
    "profile.edit",
    "capsule.create",
    "capsule.verify",
    "capsule.moderate", 
    "billing.view",
    "billing.manage",
    "treasury.view",
    "treasury.manage",
    "user.view",
    "user.manage",
    "system.configure",
    "compliance.view",
    "compliance.manage"
  ],
  [ENTERPRISE_ROLES.MASTER_ADMIN]: ["*"]
};

/**
 * Enterprise JWT token verification middleware
 */
export function verifyEnterpriseToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      req.authLevel = AUTH_LEVELS.PUBLIC;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || ENTERPRISE_ROLES.USER,
      tier: decoded.tier || ENTERPRISE_TIERS.EXPLORER,
      permissions: decoded.permissions || ROLE_PERMISSIONS[decoded.role] || []
    };

    req.authLevel = AUTH_LEVELS.AUTHENTICATED;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    req.authLevel = AUTH_LEVELS.PUBLIC;
    next();
  }
}

/**
 * Require authentication middleware
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.authLevel === AUTH_LEVELS.PUBLIC) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      requiresAuth: true
    });
  }
  next();
}

/**
 * Require specific role middleware factory
 */
export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${requiredRole}, current role: ${req.user.role}`
      });
    }

    next();
  };
}

/**
 * Require specific tier middleware factory
 */
export function requireTier(requiredTier: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userTierLevel = TIER_HIERARCHY[req.user.tier as keyof typeof TIER_HIERARCHY] || 0;
    const requiredTierLevel = TIER_HIERARCHY[requiredTier as keyof typeof TIER_HIERARCHY] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required tier: ${requiredTier}, current tier: ${req.user.tier}`,
        upgradeRequired: true,
        currentTier: req.user.tier,
        requiredTier
      });
    }

    next();
  };
}

/**
 * Require specific permission middleware factory
 */
export function requirePermission(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Master admin has all permissions
    if (req.user.permissions.includes("*")) {
      return next();
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${requiredPermission}`,
        currentPermissions: req.user.permissions,
        requiredPermission
      });
    }

    next();
  };
}

/**
 * Master admin only middleware
 */
export function requireMasterAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== ENTERPRISE_ROLES.MASTER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Master admin access required"
    });
  }
  next();
}

/**
 * Generate enterprise JWT token
 */
export function generateEnterpriseToken(user: any): string {
  const userRole = user.role || ENTERPRISE_ROLES.USER;
  const permissions = user.permissions || ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS[ENTERPRISE_ROLES.USER];
  
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: userRole,
      tier: user.tier || ENTERPRISE_TIERS.EXPLORER,
      permissions
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

/**
 * Validate user permissions
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes("*") || userPermissions.includes(requiredPermission);
}

/**
 * Validate user role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  const userRoleLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredRoleLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Validate user tier
 */
export function hasTier(userTier: string, requiredTier: string): boolean {
  const userTierLevel = TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 0;
  const requiredTierLevel = TIER_HIERARCHY[requiredTier as keyof typeof TIER_HIERARCHY] || 0;
  return userTierLevel >= requiredTierLevel;
}

/**
 * Get user's effective permissions
 */
export function getUserPermissions(role: string, tier: string, customPermissions?: string[]): string[] {
  const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
  const allPermissions = [...rolePermissions, ...(customPermissions || [])];
  return Array.from(new Set(allPermissions));
}

/**
 * Master login validation
 */
export function validateMasterCredentials(email: string, password: string, masterKey: string): boolean {
  return (
    email === "master@guardianchain.org" &&
    password === "masterkey123" &&
    masterKey === "GUARDIAN_MASTER_2025"
  );
}

// Export all enterprise auth utilities
export {
  JWT_SECRET,
  ROLE_HIERARCHY,
  TIER_HIERARCHY,
  ROLE_PERMISSIONS
};