// Friend system utilities and mock data for development

export interface Friend {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  lastActive?: string;
  reputation?: number;
  verifiedCapsules?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    username: string;
    email: string;
    avatar?: string;
    reputation?: number;
  };
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: string;
}

// Mock accepted friends data
export const mockFriends: Friend[] = [
  {
    id: "1",
    username: "Leila Chen",
    email: "leila@guardianchain.app",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=leila",
    status: "accepted",
    createdAt: "2024-01-15T10:30:00Z",
    lastActive: "2024-01-20T14:22:00Z",
    reputation: 95,
    verifiedCapsules: 23,
  },
  {
    id: "2",
    username: "Nuru Makena",
    email: "nuru@guardianchain.app",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nuru",
    status: "accepted",
    createdAt: "2024-01-12T08:15:00Z",
    lastActive: "2024-01-20T16:45:00Z",
    reputation: 88,
    verifiedCapsules: 31,
  },
  {
    id: "3",
    username: "Marcus Rivera",
    email: "marcus@guardianchain.app",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    status: "accepted",
    createdAt: "2024-01-18T12:00:00Z",
    lastActive: "2024-01-20T09:30:00Z",
    reputation: 92,
    verifiedCapsules: 18,
  },
];

// Mock friend requests
export const mockFriendRequests: FriendRequest[] = [
  {
    id: "1",
    fromUserId: "4",
    toUserId: "current-user",
    fromUser: {
      username: "Sarah Kim",
      email: "sarah@guardianchain.app",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      reputation: 78,
    },
    status: "pending",
    message:
      "Hi! I found your truth capsules very insightful. Would love to connect!",
    createdAt: "2024-01-20T10:15:00Z",
  },
  {
    id: "2",
    fromUserId: "5",
    toUserId: "current-user",
    fromUser: {
      username: "Alex Thompson",
      email: "alex@guardianchain.app",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      reputation: 85,
    },
    status: "pending",
    message: "Fellow truth seeker here. Let's verify each other's capsules!",
    createdAt: "2024-01-20T15:30:00Z",
  },
];

// Mock private capsules from friends
export const mockPrivateCapsules = [
  {
    id: "101",
    creator: "Leila Chen",
    creatorId: "1",
    title: "Private: Family Recipe Truth",
    content:
      "This is the real story behind our family's secret recipe that was stolen by a major corporation...",
    griefScore: 87,
    isSealed: true,
    isPrivate: true,
    tags: ["family", "corporate-theft", "recipes"],
    createdAt: "2024-01-20T08:30:00Z",
    verificationStatus: "verified",
    truthYield: "125.5",
    viewCount: 0, // Private capsules don't show view counts
    shareCount: 0, // Can't be shared publicly
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=leila",
  },
  {
    id: "102",
    creator: "Nuru Makena",
    creatorId: "2",
    title: "Private: Whistleblower Evidence",
    content:
      "Documented proof of environmental violations by mining company in Kenya. Sharing privately first...",
    griefScore: 94,
    isSealed: true,
    isPrivate: true,
    tags: ["environment", "whistleblower", "kenya"],
    createdAt: "2024-01-19T14:15:00Z",
    verificationStatus: "pending",
    truthYield: "200.0",
    viewCount: 0,
    shareCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nuru",
  },
  {
    id: "103",
    creator: "Marcus Rivera",
    creatorId: "3",
    title: "Private: Medical Research Findings",
    content:
      "Early results from our clinical trial that pharmaceutical companies don't want public yet...",
    griefScore: 91,
    isSealed: false,
    isPrivate: true,
    tags: ["medical", "research", "pharmaceutical"],
    createdAt: "2024-01-18T16:45:00Z",
    verificationStatus: "verified",
    truthYield: "175.8",
    viewCount: 0,
    shareCount: 0,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  },
];

/**
 * Get private capsules from accepted friends only
 * In production, this would query the database with proper friend relationship validation
 */
export function getPrivateCapsules(userId: string) {
  // Get list of accepted friend IDs
  const acceptedFriendIds = mockFriends
    .filter((friend) => friend.status === "accepted")
    .map((friend) => friend.id);

  // Filter private capsules to only show those from accepted friends
  return mockPrivateCapsules.filter((capsule) =>
    acceptedFriendIds.includes(capsule.creatorId),
  );
}

/**
 * Get friend list for current user
 */
export function getFriends(userId: string): Friend[] {
  return mockFriends.filter((friend) => friend.status === "accepted");
}

/**
 * Get pending friend requests
 */
export function getPendingFriendRequests(userId: string): FriendRequest[] {
  return mockFriendRequests.filter(
    (request) => request.toUserId === userId && request.status === "pending",
  );
}

/**
 * Get friend statistics
 */
export function getFriendStats(userId: string) {
  const friends = getFriends(userId);
  const pendingRequests = getPendingFriendRequests(userId);
  const privateCapsules = getPrivateCapsules(userId);

  return {
    activeFriends: friends.length,
    pendingRequests: pendingRequests.length,
    privateCapsules: privateCapsules.length,
    totalConnections: friends.length + pendingRequests.length,
  };
}

/**
 * Send friend request
 */
export async function sendFriendRequest(
  fromUserId: string,
  toUserId: string,
  message?: string,
): Promise<boolean> {
  // In production, this would make an API call to create the friend request
  console.log("Sending friend request:", { fromUserId, toUserId, message });
  return true;
}

/**
 * Accept friend request
 */
export async function acceptFriendRequest(requestId: string): Promise<boolean> {
  // In production, this would update the friend request status in the database
  console.log("Accepting friend request:", requestId);
  return true;
}

/**
 * Reject friend request
 */
export async function rejectFriendRequest(requestId: string): Promise<boolean> {
  // In production, this would update the friend request status in the database
  console.log("Rejecting friend request:", requestId);
  return true;
}

/**
 * Remove friend
 */
export async function removeFriend(friendId: string): Promise<boolean> {
  // In production, this would remove the friend relationship from the database
  console.log("Removing friend:", friendId);
  return true;
}

/**
 * Block user
 */
export async function blockUser(userId: string): Promise<boolean> {
  // In production, this would add the user to the blocked list
  console.log("Blocking user:", userId);
  return true;
}
