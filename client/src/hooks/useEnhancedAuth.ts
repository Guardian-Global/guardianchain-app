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
  isWalletVerified: boolean;
  onboardingCompleted: boolean;
  subscriptionStatus?: "active" | "inactive" | "pending" | "cancelled";
  subscriptionTier?: string;
  subscriptionPlan?: "monthly" | "yearly";
  subscriptionExpiry?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  lastLoginAt: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    theme: "dark" | "light" | "auto";
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      capsulesPublic: boolean;
      allowAnalytics: boolean;
    };
  };
  usage: {
    capsulesCreated: number;
    capsulesLimit: number;
    gttEarned: number;
    truthScore: number;
    verificationCount: number;
    reelsCreated: number;
    socialConnections: number;
  };
  subscription: {
    plan: string;
    billingCycle: string;
    nextBillingDate: string;
    status: string;
    features: string[];
    canUpgrade: boolean;
    canDowngrade: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export function useEnhancedAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get current user with enhanced data
  const { 
    data: user, 
    isLoading, 
    error, 
    refetch,
    isError 
  } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async (): Promise<EnhancedUser> => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Authentication failed: ${response.status} ${response.statusText}`
        );
      }
      
      return response.json();
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.message?.includes("401")) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Login mutation
  const loginMutation = useMutation({
  // FIXME: Replace 'any' with a proper credentials interface if available
  mutationFn: async (credentials?: Record<string, unknown>) => {
      const response = await fetch("/api/auth/login", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back to GuardianChain!",
      });
      
      // Invalidate user query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect if specified in login response
      if (data?.redirectTo) {
        window.location.href = data.redirectTo;
      }
    },
    onError: (error: unknown) => {
      let message = "Failed to sign in.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      // Clear all cached data
      queryClient.clear();
      
      // Redirect to home or login page
      window.location.href = data.redirectTo || "/";
    },
    onError: (error: unknown) => {
      let message = "Failed to log out.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Logout Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<EnhancedUser>) => {
      return apiRequest("PATCH", "/api/auth/user/profile", updates);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to update profile.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<EnhancedUser["preferences"]>) => {
      return apiRequest("PATCH", "/api/auth/user/preferences", { preferences });
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved.",
      });
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to update preferences.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      return apiRequest("POST", "/api/auth/verify-email", { verificationCode });
    },
    onSuccess: () => {
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
      });
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to verify email.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Verification Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Connect wallet mutation
  const connectWalletMutation = useMutation({
    mutationFn: async ({ walletAddress, signature }: { walletAddress: string; signature: string }) => {
      return apiRequest("POST", "/api/auth/connect-wallet", { walletAddress, signature });
    },
    onSuccess: () => {
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to connect wallet.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    // FIXME: Replace 'any' with a proper onboarding data interface if available
    mutationFn: async (onboardingData: Record<string, unknown>) => {
      // Optionally replace with logger
      // logger.info("🔐 useEnhancedAuth: Starting onboarding completion...", onboardingData);
      return apiRequest("POST", "/api/auth/complete-onboarding", onboardingData);
    },
    onSuccess: (data) => {
      console.log("✅ useEnhancedAuth: Onboarding completed successfully", data);
      toast({
        title: "Welcome to GuardianChain! 🎉",
        description: "Your account setup is complete.",
      });
      
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Redirect to dashboard after onboarding completion
      if (data?.redirectTo) {
        console.log("🔀 useEnhancedAuth: Redirecting to:", data.redirectTo);
        window.location.href = data.redirectTo;
      } else {
        console.log("🏠 useEnhancedAuth: Redirecting to dashboard");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    },
    onError: (error: unknown) => {
      // Optionally replace with logger
      // logger.error("❌ useEnhancedAuth: Onboarding failed:", error);
      let message = "Failed to complete onboarding.";
      if (error instanceof Error) message = error.message;
      toast({
        title: "Setup Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  // Computed values
  const isAuthenticated = !!user && !isError;
  const needsOnboarding = isAuthenticated && user && (
    !user.onboardingCompleted || 
    !user.firstName || 
    !user.lastName || 
    !user.username ||
    !user.emailVerified
  );
  const needsEmailVerification = isAuthenticated && user && !user.emailVerified;
  const canUpgrade = isAuthenticated && user?.subscription?.canUpgrade;
  const hasActiveSubscription = isAuthenticated && user?.subscriptionStatus === "active";

  // Helper functions
  const getTierFeatures = () => {
    return user?.subscription?.features || [];
  };

  const getRemainingCapsules = () => {
    if (!user) return 0;
    return Math.max(0, user.usage.capsulesLimit - user.usage.capsulesCreated);
  };

  const getUsagePercentage = () => {
    if (!user) return 0;
    return (user.usage.capsulesCreated / user.usage.capsulesLimit) * 100;
  };

  return {
    // User data
    user,
    isAuthenticated,
    isLoading,
    isError,
    error,
    
    // Status checks
    needsOnboarding,
    needsEmailVerification,
    canUpgrade,
    hasActiveSubscription,
    
    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    connectWallet: connectWalletMutation.mutate,
    completeOnboarding: completeOnboardingMutation.mutate,
    refetch,
    
    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isConnectingWallet: connectWalletMutation.isPending,
    isCompletingOnboarding: completeOnboardingMutation.isPending,
    
    // Helper functions
    getTierFeatures,
    getRemainingCapsules,
    getUsagePercentage,
  };
}

// Helper hook for checking specific permissions
export function useAuthPermissions() {
  const { user, isAuthenticated } = useEnhancedAuth();

  const canCreateCapsules = () => {
    if (!isAuthenticated || !user) return false;
    return user.usage.capsulesCreated < user.usage.capsulesLimit;
  };

  const canAccessFeature = (feature: string) => {
    if (!isAuthenticated || !user) return false;
    return user.subscription?.features.includes(feature) || false;
  };

  const hasMinimumTier = (tier: "EXPLORER" | "SEEKER" | "CREATOR" | "SOVEREIGN") => {
    if (!isAuthenticated || !user) return false;
    
    const tierOrder = ["EXPLORER", "SEEKER", "CREATOR", "SOVEREIGN"];
    const userTierIndex = tierOrder.indexOf(user.tier);
    const requiredTierIndex = tierOrder.indexOf(tier);
    
    return userTierIndex >= requiredTierIndex;
  };

  return {
    canCreateCapsules,
    canAccessFeature,
    hasMinimumTier,
  };
}