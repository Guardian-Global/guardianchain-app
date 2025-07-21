import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Role hierarchy (higher numbers = more permissions)
export const ROLE_HIERARCHY = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
  MASTER_ADMIN: 4
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

// Password hashing with pepper
export async function hashPassword(password: string): Promise<string> {
  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    throw new Error('PASSWORD_PEPPER not configured');
  }
  
  const pepperedPassword = password + pepper;
  const saltRounds = 12;
  return bcrypt.hash(pepperedPassword, saltRounds);
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    throw new Error('PASSWORD_PEPPER not configured');
  }
  
  const pepperedPassword = password + pepper;
  return bcrypt.compare(pepperedPassword, hash);
}

// JWT token generation
export function generateToken(userId: string, roles: string[]): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { 
      userId, 
      roles,
      iat: Math.floor(Date.now() / 1000),
    },
    jwtSecret,
    { expiresIn: '24h' }
  );
}

// JWT token verification
export function verifyToken(token: string): { userId: string; roles: string[] } | null {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    return {
      userId: decoded.userId,
      roles: decoded.roles || ['USER']
    };
  } catch (error) {
    return null;
  }
}

// Check if user has required role
export function hasRole(userRoles: string[], requiredRole: UserRole): boolean {
  const userMaxRole = Math.max(...userRoles.map(role => ROLE_HIERARCHY[role as UserRole] || 0));
  return userMaxRole >= ROLE_HIERARCHY[requiredRole];
}

// Authentication middleware
export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Role-based authorization middleware
export function requireRole(requiredRole: UserRole) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasRole(req.user.roles, requiredRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: requiredRole,
        current: req.user.roles
      });
    }

    next();
  };
}

// Initialize master admin account
export async function initializeMasterAdmin(): Promise<void> {
  const masterEmail = process.env.MASTER_ADMIN_EMAIL;
  const masterPassword = process.env.MASTER_ADMIN_INIT_PASSWORD;

  if (!masterEmail || !masterPassword) {
    console.warn('Master admin credentials not configured');
    return;
  }

  try {
    // Check if master admin already exists
    const existingAdmin = await storage.getUserByEmail(masterEmail);
    if (existingAdmin) {
      console.log('Master admin already exists');
      return;
    }

    // Create master admin account
    const passwordHash = await hashPassword(masterPassword);
    await storage.createAdminUser({
      email: masterEmail,
      firstName: 'Master',
      lastName: 'Admin',
      roles: ['MASTER_ADMIN'],
      isActive: true,
      passwordHash
    });

    console.log('Master admin account created successfully');
  } catch (error) {
    console.error('Failed to initialize master admin:', error);
  }
}