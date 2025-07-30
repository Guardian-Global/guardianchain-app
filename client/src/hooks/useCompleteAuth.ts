import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tier: string;
  permissions: string[];
}

interface AuthSession {
  token: string;
  user: User;
  expiresAt: Date;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; message?: string }>;
  masterLogin: (email: string, password: string, role: string, masterKey: string) => Promise<{ success: boolean; redirectTo?: string; message?: string }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; username?: string }) => Promise<{ success: boolean; redirectTo?: string; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "guardianchain_token";
const SESSION_KEY = "guardianchain_session";

export function CompleteAuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedSession = localStorage.getItem(SESSION_KEY);

      if (storedToken && storedSession) {
        const parsedSession = JSON.parse(storedSession);
        const expiresAt = new Date(parsedSession.expiresAt);

        if (expiresAt > new Date()) {
          // Session is still valid
          setSession({
            ...parsedSession,
            expiresAt
          });
          setUser(parsedSession.user);
          setIsAuthenticated(true);
          
          // Verify session with server
          await verifySession(storedToken);
        } else {
          // Session expired
          clearSession();
        }
      }
    } catch (error) {
      console.error("Error loading stored session:", error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const verifySession = async (token: string) => {
    try {
      const response = await fetch("/api/auth/status", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        clearSession();
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      clearSession();
    }
  };

  const storeSession = (sessionData: AuthSession) => {
    localStorage.setItem(TOKEN_KEY, sessionData.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success && result.session) {
        const sessionData = {
          ...result.session,
          expiresAt: new Date(result.session.expiresAt)
        };

        setSession(sessionData);
        setUser(sessionData.user);
        setIsAuthenticated(true);
        storeSession(sessionData);

        return {
          success: true,
          redirectTo: result.redirectTo,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || "Login failed"
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error during login"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const masterLogin = async (email: string, password: string, role: string, masterKey: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/master-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role, masterKey })
      });

      const result = await response.json();

      if (result.success && result.session) {
        const sessionData = {
          ...result.session,
          expiresAt: new Date(result.session.expiresAt)
        };

        setSession(sessionData);
        setUser(sessionData.user);
        setIsAuthenticated(true);
        storeSession(sessionData);

        return {
          success: true,
          redirectTo: result.redirectTo,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || "Master login failed"
        };
      }
    } catch (error) {
      console.error("Master login error:", error);
      return {
        success: false,
        message: "Network error during master login"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; username?: string }) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success && result.session) {
        const sessionData = {
          ...result.session,
          expiresAt: new Date(result.session.expiresAt)
        };

        setSession(sessionData);
        setUser(sessionData.user);
        setIsAuthenticated(true);
        storeSession(sessionData);

        return {
          success: true,
          redirectTo: result.redirectTo,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || "Registration failed"
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error during registration"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearSession();
    }
  };

  const checkAuth = async () => {
    if (!session?.token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          clearSession();
        }
      } else {
        clearSession();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      clearSession();
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes("*");
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    masterLogin,
    register,
    logout,
    checkAuth,
    hasPermission,
    hasRole
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useCompleteAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCompleteAuth must be used within a CompleteAuthProvider");
  }
  return context;
}

export { AuthContext };