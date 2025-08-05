// Profile API utility functions
import { apiRequest } from "@/lib/queryClient";

export const getActivityTimeline = async (userId: string) => {
  try {
    const response = await apiRequest("GET", `/api/profile/${userId}/activity-timeline`);
    return response;
  } catch (error) {
    console.error("Failed to fetch activity timeline:", error);
    // Return mock data for development
    return [
      {
        id: 1,
        type: "capsule_created",
        title: "Created Truth Capsule",
        description: "Environmental Impact Report submitted for verification",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        metadata: { capsuleId: "cap-123", category: "environment" }
      },
      {
        id: 2,
        type: "capsule_verified", 
        title: "Capsule Verified",
        description: "Community Safety Report successfully verified",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        metadata: { capsuleId: "cap-456", verificationScore: 0.92 }
      },
      {
        id: 3,
        type: "badge_earned",
        title: "Truth Seeker Badge Earned",
        description: "Achieved milestone of 25 verified capsules",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { badgeId: "truth-seeker", milestone: 25 }
      },
      {
        id: 4,
        type: "friend_added",
        title: "New Guardian Connection",
        description: "Connected with @truthkeeper_alex",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        metadata: { friendId: "user-789", username: "truthkeeper_alex" }
      }
    ];
  }
};

export const uploadProfileMedia = async (userId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('userId', userId);
  
  return await apiRequest("POST", "/api/profile/media/upload", formData);
};

export const getProfileMedia = async (userId: string) => {
  try {
    return await apiRequest("GET", `/api/profile/${userId}/media`);
  } catch (error) {
    console.error("Failed to fetch profile media:", error);
    return [];
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    return await apiRequest("GET", `/api/profile/${userId}`);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return {
      id: userId,
      firstName: "Guardian",
      lastName: "User",
      email: "guardian@example.com",
      bio: "Truth seeker and capsule creator",
      profileImageUrl: "",
      tier: "SEEKER"
    };
  }
};

export const getUserCapsules = async (userId: string) => {
  try {
    return await apiRequest("GET", `/api/profile/${userId}/capsules`);
  } catch (error) {
    console.error("Failed to fetch user capsules:", error);
    return [
      {
        id: "cap-1",
        title: "Environmental Truth Report",
        description: "Comprehensive analysis of local environmental impact",
        type: "Environmental",
        status: "verified",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        truthScore: 0.92,
        likes: 45,
        shares: 12
      },
      {
        id: "cap-2", 
        title: "Community Safety Analysis",
        description: "Safety assessment of public infrastructure",
        type: "Safety",
        status: "pending",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        truthScore: 0.87,
        likes: 23,
        shares: 6
      }
    ];
  }
};

export const getUserBadges = async (userId: string) => {
  try {
    return await apiRequest("GET", `/api/profile/${userId}/badges`);
  } catch (error) {
    console.error("Failed to fetch user badges:", error);
    return [
      {
        id: "truth-seeker",
        name: "Truth Seeker",
        description: "Verified 25+ capsules",
        icon: "🔍",
        rarity: "common",
        earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "guardian-verified",
        name: "Guardian Verified",
        description: "Official platform verification",
        icon: "🛡️",
        rarity: "rare",
        earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
};

export const getFriends = async (userId: string) => {
  try {
    return await apiRequest("GET", `/api/profile/${userId}/friends`);
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    return [
      {
        id: "friend-1",
        firstName: "Alex",
        lastName: "Truth",
        username: "truthkeeper_alex",
        profileImageUrl: "",
        tier: "CREATOR",
        mutualFriends: 5,
        isOnline: true
      },
      {
        id: "friend-2",
        firstName: "Maya",
        lastName: "Verify", 
        username: "maya_verifier",
        profileImageUrl: "",
        tier: "SOVEREIGN",
        mutualFriends: 12,
        isOnline: false
      }
    ];
  }
};