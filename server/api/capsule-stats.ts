import { Request, Response } from "express";

export async function getCapsuleStats(req: Request, res: Response) {
  try {
    // Mock data for capsule statistics
    const stats = {
      totalCapsules: 12847,
      totalViews: 2847365,
      totalLikes: 186492,
      totalComments: 45823,
      verificationRate: 87.3,
      topPerformingCapsules: [
        {
          id: "cap_001",
          title: "The Truth About Climate Change Evidence",
          views: 45892,
          likes: 3847,
          verificationStatus: "verified" as const,
          griefScore: 92
        },
        {
          id: "cap_002", 
          title: "Corporate Whistleblower Testimony",
          views: 38746,
          likes: 4521,
          verificationStatus: "verified" as const,
          griefScore: 98
        },
        {
          id: "cap_003",
          title: "Historical Family Archive",
          views: 29384,
          likes: 2847,
          verificationStatus: "pending" as const,
          griefScore: 76
        },
        {
          id: "cap_004",
          title: "Medical Research Findings",
          views: 24756,
          likes: 3201,
          verificationStatus: "verified" as const,
          griefScore: 89
        },
        {
          id: "cap_005",
          title: "Educational Documentary Evidence",
          views: 21394,
          likes: 2156,
          verificationStatus: "verified" as const,
          griefScore: 84
        }
      ],
      categoryBreakdown: [
        { category: "Truth Testimonies", count: 3842, percentage: 29.9 },
        { category: "Historical Records", count: 2947, percentage: 22.9 },
        { category: "Scientific Evidence", count: 2384, percentage: 18.5 },
        { category: "Personal Stories", count: 1923, percentage: 15.0 },
        { category: "Educational Content", count: 1751, percentage: 13.6 }
      ],
      performanceMetrics: {
        avgViews: 2847,
        avgLikes: 247,
        engagementRate: 8.7,
        truthScore: 86.4
      }
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching capsule stats:", error);
    res.status(500).json({ error: "Failed to fetch capsule statistics" });
  }
}