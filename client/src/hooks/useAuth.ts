import { useState, useEffect, createContext, useContext, type ReactNode, createElement } from 'react';

// Authentication types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: string;
  gttStakeAmount: number;
  walletAddress?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateStake: (amount: number) => Promise<boolean>;
  upgradeTier: (targetTier: string, paymentData?: any) => Promise<boolean>;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agreedToTerms: boolean;
}

// Auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Token storage utilities
const TOKEN_KEY = 'guardianchain_auth_token';
const USER_KEY = 'guardianchain_user_data';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
}

function setAuthData(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// API request helper with auth
async function authRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/auth${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const storedToken = getStoredToken();

        if (storedUser && storedToken) {
          // Verify token is still valid
          try {
            const response = await authRequest('/profile');
            if (response.success) {
              setUser(response.user);
            } else {
              clearAuthData();
            }
          } catch {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success && response.session) {
        setAuthData(response.session);
        setUser(response.session.user);
        return true;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authRequest('/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success && response.session) {
        setAuthData(response.session);
        setUser(response.session.user);
        return true;
      }

      throw new Error(response.message || 'Signup failed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint for logging
      await authRequest('/logout', { method: 'POST' });
    } catch {
      // Ignore logout endpoint errors
    } finally {
      clearAuthData();
      setUser(null);
      setError(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await authRequest('/refresh', { method: 'POST' });
      
      if (response.success && response.token) {
        const currentUser = getStoredUser();
        if (currentUser) {
          const newSession: AuthSession = {
            user: currentUser,
            token: response.token,
            expiresAt: response.expiresAt
          };
          setAuthData(newSession);
          return true;
        }
      }
      
      return false;
    } catch {
      logout();
      return false;
    }
  };

  const updateStake = async (amount: number): Promise<boolean> => {
    try {
      const response = await authRequest('/update-stake', {
        method: 'PATCH',
        body: JSON.stringify({ stakeAmount: amount })
      });

      if (response.success && user) {
        const updatedUser = { ...user, gttStakeAmount: amount };
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return true;
      }

      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update stake';
      setError(message);
      return false;
    }
  };

  const upgradeTier = async (targetTier: string, paymentData?: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authRequest('/upgrade-tier', {
        method: 'POST',
        body: JSON.stringify({ targetTier, ...paymentData })
      });

      if (response.success && user) {
        const updatedUser = { ...user, tier: targetTier.toUpperCase() };
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return true;
      }

      throw new Error(response.message || 'Tier upgrade failed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tier upgrade failed';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    updateStake,
    upgradeTier
  };

  return createElement(AuthContext.Provider, { value: contextValue }, children);
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export AuthContext for potential direct usage
export { AuthContext };