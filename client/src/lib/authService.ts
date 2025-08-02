/**
 * Secure Authentication Service for GUARDIANCHAIN
 * Implements tiered access control with Stripe integration
 */

import { UserTier, USER_TIERS } from "./yieldCalculations";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  gttStakeAmount: number;
  walletAddress?: string;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  emailVerified: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
  tier: UserTier;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agreedToTerms: boolean;
}

export interface TierUpgradeData {
  targetTier: string;
  paymentMethodId: string;
  billingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

class AuthenticationService {
  private currentSession: AuthSession | null = null;
  private sessionKey = "guardianchain_session";

  constructor() {
    this.loadStoredSession();
  }

  /**
   * Load session from localStorage on init
   */
  private loadStoredSession(): void {
    try {
      const stored = localStorage.getItem(this.sessionKey);
      if (stored) {
        const session = JSON.parse(stored);
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = {
            ...session,
            expiresAt: new Date(session.expiresAt),
          };
        } else {
          localStorage.removeItem(this.sessionKey);
        }
      }
    } catch (error) {
      console.error("Failed to load stored session:", error);
      localStorage.removeItem(this.sessionKey);
    }
  }

  /**
   * Store session in localStorage
   */
  private storeSession(session: AuthSession): void {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to store session:", error);
    }
  }

  /**
   * User signup with email verification
   */
  async signup(signupData: SignupData): Promise<{
    success: boolean;
    message: string;
    requiresVerification?: boolean;
  }> {
    try {
      // Validate signup data
      const validation = this.validateSignupData(signupData);
      if (!validation.isValid) {
        return { success: false, message: validation.errors.join(", ") };
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          message:
            "Account created successfully. Please check your email for verification.",
          requiresVerification: true,
        };
      } else {
        return { success: false, message: result.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Network error during signup" };
    }
  }

  /**
   * User login
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; message: string; session?: AuthSession }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success && result.session) {
        const session: AuthSession = {
          ...result.session,
          expiresAt: new Date(result.session.expiresAt),
          tier:
            USER_TIERS[result.session.user.tier.toUpperCase()] ||
            USER_TIERS.EXPLORER,
        };

        this.currentSession = session;
        this.storeSession(session);

        return { success: true, message: "Login successful", session };
      } else {
        return { success: false, message: result.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error during login" };
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      if (this.currentSession) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.currentSession.token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.currentSession = null;
      localStorage.removeItem(this.sessionKey);
    }
  }

  /**
   * Upgrade user tier with Stripe payment
   */
  async upgradeTier(
    upgradeData: TierUpgradeData,
  ): Promise<{ success: boolean; message: string; subscriptionId?: string }> {
    if (!this.currentSession) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await fetch("/api/auth/upgrade-tier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentSession.token}`,
        },
        body: JSON.stringify(upgradeData),
      });

      const result = await response.json();

      if (result.success) {
        // Update current session with new tier
        this.currentSession.user.tier = upgradeData.targetTier;
        this.currentSession.user.stripeSubscriptionId = result.subscriptionId;
        this.currentSession.tier =
          USER_TIERS[upgradeData.targetTier.toUpperCase()] ||
          USER_TIERS.EXPLORER;
        this.storeSession(this.currentSession);

        return {
          success: true,
          message: "Tier upgraded successfully",
          subscriptionId: result.subscriptionId,
        };
      } else {
        return {
          success: false,
          message: result.message || "Tier upgrade failed",
        };
      }
    } catch (error) {
      console.error("Tier upgrade error:", error);
      return { success: false, message: "Network error during tier upgrade" };
    }
  }

  /**
   * Update user's GTT stake amount
   */
  async updateStakeAmount(
    stakeAmount: number,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.currentSession) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await fetch("/api/auth/update-stake", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.currentSession.token}`,
        },
        body: JSON.stringify({ stakeAmount }),
      });

      const result = await response.json();

      if (result.success) {
        this.currentSession.user.gttStakeAmount = stakeAmount;
        this.storeSession(this.currentSession);
        return { success: true, message: "Stake amount updated" };
      } else {
        return { success: false, message: result.message || "Update failed" };
      }
    } catch (error) {
      console.error("Stake update error:", error);
      return { success: false, message: "Network error during update" };
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  hasFeatureAccess(feature: string): boolean {
    if (!this.currentSession) return false;

    return this.currentSession.tier.features.includes(feature);
  }

  /**
   * Check if user meets minimum stake for their tier
   */
  meetsStakeRequirement(): boolean {
    if (!this.currentSession) return false;

    return (
      this.currentSession.user.gttStakeAmount >=
      this.currentSession.tier.minStake
    );
  }

  /**
   * Get current user session
   */
  getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentSession && new Date() < this.currentSession.expiresAt;
  }

  /**
   * Validate signup data
   */
  private validateSignupData(data: SignupData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Valid email address is required");
    }

    if (!data.password || data.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      errors.push(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      );
    }

    if (!data.agreedToTerms) {
      errors.push("You must agree to the Terms of Service");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Refresh session token
   */
  async refreshSession(): Promise<boolean> {
    if (!this.currentSession) return false;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.currentSession.token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.token) {
        this.currentSession.token = result.token;
        this.currentSession.expiresAt = new Date(result.expiresAt);
        this.storeSession(this.currentSession);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      this.logout();
      return false;
    }
  }

  /**
   * Validate feature access with error message
   */
  validateFeatureAccess(feature: string): {
    hasAccess: boolean;
    message?: string;
    upgradeRequired?: boolean;
  } {
    if (!this.isAuthenticated()) {
      return {
        hasAccess: false,
        message: "Please log in to access this feature",
      };
    }

    if (!this.hasFeatureAccess(feature)) {
      const currentTier = this.currentSession!.tier;
      const availableTiers = Object.values(USER_TIERS).filter((tier) =>
        tier.features.includes(feature),
      );
      const minTier = availableTiers.sort((a, b) => a.price - b.price)[0];

      return {
        hasAccess: false,
        message: `This feature requires ${minTier.name} tier or higher. Your current tier: ${currentTier.name}`,
        upgradeRequired: true,
      };
    }

    if (!this.meetsStakeRequirement()) {
      const requiredStake = this.currentSession!.tier.minStake;
      const currentStake = this.currentSession!.user.gttStakeAmount;

      return {
        hasAccess: false,
        message: `This tier requires ${requiredStake} GTT staked. Your current stake: ${currentStake} GTT`,
        upgradeRequired: false,
      };
    }

    return { hasAccess: true };
  }
}

// Export singleton instance
export const authService = new AuthenticationService();

// Export service class for testing
export { AuthenticationService };
