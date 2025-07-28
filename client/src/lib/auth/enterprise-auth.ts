/**
 * Enterprise-Grade Authentication System
 * Multi-provider auth with AI-assisted onboarding and tiered access
 */

import { z } from "zod";

// User tier definitions with enterprise-grade permissions
export const USER_TIERS = {
  STARTER: "starter",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
  SOVEREIGN: "sovereign",
} as const;

export type UserTier = (typeof USER_TIERS)[keyof typeof USER_TIERS];

export interface AuthProvider {
  id: string;
  name: string;
  type: "oauth" | "web3" | "biometric" | "enterprise";
  enabled: boolean;
  config?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  tier: UserTier;
  verificationLevel: "basic" | "verified" | "enterprise" | "sovereign";
  permissions: string[];
  onboardingStep: number;
  aiAssistantEnabled: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  metadata: Record<string, any>;
}

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  provider: string;
  deviceFingerprint?: string;
  ipAddress?: string;
  location?: string;
}

// Authentication providers configuration
export const AUTH_PROVIDERS: AuthProvider[] = [
  {
    id: "google-oauth",
    name: "Google",
    type: "oauth",
    enabled: true,
    config: {
      scopes: ["email", "profile"],
      prompt: "consent",
    },
  },
  {
    id: "github-oauth",
    name: "GitHub",
    type: "oauth",
    enabled: true,
    config: {
      scopes: ["user:email", "read:user"],
    },
  },
  {
    id: "metamask-web3",
    name: "MetaMask",
    type: "web3",
    enabled: true,
    config: {
      chainId: 1,
      requiredChains: [1, 137, 80001],
    },
  },
  {
    id: "coinbase-web3",
    name: "Coinbase Wallet",
    type: "web3",
    enabled: true,
  },
  {
    id: "stripe-identity",
    name: "Stripe Identity",
    type: "enterprise",
    enabled: true,
    config: {
      verification_session: {
        type: "document",
        options: {
          document: {
            allowed_types: ["driving_license", "passport", "id_card"],
            require_id_number: true,
            require_matching_selfie: true,
          },
        },
      },
    },
  },
  {
    id: "webauthn-biometric",
    name: "Biometric Auth",
    type: "biometric",
    enabled: true,
    config: {
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
    },
  },
];

// Tier-based permissions system
export const TIER_PERMISSIONS = {
  [USER_TIERS.STARTER]: [
    "capsule:create:basic",
    "viral-tools:access:limited",
    "profile:edit:basic",
  ],
  [USER_TIERS.PROFESSIONAL]: [
    "capsule:create:unlimited",
    "viral-tools:access:full",
    "ai-analysis:access:standard",
    "profile:edit:advanced",
    "export:data:csv",
  ],
  [USER_TIERS.ENTERPRISE]: [
    "capsule:create:unlimited",
    "viral-tools:access:full",
    "ai-analysis:access:premium",
    "admin:dashboard:view",
    "compliance:monitoring:access",
    "api:enterprise:access",
    "export:data:all",
    "white-label:access",
  ],
  [USER_TIERS.SOVEREIGN]: [
    "all:permissions",
    "admin:full:access",
    "system:configuration:modify",
    "ai-training:access",
    "revenue:analytics:full",
  ],
};

// AI onboarding steps
export const ONBOARDING_STEPS = [
  {
    id: 1,
    title: "Welcome & Profile Setup",
    description: "Basic profile information and tier selection",
    aiPrompt:
      "Help user understand their verification needs and select optimal tier",
    requiredFields: ["username", "email", "tier"],
  },
  {
    id: 2,
    title: "Security Configuration",
    description: "Multi-factor authentication and security preferences",
    aiPrompt: "Recommend security settings based on user tier and risk profile",
    requiredFields: ["authMethods", "securityPreferences"],
  },
  {
    id: 3,
    title: "Verification Process",
    description: "Identity verification and compliance checks",
    aiPrompt:
      "Guide user through verification requirements for their jurisdiction",
    requiredFields: ["verification", "compliance"],
  },
  {
    id: 4,
    title: "Tool Configuration",
    description: "Configure viral tools and AI preferences",
    aiPrompt: "Customize tool settings based on user goals and use cases",
    requiredFields: ["toolPreferences", "aiSettings"],
  },
  {
    id: 5,
    title: "Integration Setup",
    description: "Connect external accounts and APIs",
    aiPrompt: "Help optimize integrations for maximum value extraction",
    requiredFields: ["integrations"],
  },
];

// Validation schemas
export const userProfileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().optional(),
  tier: z.enum([
    USER_TIERS.STARTER,
    USER_TIERS.PROFESSIONAL,
    USER_TIERS.ENTERPRISE,
    USER_TIERS.SOVEREIGN,
  ]),
  verificationLevel: z.enum(["basic", "verified", "enterprise", "sovereign"]),
  metadata: z.record(z.any()).optional(),
});

export const authRequestSchema = z.object({
  provider: z.string(),
  returnUrl: z.string().url().optional(),
  tier: z
    .enum([
      USER_TIERS.STARTER,
      USER_TIERS.PROFESSIONAL,
      USER_TIERS.ENTERPRISE,
      USER_TIERS.SOVEREIGN,
    ])
    .optional(),
});

// Enterprise authentication class
export class EnterpriseAuth {
  private baseUrl: string;

  constructor(baseUrl: string = "/api/auth") {
    this.baseUrl = baseUrl;
  }

  // Initiate authentication with provider
  async authenticate(
    provider: string,
    options?: {
      tier?: UserTier;
      returnUrl?: string;
      metadata?: Record<string, any>;
    }
  ) {
    const response = await fetch(`${this.baseUrl}/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error("Authentication initiation failed");
    }

    const data = await response.json();

    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }

    return data;
  }

  // Get current session
  async getSession(): Promise<AuthSession | null> {
    try {
      const response = await fetch(`${this.baseUrl}/session`, {
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Session retrieval failed:", error);
      return null;
    }
  }

  // Get user profile
  async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Profile retrieval failed:", error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Profile update failed");
    }

    return await response.json();
  }

  // Check permissions
  hasPermission(user: UserProfile, permission: string): boolean {
    if (user.tier === USER_TIERS.SOVEREIGN) {
      return true; // Sovereign tier has all permissions
    }

    const tierPermissions = TIER_PERMISSIONS[user.tier] || [];
    return (
      tierPermissions.includes(permission) ||
      user.permissions.includes(permission)
    );
  }

  // Get AI onboarding recommendations
  async getOnboardingRecommendations(
    step: number,
    userContext?: Record<string, any>
  ) {
    try {
      const response = await fetch(
        `${this.baseUrl}/onboarding/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            step,
            userContext,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Onboarding recommendations failed");
      }

      return await response.json();
    } catch (error) {
      console.error("AI onboarding failed:", error);
      return {
        recommendations: [
          "Complete your profile setup",
          "Verify your identity",
          "Configure security settings",
        ],
        nextSteps: [
          "Choose verification method",
          "Set up two-factor authentication",
        ],
        estimatedTime: "5-10 minutes",
      };
    }
  }

  // Logout
  async logout() {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    // Clear any local storage
    localStorage.removeItem("auth_session");
    localStorage.removeItem("user_preferences");

    return true;
  }
}

// Singleton instance
export const enterpriseAuth = new EnterpriseAuth();

// Utility functions
export function getTierDisplayName(tier: UserTier): string {
  const names = {
    [USER_TIERS.STARTER]: "Starter",
    [USER_TIERS.PROFESSIONAL]: "Professional",
    [USER_TIERS.ENTERPRISE]: "Enterprise",
    [USER_TIERS.SOVEREIGN]: "Sovereign",
  };
  return names[tier];
}

export function getTierColor(tier: UserTier): string {
  const colors = {
    [USER_TIERS.STARTER]: "bg-blue-500",
    [USER_TIERS.PROFESSIONAL]: "bg-purple-500",
    [USER_TIERS.ENTERPRISE]: "bg-gold-500",
    [USER_TIERS.SOVEREIGN]: "bg-gradient-to-r from-purple-500 to-gold-500",
  };
  return colors[tier];
}

export function getRequiredVerificationLevel(tier: UserTier): string {
  const levels = {
    [USER_TIERS.STARTER]: "basic",
    [USER_TIERS.PROFESSIONAL]: "verified",
    [USER_TIERS.ENTERPRISE]: "enterprise",
    [USER_TIERS.SOVEREIGN]: "sovereign",
  };
  return levels[tier];
}
