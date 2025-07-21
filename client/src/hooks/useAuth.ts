import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl?: string;
  userTier: string;
  gttBalance: string;
  reputation: number;
  xpPoints: number;
  roles: string[];
  isVerified: boolean;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored token and user
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Query to verify token is still valid
  const { data: verifiedUser, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!token) return null;
      
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Token verification failed");
      }
      
      const data = await response.json();
      return data.user;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user if verification succeeds
  useEffect(() => {
    if (verifiedUser) {
      setUser(verifiedUser);
      localStorage.setItem("user", JSON.stringify(verifiedUser));
    }
  }, [verifiedUser]);

  // Handle token errors
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      logout();
    }
  }, [error]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isAuthenticated = !!token && !!user;

  return {
    user,
    isLoading: isLoading && !!token,
    isAuthenticated,
    logout,
    token,
  };
}