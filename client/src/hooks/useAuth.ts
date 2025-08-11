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
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('gc_jwt');
      if (!token) return null;
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('gc_jwt');
      queryClient.clear();
      window.location.href = "/";
    },
    onSuccess: () => {
      queryClient.clear();
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
  queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
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
  queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
    },
  });

  const unlinkWalletMutation = useMutation({
    mutationFn: async () => {
      if (!user?.walletAddress) {
        throw new Error("No wallet linked");
      }
      
      const response = await fetch(`/api/auth/unlink/${user.walletAddress}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Wallet unlinking failed");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
  queryClient.invalidateQueries({ queryKey: ["/api/auth-complete/me"] });
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
    unlinkWallet: unlinkWalletMutation.mutate,
    refetchUser: refetch,
    
    // Mutation states
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isLinkingWallet: linkWalletMutation.isPending,
    isUnlinkingWallet: unlinkWalletMutation.isPending,
  };
}