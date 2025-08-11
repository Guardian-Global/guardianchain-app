import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface EnhancedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  tier: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  profileImageUrl?: string;
  walletAddress?: string;
  isWalletVerified?: boolean;
  onboardingCompleted?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function getToken() {
  return localStorage.getItem('gc_jwt');
}

export function useEnhancedAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: user, 
    isLoading, 
    error, 
    refetch,
    isError 
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async (): Promise<EnhancedUser> => {
      const token = getToken();
      const response = await fetch("/api/auth/user", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include'
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Authentication failed: ${response.status}`);
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const loginMutation = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (data.token) localStorage.setItem('gc_jwt', data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: 'Login Successful', description: 'Welcome back!' });
    },
    onError: (e: any) => toast({ title: 'Login Failed', description: e.message, variant: 'destructive' })
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('gc_jwt');
    },
    onSuccess: () => {
      queryClient.clear();
      toast({ title: 'Logged Out', description: 'Session ended.' });
    }
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    refetch,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    needsOnboarding: user ? !user.onboardingCompleted : false,
  };
}