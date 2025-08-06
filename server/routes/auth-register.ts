import { Router } from "express";
import { pool } from "../db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Request, Response } from "express";

const router = Router();

// User registration schema for validation
const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  tier: z.enum(["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"]).default("EXPLORER")
});

// Complete user registration with database persistence
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validatedData = registrationSchema.parse(req.body);
    
    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [validatedData.email]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists with this email" 
        });
      }

      // Check if username is taken (if provided)
      if (validatedData.username) {
        const existingUsername = await client.query(
          "SELECT id FROM users WHERE username = $1",
          [validatedData.username]
        );
        
        if (existingUsername.rows.length > 0) {
          return res.status(400).json({ 
            success: false, 
            message: "Username is already taken" 
          });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      // Generate user ID and session token
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const verificationToken = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new user in database
      const result = await client.query(`
        INSERT INTO users (
          id, email, first_name, last_name, username, password_hash, tier,
          session_token, token_expires_at, email_verified, is_active,
          created_at, updated_at, onboarding_completed, gtt_balance,
          total_capsules, verified_capsules, social_links
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 
          NOW() + INTERVAL '24 hours', false, true, 
          NOW(), NOW(), false, 0, 0, 0, '{}'
        ) RETURNING 
          id, email, first_name, last_name, username, tier, 
          email_verified, created_at, updated_at
      `, [
        userId,
        validatedData.email,
        validatedData.firstName,
        validatedData.lastName,
        validatedData.username || `user_${Date.now()}`,
        hashedPassword,
        validatedData.tier,
        sessionToken
      ]);

      const newUser = result.rows[0];

      // Set session cookie
      res.cookie("guardian_session_token", sessionToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/"
      });

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          username: newUser.username,
          tier: newUser.tier,
          emailVerified: newUser.email_verified,
          onboardingCompleted: false,
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at
        },
        sessionToken,
        redirectTo: "/onboarding"
      });

    } finally {
      client.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        message: "Validation failed", 
        errors: error.errors 
      });
    }
    console.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// User login with database verification
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const client = await pool.connect();
    try {
      // Get user from database
      const result = await client.query(`
        SELECT 
          id, email, first_name, last_name, username, password_hash, tier,
          email_verified, is_active, onboarding_completed, profile_image_url,
          gtt_balance, total_capsules, verified_capsules, social_links,
          created_at, updated_at
        FROM users 
        WHERE email = $1 AND is_active = true
      `, [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid email or password" 
        });
      }

      // Generate new session token
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update session token and last login
      await client.query(`
        UPDATE users 
        SET 
          session_token = $2,
          token_expires_at = NOW() + INTERVAL '24 hours',
          last_login_at = NOW(),
          updated_at = NOW()
        WHERE id = $1
      `, [user.id, sessionToken]);

      // Set session cookie
      res.cookie("guardian_session_token", sessionToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/"
      });

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          tier: user.tier,
          profileImageUrl: user.profile_image_url,
          emailVerified: user.email_verified,
          onboardingCompleted: user.onboarding_completed,
          gttBalance: user.gtt_balance,
          totalCapsules: user.total_capsules,
          verifiedCapsules: user.verified_capsules,
          socialLinks: user.social_links,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        },
        sessionToken,
        redirectTo: user.onboarding_completed ? "/dashboard" : "/onboarding"
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// Complete onboarding process
router.post("/complete-onboarding", async (req: Request, res: Response) => {
  try {
    const { 
      profileData, 
      preferences, 
      interests,
      walletAddress,
      tier 
    } = req.body;

    // Get session token from cookie
    const sessionToken = req.cookies.guardian_session_token;
    if (!sessionToken) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated" 
      });
    }

    const client = await pool.connect();
    try {
      // Get user by session token
      const userResult = await client.query(`
        SELECT id FROM users 
        WHERE session_token = $1 
        AND token_expires_at > NOW()
      `, [sessionToken]);

      if (userResult.rows.length === 0) {
        return res.status(401).json({ 
          success: false,
          message: "Invalid or expired session" 
        });
      }

      const userId = userResult.rows[0].id;

      // Update user profile with onboarding data
      const updateResult = await client.query(`
        UPDATE users 
        SET 
          bio = COALESCE($2, bio),
          wallet_address = COALESCE($3, wallet_address),
          tier = COALESCE($4, tier),
          interests = COALESCE($5, interests),
          social_links = COALESCE($6, social_links),
          onboarding_completed = true,
          updated_at = NOW()
        WHERE id = $1
        RETURNING 
          id, email, first_name, last_name, username, bio,
          wallet_address, tier, interests, social_links,
          onboarding_completed, updated_at
      `, [
        userId,
        profileData?.bio,
        walletAddress,
        tier,
        interests ? JSON.stringify(interests) : null,
        preferences ? JSON.stringify(preferences) : null
      ]);

      const updatedUser = updateResult.rows[0];

      res.json({
        success: true,
        message: "Onboarding completed successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          username: updatedUser.username,
          bio: updatedUser.bio,
          walletAddress: updatedUser.wallet_address,
          tier: updatedUser.tier,
          interests: updatedUser.interests,
          socialLinks: updatedUser.social_links,
          onboardingCompleted: updatedUser.onboarding_completed,
          updatedAt: updatedUser.updated_at
        },
        redirectTo: "/dashboard"
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Onboarding completion error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to complete onboarding" 
    });
  }
});

export default router;