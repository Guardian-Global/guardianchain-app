import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/queryClient";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: string;
  usage?: {
    capsulesCreated: number;
    capsulesLimit: number;
  };
  subscription?: any;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: () => api.auth.getUser(),
    retry: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}
