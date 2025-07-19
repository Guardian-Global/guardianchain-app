import type { Request, Response, NextFunction } from "express";

// Simple authentication middleware for development
export const simpleAuth = (req: Request, res: Response, next: NextFunction) => {
  // For development, always allow access
  if (process.env.NODE_ENV === 'development') {
    (req as any).user = { 
      id: 'dev-user', 
      walletAddress: '0xYourMasterWalletAddress',
      role: 'admin' 
    };
    return next();
  }
  
  // In production, check for valid session or auth header
  const isAuthenticated = (req as any).session?.user || req.headers.authorization;
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  next();
};

// Admin-only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};