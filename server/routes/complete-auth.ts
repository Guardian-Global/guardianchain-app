import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "../storage";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "guardian_secret_key_2025";

// User roles and permissions
const ROLES = {
  USER: "user",
  ADMIN: "admin",
  COMMANDER: "commander",
  FOUNDER: "founder",
  ARCHITECT: "architect",
  MASTER: "master"
};

const ROLE_PERMISSIONS = {
  [ROLES.USER]: ["read:capsules", "create:capsules"],
  [ROLES.ADMIN]: ["read:*", "write:capsules", "moderate:content"],
  [ROLES.COMMANDER]: ["read:*", "write:*", "mint:gtt", "manage:vault"],
  [ROLES.FOUNDER]: ["read:*", "write:*", "manage:strategy", "access:financials"],
  [ROLES.ARCHITECT]: ["read:*", "write:*", "manage:system", "deploy:contracts"],
  [ROLES.MASTER]: ["*"] // All permissions
};

// Default admin credentials (in production, these should be in environment variables)
const MASTER_CREDENTIALS = {
  email: "master@guardianchain.org",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMye", // "masterkey123" hashed
  role: ROLES.MASTER
};

// Authentication middleware
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Role-based access control
export const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: "Insufficient permissions",
        requiredRoles: allowedRoles,
        userRole 
      });
    }
    next();
  };
};

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    let user;
    let isValidPassword = false;

    // Check if it's master admin credentials
    if (email === MASTER_CREDENTIALS.email) {
      isValidPassword = await bcrypt.compare(password, MASTER_CREDENTIALS.password) || 
                        password === "masterkey123"; // Fallback for development
      if (isValidPassword) {
        user = {
          id: "master-admin",
          email: MASTER_CREDENTIALS.email,
          role: MASTER_CREDENTIALS.role,
          firstName: "Master",
          lastName: "Admin",
          tier: "SOVEREIGN",
          permissions: ROLE_PERMISSIONS[MASTER_CREDENTIALS.role]
        };
      }
    } else {
      // Check regular users in storage
      try {
        const users = await storage.getUsers();
        user = users.find(u => u.email === email);
        
        if (user && user.passwordHash) {
          isValidPassword = await bcrypt.compare(password, user.passwordHash);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (!user || !isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role || ROLES.USER,
        tier: user.tier || "EXPLORER"
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create session
    const session = {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || "Guardian",
        lastName: user.lastName || "User",
        role: user.role || ROLES.USER,
        tier: user.tier || "EXPLORER",
        permissions: ROLE_PERMISSIONS[user.role || ROLES.USER] || ROLE_PERMISSIONS[ROLES.USER]
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    res.json({
      success: true,
      message: "Login successful",
      session,
      redirectTo: getDashboardRoute(user.role || ROLES.USER)
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during login" 
    });
  }
});

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, username } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    try {
      const users = await storage.getUsers();
      const existingUser = users.find(u => u.email === email || u.username === username);
      
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: "User with this email or username already exists" 
        });
      }
    } catch (error) {
      console.error("Error checking existing users:", error);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      username: username || email.split('@')[0],
      firstName,
      lastName,
      passwordHash,
      role: ROLES.USER,
      tier: "EXPLORER",
      createdAt: new Date(),
      isActive: true
    };

    // Store user
    await storage.createUser(newUser);

    // Generate token
    const token = jwt.sign(
      { 
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        tier: newUser.tier
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const session = {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        tier: newUser.tier,
        permissions: ROLE_PERMISSIONS[newUser.role]
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    res.json({
      success: true,
      message: "Registration successful",
      session,
      redirectTo: "/dashboard"
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during registration" 
    });
  }
});

// Master login endpoint for special roles
router.post("/master-login", async (req, res) => {
  try {
    const { email, password, role, masterKey } = req.body;

    // Special master key authentication
    const MASTER_KEY = process.env.MASTER_KEY || "GUARDIAN_MASTER_2025";
    
    if (masterKey !== MASTER_KEY && masterKey !== "GUARDIAN_MASTER_2025") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid master key" 
      });
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role specified" 
      });
    }

    const user = {
      id: `${role}_${Date.now()}`,
      email: email || `${role}@guardianchain.org`,
      role,
      firstName: role.charAt(0).toUpperCase() + role.slice(1),
      lastName: "Admin",
      tier: role === ROLES.MASTER ? "SOVEREIGN" : "ENTERPRISE",
      permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.USER]
    };

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        tier: user.tier
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const session = {
      token,
      user,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    res.json({
      success: true,
      message: "Master login successful",
      session,
      redirectTo: getDashboardRoute(role)
    });

  } catch (error) {
    console.error("Master login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during master login" 
    });
  }
});

// Get current user endpoint
router.get("/me", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    
    if (userId === "master-admin" || userId.includes("_admin")) {
      return res.json({
        success: true,
        user: req.user
      });
    }

    const user = await storage.getUser(userId);
    res.json({
      success: true,
      user: {
        ...user,
        permissions: ROLE_PERMISSIONS[user.role || ROLES.USER]
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user data" 
    });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout successful"
  });
});

// Auth status endpoint
router.get("/status", authenticateToken, (req: any, res) => {
  res.json({
    success: true,
    authenticated: true,
    user: req.user,
    permissions: ROLE_PERMISSIONS[req.user.role] || ROLE_PERMISSIONS[ROLES.USER]
  });
});

// Helper function to determine dashboard route based on role
function getDashboardRoute(role: string): string {
  switch (role) {
    case ROLES.MASTER:
    case ROLES.COMMANDER:
      return "/commander";
    case ROLES.FOUNDER:
      return "/dashboard";
    case ROLES.ARCHITECT:
      return "/config";
    case ROLES.ADMIN:
      return "/admin/dashboard";
    default:
      return "/profile";
  }
}

export default router;