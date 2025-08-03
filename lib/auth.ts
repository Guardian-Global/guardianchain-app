// Enhanced authentication system for GuardianChain
// Using debug authentication compatible with current project structure

export interface AuthUser {
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

// Server-side session verification
export const verifyAuthentication = async (req: any, res: any): Promise<AuthUser | null> => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) return null;
    
    // Enhanced user data with GuardianChain specific fields
    return {
      id: session.user.id || session.user.sub,
      email: session.user.email,
      firstName: session.user.firstName || session.user.first_name,
      lastName: session.user.lastName || session.user.last_name,
      profileImageUrl: session.user.image || session.user.profile_image_url,
      tier: session.user.tier || "EXPLORER",
      walletAddress: session.user.walletAddress,
      gttBalance: session.user.gttBalance || 0,
      truthScore: session.user.truthScore || 0,
      isVerified: session.user.isVerified || false,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    };
  } catch (error) {
    console.error("Authentication verification failed:", error);
    return null;
  }
};

// JWT token utilities for API authentication
export const generateAuthToken = (userId: string): string => {
  // Implementation depends on your JWT setup
  return `auth_token_${userId}`;
};

export const verifyAuthToken = (token: string): { userId: string } | null => {
  // Implementation depends on your JWT setup
  if (token.startsWith("auth_token_")) {
    return { userId: token.replace("auth_token_", "") };
  }
  return null;
};