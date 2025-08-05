import { apiRequest } from "./queryClient";

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  displayName?: string;
  bio?: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  location?: string;
  website?: string;
  twitterHandle?: string;
  githubHandle?: string;
  isVerified: boolean;
  truthScore: number;
  gttBalance: number;
  capsulesCount: number;
  verifiedCapsulesCount: number;
  followersCount: number;
  followingCount: number;
  joinedAt: string;
  lastActive: string;
  privacySettings: {
    profileVisibility: "public" | "friends" | "private";
    showEmail: boolean;
    showWallet: boolean;
    showStats: boolean;
  };
  socialLinks?: Array<{
    id: string;
    platform: string;
    url: string;
    verified: boolean;
  }>;
}

export interface UserCapsule {
  id: string;
  title: string;
  description: string;
  type: string;
  verified: boolean;
  truthScore?: number;
  createdAt: string;
  isTimeSealed?: boolean;
  unlockDate?: string;
  verificationDate?: string;
  verifiedBy?: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  color: string;
  earnedAt: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Friend {
  id: string;
  walletAddress: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  truthScore: number;
  connectionDate: string;
  mutualConnections: number;
}

export interface TimelineEvent {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export async function getUserProfile(walletAddress: string): Promise<UserProfile> {
  // Mock profile data for demo
  return {
    id: walletAddress,
    walletAddress,
    username: "debug_guardian",
    displayName: "Debug Guardian",
    bio: "Testing the enhanced profile system with AI memory recall and Truth Genome analysis",
    profileImageUrl: "/api/placeholder/avatar.jpg",
    bannerImageUrl: "/api/placeholder/banner.jpg",
    location: "Digital Realm",
    website: "https://guardianchain.app",
    twitterHandle: "@guardianchain",
    githubHandle: "guardianchain",
    isVerified: true,
    truthScore: 92,
    gttBalance: 15847,
    capsulesCount: 23,
    verifiedCapsulesCount: 18,
    followersCount: 147,
    followingCount: 89,
    joinedAt: "2024-12-15T10:30:00Z",
    lastActive: new Date().toISOString(),
    privacySettings: {
      profileVisibility: "public",
      showEmail: false,
      showWallet: true,
      showStats: true,
    },
    socialLinks: [
      {
        id: "social-1",
        platform: "twitter",
        url: "https://twitter.com/guardianchain",
        verified: true,
      },
      {
        id: "social-2",
        platform: "github",
        url: "https://github.com/Guardian-Global/guardianchain_app",
        verified: true,
      },
    ],
  };
}

export async function getUserCapsules(walletAddress: string): Promise<UserCapsule[]> {
  // Mock capsules data for demo
  return [
    {
      id: "capsule-1",
      title: "Family Legacy Memories",
      description: "Precious moments and stories from three generations of our family",
      type: "family",
      verified: true,
      truthScore: 95,
      createdAt: "2025-08-01T15:30:00Z",
      verificationDate: "2025-08-02T10:15:00Z",
      verifiedBy: "Community Guardian Network",
    },
    {
      id: "capsule-2",
      title: "Career Milestone Documentation",
      description: "Professional achievements and lessons learned throughout my career",
      type: "milestone",
      verified: true,
      truthScore: 88,
      createdAt: "2025-07-28T09:20:00Z",
      verificationDate: "2025-07-29T14:45:00Z",
      verifiedBy: "Professional Validators",
    },
    {
      id: "capsule-3",
      title: "Time-Sealed Future Message",
      description: "A message to my future self, sealed until 2030",
      type: "future",
      verified: false,
      isTimeSealed: true,
      unlockDate: "2030-01-01",
      createdAt: "2025-07-25T20:10:00Z",
    },
  ];
}

export async function getUserBadges(walletAddress: string): Promise<UserBadge[]> {
  // Mock badges data for demo
  return [
    {
      id: "badge-1",
      name: "Truth Pioneer",
      description: "First 100 verified capsules in the network",
      color: "text-yellow-400",
      earnedAt: "2025-07-20T12:00:00Z",
      category: "achievement",
      rarity: "legendary",
    },
    {
      id: "badge-2",
      name: "Memory Guardian",
      description: "Helped verify 50+ community capsules",
      color: "text-blue-400",
      earnedAt: "2025-07-15T16:30:00Z",
      category: "community",
      rarity: "epic",
    },
    {
      id: "badge-3",
      name: "Legacy Builder",
      description: "Created 10+ family heritage capsules",
      color: "text-green-400",
      earnedAt: "2025-07-10T11:45:00Z",
      category: "creation",
      rarity: "rare",
    },
  ];
}

export async function getFriends(walletAddress: string): Promise<Friend[]> {
  // Mock friends data for demo
  return [
    {
      id: "friend-1",
      walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      username: "alice_memories",
      displayName: "Alice Cooper",
      profileImageUrl: "/api/placeholder/avatar2.jpg",
      isVerified: true,
      truthScore: 89,
      connectionDate: "2025-07-18T14:20:00Z",
      mutualConnections: 12,
    },
    {
      id: "friend-2", 
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      username: "bob_truth",
      displayName: "Bob Wilson",
      profileImageUrl: "/api/placeholder/avatar3.jpg",
      isVerified: false,
      truthScore: 76,
      connectionDate: "2025-07-16T09:15:00Z",
      mutualConnections: 8,
    },
  ];
}

export async function getActivityTimeline(userId: string): Promise<TimelineEvent[]> {
  // Mock activity timeline for demo
  return [
    {
      id: "activity-1",
      type: "capsule_created",
      description: "Created 'Family Legacy Memories' capsule",
      timestamp: "2025-08-01T15:30:00Z",
      metadata: {
        capsuleTitle: "Family Legacy Memories",
      },
    },
    {
      id: "activity-2",
      type: "capsule_verified",
      description: "Career milestone capsule verified by community",
      timestamp: "2025-07-29T14:45:00Z",
      metadata: {
        capsuleTitle: "Career Milestone Documentation",
      },
    },
    {
      id: "activity-3",
      type: "badge_earned",
      description: "Earned 'Truth Pioneer' achievement badge",
      timestamp: "2025-07-20T12:00:00Z",
      metadata: {
        badgeName: "Truth Pioneer",
      },
    },
    {
      id: "activity-4",
      type: "friend_added",
      description: "Connected with Alice Cooper",
      timestamp: "2025-07-18T14:20:00Z",
      metadata: {
        friendName: "Alice Cooper",
      },
    },
  ];
}