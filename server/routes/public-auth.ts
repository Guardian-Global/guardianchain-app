import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { storage } from "../storage";

const router = Router();

// Registration schema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3).max(20)
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    console.log("Registration attempt:", req.body);
    
    const { email, password, firstName, lastName, username } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    
    // Check if username is taken
    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      id: userId,
      email,
      firstName,
      lastName,
      username,
      passwordHash,
      profileImageUrl: null,
      bio: null,
      avatar: null,
      reputation: 0,
      xpPoints: 0,
      totalCapsules: 0,
      verifiedCapsules: 0,
      gttBalance: "0",
      badges: [],
      achievements: [],
      socialLinks: {},
      isVerified: false,
      roles: ["USER"],
      isActive: true,
      userTier: "EXPLORER",
      totalYieldClaimed: "0",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      walletAddress: null,
      lastLoginAt: new Date()
    };
    
    const user = await storage.upsertUser(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "guardianchain-secret-key",
      { expiresIn: "7d" }
    );
    
    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;
    
    console.log("User registered successfully:", user.id);
    
    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Registration failed", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log("Login attempt:", req.body.email);
    
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Update last login
    await storage.updateUserLastLogin(user.id);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "guardianchain-secret-key",
      { expiresIn: "7d" }
    );
    
    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;
    
    console.log("User logged in successfully:", user.id);
    
    res.json({
      message: "Login successful",
      user: userResponse,
      token
    });
    
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: "Login failed", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "guardianchain-secret-key") as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;
    
    res.json({ user: userResponse });
    
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;