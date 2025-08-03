interface ClusterThemeYield {
  theme: string;
  cluster: number;
  gttYield: number;
  engagementScore: number;
  velocityScore: number;
}

export async function calculateGTTThemeYield(): Promise<ClusterThemeYield[]> {
  // Demo calculation using engagement and velocity metrics
  const mockClusterData = [
    {
      theme: "Grief & Loss",
      cluster_id: 0,
      engagement_score: 8.5,
      velocity_score: 7.2,
      total_capsules: 342,
      average_truth_score: 91.5
    },
    {
      theme: "Family Memories",
      cluster_id: 1, 
      engagement_score: 7.8,
      velocity_score: 8.1,
      total_capsules: 287,
      average_truth_score: 88.3
    },
    {
      theme: "Personal Growth",
      cluster_id: 2,
      engagement_score: 6.9,
      velocity_score: 6.8,
      total_capsules: 195,
      average_truth_score: 85.7
    },
    {
      theme: "Life Transitions",
      cluster_id: 3,
      engagement_score: 7.4,
      velocity_score: 7.9,
      total_capsules: 156,
      average_truth_score: 89.1
    }
  ];

  return mockClusterData.map((c) => ({
    theme: c.theme,
    cluster: c.cluster_id,
    gttYield: Math.round((c.engagement_score + c.velocity_score) * 1.5 * 100) / 100,
    engagementScore: c.engagement_score,
    velocityScore: c.velocity_score
  }));
}