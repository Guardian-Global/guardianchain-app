import { Router, Request, Response } from "express";
import {
  authenticateToken,
  generateToken,
  hashPassword,
  verifyPassword,
  isValidEmail,
  isValidPassword,
  rateLimiter,
  requireTier,
} from "../middleware/auth";
import { storage } from "../storage";

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes
const loginRateLimit = rateLimiter(10, 15 * 60 * 1000); // 10 login attempts per 15 minutes

/**
 * User Signup
 */
router.post("/signup", authRateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, agreedToTerms } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet requirements",
        errors: passwordValidation.errors,
      });
    }

    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the Terms of Service",
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await storage.createUser({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      tier: "EXPLORER", // Default tier
      gttStakeAmount: 0,
      emailVerified: false, // TODO: Implement email verification
      isActive: true,
      agreedToTermsAt: new Date(),
    });

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      session: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          tier: newUser.tier,
          gttStakeAmount: newUser.gttStakeAmount,
          createdAt: newUser.createdAt,
          lastLoginAt: new Date(),
          isActive: newUser.isActive,
          emailVerified: newUser.emailVerified,
        },
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during signup",
    });
  }
});

/**
 * User Login
 */
router.post("/login", loginRateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    await storage.updateUserLastLogin(user.id);

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      session: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          gttStakeAmount: user.gttStakeAmount,
          walletAddress: user.walletAddress,
          createdAt: user.createdAt,
          lastLoginAt: new Date(),
          isActive: user.isActive,
          emailVerified: user.emailVerified,
        },
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
});

/**
 * Logout (optional - mainly for logging)
 */
router.post(
  "/logout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // Log logout event (optional)
      console.log(
        `User ${req.user?.email} logged out at ${new Date().toISOString()}`
      );

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }
  }
);

/**
 * Refresh token
 */
router.post(
  "/refresh",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Invalid session",
        });
      }

      // Get fresh user data
      const user = await storage.getUserById(req.user.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive",
        });
      }

      // Generate new token
      const token = generateToken(user);

      res.json({
        success: true,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "Error refreshing token",
      });
    }
  }
);

/**
 * Update GTT stake amount
 */
router.patch(
  "/update-stake",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { stakeAmount } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (typeof stakeAmount !== "number" || stakeAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid stake amount",
        });
      }

      // Update user's stake amount
      await storage.updateUserStake(req.user.id, stakeAmount);

      res.json({
        success: true,
        message: "Stake amount updated successfully",
        stakeAmount,
      });
    } catch (error) {
      console.error("Stake update error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating stake amount",
      });
    }
  }
);

/**
 * Upgrade user tier (requires Stripe integration)
 */
router.post(
  "/upgrade-tier",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { targetTier, paymentMethodId, billingAddress } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Validate target tier
      const validTiers = ["SEEKER", "CREATOR", "SOVEREIGN"];
      if (!validTiers.includes(targetTier.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid target tier",
        });
      }

      // TODO: Implement Stripe subscription creation
      // This would involve:
      // 1. Create or update Stripe customer
      // 2. Create subscription with appropriate price ID
      // 3. Handle payment confirmation
      // 4. Update user tier in database

      // For now, simulate successful upgrade
      await storage.updateUserTier(req.user.id, targetTier.toUpperCase());

      res.json({
        success: true,
        message: `Successfully upgraded to ${targetTier} tier`,
        subscriptionId: "sim_subscription_id", // TODO: Real Stripe subscription ID
        targetTier: targetTier.toUpperCase(),
      });
    } catch (error) {
      console.error("Tier upgrade error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing tier upgrade",
      });
    }
  }
);

/**
 * Get current user profile
 */
router.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
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
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user profile",
      });
    }
  }
);

/**
 * Feature access check endpoint
 */
router.post(
  "/check-feature-access",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { feature } = req.body;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // TODO: Implement feature access checking logic based on user tier
      // This would check the user's tier against the feature requirements

      res.json({
        success: true,
        hasAccess: true, // TODO: Implement real access checking
        message: "Access granted",
      });
    } catch (error) {
      console.error("Feature access check error:", error);
      res.status(500).json({
        success: false,
        message: "Error checking feature access",
      });
    }
  }
);

export default router;
