import { Request, Response } from "express";

export async function getCapsuleTimeline(req: Request, res: Response) {
  try {
    const { filter = "all", page = 1 } = req.query;

    // Mock timeline data
    const allEvents = [
      {
        id: "event_001",
        type: "capsule_created" as const,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        capsule: {
          id: "cap_001",
          title: "Breaking: Corporate Environmental Data Leak",
          content:
            "Newly discovered internal documents reveal systematic environmental data manipulation by major corporations...",
          author: "EcoWhistleblower",
          category: "Environmental Truth",
          verificationStatus: "pending" as const,
          griefScore: 95,
          stats: { views: 1247, likes: 89, comments: 23, shares: 15 },
        },
      },
      {
        id: "event_002",
        type: "capsule_verified" as const,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        capsule: {
          id: "cap_002",
          title: "Family Heritage Documentation Project",
          content:
            "Comprehensive documentation of our family's journey through three generations of immigration...",
          author: "HeritageKeeper",
          category: "Personal History",
          verificationStatus: "verified" as const,
          griefScore: 78,
          stats: { views: 2894, likes: 156, comments: 45, shares: 28 },
        },
        actor: "Validator_Alpha",
      },
      {
        id: "event_003",
        type: "capsule_liked" as const,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        capsule: {
          id: "cap_003",
          title: "Scientific Research Integrity Report",
          content:
            "Analysis of research methodologies and data integrity across major pharmaceutical studies...",
          author: "ResearchEthicist",
          category: "Scientific Truth",
          verificationStatus: "verified" as const,
          griefScore: 92,
          stats: { views: 4521, likes: 387, comments: 78, shares: 42 },
        },
        actor: "CommunityMember_47",
      },
      {
        id: "event_004",
        type: "comment_added" as const,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        capsule: {
          id: "cap_004",
          title: "Historical War Documentation",
          content:
            "First-hand accounts and documentation from World War II survivors and their families...",
          author: "HistoryPreserver",
          category: "Historical Records",
          verificationStatus: "verified" as const,
          griefScore: 89,
          stats: { views: 3762, likes: 245, comments: 67, shares: 31 },
        },
        actor: "HistoryBuff_92",
        metadata: {
          commentPreview: "Thank you for preserving these important stories...",
        },
      },
      {
        id: "event_005",
        type: "capsule_shared" as const,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        capsule: {
          id: "cap_005",
          title: "Educational System Truth Capsule",
          content:
            "Analysis of educational policies and their real-world impact on student development...",
          author: "EduAdvocate",
          category: "Educational Truth",
          verificationStatus: "verified" as const,
          griefScore: 84,
          stats: { views: 2156, likes: 189, comments: 34, shares: 67 },
        },
        actor: "ParentCoalition",
      },
      {
        id: "event_006",
        type: "capsule_created" as const,
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        capsule: {
          id: "cap_006",
          title: "Healthcare Worker Testimony",
          content:
            "Personal experiences and observations from frontline healthcare workers during crisis situations...",
          author: "HealthcareHero",
          category: "Medical Truth",
          verificationStatus: "pending" as const,
          griefScore: 91,
          stats: { views: 3847, likes: 298, comments: 89, shares: 45 },
        },
      },
      {
        id: "event_007",
        type: "capsule_verified" as const,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        capsule: {
          id: "cap_007",
          title: "Community Development Impact Study",
          content:
            "Comprehensive study of urban development impact on local communities over the past decade...",
          author: "UrbanPlanner",
          category: "Social Impact",
          verificationStatus: "verified" as const,
          griefScore: 87,
          stats: { views: 1923, likes: 134, comments: 28, shares: 19 },
        },
        actor: "Validator_Beta",
      },
    ];

    // Filter events based on filter parameter
    let filteredEvents = allEvents;
    if (filter !== "all") {
      filteredEvents = allEvents.filter((event) => event.type === filter);
    }

    // Pagination
    const pageSize = 10;
    const startIndex = (Number(page) - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    const timeline = {
      events: paginatedEvents,
      totalEvents: filteredEvents.length,
      hasMore: endIndex < filteredEvents.length,
    };

    res.json(timeline);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    res.status(500).json({ error: "Failed to fetch timeline data" });
  }
}
