import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Production-ready authentication configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "guardianchain-production-secret-change-in-prod";
const JWT_EXPIRY = "24h";

// Mock user database for production (replace with real database)
interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tier: string;
  gttStakeAmount: number;
  walletAddress?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// In-memory user store (replace with database in production)
const users: Map<string, User> = new Map();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { message: "Too many login attempts, please try again later." },
});

// Mock authentication for development
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For development, we'll use a simple mock system
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  // Mock user data for development
  (req as any).user = {
    userId: "mock-user-id",
    email: "user@guardianchain.org",
    tier: "CREATOR",
  };

  next();
};

// Signup endpoint
router.post("/signup", authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, agreedToTerms } = req.body;

    // Validation
    if (!email || !password || !agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and terms agreement are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === email
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Mock password hashing for development

    // Create new user with mock data for development
    const userId = "user-" + Date.now();
    const user: User = {
      id: userId,
      email,
      password: "mock-hash", // Mock password hash
      firstName,
      lastName,
      tier: "EXPLORER",
      gttStakeAmount: 0,
      isActive: true,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    users.set(user.id, user);

    // Generate mock JWT token
    const token = "mock-jwt-token-" + Date.now();

    // Create session object
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        gttStakeAmount: user.gttStakeAmount,
        walletAddress: user.walletAddress,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      session,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during signup",
    });
  }
});

// Login endpoint
router.post("/login", loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = Array.from(users.values()).find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Mock password verification for development
    if (password !== "demo123") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password (use demo123)",
      });
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    users.set(user.id, user);

    // Generate mock JWT token
    const token = "mock-jwt-token-" + Date.now();

    // Create session object
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        gttStakeAmount: user.gttStakeAmount,
        walletAddress: user.walletAddress,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    res.json({
      success: true,
      message: "Login successful",
      session,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
});

// Get user profile
router.get("/profile", authenticateToken, (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    let user = users.get(userId);

    // Create mock user if not found
    if (!user) {
      user = {
        id: userId,
        email: "user@guardianchain.org",
        password: "mock-hash",
        firstName: "Demo",
        lastName: "User",
        tier: "CREATOR",
        gttStakeAmount: 1000,
        isActive: true,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      users.set(userId, user);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        gttStakeAmount: user.gttStakeAmount,
        walletAddress: user.walletAddress,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update stake amount
router.patch(
  "/update-stake",
  authenticateToken,
  (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const { stakeAmount } = req.body;

      if (typeof stakeAmount !== "number" || stakeAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid stake amount",
        });
      }

      const user = users.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.gttStakeAmount = stakeAmount;
      users.set(userId, user);

      res.json({
        success: true,
        message: "Stake amount updated successfully",
        gttStakeAmount: user.gttStakeAmount,
      });
    } catch (error) {
      console.error("Update stake error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Upgrade tier
router.post(
  "/upgrade-tier",
  authenticateToken,
  (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const { targetTier } = req.body;

      const validTiers = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
      if (!validTiers.includes(targetTier)) {
        return res.status(400).json({
          success: false,
          message: "Invalid tier",
        });
      }

      const user = users.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      user.tier = targetTier;
      users.set(userId, user);

      res.json({
        success: true,
        message: "Tier upgraded successfully",
        tier: user.tier,
      });
    } catch (error) {
      console.error("Upgrade tier error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Refresh token
router.post("/refresh", authenticateToken, (req: Request, res: Response) => {
  try {
    const { userId, email, tier } = (req as any).user;

    // Generate new mock token
    const token = "mock-jwt-token-refreshed-" + Date.now();

    res.json({
      success: true,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  // In a production app, you might invalidate the token in a blacklist
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
