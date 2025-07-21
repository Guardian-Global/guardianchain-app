import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: () => apiRequest('GET', '/api/auth/user'),
    retry: false,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}