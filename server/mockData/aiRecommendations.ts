export const mockRecommendationData = {
  personalizedCapsules: [
    {
      id: "rec-1",
      title: "Corporate Whistleblower Evidence Package",
      description: "Detailed evidence of financial misconduct at major corporation, verified through multiple sources and blockchain attestation.",
      author: "TruthSeeker_2024",
      truthScore: 94,
      matchScore: 87,
      reasonForRecommendation: "Based on your interest in corporate transparency and high engagement with whistleblower content",
      tags: ["corporate", "whistleblower", "evidence", "finance"],
      estimatedReadTime: 8,
      category: "evidence",
      createdAt: "2024-08-04T10:30:00Z"
    },
    {
      id: "rec-2", 
      title: "Family Legacy: My Grandfather's WWII Stories",
      description: "Personal testimonies and documents from WWII veteran, preserved for future generations with blockchain verification.",
      author: "HistoryKeeper",
      truthScore: 89,
      matchScore: 92,
      reasonForRecommendation: "Your profile shows strong interest in historical documentation and personal stories",
      tags: ["history", "family", "legacy", "personal"],
      estimatedReadTime: 12,
      category: "legacy",
      createdAt: "2024-08-04T09:15:00Z"
    },
    {
      id: "rec-3",
      title: "Climate Data Manipulation Investigation",
      description: "Comprehensive analysis of altered climate research data, including leaked documents and expert testimony.",
      author: "EnvironmentalGuardian",
      truthScore: 91,
      matchScore: 83,
      reasonForRecommendation: "Matches your engagement patterns with environmental issues and data integrity topics",
      tags: ["climate", "data", "research", "investigation"],
      estimatedReadTime: 15,
      category: "truth",
      createdAt: "2024-08-04T08:45:00Z"
    }
  ],
  trendingCapsules: [
    {
      id: "trend-1",
      title: "Tech Giant Privacy Violations Exposed",
      description: "Latest revelations about data collection practices at major technology companies, backed by internal documents.",
      author: "PrivacyAdvocate",
      truthScore: 88,
      matchScore: 79,
      reasonForRecommendation: "Currently trending due to high community engagement and recent news relevance",
      tags: ["technology", "privacy", "corporate", "trending"],
      estimatedReadTime: 10,
      category: "truth",
      createdAt: "2024-08-04T12:00:00Z"
    },
    {
      id: "trend-2",
      title: "Healthcare System Corruption Case Study",
      description: "In-depth analysis of healthcare fraud schemes, including evidence from multiple whistleblowers and financial records.",
      author: "MedicalTruth",
      truthScore: 93,
      matchScore: 85,
      reasonForRecommendation: "Viral due to widespread public interest and high verification score",
      tags: ["healthcare", "corruption", "investigation", "viral"],
      estimatedReadTime: 14,
      category: "evidence",
      createdAt: "2024-08-04T11:30:00Z"
    }
  ],
  similarInterests: [
    {
      id: "similar-1",
      title: "Government Transparency Report 2024",
      description: "Annual analysis of government disclosure practices and recommendations for increased accountability.",
      author: "TransparencyWatch",
      truthScore: 86,
      matchScore: 88,
      reasonForRecommendation: "Users with similar interests frequently engage with government accountability content",
      tags: ["government", "transparency", "accountability", "report"],
      estimatedReadTime: 18,
      category: "truth", 
      createdAt: "2024-08-04T07:20:00Z"
    },
    {
      id: "similar-2",
      title: "Digital Rights and Surveillance Evidence",
      description: "Collection of evidence regarding digital surveillance programs and their impact on civil liberties.",
      author: "DigitalRightsDefender",
      truthScore: 90,
      matchScore: 84,
      reasonForRecommendation: "Similar users show high engagement with digital rights and surveillance topics",
      tags: ["digital-rights", "surveillance", "civil-liberties", "evidence"],
      estimatedReadTime: 13,
      category: "testimony",
      createdAt: "2024-08-04T06:45:00Z"
    }
  ],
  aiInsights: {
    userPersonality: "Truth-Seeking Investigator",
    preferredTopics: ["Corporate Accountability", "Government Transparency", "Environmental Issues", "Digital Rights"],
    optimalEngagementTime: "9:00 AM - 11:00 AM",
    recommendationConfidence: 87
  }
};

export const mockAchievementData = {
  currentScore: 2847,
  totalPossibleScore: 5000,
  currentLevel: {
    level: 7,
    title: "Truth Guardian",
    minScore: 2500,
    maxScore: 3499,
    color: "from-[#f59e0b] to-[#d97706]",
    benefits: [
      "Enhanced capsule verification priority",
      "Advanced AI recommendation algorithms", 
      "Truth Bounty access",
      "Exclusive Guardian community features"
    ]
  },
  nextLevel: {
    level: 8,
    title: "Sovereign Verifier", 
    minScore: 3500,
    maxScore: 4999,
    color: "from-[#ff00d4] to-[#c21cac]",
    benefits: [
      "Custom verification badges",
      "Advanced analytics dashboard",
      "Priority customer support",
      "Beta feature access"
    ]
  },
  achievements: [
    {
      id: "truth-seeker-1",
      title: "First Truth Discovered",
      description: "Successfully verified your first truth capsule",
      icon: "star",
      category: "truth" as const,
      rarity: "common" as const,
      points: 100,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: "2024-07-15T10:30:00Z",
      requirements: ["Verify first capsule"],
      rewards: {
        gttTokens: 50,
        truthScoreBonus: 25,
        specialBadge: "Truth Seeker"
      }
    },
    {
      id: "engagement-master",
      title: "Community Engagement Master", 
      description: "Achieved 1000+ community interactions",
      icon: "flame",
      category: "engagement" as const,
      rarity: "epic" as const,
      points: 500,
      progress: 847,
      maxProgress: 1000,
      unlocked: false,
      requirements: ["Reach 1000 community interactions"],
      rewards: {
        gttTokens: 250,
        truthScoreBonus: 100,
        specialBadge: "Community Champion"
      }
    },
    {
      id: "blockchain-pioneer",
      title: "Blockchain Pioneer",
      description: "Successfully completed 50 blockchain verifications",
      icon: "shield",
      category: "verification" as const,
      rarity: "rare" as const,
      points: 300,
      progress: 43,
      maxProgress: 50,
      unlocked: false,
      requirements: ["Complete 50 blockchain verifications"],
      rewards: {
        gttTokens: 150,
        truthScoreBonus: 75,
        specialBadge: "Blockchain Pioneer"
      }
    }
  ],
  recentUnlocks: [],
  streakCount: 12,
  multiplier: 1.5
};