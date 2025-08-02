import { apiRequest } from "@/lib/queryClient";

// User API functions
export async function fetchUserProfile(address: string) {
  try {
    const response = await apiRequest("GET", `/api/users/${address}`);
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function fetchUserAchievements(address: string) {
  try {
    const response = await apiRequest(
      "GET",
      `/api/users/${address}/achievements`,
    );
    return response.achievements || [];
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    // Return empty array instead of throwing for better UX
    return [];
  }
}

export async function fetchUserCapsules(address: string) {
  try {
    const response = await apiRequest("GET", `/api/users/${address}/capsules`);
    return response.capsules || [];
  } catch (error) {
    console.error("Error fetching user capsules:", error);
    return [];
  }
}

export async function fetchUserTransactions(address: string) {
  try {
    const response = await apiRequest(
      "GET",
      `/api/users/${address}/transactions`,
    );
    return response.transactions || [];
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
}

export async function fetchUserXPData(address: string) {
  try {
    const response = await apiRequest(
      "GET",
      `/api/users/${address}/xp-history`,
    );
    return response.xpHistory || [];
  } catch (error) {
    console.error("Error fetching user XP data:", error);
    return [];
  }
}

// Capsule API functions
export async function fetchCapsuleTypes() {
  try {
    const response = await apiRequest("GET", "/api/capsule-types");
    return response.types || [];
  } catch (error) {
    console.error("Error fetching capsule types:", error);
    throw error;
  }
}

export async function validateCapsuleType(type: string, data: any) {
  try {
    const response = await apiRequest("POST", "/api/capsule-types/validate", {
      type,
      data,
    });
    return response;
  } catch (error) {
    console.error("Error validating capsule type:", error);
    throw error;
  }
}

export async function createCapsule(capsuleData: any) {
  try {
    const response = await apiRequest("POST", "/api/capsules", capsuleData);
    return response;
  } catch (error) {
    console.error("Error creating capsule:", error);
    throw error;
  }
}

export async function fetchCapsule(id: string) {
  try {
    const response = await apiRequest("GET", `/api/capsules/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching capsule:", error);
    throw error;
  }
}

// Brand API functions
export async function fetchBrandInfo() {
  try {
    const response = await apiRequest("GET", "/api/brand/info");
    return response;
  } catch (error) {
    console.error("Error fetching brand info:", error);
    throw error;
  }
}

// Analytics API functions
export async function fetchAnalytics(address?: string) {
  try {
    const endpoint = address
      ? `/api/analytics/user/${address}`
      : "/api/analytics/global";
    const response = await apiRequest("GET", endpoint);
    return response;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}
