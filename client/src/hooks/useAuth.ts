import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  tier?: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN";
  walletAddress?: string;
  gttBalance?: number;
  truthScore?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
      // Redirect to home page
      window.location.href = "/";
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Profile update failed");
      }
      return response.json();
    },
    onSuccess: () => {
      // Refetch user data after profile update
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const linkWalletMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await fetch("/api/user/link-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Wallet linking failed");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    
    // Actions
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    linkWallet: linkWalletMutation.mutate,
    refetchUser: refetch,
    
    // Mutation states
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isLinkingWallet: linkWalletMutation.isPending,
  };
}