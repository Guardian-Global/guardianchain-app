// Mock Supabase client for development
const mockSupabaseClient = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          if (table === "capsule_engagement") {
            const mockEngagement = {
              capsule_id: value,
              user_id: "user-123",
              views: 1250,
              shares: 45,
              resonance: 87,
              veritus_verified: true,
              pending_yield: 15.5,
            };
            callback({ data: [mockEngagement], error: null });
          }
        },
      }),
      gt: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          const mockCapsules = [
            { capsule_id: 1, user_id: "user-123", pending_yield: 15.5 },
            { capsule_id: 2, user_id: "user-456", pending_yield: 8.2 },
            { capsule_id: 3, user_id: "user-789", pending_yield: 22.1 },
          ];
          callback({ data: mockCapsules, error: null });
        },
      }),
    }),
    upsert: (data: any, options: any) => ({
      then: (callback: (result: any) => void) => {
        console.log(`Upserted ${table}:`, data);
        callback({ data, error: null });
      },
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: (callback: (result: any) => void) => {
          console.log(`Updated ${table} where ${column} = ${value}:`, data);
          callback({ data, error: null });
        },
      }),
    }),
  }),
};

export interface CapsuleEngagement {
  capsule_id: number;
  user_id: string;
  views: number;
  shares: number;
  resonance: number;
  veritus_verified: boolean;
  pending_yield: number;
}

export interface UserBalance {
  user_id: string;
  gtt_balance: number;
}

// Core yield calculation logic
export async function calculateCapsuleYield(
  capsuleId: number
): Promise<number> {
  try {
    const engagement = await new Promise<CapsuleEngagement>((resolve) => {
      mockSupabaseClient
        .from("capsule_engagement")
        .select("*")
        .eq("capsule_id", capsuleId)
        .then((result: any) => {
          resolve(
            result.data?.[0] || {
              capsule_id: capsuleId,
              user_id: "",
              views: 0,
              shares: 0,
              resonance: 0,
              veritus_verified: false,
              pending_yield: 0,
            }
          );
        });
    });

    // Yield formula: views × 0.005 + shares × 0.01 + resonance × 0.02
    let yieldSum = 0;
    const { views, shares, resonance, veritus_verified } = engagement;

    yieldSum = views * 0.005 + shares * 0.01 + resonance * 0.02;

    // Veritus verification bonus (2x multiplier)
    if (veritus_verified) {
      yieldSum *= 2;
    }

    return Math.round(yieldSum * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error("Yield calculation error:", error);
    return 0;
  }
}

export async function distributeYield(): Promise<void> {
  try {
    // Get all capsules with pending yield
    const capsules = await new Promise<any[]>((resolve) => {
      mockSupabaseClient
        .from("capsule_engagement")
        .select("capsule_id,user_id,pending_yield")
        .gt("pending_yield", 0)
        .then((result: any) => {
          resolve(result.data || []);
        });
    });

    for (const capsule of capsules) {
      const yieldAmount = await calculateCapsuleYield(capsule.capsule_id);

      // Update user balance
      await new Promise((resolve) => {
        mockSupabaseClient
          .from("user_balances")
          .upsert(
            {
              user_id: capsule.user_id,
              gtt_balance: yieldAmount,
            },
            { onConflict: ["user_id"] }
          )
          .then(resolve);
      });

      // Clear pending yield
      await new Promise((resolve) => {
        mockSupabaseClient
          .from("capsule_engagement")
          .update({ pending_yield: 0 })
          .eq("capsule_id", capsule.capsule_id)
          .then(resolve);
      });

      console.log(
        `Distributed ${yieldAmount} GTT to user ${capsule.user_id} for capsule ${capsule.capsule_id}`
      );
    }
  } catch (error) {
    console.error("Yield distribution error:", error);
    throw error;
  }
}

export async function getUserYieldSummary(userId: string) {
  try {
    // Get user's capsule engagement data
    const mockData = {
      totalCapsules: 5,
      totalViews: 3420,
      totalShares: 156,
      averageResonance: 78,
      verifiedCapsules: 3,
      pendingYield: 42.5,
      totalEarnedGTT: 156.7,
      yieldRank: "Top 15%",
    };

    return mockData;
  } catch (error) {
    console.error("Yield summary error:", error);
    throw error;
  }
}

export async function calculateTierYieldBonus(
  userId: string,
  baseYield: number
) {
  // Mock tier data - in production, fetch from user profile
  const userTier = "Creator"; // Mock tier

  const tierBonuses = {
    Starter: 0,
    Creator: 0.05,
    Guardian: 0.1,
    Institutional: 0.25,
  };

  const bonus = tierBonuses[userTier as keyof typeof tierBonuses] || 0;
  return baseYield * (1 + bonus);
}

export async function getYieldDistributionStats() {
  return {
    totalDistributedToday: 1247.5,
    totalDistributedThisMonth: 18350.2,
    activeCapsules: 156,
    totalUsers: 89,
    averageYieldPerCapsule: 12.8,
    topEarningCapsule: 98.5,
    distributionStatus: "healthy",
    lastDistribution: new Date().toISOString(),
  };
}
