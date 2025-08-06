import { Router } from "express";
import { authService } from "../services/AuthService";
import { insertUserSchema, updateUserSchema } from "../../shared/schema";
import type { Request, Response } from "express";
import { z } from "zod";
import "../types/session";

const router = Router();

// User registration endpoint
router.post("/register", async (req: Request, res: Response) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await authService.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Check if username is taken
    const existingUsername = await authService.getUserByUsername(validatedData.username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Create user and generate verification token
    const { user, verificationToken } = await authService.createUser(validatedData);

    // In a real app, you would send an email here
    // For now, we'll return the token for testing
    res.status(201).json({
      message: "User created successfully. Please verify your email.",
      userId: user.id,
      verificationToken, // Remove this in production
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email verification endpoint
router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    const user = await authService.verifyEmail(token);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    res.json({
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Simple login endpoint (for testing - would normally use proper authentication)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: "Please verify your email first" });
    }

    // Update last login
    await authService.updateLastLogin(user.id);

    // Create session (simplified for testing)
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.tier || "EXPLORER",
    };

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        tier: user.tier,
        onboardingCompleted: user.onboardingCompleted,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user endpoint
router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      twitter: user.twitter,
      github: user.github,
      linkedin: user.linkedin,
      profileImageUrl: user.profileImageUrl,
      tier: user.tier,
      subscriptionStatus: user.subscriptionStatus,
      onboardingCompleted: user.onboardingCompleted,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update profile endpoint
router.put("/profile", async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const validatedData = userProfileUpdateSchema.parse(req.body);
    
    // Check if username is taken (if being updated)
    if (validatedData.username) {
      const existingUser = await authService.getUserByUsername(validatedData.username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    const updatedUser = await authService.updateUserProfile(userId, validatedData);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        twitter: updatedUser.twitter,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin,
        profileImageUrl: updatedUser.profileImageUrl,
        tier: updatedUser.tier,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: error.errors });
    }
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Complete onboarding endpoint
router.post("/complete-onboarding", async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await authService.completeOnboarding(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Onboarding completed successfully",
      user: {
        id: user.id,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user activities endpoint
router.get("/activities", async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const activities = await authService.getUserActivities(userId, limit, offset);
    const stats = await authService.getUserStats(userId);

    res.json({
      activities,
      stats,
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;