import type { Express, RequestHandler } from "express";
// Enhanced authentication system for GuardianChain

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  tier: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  profileImageUrl?: string;
  walletAddress?: string;
  isWalletVerified: boolean;
  onboardingCompleted: boolean;
  subscriptionStatus?: "active" | "inactive" | "pending" | "cancelled";
  subscriptionTier?: string;
  subscriptionPlan?: "monthly" | "yearly";
  subscriptionExpiry?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  lastLoginAt: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    theme: "dark" | "light" | "auto";
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      capsulesPublic: boolean;
      allowAnalytics: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Enhanced authentication middleware with comprehensive user data
export const enhancedAuth: RequestHandler = (req: any, res, next) => {
  console.log("🔐 Enhanced Auth: Middleware called");
  console.log("🔐 Enhanced Auth: Path:", req.path);
  console.log("🔐 Enhanced Auth: Method:", req.method);

  // Simulate authentication check (in production, this would verify JWT/session)
  const isAuthenticated = true; // Replace with actual auth logic

  if (!isAuthenticated) {
    console.log("❌ Enhanced Auth: User not authenticated");
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "Please log in to access this resource",
      redirectTo: "/login"
    });
  }

  // Enhanced user object with comprehensive data
  const user: AuthUser = {
    id: "enhanced-user-789",
    email: "user@guardianchain.app",
    firstName: "Guardian",
    lastName: "User",
    username: "guardian_user_789",
    tier: "SEEKER",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    walletAddress: undefined,
    isWalletVerified: false,
    onboardingCompleted: true,
    subscriptionStatus: "active",
    subscriptionTier: "SEEKER",
    subscriptionPlan: "monthly",
    subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    stripeCustomerId: "cus_enhanced_customer_123",
    stripeSubscriptionId: "sub_enhanced_subscription_456",
    lastLoginAt: new Date().toISOString(),
    emailVerified: true,
    twoFactorEnabled: false,
    preferences: {
      theme: "dark",
      language: "en",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisible: true,
        capsulesPublic: false,
        allowAnalytics: true,
      },
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  req.user = user;
  console.log("✅ Enhanced Auth: User authenticated successfully");
  console.log("✅ Enhanced Auth: User tier:", user.tier);
  console.log("✅ Enhanced Auth: Subscription status:", user.subscriptionStatus);
  
  next();
};

// Authentication routes setup
export function setupEnhancedAuth(app: Express) {
  console.log("🔐 Setting up Enhanced Authentication System");

  // Login endpoint
  app.get("/api/auth/login", (req, res) => {
    console.log("🔐 Enhanced Auth: Login endpoint called");
    
    // In production, this would redirect to OAuth provider
    res.json({
      message: "Login successful",
      redirectTo: "/onboarding",
      user: {
        id: "enhanced-user-789",
        email: "user@guardianchain.app",
        tier: "SEEKER"
      }
    });
  });

  // Logout endpoint
  app.post("/api/auth/logout", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Logout endpoint called");
    console.log("🔐 Enhanced Auth: User logging out:", req.user.email);
    
    // Clear session/JWT in production
    res.json({
      message: "Logout successful",
      redirectTo: "/"
    });
  });

  // Get current user
  app.get("/api/auth/user", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Get user endpoint called");
    
    const user = req.user;
    
    // Add usage statistics
    const userWithUsage = {
      ...user,
      usage: {
        capsulesCreated: 12,
        capsulesLimit: user.tier === "EXPLORER" ? 5 : user.tier === "SEEKER" ? 25 : user.tier === "CREATOR" ? 100 : 500,
        gttEarned: 1250.75,
        truthScore: 87,
        verificationCount: 45,
        reelsCreated: 8,
        socialConnections: 156
      },
      subscription: user.subscriptionStatus === "active" ? {
        plan: user.subscriptionTier,
        billingCycle: user.subscriptionPlan,
        nextBillingDate: user.subscriptionExpiry,
        status: user.subscriptionStatus,
        features: getTierFeatures(user.tier),
        canUpgrade: user.tier !== "SOVEREIGN",
        canDowngrade: user.tier !== "EXPLORER"
      } : null
    };

    console.log("✅ Enhanced Auth: Returning user data with usage stats");
    res.json(userWithUsage);
  });

  // Update user profile
  app.patch("/api/auth/user/profile", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Update profile endpoint called");
    
    const updates = req.body;
    const user = req.user;
    
    // Validate and apply updates
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    console.log("✅ Enhanced Auth: Profile updated successfully");
    res.json(updatedUser);
  });

  // Update user preferences
  app.patch("/api/auth/user/preferences", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Update preferences endpoint called");
    
    const { preferences } = req.body;
    const user = req.user;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    
    console.log("✅ Enhanced Auth: Preferences updated successfully");
    res.json(updatedUser);
  });

  // Verify email
  app.post("/api/auth/verify-email", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Email verification endpoint called");
    
    const { verificationCode } = req.body;
    
    // Simulate email verification
    if (verificationCode === "123456") {
      const user = req.user;
      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();
      
      console.log("✅ Enhanced Auth: Email verified successfully");
      res.json({ success: true, message: "Email verified successfully" });
    } else {
      console.log("❌ Enhanced Auth: Invalid verification code");
      res.status(400).json({ error: "Invalid verification code" });
    }
  });

  // Connect wallet
  app.post("/api/auth/connect-wallet", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Connect wallet endpoint called");
    
    const { walletAddress, signature } = req.body;
    
    // Simulate wallet verification
    if (walletAddress && signature) {
      const user = req.user;
      user.walletAddress = walletAddress;
      user.isWalletVerified = true;
      user.updatedAt = new Date().toISOString();
      
      console.log("✅ Enhanced Auth: Wallet connected successfully");
      res.json({ 
        success: true, 
        message: "Wallet connected successfully",
        walletAddress: walletAddress
      });
    } else {
      console.log("❌ Enhanced Auth: Invalid wallet connection data");
      res.status(400).json({ error: "Invalid wallet connection data" });
    }
  });

  // Complete onboarding
  app.post("/api/auth/complete-onboarding", enhancedAuth, (req: any, res) => {
    console.log("🔐 Enhanced Auth: Complete onboarding endpoint called");
    
    const user = req.user;
    user.onboardingCompleted = true;
    user.updatedAt = new Date().toISOString();
    
    console.log("✅ Enhanced Auth: Onboarding completed successfully");
    res.json({ 
      success: true, 
      message: "Onboarding completed successfully",
      redirectTo: "/dashboard"
    });
  });
}

// Helper function to get tier features
function getTierFeatures(tier: string): string[] {
  const features = {
    EXPLORER: [
      "5 capsule mints per month",
      "Basic verification access",
      "Community support",
      "Standard yield rate"
    ],
    SEEKER: [
      "25 capsule mints per month",
      "5% yield bonus",
      "Priority verification queue",
      "Basic analytics dashboard",
      "Email support"
    ],
    CREATOR: [
      "100 capsule mints per month",
      "10% yield bonus",
      "Advanced analytics",
      "Custom verification seals",
      "Priority support",
      "Creator marketplace access"
    ],
    SOVEREIGN: [
      "500 capsule mints per month",
      "25% yield bonus",
      "Full analytics suite",
      "Custom branding options",
      "Dedicated support",
      "Early feature access",
      "API access",
      "Bulk operations"
    ]
  };
  
  return features[tier as keyof typeof features] || features.EXPLORER;
}

export type { AuthUser };