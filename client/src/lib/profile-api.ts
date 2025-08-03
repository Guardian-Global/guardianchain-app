import { apiRequest } from "@/lib/queryClient";

export async function getUserProfile(wallet: string) {
  try {
    const response = await apiRequest("GET", `/api/profile/${wallet}`);
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getUserCapsules(wallet: string) {
  try {
    const response = await apiRequest("GET", `/api/profile/${wallet}/capsules`);
    return response;
  } catch (error) {
    console.error("Error fetching user capsules:", error);
    return [];
  }
}

export async function getUserBadges(wallet: string) {
  try {
    const response = await apiRequest("GET", `/api/profile/${wallet}/badges`);
    return response;
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }
}

export async function getFriends(wallet: string) {
  try {
    const response = await apiRequest("GET", `/api/profile/${wallet}/friends`);
    return response;
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
}

export async function getActivityTimeline(userId: string) {
  try {
    const response = await apiRequest("GET", `/api/profile/timeline/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching activity timeline:", error);
    return [];
  }
}

export async function updateProfileSettings(userId: string, settings: any) {
  try {
    const response = await apiRequest("PUT", `/api/profile/${userId}/settings`, settings);
    return response;
  } catch (error) {
    console.error("Error updating profile settings:", error);
    throw error;
  }
}

export async function addFriend(userId: string, friendWallet: string) {
  try {
    const response = await apiRequest("POST", `/api/profile/${userId}/friends`, { friendWallet });
    return response;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
}