import { Request, Response, NextFunction } from 'express';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        tier: string;
        role?: string;
        [key: string]: any;
      };
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const { user } = req;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED' 
    });
  }

  // Check for admin tier or role
  if (user.tier !== 'ADMIN' && user.tier !== 'SOVEREIGN' && user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required. Current tier insufficient.',
      code: 'ADMIN_REQUIRED',
      currentTier: user.tier 
    });
  }

  console.log(`🔐 Admin access granted to user: ${user.email} (tier: ${user.tier})`);
  next();
}

export function requireSovereign(req: Request, res: Response, next: NextFunction) {
  const { user } = req;
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED' 
    });
  }

  // Only SOVEREIGN tier can access certain endpoints
  if (user.tier !== 'SOVEREIGN') {
    return res.status(403).json({ 
      error: 'Sovereign access required. Upgrade your tier to access this feature.',
      code: 'SOVEREIGN_REQUIRED',
      currentTier: user.tier 
    });
  }

  console.log(`👑 Sovereign access granted to user: ${user.email}`);
  next();
}

// Middleware to check capsule ownership
export function requireCapsuleOwnership(req: Request, res: Response, next: NextFunction) {
  // This will be used with database checks in the route handlers
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required for capsule operations',
      code: 'AUTH_REQUIRED' 
    });
  }
  next();
}