import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { storage } from "./storage";

const router = Router();

// JWT secret for authentication
const JWT_SECRET = process.env.JWT_SECRET || "guardianchain-unified-secret-2025";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  isMaster: z.boolean().optional()
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  agreedToTerms: z.boolean()
});

const masterLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  masterKey: z.string().optional()
});

// Master admin credentials (from system upgrade specifications)
const MASTER_CREDENTIALS = {
  email: "master@guardianchain.org",
  password: "masterkey123",
  masterKey: "GUARDIAN_MASTER_2025"
};

// JWT token generation
function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

// Create session object
function createSession(user: any, token: string) {
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username || user.firstName,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.tier || "EXPLORER",
      role: user.role || "USER",
      permissions: user.permissions || [],
      gttStakeAmount: user.gttStakeAmount || 0,
      walletAddress: user.walletAddress,
      isActive: user.isActive !== false,
      emailVerified: user.emailVerified || false,
      twoFactorEnabled: user.twoFactorEnabled || false,
      createdAt: user.createdAt,
      lastLoginAt: new Date()
    },
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
}

// Authentication middleware
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = decoded;
    req.userId = decoded.userId;
    next();
  });
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || "");
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Update last login
    await storage.updateUser(user.id, { lastLogin: new Date() });

    // Generate token and session
    const token = generateToken(user.id, user.role || "USER");
    const session = createSession(user, token);

    res.json({
      success: true,
      message: "Login successful",
      session
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Account with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create new user
    const newUser = await storage.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      tier: "EXPLORER",
      role: "USER",
      gttStakeAmount: 0,
      agreedToTerms: data.agreedToTerms
    });

    // Generate token and session
    const token = generateToken(newUser.id, newUser.role);
    const session = createSession(newUser, token);

    res.json({
      success: true,
      message: "Account created successfully",
      session
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create account"
    });
  }
});

// POST /api/auth/master-login
router.post("/master-login", async (req, res) => {
  try {
    const { email, password, masterKey } = masterLoginSchema.parse(req.body);

    // Validate master credentials
    if (email !== MASTER_CREDENTIALS.email ||
        password !== MASTER_CREDENTIALS.password ||
        masterKey !== MASTER_CREDENTIALS.masterKey) {
      return res.status(401).json({
        success: false,
        message: "Invalid master credentials"
      });
    }

    // Check if master admin user exists, create if not
    let masterUser = await storage.getUserByEmail(email);
    if (!masterUser) {
      const hashedPassword = await bcrypt.hash(password, 12);
      masterUser = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: "Master",
        lastName: "Admin",
        tier: "SOVEREIGN",
        role: "MASTER_ADMIN",
        gttStakeAmount: 1000000, // 1M GTT stake
        agreedToTerms: true
      });
    }

    // Update last login
    await storage.updateUser(masterUser.id, { lastLogin: new Date() });

    // Generate token and session
    const token = generateToken(masterUser.id, masterUser.role);
    const session = createSession(masterUser, token);

    res.json({
      success: true,
      message: "Master admin access granted",
      session
    });
  } catch (error) {
    console.error("Master login error:", error);
    res.status(500).json({
      success: false,
      message: "Master authentication failed"
    });
  }
});

// GET /api/auth/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await storage.getUser(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username || user.firstName,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        role: user.role,
        permissions: user.permissions || [],
        gttStakeAmount: user.gttStakeAmount,
        walletAddress: user.walletAddress,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLogin
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile"
    });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you might invalidate the token in a blacklist
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
});

// POST /api/auth/refresh
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    const user = await storage.getUser(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new token
    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed"
    });
  }
});

export default router;