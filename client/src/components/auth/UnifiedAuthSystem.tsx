import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  tier: string;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
  isMaster?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  agreedToTerms: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['/api/auth/profile'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user state when data changes
  useEffect(() => {
    setUser(userData || null);
  }, [userData]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const endpoint = credentials.isMaster ? '/api/auth/master-login' : '/api/auth/login';
      const response = await apiRequest('POST', endpoint, credentials);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['/api/auth/profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['/api/auth/profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(['/api/auth/profile'], null);
      queryClient.clear();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiRequest('PATCH', '/api/auth/profile', data);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['/api/auth/profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
  });

  const authValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    tier: user?.tier || 'EXPLORER',
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    refreshUser: refetch,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUnifiedAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUnifiedAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function ProtectedRoute({ 
  children, 
  requiredTier = 'EXPLORER',
  fallbackComponent 
}: { 
  children: React.ReactNode;
  requiredTier?: string;
  fallbackComponent?: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useUnifiedAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallbackComponent || (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-slate-400 mb-6">Please log in to access this feature</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Check tier access
  const tiers = ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN', 'MASTER_ADMIN'];
  const userTierLevel = tiers.indexOf(user?.tier || 'EXPLORER');
  const requiredTierLevel = tiers.indexOf(requiredTier);

  if (userTierLevel < requiredTierLevel) {
    return fallbackComponent || (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade Required</h2>
          <p className="text-slate-400 mb-6">You need {requiredTier} tier to access this feature</p>
          <button 
            onClick={() => window.location.href = '/upgrade'}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}