import { Request, Response } from "express";

export async function getValidatorBids(req: Request, res: Response) {
  try {
    const { filterStatus = "all", sortBy = "bidAmount" } = req.query;

    // Mock validator bids data
    const mockBids = [
      {
        id: "bid_001",
        validator: {
          id: "val_001",
          name: "TruthSeeker_Alpha",
          reputation: 94,
          avatar: "/api/placeholder/32/32",
          totalValidations: 847,
          successRate: 96.2,
          stakeAmount: 50000,
        },
        capsule: {
          id: "cap_001",
          title: "Climate Research Data Analysis",
          category: "Scientific Evidence",
          griefScore: 92,
          author: "ResearchScientist",
        },
        bidAmount: 2500,
        bidTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "pending" as const,
        estimatedCompletion: "2024-08-03T10:00:00Z",
        confidence: 95,
        specialization: [
          "Scientific Data",
          "Environmental",
          "Research Validation",
        ],
      },
      {
        id: "bid_002",
        validator: {
          id: "val_002",
          name: "VeritasGuardian",
          reputation: 92,
          avatar: "/api/placeholder/32/32",
          totalValidations: 1203,
          successRate: 94.8,
          stakeAmount: 75000,
        },
        capsule: {
          id: "cap_002",
          title: "Historical Document Authentication",
          category: "Historical Records",
          griefScore: 87,
          author: "HistoryKeeper",
        },
        bidAmount: 3200,
        bidTimestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: "accepted" as const,
        estimatedCompletion: "2024-08-03T14:00:00Z",
        confidence: 92,
        specialization: [
          "Historical Documents",
          "Authentication",
          "Archival Records",
        ],
      },
      {
        id: "bid_003",
        validator: {
          id: "val_003",
          name: "EthicsValidator",
          reputation: 89,
          avatar: "/api/placeholder/32/32",
          totalValidations: 567,
          successRate: 91.5,
          stakeAmount: 45000,
        },
        capsule: {
          id: "cap_003",
          title: "Corporate Whistleblower Evidence",
          category: "Truth Testimony",
          griefScore: 96,
          author: "CorporateInsider",
        },
        bidAmount: 4100,
        bidTimestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: "pending" as const,
        estimatedCompletion: "2024-08-04T09:00:00Z",
        confidence: 88,
        specialization: [
          "Corporate Ethics",
          "Legal Evidence",
          "Whistleblower Protection",
        ],
      },
      {
        id: "bid_004",
        validator: {
          id: "val_004",
          name: "DataIntegrityPro",
          reputation: 91,
          avatar: "/api/placeholder/32/32",
          totalValidations: 923,
          successRate: 93.7,
          stakeAmount: 60000,
        },
        capsule: {
          id: "cap_004",
          title: "Medical Research Integrity Report",
          category: "Medical Truth",
          griefScore: 89,
          author: "MedicalResearcher",
        },
        bidAmount: 2800,
        bidTimestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: "completed" as const,
        estimatedCompletion: "2024-08-02T16:00:00Z",
        confidence: 94,
        specialization: [
          "Medical Research",
          "Data Analysis",
          "Clinical Studies",
        ],
      },
      {
        id: "bid_005",
        validator: {
          id: "val_005",
          name: "CommunityValidator",
          reputation: 86,
          avatar: "/api/placeholder/32/32",
          totalValidations: 445,
          successRate: 89.3,
          stakeAmount: 35000,
        },
        capsule: {
          id: "cap_005",
          title: "Educational Policy Impact Study",
          category: "Educational Truth",
          griefScore: 82,
          author: "EducationAdvocate",
        },
        bidAmount: 1950,
        bidTimestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: "accepted" as const,
        estimatedCompletion: "2024-08-03T12:00:00Z",
        confidence: 87,
        specialization: [
          "Education Policy",
          "Community Impact",
          "Social Research",
        ],
      },
    ];

    // Filter by status
    let filteredBids = mockBids;
    if (filterStatus !== "all") {
      filteredBids = mockBids.filter((bid) => bid.status === filterStatus);
    }

    // Sort bids
    if (sortBy === "bidAmount") {
      filteredBids.sort((a, b) => b.bidAmount - a.bidAmount);
    } else if (sortBy === "reputation") {
      filteredBids.sort(
        (a, b) => b.validator.reputation - a.validator.reputation,
      );
    }

    const bidsData = {
      activeBids: filteredBids,
      totalBids: mockBids.length,
      averageBidAmount: Math.round(
        mockBids.reduce((sum, bid) => sum + bid.bidAmount, 0) / mockBids.length,
      ),
      topValidators: [
        {
          id: "val_001",
          name: "TruthSeeker_Alpha",
          reputation: 94,
          totalEarnings: 125000,
          activeBids: 3,
        },
        {
          id: "val_002",
          name: "VeritasGuardian",
          reputation: 92,
          totalEarnings: 110000,
          activeBids: 2,
        },
        {
          id: "val_003",
          name: "EthicsValidator",
          reputation: 89,
          totalEarnings: 95000,
          activeBids: 4,
        },
        {
          id: "val_004",
          name: "DataIntegrityPro",
          reputation: 91,
          totalEarnings: 105000,
          activeBids: 2,
        },
        {
          id: "val_005",
          name: "CommunityValidator",
          reputation: 86,
          totalEarnings: 78000,
          activeBids: 1,
        },
      ],
      marketStats: {
        totalStaked: 265000,
        averageValidationTime: 18,
        successRate: 93.1,
        dailyVolume: 45000,
      },
    };

    res.json(bidsData);
  } catch (error) {
    console.error("Error fetching validator bids:", error);
    res.status(500).json({ error: "Failed to fetch validator bids data" });
  }
}
