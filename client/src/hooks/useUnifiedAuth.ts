import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { z } from "zod";

// Simple schemas for authentication
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

// Unified authentication types
export interface UnifiedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: string;
  role: string;
  permissions: string[];
  gttStakeAmount: number;
  walletAddress?: string;
  isActive: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthSession {
  user: UnifiedUser;
  token: string;
  expiresAt: Date;
}

export interface UnifiedAuthContextType {
  user: UnifiedUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Basic authentication
  login: (credentials: z.infer<typeof loginSchema>) => Promise<AuthResult>;
  register: (data: z.infer<typeof registerSchema>) => Promise<AuthResult>;
  logout: () => Promise<void>;
  
  // Enterprise authentication
  masterLogin: (credentials: z.infer<typeof masterLoginSchema>) => Promise<AuthResult>;
  
  // Multi-provider authentication
  authenticateWithProvider: (provider: string, options?: any) => Promise<AuthResult>;
  
  // Session management
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  
  // Permissions and access control
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasTier: (requiredTier: string) => boolean;
  
  // Account management
  updateProfile: (updates: Partial<UnifiedUser>) => Promise<boolean>;
  updateStake: (amount: number) => Promise<boolean>;
  upgradeTier: (targetTier: string, paymentData?: any) => Promise<boolean>;
  
  // 2FA management
  enableTwoFactor: () => Promise<{ secret: string; qrCode: string }>;
  verifyTwoFactor: (token: string) => Promise<boolean>;
  disableTwoFactor: (token: string) => Promise<boolean>;
  
  // Security
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
  requires2FA?: boolean;
  session?: AuthSession;
}

// Context and provider
const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null);

// Storage keys
const TOKEN_KEY = "guardianchain_unified_token";
const SESSION_KEY = "guardianchain_unified_session";

// Master admin credentials (from audit)
const MASTER_CREDENTIALS = {
  email: "master@guardianchain.org",
  password: "masterkey123",
  masterKey: "GUARDIAN_MASTER_2025"
};

// Tier hierarchy for access control
const TIER_HIERARCHY = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];

export function UnifiedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedSession = localStorage.getItem(SESSION_KEY);

      if (storedToken && storedSession) {
        const parsedSession = JSON.parse(storedSession);
        const expiresAt = new Date(parsedSession.expiresAt);

        if (expiresAt > new Date()) {
          const sessionData = {
            ...parsedSession,
            expiresAt
          };
          setSession(sessionData);
          setUser(sessionData.user);
          
          // Verify session with server
          await verifySession(storedToken);
        } else {
          clearStoredSession();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearStoredSession();
    } finally {
      setIsLoading(false);
    }
  };

  const verifySession = async (token: string) => {
    try {
      const response = await authRequest("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.success) {
        clearStoredSession();
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      clearStoredSession();
    }
  };

  const storeSession = (sessionData: AuthSession) => {
    localStorage.setItem(TOKEN_KEY, sessionData.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  };

  const clearStoredSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setUser(null);
  };

  const authRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Basic authentication methods
  const login = async (credentials: z.infer<typeof loginSchema>): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
      });

      if (response.success && response.session) {
        const sessionData = {
          ...response.session,
          expiresAt: new Date(response.session.expiresAt)
        };

        setSession(sessionData);
        setUser(sessionData.user);
        storeSession(sessionData);

        return {
          success: true,
          message: response.message,
          session: sessionData
        };
      }

      return {
        success: false,
        message: response.message || "Login failed"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error during login";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: z.infer<typeof registerSchema>): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data)
      });

      if (response.success && response.session) {
        const sessionData = {
          ...response.session,
          expiresAt: new Date(response.session.expiresAt)
        };

        setSession(sessionData);
        setUser(sessionData.user);
        storeSession(sessionData);

        return {
          success: true,
          message: response.message,
          redirectTo: "/onboarding",
          session: sessionData
        };
      }

      return {
        success: false,
        message: response.message || "Registration failed"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error during registration";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const masterLogin = async (credentials: z.infer<typeof masterLoginSchema>): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate master credentials
      if (credentials.email === MASTER_CREDENTIALS.email && 
          credentials.password === MASTER_CREDENTIALS.password &&
          credentials.masterKey === MASTER_CREDENTIALS.masterKey) {
        
        const response = await authRequest("/auth/master-login", {
          method: "POST",
          body: JSON.stringify(credentials)
        });

        if (response.success && response.session) {
          const sessionData = {
            ...response.session,
            expiresAt: new Date(response.session.expiresAt)
          };

          setSession(sessionData);
          setUser(sessionData.user);
          storeSession(sessionData);

          return {
            success: true,
            message: "Master admin access granted",
            redirectTo: "/master-admin",
            session: sessionData
          };
        }
      }

      return {
        success: false,
        message: "Invalid master credentials"
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error during master login";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const authenticateWithProvider = async (provider: string, options?: any): Promise<AuthResult> => {
    try {
      setError(null);
      
      // Redirect to provider authentication endpoint
      window.location.href = `/api/auth/${provider}?${new URLSearchParams(options || {})}`;
      
      return { success: true, message: "Redirecting to provider..." };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Provider authentication failed";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      if (session?.token) {
        await authRequest("/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.token}` }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredSession();
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!session?.token) return false;

      const response = await authRequest("/auth/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` }
      });

      if (response.success && response.token) {
        const newSession = {
          ...session,
          token: response.token,
          expiresAt: new Date(response.expiresAt)
        };
        setSession(newSession);
        storeSession(newSession);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      await logout();
      return false;
    }
  };

  const checkAuth = async () => {
    if (!session?.token) return;

    try {
      const response = await authRequest("/auth/profile", {
        headers: { Authorization: `Bearer ${session.token}` }
      });

      if (response.success) {
        setUser(response.user);
      } else {
        await logout();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await logout();
    }
  };

  // Permission and access control methods
  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    
    // Master admin and founder have all permissions
    if (user.role === "MASTER_ADMIN" || user.role === "FOUNDER") {
      return true;
    }
    
    return user.permissions.includes(permission) || user.permissions.includes("*");
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasTier = (requiredTier: string): boolean => {
    if (!user?.tier) return false;
    
    // Master admin and founder have access to all tiers
    if (user.role === "MASTER_ADMIN" || user.role === "FOUNDER") {
      return true;
    }
    
    const userTierIndex = TIER_HIERARCHY.indexOf(user.tier.toUpperCase());
    const requiredTierIndex = TIER_HIERARCHY.indexOf(requiredTier.toUpperCase());
    return userTierIndex >= requiredTierIndex;
  };

  // Account management methods
  const updateProfile = async (updates: Partial<UnifiedUser>): Promise<boolean> => {
    try {
      if (!session?.token) return false;

      const response = await authRequest("/auth/profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify(updates)
      });

      if (response.success && user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    }
  };

  const updateStake = async (amount: number): Promise<boolean> => {
    try {
      if (!session?.token) return false;

      const response = await authRequest("/auth/update-stake", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ stakeAmount: amount })
      });

      if (response.success && user) {
        setUser({ ...user, gttStakeAmount: amount });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Stake update error:", error);
      return false;
    }
  };

  const upgradeTier = async (targetTier: string, paymentData?: any): Promise<boolean> => {
    try {
      if (!session?.token) return false;

      const response = await authRequest("/auth/upgrade-tier", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ targetTier, ...paymentData })
      });

      if (response.success && user) {
        setUser({ ...user, tier: targetTier.toUpperCase() });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Tier upgrade error:", error);
      return false;
    }
  };

  // 2FA methods (placeholder implementations)
  const enableTwoFactor = async (): Promise<{ secret: string; qrCode: string }> => {
    // TODO: Implement 2FA setup
    throw new Error("2FA implementation pending");
  };

  const verifyTwoFactor = async (token: string): Promise<boolean> => {
    // TODO: Implement 2FA verification
    return false;
  };

  const disableTwoFactor = async (token: string): Promise<boolean> => {
    // TODO: Implement 2FA disable
    return false;
  };

  // Security methods (placeholder implementations)
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // TODO: Implement password change
    return false;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    // TODO: Implement password reset request
    return false;
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // TODO: Implement password reset
    return false;
  };

  const contextValue: UnifiedAuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    masterLogin,
    authenticateWithProvider,
    refreshToken,
    checkAuth,
    hasPermission,
    hasRole,
    hasTier,
    updateProfile,
    updateStake,
    upgradeTier,
    enableTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    changePassword,
    requestPasswordReset,
    resetPassword
  };

  return React.createElement(
    UnifiedAuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useUnifiedAuth(): UnifiedAuthContextType {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useUnifiedAuth must be used within a UnifiedAuthProvider");
  }
  return context;
}

// Export context for direct usage if needed
export { UnifiedAuthContext };