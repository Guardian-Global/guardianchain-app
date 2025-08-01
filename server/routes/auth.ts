import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "guardianchain-secret-key-2025";

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
  agreedToTerms: z.boolean()
});

const masterLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  masterKey: z.string().optional()
});

// Mock user database (replace with real database)
const users = new Map();
const sessions = new Map();

// Master admin credentials
const MASTER_CREDENTIALS = {
  email: "master@guardianchain.org",
  password: "masterkey123",
  masterKey: "GUARDIAN_MASTER_2025"
};

// Helper functions
function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function createUser(data: any) {
  const user = {
    id: Math.random().toString(36).substr(2, 9),
    email: data.email,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    tier: "EXPLORER",
    role: "USER",
    permissions: ["read:profile", "write:profile"],
    gttStakeAmount: 0,
    walletAddress: null,
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date(),
    lastLoginAt: new Date()
  };
  
  users.set(user.id, user);
  return user;
}

function createMasterUser(data: any) {
  const user = {
    id: "master-admin-001",
    email: data.email,
    firstName: "Master",
    lastName: "Admin",
    tier: "SOVEREIGN",
    role: "MASTER_ADMIN",
    permissions: ["*"],
    gttStakeAmount: 1000000,
    walletAddress: null,
    isActive: true,
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date(),
    lastLoginAt: new Date()
  };
  
  users.set(user.id, user);
  return user;
}

function createSession(user: any, token: string) {
  const session = {
    user,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  sessions.set(token, session);
  return session;
}

// Authentication routes
router.post("/login", async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validation.error.errors
      });
    }

    const { email, password } = validation.data;

    // Find user by email (mock implementation)
    let foundUser = null;
    for (const [id, user] of users.entries()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    // Create demo user if not found
    if (!foundUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      foundUser = createUser({ email, password: hashedPassword });
    }

    // Update last login
    foundUser.lastLoginAt = new Date();

    // Generate token and session
    const token = generateToken(foundUser.id);
    const session = createSession(foundUser, token);

    res.json({
      success: true,
      message: "Login successful",
      session
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validation.error.errors
      });
    }

    const { email, password, firstName, lastName } = validation.data;

    // Check if user already exists
    for (const [id, user] of users.entries()) {
      if (user.email === email) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists"
        });
      }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Generate token and session
    const token = generateToken(newUser.id);
    const session = createSession(newUser, token);

    res.json({
      success: true,
      message: "Account created successfully",
      session,
      redirectTo: "/onboarding"
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during signup"
    });
  }
});

router.post("/master-login", async (req, res) => {
  try {
    const validation = masterLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data"
      });
    }

    const { email, password, masterKey } = validation.data;

    // Validate master credentials
    if (email !== MASTER_CREDENTIALS.email || 
        password !== MASTER_CREDENTIALS.password ||
        masterKey !== MASTER_CREDENTIALS.masterKey) {
      return res.status(401).json({
        success: false,
        message: "Invalid master credentials"
      });
    }

    // Create or get master user
    let masterUser = users.get("master-admin-001");
    if (!masterUser) {
      masterUser = createMasterUser({ email });
    }

    // Update last login
    masterUser.lastLoginAt = new Date();

    // Generate token and session
    const token = generateToken(masterUser.id);
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
      message: "Internal server error during master login"
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token && sessions.has(token)) {
      sessions.delete(token);
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout"
    });
  }
});

router.get("/profile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !sessions.has(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const session = sessions.get(token);
    if (new Date() > session.expiresAt) {
      sessions.delete(token);
      return res.status(401).json({
        success: false,
        message: "Session expired"
      });
    }

    res.json({
      success: true,
      user: session.user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;