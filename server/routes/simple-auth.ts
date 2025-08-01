import { Router } from "express";

const router = Router();

// Simple in-memory storage for demo
const demoUsers: any[] = [];
const demoSessions: Map<string, any> = new Map();

// Demo authentication - create account for any email/password combination
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // Find or create user
    let user = demoUsers.find(u => u.email === email);
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: "User",
        tier: "EXPLORER",
        role: "USER",
        permissions: ["read:profile", "write:profile"],
        gttStakeAmount: 0,
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };
      demoUsers.push(user);
    }

    // Create session
    const token = `demo-token-${Date.now()}`;
    const session = {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    demoSessions.set(token, session);

    res.json({
      success: true,
      message: "Login successful",
      session
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // Check if user exists
    const existingUser = demoUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Create new user
    const user = {
      id: `user-${Date.now()}`,
      email,
      firstName: firstName || email.split('@')[0],
      lastName: lastName || "User",
      tier: "EXPLORER",
      role: "USER",
      permissions: ["read:profile", "write:profile"],
      gttStakeAmount: 0,
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };
    
    demoUsers.push(user);

    // Create session
    const token = `demo-token-${Date.now()}`;
    const session = {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    
    demoSessions.set(token, session);

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
      message: "Signup failed"
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token && demoSessions.has(token)) {
      demoSessions.delete(token);
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
});

router.get("/profile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !demoSessions.has(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const session = demoSessions.get(token);
    if (new Date() > session.expiresAt) {
      demoSessions.delete(token);
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
    res.status(500).json({
      success: false,
      message: "Profile fetch failed"
    });
  }
});

export default router;