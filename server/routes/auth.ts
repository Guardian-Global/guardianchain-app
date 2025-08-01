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

// Mock user database with persistent storage simulation
class UserStorage {
  private users = new Map();
  private sessions = new Map();
  
  findUserByEmail(email: string) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
  
  createUser(userData: any) {
    const id = `user-${Date.now()}`;
    const user = {
      id,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      tier: "EXPLORER",
      role: "USER",
      permissions: ["read:profile", "write:profile"],
      gttStakeAmount: 0,
      walletAddress: null,
      isActive: true,
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }
  
  updateUser(id: string, updates: any) {
    const user = this.users.get(id);
    if (user) {
      Object.assign(user, updates);
      this.users.set(id, user);
    }
    return user;
  }
  
  createSession(user: any, token: string) {
    const session = {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    this.sessions.set(token, session);
    return session;
  }
  
  getSession(token: string) {
    return this.sessions.get(token);
  }
  
  deleteSession(token: string) {
    this.sessions.delete(token);
  }
}

const userStorage = new UserStorage();

// Master admin credentials
const MASTER_CREDENTIALS = {
  email: "master@guardianchain.org",
  password: "masterkey123",
  masterKey: "GUARDIAN_MASTER_2025"
};

// Helper functions
function generateToken(userId: string): string {
  return `mock-jwt-token-${Date.now()}`;
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

    // Find user by email
    let foundUser = userStorage.findUserByEmail(email);

    // For demo purposes, create user if not exists
    if (!foundUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      foundUser = userStorage.createUser({ 
        email, 
        password: hashedPassword,
        firstName: email.split('@')[0],
        lastName: "User"
      });
    }

    // For demo: accept any password for existing users, or use "demo123" for new users
    const isValidPassword = foundUser.password === password || password === "demo123";
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password (use demo123)"
      });
    }

    // Update last login
    userStorage.updateUser(foundUser.id, { lastLoginAt: new Date() });

    // Generate token and session
    const token = generateToken(foundUser.id);
    const session = userStorage.createSession(foundUser, token);

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
    const existingUser = userStorage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userStorage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Generate token and session
    const token = generateToken(newUser.id);
    const session = userStorage.createSession(newUser, token);

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

    const { email, password } = validation.data;

    // Validate master credentials (simplified)
    if (email === "master@guardianchain.org" && password === "masterkey123") {
      const masterUser = {
        id: "master-admin-001",
        email: email,
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

      const token = generateToken(masterUser.id);
      const session = userStorage.createSession(masterUser, token);

      res.json({
        success: true,
        message: "Master admin access granted",
        session
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid master credentials"
      });
    }

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

    if (token) {
      userStorage.deleteSession(token);
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

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const session = userStorage.getSession(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (new Date() > session.expiresAt) {
      userStorage.deleteSession(token);
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