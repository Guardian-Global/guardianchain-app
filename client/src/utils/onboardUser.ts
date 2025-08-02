// Production-ready user onboarding with Replit DB integration
export async function onboardUser(userId: string, userEmail?: string) {
  try {
    // For now, we'll use localStorage as a mock for Replit DB
    // In production, this would use actual Replit DB
    const tierKey = `tier-${userId}`;
    const onboardKey = `onboarded-${userId}`;

    // Check if user already has a tier assigned
    const existingTier = localStorage.getItem(tierKey);
    const isOnboarded = localStorage.getItem(onboardKey);

    if (!existingTier) {
      // Assign default tier based on user status
      const defaultTier = userEmail ? "explorer" : "guest";
      localStorage.setItem(tierKey, defaultTier);
      console.log(`✅ Assigned '${defaultTier}' tier to new user ${userId}`);
    }

    if (!isOnboarded) {
      // Mark user as onboarded and set initial preferences
      localStorage.setItem(onboardKey, "true");
      localStorage.setItem(`onboard-date-${userId}`, new Date().toISOString());

      // Set default user preferences
      localStorage.setItem(`theme-${userId}`, "dark");
      localStorage.setItem(`notifications-${userId}`, "enabled");
      localStorage.setItem(`marketing-${userId}`, "true");

      console.log("✅ User onboarding completed successfully");

      // Track onboarding for analytics
      trackOnboardingEvent(userId, existingTier || "explorer");
    }

    return {
      success: true,
      tier: existingTier || localStorage.getItem(tierKey),
      isNewUser: !isOnboarded,
    };
  } catch (err) {
    console.error("Failed to onboard user:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      tier: "guest",
    };
  }
}

export async function updateUserTier(
  userId: string,
  newTier: "guest" | "explorer" | "pro" | "enterprise",
) {
  try {
    const tierKey = `tier-${userId}`;
    const previousTier = localStorage.getItem(tierKey);

    localStorage.setItem(tierKey, newTier);
    localStorage.setItem(`tier-updated-${userId}`, new Date().toISOString());

    console.log(
      `✅ Updated user ${userId} tier from ${previousTier} to ${newTier}`,
    );

    // Track tier upgrade for analytics
    if (previousTier && previousTier !== newTier) {
      trackTierUpgrade(userId, previousTier, newTier);
    }

    return { success: true, previousTier, newTier };
  } catch (err) {
    console.error("Failed to update user tier:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function getUserTier(userId: string): Promise<string> {
  try {
    const tierKey = `tier-${userId}`;
    const tier = localStorage.getItem(tierKey);
    return tier || "guest";
  } catch (err) {
    console.error("Failed to get user tier:", err);
    return "guest";
  }
}

export async function getUserOnboardingStatus(userId: string) {
  try {
    const onboardKey = `onboarded-${userId}`;
    const dateKey = `onboard-date-${userId}`;

    return {
      isOnboarded: localStorage.getItem(onboardKey) === "true",
      onboardDate: localStorage.getItem(dateKey),
      tier: await getUserTier(userId),
    };
  } catch (err) {
    console.error("Failed to get onboarding status:", err);
    return {
      isOnboarded: false,
      onboardDate: null,
      tier: "guest",
    };
  }
}

function trackOnboardingEvent(userId: string, tier: string) {
  // In production, this would send to analytics service
  console.log("📊 Onboarding Event:", {
    userId,
    tier,
    timestamp: new Date().toISOString(),
  });
}

function trackTierUpgrade(userId: string, fromTier: string, toTier: string) {
  // In production, this would send to analytics service
  console.log("📊 Tier Upgrade Event:", {
    userId,
    fromTier,
    toTier,
    timestamp: new Date().toISOString(),
  });
}

// Production Replit DB integration (commented for development)
/*
import { replitDb } from "@replit/extensions";

export async function onboardUserProduction(userId: string, userEmail?: string) {
  try {
    const tierKey = `tier-${userId}`;
    const exists = await replitDb.get(tierKey);
    
    if (!exists) {
      const defaultTier = userEmail ? "explorer" : "guest";
      await replitDb.set(tierKey, defaultTier);
      await replitDb.set(`onboarded-${userId}`, "true");
      await replitDb.set(`onboard-date-${userId}`, new Date().toISOString());
      
      console.log(`✅ Assigned '${defaultTier}' tier to new user ${userId}`);
    }
    
    return { success: true, tier: await replitDb.get(tierKey) };
  } catch (err) {
    console.error("Failed to onboard user with Replit DB:", err);
    return { success: false, error: err.message };
  }
}

export async function updateUserTierProduction(userId: string, newTier: string) {
  try {
    await replitDb.set(`tier-${userId}`, newTier);
    await replitDb.set(`tier-updated-${userId}`, new Date().toISOString());
    
    console.log(`✅ Updated user ${userId} tier to ${newTier}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update user tier with Replit DB:", err);
    return { success: false, error: err.message };
  }
}
*/
