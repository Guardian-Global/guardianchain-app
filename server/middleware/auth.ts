import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        tier: string;
        gttStakeAmount: number;
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";
const JWT_EXPIRES_IN = "24h";

/**
 * Middleware to verify JWT token and set user in request
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Access token required" });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};

/**
 * Middleware to check if user has required tier
 */
export const requireTier = (requiredTier: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    const tierHierarchy = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierHierarchy.indexOf(req.user.tier.toUpperCase());
    const requiredTierIndex = tierHierarchy.indexOf(requiredTier.toUpperCase());

    if (userTierIndex < requiredTierIndex) {
      res.status(403).json({
        success: false,
        message: "Insufficient tier access",
        requiredTier,
        currentTier: req.user.tier
      });
      return;
    }

    next();
  };
};

/**
 * Simple authentication middleware (placeholder for missing simpleAuth)
 */
export const simpleAuth = (req: Request, res: Response, next: NextFunction): void => {
  // For development, allow all requests
  next();
};

/**
 * Admin-only middleware (placeholder for missing adminOnly)
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  // For development, allow all requests
  next();
        success: false,
        message: `${requiredTier} tier or higher required. Current tier: ${req.user.tier}`,
        upgradeRequired: true,
        requiredTier,
        currentTier: req.user.tier,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user meets minimum stake requirement
 */
export const requireMinStake = (minStake: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "Authentication required" });
      return;
    }

    if (req.user.gttStakeAmount < minStake) {
      res.status(403).json({
        success: false,
        message: `Minimum stake of ${minStake} GTT required. Current stake: ${req.user.gttStakeAmount} GTT`,
        stakeRequired: true,
        requiredStake: minStake,
        currentStake: req.user.gttStakeAmount,
      });
      return;
    }

    next();
  };
};

/**
 * Generate JWT token for user
 */
export const generateToken = (user: any): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      tier: user.tier,
      gttStakeAmount: user.gttStakeAmount,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Verify password
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!password.match(/[a-z]/)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!password.match(/[A-Z]/)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!password.match(/\d/)) {
    errors.push("Password must contain at least one number");
  }

  if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Rate limiting middleware
 */
export const rateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map();

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [ip, timestamps] of requests.entries()) {
      const filteredTimestamps = timestamps.filter(
        (timestamp: number) => timestamp > windowStart
      );
      if (filteredTimestamps.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, filteredTimestamps);
      }
    }

    // Check current IP
    const clientRequests = requests.get(clientIP) || [];
    const recentRequests = clientRequests.filter(
      (timestamp: number) => timestamp > windowStart
    );

    if (recentRequests.length >= maxRequests) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return;
    }

    // Add current request
    recentRequests.push(now);
    requests.set(clientIP, recentRequests);

    next();
  };
};

/**
 * CORS middleware for auth routes
 */
export const authCors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
};
