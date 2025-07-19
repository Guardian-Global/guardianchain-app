import { useState, useEffect } from 'react';
import { enterpriseAuth, type UserProfile, type AuthSession } from '@/lib/auth/enterprise-auth';

export function useEnterpriseAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [sessionData, profileData] = await Promise.all([
        enterpriseAuth.getSession(),
        enterpriseAuth.getProfile()
      ]);
      
      setSession(sessionData);
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication error');
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (provider: string, options?: any) => {
    try {
      setError(null);
      await enterpriseAuth.authenticate(provider, options);
      // After successful auth, the callback will redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await enterpriseAuth.logout();
      setUser(null);
      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);
      const updatedUser = await enterpriseAuth.updateProfile(updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    }
  };

  const hasPermission = (permission: string): boolean => {
    return user ? enterpriseAuth.hasPermission(user, permission) : false;
  };

  const refreshSession = () => {
    loadSession();
  };

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user && !!session,
    login,
    logout,
    updateProfile,
    hasPermission,
    refreshSession
  };
}

export default useEnterpriseAuth;