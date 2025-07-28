import { Request, Response } from "express";

interface YieldDataPoint {
  date: string;
  yieldAmount: number;
  emotionalResonance: number;
  viewCount: number;
  verificationCount: number;
  shareCount: number;
}

export async function getCapsuleAnalytics(req: Request, res: Response) {
  try {
    const { capsuleId } = req.params;
    const { timeRange = "30d" } = req.query;

    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase
    //   .from('capsule_yield')
    //   .select('*')
    //   .eq('capsule_id', capsuleId)
    //   .order('date', { ascending: true });

    // For now, generate realistic demo data
    const generateAnalyticsData = (
      id: string,
      range: string
    ): YieldDataPoint[] => {
      const days =
        range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365;
      const data: YieldDataPoint[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const baseMultiplier = (parseInt(id) % 3) + 1;
        const timeVariation = Math.sin((i / days) * Math.PI * 2) * 0.3 + 0.7;
        const randomFactor = 0.8 + Math.random() * 0.4;

        data.push({
          date: date.toISOString().split("T")[0],
          yieldAmount:
            baseMultiplier * timeVariation * randomFactor * (1 + i / 100),
          emotionalResonance: Math.min(
            95,
            40 + baseMultiplier * 15 + timeVariation * 20 + Math.random() * 10
          ),
          viewCount: Math.floor(
            baseMultiplier * timeVariation * randomFactor * (50 + i * 2)
          ),
          verificationCount: Math.floor(
            baseMultiplier * timeVariation * (3 + i / 10)
          ),
          shareCount: Math.floor(baseMultiplier * timeVariation * (8 + i / 5)),
        });
      }

      return data;
    };

    const dataPoints = generateAnalyticsData(capsuleId, timeRange as string);
    const totalYield = dataPoints.reduce(
      (sum, point) => sum + point.yieldAmount,
      0
    );
    const avgResonance =
      dataPoints.reduce((sum, point) => sum + point.emotionalResonance, 0) /
      dataPoints.length;

    res.json({
      success: true,
      capsuleId,
      timeRange,
      dataPoints,
      totalYield,
      avgResonance,
      metadata: {
        totalViews: dataPoints.reduce((sum, dp) => sum + dp.viewCount, 0),
        totalVerifications: dataPoints.reduce(
          (sum, dp) => sum + dp.verificationCount,
          0
        ),
        totalShares: dataPoints.reduce((sum, dp) => sum + dp.shareCount, 0),
      },
    });
  } catch (error) {
    console.error("Error fetching capsule analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics data",
    });
  }
}

export async function getAllCapsulesAnalytics(req: Request, res: Response) {
  try {
    // TODO: Implement aggregated analytics across all capsules
    const mockSummary = {
      totalCapsules: 156,
      totalYield: 2847.6,
      avgResonance: 72.3,
      topPerformers: [
        { id: "3", title: "Economic Analysis Report", yield: 25.7 },
        { id: "7", title: "Climate Research Data", yield: 18.2 },
        { id: "12", title: "Medical Trial Results", yield: 15.8 },
      ],
    };

    res.json({
      success: true,
      summary: mockSummary,
    });
  } catch (error) {
    console.error("Error fetching all capsules analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics summary",
    });
  }
}
