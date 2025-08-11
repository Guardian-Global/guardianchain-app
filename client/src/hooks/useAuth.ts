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
      const token = localStorage.getItem('gc_jwt');
      if (!token) throw new Error('Not authenticated');
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error("Profile update failed");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const linkWalletMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const token = localStorage.getItem('gc_jwt');
      if (!token) throw new Error('Not authenticated');
      const response = await fetch("/api/user/link-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ walletAddress }),
      });
      if (!response.ok) {
        throw new Error("Wallet linking failed");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const unlinkWalletMutation = useMutation({
    mutationFn: async () => {
      if (!user?.walletAddress) {
        throw new Error("No wallet linked");
      }
      const token = localStorage.getItem('gc_jwt');
      if (!token) throw new Error('Not authenticated');
      const response = await fetch(`/api/auth/unlink/${user.walletAddress}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error("Wallet unlinking failed");
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    linkWallet: linkWalletMutation.mutate,
    unlinkWallet: unlinkWalletMutation.mutate,
    refetchUser: refetch,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isLinkingWallet: linkWalletMutation.isPending,
    isUnlinkingWallet: unlinkWalletMutation.isPending,
  };
}